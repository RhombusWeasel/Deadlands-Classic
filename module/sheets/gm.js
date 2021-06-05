import { dc } from "../config.js";
let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
                    if (chk_card == 'Joker (Red)') {
                        card_pile[chk].name += ' HooWEE!'
                        r_pile.push(card_pile[chk]);
                        break;
                    }else if(chk_card == 'Joker (Black)') {
                        card_pile[chk].name += ' Yee Haw!'
                        r_pile.push(card_pile[chk]);
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

function new_modifier(name, mod) {
    return {
        name: name,
        mod: mod
    };
}

export default class GMSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/gm-sheet.html`,
            classes: ["doc"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
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
        data.action_deck = sort_deck(data.items.filter(function (item) {return item.type == "action_deck"}));
        data.modifiers = this.actor.data.data.modifiers;
        data.tn = 5;
        for (const [key, mod] of Object.entries(data.modifiers)){
            if (mod.active) {
                data.tn -= mod.mod;
            }
        }
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        if (data.combat_active) {
            let action_list = [];
            for (let i = 0; i < game.dc.chars.length; i++) {
                const actor = game.actors.getName(game.dc.chars[i]);
                let cards = actor.items.filter(function (item) {return item.type == "action_deck"});
                for (let c = 0; c < cards.length; c++) {
                    const card = cards[c];
                    let card_data = {'name': card.name, 'player': actor.data.name};
                    action_list.push(card_data);
                }
            }
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                let card_data = {'name': card.name, 'player': 'GM'};
                action_list.push(card_data);
            }
            if (action_list.length > 0) {
                data.action_list = [];
                for (let card = 0; card < cards.length ; card++) {
                    const cur_card = cards[card];
                    for (let suit = 0; suit < suits.length; suit++) {
                        const cur_suit = suits[suit];
                        for (let chk = 0; chk < action_list.length; chk++) {
                            const chk_card = action_list[chk].name;
                            if( (cur_card == 'Joker' && chk_card == 'Joker (Red)') || (cur_card == 'Joker' && chk_card == 'Joker (Black)') || chk_card == cur_card + ' of ' + cur_suit){
                                data.action_list.push(action_list[chk]);
                                break;
                            }
                        }
                    }
                }
            }
        }else{
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                setTimeout(() => {this.actor.deleteOwnedItem(card._id)}, c * 100);
            }
        }
        return data;
    }

    activateListeners(html) {
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".use-fate").click(this._on_use_fate.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".start-combat").click(this._on_start_combat.bind(this));
        html.find(".new-round").click(this._on_new_round.bind(this));
        html.find(".end-combat").click(this._on_end_combat.bind(this));
        html.find(".draw-card").click(this._on_draw_card.bind(this));
        html.find(".play-card").click(this._on_play_card.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        html.find(".next-turn").click(this._on_next_turn.bind(this));
        return super.activateListeners(html);
    }

    _on_refresh(event) {
        event.preventDefault();
        this.getData();
        this.render();
    }

    _on_draw_fate(event) {
        let chips = [
            {
                name: game.i18n.localize("dc.fate_chips.white"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.white"),
                    bounty: 1
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.red"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.red"),
                    bounty: 2
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.blue"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.blue"),
                    bounty: 3
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.legend"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.legend"),
                    bounty: 5
                }
            }
        ];
        let percs = [
            {limit: 99, chip:3},
            {limit: 88, chip:2},
            {limit: 58, chip:1},
            {limit: 0, chip:0},
        ]
        let choice = Math.floor(Math.random() * 100);
        for (let p = 0; p < percs.length; p++) {
            const el = percs[p];
            if (choice >= el.limit){
                ChatMessage.create({ content: `The Marshal draws a fate chip`});
                return this.actor.createOwnedItem(chips[el.chip])
            }
        }
    }

    _on_use_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let chip_type = element.closest(".use-fate").dataset.chip;
        let act = this.getData();
        let fate_chips = act.items.filter(function (item) {return item.type == "chip"});
        let found = false
        let responses = [
            `I think you might've pissed 'im off`,
            `Let's hope he doesn't have it in fer ya.`,
            `I don't like it when he gets like this...`,
        ];
        fate_chips.forEach(chip => {
            console.log(chip.name, chip_type);
            if (found == false) {
                if (chip.name == chip_type) {
                    let r_msg = responses[get_random_int(0, responses.length - 1)]
                    ChatMessage.create({ content: `
                        <h3 style="text-align:center">Fate</h3>
                        <p style="text-align:center">The Marshal uses a ${chip_type} fate chip.</p>
                        <p style="text-align:center">${r_msg}</p>
                    `});
                    this.actor.deleteOwnedItem(chip._id);
                    found = true;
                }
            }
        });
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `Discarding ${item.type} ${item.name}`});
        return this.actor.deleteOwnedItem(itemId);
    }

    _on_start_combat(event) {
        event.preventDefault();
        let act = this.getData();
        this.actor.update({"combat_active": true});
        ChatMessage.create({ content: `Combat Begins!`});
        game.socket.emit("system.deadlands_classic", {
            operation: 'roll_quickness',
            data: {}
        });
        game.settings.set('deadlands_classic', 'combat_active', true);
        return this.render();
    }

    _on_new_round(event) {
        event.preventDefault();
        ChatMessage.create({ content: `New Round! Get Down with the Quickness!`});
        game.socket.emit("system.deadlands_classic", {
            operation: 'roll_quickness',
            data: {}
        });
        return this.render();
    }

    _on_end_combat(event) {
        event.preventDefault();
        ChatMessage.create({ content: `Combat Ends!`});
        game.socket.emit("system.deadlands_classic", {
            operation: 'end_combat',
            data: {}
        });
        game.settings.set('deadlands_classic', 'combat_active', false);
        return this.render();
    }

    _on_draw_card() {
        let card = game.dc.action_deck.pop();
        let c = Math.random()
        setTimeout(() => {this.actor.createOwnedItem(card)}, c * 100);
    }

    _on_play_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `
            <h3 style="text-align: center;">Action Deck</h3>
            <p style="text-align: center;">The Marshal plays ${item.name}</p>
        `});
        game.dc.action_discard.push(item)
        setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, 500);
        return this.getData();
    }

    _on_next_turn(event) {
        event.preventDefault();
        if (game.dc.combat_active) {
            let data = this.getData();
            let next = data.action_list.pop();
            console.log(next);
        }
    }
}