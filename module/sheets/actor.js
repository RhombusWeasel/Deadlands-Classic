export default class PlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/player-sheet.html`,
            classes: ["player-sheet"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.firearms = data.items.filter(function (item) {return item.type == "firearm"});
        data.melee_weapons = data.items.filter(function (item) {return item.type == "melee"});
        data.miracles = data.items.filter(function (item) {return item.type == "miracle"});
        data.hexes = data.items.filter(function (item) {return item.type == "hex"});
        data.favors = data.items.filter(function (item) {return item.type == "favor"});
        data.hinderances = data.items.filter(function (item) {return item.type == "hinderance"});
        data.edges = data.items.filter(function (item) {return item.type == "edge"});
        data.fate_chips = data.items.filter(function (item) {return item.type == "chip"});
        return data;
    }

    activateListeners(html) {
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".spend-fate").click(this._on_spend_fate.bind(this));
        html.find(".melee-attack").click(this._on_melee_attack.bind(this));
        html.find(".gun-attack").click(this._on_gun_attack.bind(this));
        html.find(".gun-reload").click(this._on_gun_reload.bind(this));
        return super.activateListeners(html);
    }

    _on_item_open(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        return item.sheet.render(true);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `Discarding ${item.type} ${item.name}`});
        return this.actor.deleteOwnedItem(itemId);
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
                return this.actor.createOwnedItem(chips[el.chip])
            }
        }
    }

    _on_spend_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let new_val = parseInt(act.data.bounty.value) + parseInt(item.data.data.bounty)
        let new_max = parseInt(act.data.bounty.max) + parseInt(item.data.data.bounty)

        ChatMessage.create({ content: `Spending a ${item.name} chip for ${item.data.data.bounty} bounty points.`});
        this.actor.update({"data.bounty.value": new_val})
        this.actor.update({"data.bounty.max": new_max})
        return this.actor.deleteOwnedItem(itemId);
    }

    _on_melee_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let dmg = item.data.data.damage;
        let act = this.getData();
        let trait = act.data.traits.nimbleness;
        let skill = trait.skills.fightin;
        let lvl = skill.level
        if (lvl == 0) {
            lvl = trait.level
        }
        let roll = `Brawlin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier}]]\nDamage: [[${act.data.traits.strength.level}${act.data.traits.strength.die_type}x= + ${dmg}x=]]\nLocation: [[d20]]`;
        ChatMessage.create({ content: roll});
    }

    _on_gun_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let shots = item.data.data.chamber;
        let dmg = item.data.data.damage;
        let off_hand_mod = 0
        let act = this.getData();
        let trait = act.data.traits.deftness;
        let skill = trait.skills["shootin_".concat(item.data.data.gun_type)];
        if (shots > 0) {
            if (item.data.data.off_hand) {
                off_hand_mod = act.off_hand_mod
            }
            let lvl = skill.level
            if (lvl == 0) {
                lvl = trait.level
            }
            let roll = `
                Shootin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${off_hand_mod}]]\n
                Damage: [[${dmg}x=]]\n
                Location: [[d20]]
            `;
            ChatMessage.create({ content: roll});
            shots = shots - 1;
        }else{
            ChatMessage.create({ content: 'Click... Click Click! Looks like you\'re empty partner'});
        }
        item.update({ "data.chamber": shots});
    }

    _on_gun_reload(event) {
        event.preventDefault();
        let reply = 'You failed your speed load skill check and manage to get 1 bullet into the gun.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let shots = item.data.data.chamber;
        let max = item.data.data.max;
        if (shots >= max) {
            reply = 'Your gun is full of ammo!';
            shots = max;
        }else{
            let act = this.getData();
            let trait = act.data.traits.deftness;
            let skill = trait.skills.speed_load;
            let lvl = skill.level;
            let roll = `${lvl}${trait.die_type}ex + ${skill.modifier} + ${trait.modifier}`
            if (lvl < 1){
                roll = `${trait.level}${trait.die_type}ex + ${skill.modifier} + ${trait.modifier}`
            }
            let reply = 'You failed your speed load skill check and manage to get 1 bullet into the gun.'
            let r = new Roll(roll).roll()
            r.toMessage()
            if(r._total > 5){
                reply = 'You passed your speed load skill check and manage to cram your gun full of bullets!'
                shots = max
            }else{
                shots = Math.min(shots + 1, max)
            }
        }
        item.update({ "data.chamber": shots});
        ChatMessage.create({ content: reply});
    }
}