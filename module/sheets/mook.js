let d6 = ["3", "4", "5", "6", "7", "8"]
let d8 = ["9", "10", "Jack"]
let d10 = ["Queen", "King"]
let d12 = ["Ace"]
let aim_bonus = 0

function check_joker(card, deck) {
    let values = card.split(' ');
    if (values[0] == 'Joker') {
        return check_joker(deck.pop().name, deck);
    }
    return card;
}

function get_dice_from_card(card, deck) {
    card = check_joker(card, deck)
    let values = card.split(' ');
    let card_val = values[0];
    let card_suit = values[2];
    let amt = 1;
    let die = 'd4';
    if (card_suit == 'Spades') {
        amt = 4
    }
    if (card_suit == 'Hearts') {
        amt = 3
    }
    if (card_suit == 'Diamonds') {
        amt = 2
    }
    if (card_suit == 'Clubs') {
        amt = 1
    }
    if (d6.includes(card_val)) {
        die = 'd6'
    }else if (d8.includes(card_val)) {
        die = 'd8'
    }else if (d10.includes(card_val)) {
        die = 'd10'
    }else if (d12.includes(card_val)) {
        die = 'd12'
    }
    return {amt: amt, die: die, card: card}
}

export default class NPCSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/mook-sheet.html`,
            classes: ["player-sheet"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.firearms = data.items.filter(function (item) {return item.type == "firearm"});
        data.melee_weapons = data.items.filter(function (item) {return item.type == "melee"});
        data.miracles = data.items.filter(function (item) {return item.type == "miracle"});
        data.tricks = data.items.filter(function (item) {return item.type == "trick"});
        data.hexes = data.items.filter(function (item) {return item.type == "hex"});
        data.favors = data.items.filter(function (item) {return item.type == "favor"});
        data.hinderances = data.items.filter(function (item) {return item.type == "hinderance"});
        data.edges = data.items.filter(function (item) {return item.type == "edge"});
        data.goods = data.items.filter(function (item) {return item.type == "goods"});
        data.fate_chips = data.items.filter(function (item) {return item.type == "chip"});
        data.huckster_deck = data.items.filter(function (item) {return item.type == "huckster_deck"});
        return data;
    }

    activateListeners(html) {
        html.find(".gen-button").click(this._on_generate.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".melee-attack").click(this._on_melee_attack.bind(this));
        html.find(".gun-attack").click(this._on_gun_attack.bind(this));
        html.find(".gun-reload").click(this._on_gun_reload.bind(this));
        html.find(".sling-trick").click(this._on_cast_trick.bind(this));
        html.find(".sling-hex").click(this._on_cast_hex.bind(this));
        html.find(".cast-miracle").click(this._on_cast_miracle.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        return super.activateListeners(html);
    }

    _on_generate(event) {
        event.preventDefault();
        let draw_deck = dc_utils.deck.new('draw');
        let act = this.getData();
        for(let key in act.data.traits){
            let dice = get_dice_from_card(draw_deck.pop().name, draw_deck);
            let target_lvl = `data.traits.${key}.level`;
            let target_die = `data.traits.${key}.die_type`;
            this.actor.update({[target_lvl]: dice.amt});
            this.actor.update({[target_die]: dice.die});
        }
        let spirit = parseInt(act.data.traits.spirit.die_type.substring(1, 3));
        let vigor = parseInt(act.data.traits.vigor.die_type.substring(1, 3));
        let max_wind = spirit + vigor
        this.actor.update({'data.wind.value': max_wind});
        this.actor.update({'data.wind.max': max_wind});

        let nimbleness = parseInt(act.data.traits.nimbleness.die_type.substring(1, 3));
        this.actor.update({'data.pace': nimbleness});
    }

    _on_refresh(event) {
        event.preventDefault();
        this.getData();
        this.render();
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
        let roll = `
            Brawlin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${game.dc.aim_bonus}]]\n
            Damage: [[${act.data.traits.strength.level}${act.data.traits.strength.die_type}x= + ${dmg}x=]]\n
            Location: [[d20]]
        `;
        game.dc.aim_bonus = 0
        ChatMessage.create({ content: roll});
    }

    _on_gun_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let shots = item.data.data.chamber;
        let dmg = item.data.data.damage;
        let dmg_mod = item.data.data.damage_bonus;
        let off_hand_mod = 0
        let act = this.getData();
        let wound_mod = act.data.wound_modifier
        let trait = act.data.traits.deftness;
        let skill = trait.skills["shootin_".concat(item.data.data.gun_type)];
        if (shots > 0) {
            if (item.data.data.off_hand) {
                console.log(act)
                off_hand_mod = act.data.off_hand_modifier
            }
            let lvl = skill.level
            if (lvl == 0) {
                lvl = trait.level
            }
            let roll = `
                ${item.name}: 
                Shootin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${off_hand_mod} + ${game.dc.aim_bonus} + ${wound_mod}]]\n
                Damage: [[${dmg}x= + ${dmg_mod}]]\n
                Location: [[1d20]]
            `;
            ChatMessage.create({ content: roll});
            shots = shots - 1;
            game.dc.aim_bonus = 0;
        }else{
            ChatMessage.create({ content: `Click... Click Click! Looks like you're empty partner`});
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
            reply = 'You failed your speed load skill check and manage to get 1 bullet into the gun.'
            let r = new Roll(roll).roll()
            r.toMessage()
            if(r._total >= 5){
                reply = 'You passed your speed load skill check and manage to cram your gun full of bullets!'
                shots = max
            }else{
                shots = Math.min(shots + 1, max)
            }
        }
        item.update({ "data.chamber": shots});
        ChatMessage.create({ content: reply});
    }

    _on_cast_trick(event) {
        event.preventDefault();
        let reply = 'You fail in your attempt to contact the Hunting Grounds.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let deck = dc_utils.deck.new('huckster_deck')
        let roll_str = `${item.data.data.level}${act.data.traits[item.data.data.trait].die_type}ex + ${act.data.traits[item.data.data.trait].modifier}`
        let r = new Roll(roll_str).roll()
        let draw = 0
        if (r._total >= 5) {
            draw = Math.floor(r._total / 5)
            reply = `You rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500)
        }
        r.toMessage()
        ChatMessage.create({ content: reply});
    }

    _on_cast_hex(event) {
        event.preventDefault();
        let reply = 'You fail in your attempt to contact the Hunting Grounds.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let deck = dc_utils.deck.new('huckster_deck')
        let roll_str = `${item.data.data.level}${act.data.traits[item.data.data.trait].die_type}ex + ${act.data.traits[item.data.data.trait].modifier}`
        let r = new Roll(roll_str).roll()
        let draw = 0
        if (r._total >= 5) {
            draw = 5 + (Math.floor(r._total / 5))
            reply = `You rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500)
        }
        r.toMessage()
        ChatMessage.create({ content: reply});
    }

    _on_cast_miracle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let roll_str = `Casts ${item.name}: [[${act.data.traits.spirit.skills.faith.level}${act.data.traits.spirit.die_type}ex + ${act.data.traits.spirit.modifier}]] against a TN of ${item.data.data.tn}`
        ChatMessage.create({ content: roll_str});
    }
}