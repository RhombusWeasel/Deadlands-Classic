let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

let percs = [
    {limit: 99, chip:3},
    {limit: 88, chip:2},
    {limit: 58, chip:1},
    {limit: 0, chip:0},
];

let aim_bonus = 0

function new_deck(id) {
    let deck = [];
    let shuffled = [];
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

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck
}

function sort_deck(card_pile){
    let r_pile = [];
    for (let card = 0; card < cards.length ; card++) {
        const cur_card = cards[card];
        for (let suit = 0; suit < suits.length; suit++) {
            const cur_suit = suits[suit];
            for (let chk = 0; chk < card_pile.length; chk++) {
                const chk_card = card_pile[chk].name;
                if (cur_card == 'Joker') {
                    if (chk_card == 'Joker (Red)' || chk_card == 'Joker (Black)') {
                        r_pile.push(card_pile[chk]);
                        card_pile[chk].name += ' Ask yer Marshal.'
                        break;
                    }
                }else if(chk_card == cur_card + ' of ' + cur_suit){
                    r_pile.push(card_pile[chk]);
                    break;
                }
            }
        }
    }
    return r_pile;
}

export default class GeneratorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/generator-sheet.html`,
            classes: ["player-sheet"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        data.gen_deck = sort_deck(data.items.filter(function (item) {return item.type == "gen_deck"}));
        data.firearms = data.items.filter(function (item) {return item.type == "firearm"});
        data.melee_weapons = data.items.filter(function (item) {return item.type == "melee"});
        data.miracles = data.items.filter(function (item) {return item.type == "miracle"});
        data.tricks = data.items.filter(function (item) {return item.type == "trick"});
        data.hexes = data.items.filter(function (item) {return item.type == "hex"});
        data.favors = data.items.filter(function (item) {return item.type == "favor"});
        data.hinderances = data.items.filter(function (item) {return item.type == "hinderance"});
        data.edges = data.items.filter(function (item) {return item.type == "edge"});
        data.level_headed_available = game.dc.level_headed_available
        data.goods = data.items.filter(function (item) {return item.type == "goods"});
        data.huckster_deck = data.items.filter(function (item) {return item.type == "huckster_deck"});
        data.action_deck = sort_deck(data.items.filter(function (item) {return item.type == "action_deck"}));
        let fate_chips = data.items.filter(function (item) {return item.type == "chip"});
        data.fate_chips = [
            {name: "White", bounty: "1", amount: 0},
            {name: "Red", bounty: "2", amount: 0},
            {name: "Blue", bounty: "3", amount: 0},
            {name: "Legendary", bounty: "5", amount: 0},
        ];
        fate_chips.forEach(chip => {
            data.fate_chips.forEach(stack => {
                if (stack.name == chip.name){
                    stack.amount += 1;
                }
            });
        });
        let lh = data.items.filter(function (item) {return item.type == "edge" && item.name == "Level Headed"})
        if (data.combat_active) {
        }else{
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                setTimeout(() => {this.actor.deleteOwnedItem(card._id)}, c * 100);
            }
        }
        return data;
    }
    activateListeners(html) {
        html.find(".draw-gen-cards").click(this._on_draw_gen_cards.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        return super.activateListeners(html);
    }
    _on_draw_gen_cards(event) {
        let g_deck = new_deck('gen_deck');
        let die_types = {
            Joker: 'd12',
            Ace: 'd12',
            King: 'd10',
            Queen: 'd10',
            Jack: 'd8',
            "10": 'd8',
            "9": 'd8',
            "8": 'd8',
            "7": 'd6',
            "6": 'd6',
            "5": 'd6',
            "4": 'd6',
            "3": 'd6',
            "2": 'd4'
        };
        let suit_types = {
            'Spades': 4,
            'Hearts': 3,
            'Diamonds': 2,
            'Clubs': 1
        };
        for (let d = 0; d < 12; d++) {
            let card = g_deck.pop();
            let name_data = card.name.split(' ');
            card.die_type = die_types[name_data[0]];
            if (name_data[0] == 'Joker') {
                let s_card = g_deck.pop();
                if (s_card.name.split(' ')[0] == 'Joker') {
                    s_card = g_deck.pop()
                }
                card.level = suit_types[s_card.name.split(' ')[2]];
            }else{
                card.level = suit_types[name_data[2]];
            }
            console.log(card);
            let item = {
                name: card.name,
                type: card.type,
                data: {
                    level: card.level,
                    die_type: card.die_type
                }
            };
            setTimeout(() => {this.actor.createOwnedItem(item)}, d * 500);
        }
    }
    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `
            Discarding ${item.type} ${item.name}
        `});
        return this.actor.deleteOwnedItem(itemId);
    }
}