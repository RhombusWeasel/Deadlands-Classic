import { dc } from "../config.js";

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
        data.combat_active = game.dc.combat_active
        return data;
    }

    activateListeners(html) {
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".start-combat").click(this._on_start_combat.bind(this));
        html.find(".end-combat").click(this._on_end_combat.bind(this));
        html.find(".new-round").click(this._on_new_round.bind(this));
        return super.activateListeners(html);
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
        game.dc.combat_active = true;
        game.socket.emit("system.deadlands_classic", {
            operation: 'roll_quickness',
            data: {}
        });
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
        return this.render();
    }
}