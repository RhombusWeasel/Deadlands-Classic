import { dc } from "../config.js";
let card_vals = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suit_vals = ["Spades", "Hearts", "Diamonds", "Clubs"];

function sort(card_pile){

}
export default class GMSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/gm-sheet.html`,
            classes: ["player-sheet"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.fate_chips = data.items.filter(function (item) {return item.type == "chip"});
        data.action_deck = data.items.filter(function (item) {return item.type == "action_deck"});
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        if (data.combat_active) {
            //There must be a token in the scene owned by a player for this to work.
            let actor_list = canvas.tokens.placeables.filter(t => t.actor.hasPlayerOwner);
            let action_list = [];
            for (let i = 0; i < actor_list.length; i++) {
                const actor = actor_list[i];
                let cards = actor.actor.items.filter(function (item) {return item.type == "action_deck"});
                for (let c = 0; c < cards.length; c++) {
                    const card = cards[c];
                    let card_data = {'name': card.name, 'player': actor.actor.data.name};
                    action_list.push(card_data);
                }
            }
            console.log('Action List Pre GM', action_list);
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                let card_data = {'name': card.name, 'player': 'GM'};
                action_list.push(card_data);
            }
            console.log('Action List Post GM', action_list);
            if (action_list.length > 0) {
                data.action_list = [];
                for (let card = 0; card < card_vals.length ; card++) {
                    const cur_card = card_vals[card];
                    for (let suit = 0; suit < suit_vals.length; suit++) {
                        const cur_suit = suit_vals[suit];
                        for (let chk = 0; chk < action_list.length; chk++) {
                            const chk_card = action_list[chk].name;
                            if( chk_card == 'Joker (Red)' || chk_card == 'Joker (Black)' || chk_card == cur_card + ' of ' + cur_suit){
                                data.action_list.push(action_list[chk]);
                                //console.log('Checking ' + cur_card + ' of ' + cur_suit);
                                //console.log('Action List Mid Sort:', data.action_list);
                                break;
                            }
                        }
                    }
                }
                console.log('Action List Post Sort:', data.action_list);
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
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".start-combat").click(this._on_start_combat.bind(this));
        html.find(".new-round").click(this._on_new_round.bind(this));
        html.find(".end-combat").click(this._on_end_combat.bind(this));
        html.find(".draw-card").click(this._on_draw_card.bind(this));
        html.find(".play-card").click(this._on_play_card.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
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
        ChatMessage.create({ content: `Playing ${item.name}`});
        game.dc.action_discard.push(item)
        setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, 500);
        return this.getData();
    }
}