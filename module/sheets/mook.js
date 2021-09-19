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
    let value = dc_utils.deck.get_card_value(card);
    let suit = card.name.slice(-1);
    card.die_type = die_types[value];
    if (value == 'Jo') {
        let s_card = deck.pop();
        if (dc_utils.deck.get_card_value(s_card) == 'Jo') {
            s_card = deck.pop()
        }
        card.level = suit_types[s_card.name.slice(-1)];
    }else{
        card.level = suit_types[suit];
    }
    return {amt: card.level, die: card.die_type, card: card}
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
        html.find(".skill-roll").click(this._on_skill_roll.bind(this));
        html.find(".skill-buff").click(this._on_skill_buff.bind(this));
        html.find(".die-buff").click(this._on_die_buff.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".attack").click(this._on_attack.bind(this));
        html.find(".gun-reload").click(this._on_gun_reload.bind(this));
        html.find(".sling-trick").click(this._on_cast_trick.bind(this));
        html.find(".sling-hex").click(this._on_cast_hex.bind(this));
        html.find(".cast-miracle").click(this._on_cast_miracle.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        html.find(".ethnicity-select").change(this._on_ethnicity_select.bind(this));
        return super.activateListeners(html);
    }

    _on_generate(event) {
        event.preventDefault();
        let draw_deck = dc_utils.deck.new('draw');
        let act = dc_utils.get_actor(this.actor.name);
        for(let key in act.data.data.traits){
            let dice = get_dice_from_card(draw_deck.pop(), draw_deck);
            dc_utils.char.skill.set_level(this.actor, key, dice.amt);
            dc_utils.char.skill.set_die_type(this.actor, key, dice.die);
        }
        let spirit = dc_utils.char.skill.get(act, 'spirit');
        let vigor = dc_utils.char.skill.get(act, 'vigor');
        let max_wind = spirit.sides + vigor.sides;
        act.update({data: {wind: {value: max_wind}}});
        act.update({data: {wind: {max: max_wind}}});

        let nimbleness = dc_utils.char.skill.get(act, 'nimbleness');
        act.update({data: {pace: nimbleness.sides}});
    }

    _on_ethnicity_select(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let value = element.value;
        let char = dc_utils.get_actor(this.actor.name);
        char.update({data: {ethnicity: value}});
    }

    _on_skill_roll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let skl = element.closest(".skill-data").dataset.skill;
        let skill = dc_utils.char.skill.get(this.actor, skl);
        let data = dc_utils.roll.new_roll_packet(this.actor, 'skill', skl);
        if (!(game.user.isGM)) {
            dc_utils.socket.emit('check_tn', data);
        }else{
            data.roll = dc_utils.roll.new(data);
            data.roll = dc_utils.roll.evaluate(data.roll, data.tn, data.modifier);
            ChatMessage.create({content: build_skill_template(data)});
        }
    }

    _on_skill_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let skill = dc_utils.char.skill.get(this.actor, element.closest(".skill-data").dataset.skill);
        dc_utils.char.skill.add_level(this.actor, skill.key, 1);
    }

    _on_die_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = dc_utils.char.skill.get(this.actor, element.closest(".skill-data").dataset.skill);
        if (trait.die_sides == 12) {
            dc_utils.char.skill.add_modifier(this.actor, trait.key, 2);
        }else{
            dc_utils.char.skill.increase_die_type(this.actor, trait.key);
        }
    }

    _on_refresh(event) {
        event.preventDefault();
        this.getData();
        this.render();
    }

    _on_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId  = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId)
        if (itemId == 'Nuthin') {
            return
        }else{
            let data
            if (item.type == 'melee') {
                data = dc_utils.roll.new_roll_packet(this.actor, 'melee', 'fightin', itemId);
            }else if (item.type == 'firearm') {
                data = dc_utils.roll.new_roll_packet(this.actor, 'ranged', `shootin_${item.data.data.gun_type}`, itemId);
            }
            dc_utils.socket.emit("register_attack", data);
        }
    }

    _on_item_open(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        return item.sheet.render(true);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        ChatMessage.create({ content: `
            Discarding ${item.type} ${item.name}
        `});
        dc_utils.char.items.delete(this.actor, itemId);
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