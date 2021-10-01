let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

let percs = [
    {limit: 99, chip:3},
    {limit: 88, chip:2},
    {limit: 58, chip:1},
    {limit: 0, chip:0},
];

let aim_bonus = 0

export default class GeneratorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/generator-sheet.html`,
            classes: ["player-sheet"],
            width: 500,
            height: 700
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        data.gen_deck = dc_utils.deck.sort(data.items.filter(function (item) {return item.type == "gen_deck"}));
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
        data.action_deck = dc_utils.deck.sort(data.items.filter(function (item) {return item.type == "action_deck"}));
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
        let g_deck = dc_utils.deck.new('gen_deck');
        let die_types = {
            Jo: 'd12',
            A: 'd12',
            K: 'd10',
            Q: 'd10',
            J: 'd8',
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
            '\u2660': 4,
            '\u2661': 3,
            '\u2662': 2,
            '\u2663': 1
        };
        for (let d = 0; d < 12; d++) {
            let card = g_deck.pop();
            let value = dc_utils.deck.get_card_value(card);
            let suit = card.name.slice(-1);
            card.die_type = die_types[value];
            if (value == 'Jo') {
                let s_card = g_deck.pop();
                if (dc_utils.deck.get_card_value(s_card) == 'Jo') {
                    s_card = g_deck.pop()
                }
                card.level = suit_types[s_card.name.slice(-1)];
            }else{
                card.level = suit_types[suit];
            }
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