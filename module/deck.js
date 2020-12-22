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

function send_card(user, card) {
    game.socket.emit("system.deadlands_classic", {
        operation: "recieve_card",
        data: {
            user: user,
            card: card
        }
    });
}

let operations = {
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
        }
    },
    request_cards: function(data){
        if (game.user.isGM) {
            let user = data.user
            let cards = data.amount
            if (game.dc.action_deck.length < cards){
                restore_discard()
            }
            for (let i=0; i<cards; i++){
                let card = game.dc.action_deck.pop();
                send_card(user, card)
            }
        };
    },
    recieve_card: function(data){
        if (game.userId == data.user){
            let actor = game.actors.get(game.user.data.character)
            actor.createOwnedItem(data.card);
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
        let user = data.user;
        let card = data.card;
        if (game.user.isGM) {
            game.dc.action_discard.push(card)
            let new_card = game.dc.action_deck.pop()
            send_card(user, new_card)
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