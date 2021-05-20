let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

function restore_discard() {
    for (let c = 0; c < game.dc.action_discard.length; c++) {
        game.dc.action_deck.push(game.dc.action_discard.pop());
    }
    game.dc.action_deck = shuffle_deck(game.dc.action_deck);
}

function shuffle_deck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function new_deck(id) {
    let deck = [];
    for (let suit = 0; suit < suits.length; suit++) {
        for (let card = 1; card < cards.length; card++) {
            deck.push({
                name: `${cards[card]} of ${suits[suit]}`,
                type: id
            });
        }        
    }
    deck.push({name: 'Joker (Red)', type: id})
    deck.push({name: 'Joker (Black)', type: id})
    deck = shuffle_deck(deck)
    return deck
}

function send_card(data) {
    game.socket.emit("system.deadlands_classic", {
        operation: "recieve_card",
        data: data
    });
}

function build_damage_dialog(char, data, saved) {
    let form = `
        <form>
            <div id="data" data-wounds="${data.wounds}" data-char="${char.name}" data-loc="${data.loc_key}">
                <h1 style="text-align: center;">Damage!</h1>
    `;
    if (data.wounds == 1){
        form += `
                <p style="text-align: center;">${char.name} has taken 1 wound to the ${data.loc_label}</p>
        `;
    }else{
        form += `
                <p style="text-align: center;">${char.name} has taken ${data.wounds} wounds to the ${data.loc_label}</p>
        `;
    }
    return form += `
            </div>
        </form>
    `;
}

let operations = {
    //COMBAT DECK OPERATIONS
    test_event: function(data) {
        console.log('Test event recieved.');
    },
    roll_quickness: function(data) {
        game.dc.combat_active = true
        game.dc.level_headed_available = true
        if (game.dc.combat_shuffle) {
            game.dc.combat_shuffle = false;
            restore_discard();
        }
    },
    end_combat: function(data) {
        game.dc.combat_active = false
        if (game.user.isGM) {
            game.dc.action_deck = []
            game.dc.discard_deck = []
            game.dc.aim_bonus = 0
        }
    },
    request_cards: function(data){
        if (game.user.isGM) {
            let cards = data.amount
            if (game.dc.action_deck.length <= cards){
                restore_discard()
            }
            for (let i=0; i<cards; i++){
                data.card = game.dc.action_deck.pop();
                send_card(data)
            }
        };
    },
    recieve_card: function(data){
        if (game.userId == data.user){
            console.log(data);
            let actor = game.actors.getName(data.char);
            console.log(actor);
            let c = Math.random();
            setTimeout(() => {actor.createOwnedItem(data.card)}, c * 100);
        }
    },
    discard_card: function(data) {
        if (game.user.isGM) {
            if (data.name == "Joker (Black)") {
                ChatMessage.create({ content: `
                    Black Joker!
                    You lose your next highest card, the combat deck will be reshuffled at the end of the round 
                    and the Marshal draws a Fate Chip.`
                });
                game.dc.combat_shuffle = true
            }
            game.dc.action_discard.push(data)
        }
    },
    recycle_card: function(data) {
        if (game.user.isGM) {
            game.dc.action_discard.push(data.card)
            data.card = game.dc.action_deck.pop()
            send_card(data);
        }
    },
    request_dodge: function(data) {

    },
    apply_damage: function(data) {
        let char = game.actors.getName(data.char);
        if (char.owner) {
            let form = new Dialog({
                title: `You've been hit!`,
                content: build_damage_dialog(char, data, 0),
                buttons: {
                    take: {
                        label: 'Take Damage.',
                        callback: (html) => {
                            let el = document.getElementById('data');
                            console.log(el);
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc = el.dataset.loc;
                            let char = game.actors.getName(name);
                            let current = parseInt(char.data.data.wounds[loc]) || 0;
                            let w_data = {data: {wounds: {[loc]: current + wounds}}};
                            char.update(w_data);
                            let highest = 0
                            Object.keys(char.data.data.wounds).forEach(function(key) {
                                if (char.data.data.wounds[key] >= highest) {
                                    highest = char.data.data.wounds[key]
                                }
                            });
                            let m_data = {data: {wound_modifier: highest * -1}}
                            char.update(m_data);
                        }
                    }
                },
                close: () => {
                    console.log('Damage Dialog Closed');
                }
            });
            form.render(true);
        }
    },
    enemy_damage: function(data) {
        console.log(data);
        let char = canvas.tokens.placeables.find(i => i.data._id == data.id);
        console.log(char);
        if (game.user.isGM) {
            let current = parseInt(char.actor.data.data.wounds[data.loc_key]) || 0;
            let updata = {data: {wounds: {[data.loc_key]: current + data.wounds}}};
            console.log(updata);
            char.actor.update(updata);
        }
    }
}

Hooks.on("ready", () => {
    game.dc = {
        combat_active: false,
        action_deck: [],
        action_discard: [],
        aim_bonus: 0,
        level_headed_available: true
    }
    if (game.user.isGM) {
        game.dc.action_deck = new_deck('action_deck');
    };
    console.log("DC | Initializing socket listeners...")
    game.socket.on(`system.deadlands_classic`, (data) => {
        if (data.operation in operations) {
            operations[data.operation](data.data);
            return false;
        }
    });
});