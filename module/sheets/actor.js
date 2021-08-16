let percs = [
    {limit: 99, chip:3},
    {limit: 88, chip:2},
    {limit: 58, chip:1},
    {limit: 0, chip:0},
];

let trait_scroll = 0;
let item_scroll = 0;

function get_target() {
    for (let t = 0; t < canvas.tokens.placeables.length; t++) {
        let tgt = canvas.tokens.placeables[t]
        for (let u of tgt.targeted) {
            if (u._id == game.user._id) {
                return tgt;
            }
        }
    }
    return false;
}

function build_skill_template(data) {
    console.log('DC | build_skill_template', data);
    let r_str = `
        <h2 style="text-align:center">${data.skill_name} [${data.tn}]</h2>
    `;
    r_str += dc_utils.roll.get_result_template(data);
    if (data.roll.success) {
        //Winning
        if (data.roll.raises == 1) {
            r_str += `
                <p style="text-align:center">${data.name} passed with a raise</p>
            `;
        }else if (data.roll.raises > 0) {
            r_str += `
                <p style="text-align:center">${data.name} passed with ${data.roll.raises} raises</p>
            `;
        }else{
            r_str += `
                <p style="text-align:center">${data.name} passed</p>
            `;
        }
    }else if (data.roll.ones > data.roll.pass) {
        r_str += `
            <p style="text-align:center">${data.name} critically failed!</p>
        `;
    }else{
        r_str += `
            <p style="text-align:center">${data.name} failed.</p>
        `;
    }
    return r_str;
}

export default class PlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/player-sheet.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "core" }]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.id = this.actor.id;
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        data.firearms = dc_utils.char.items.get(this.actor, "firearm", "gun_type");
        data.equippable = dc_utils.char.items.get_equippable(this.actor);
        data.hand_slots = dc_utils.hand_slots;
        data.equip_slots = dc_utils.equip_slots;
        data.melee_weapons = dc_utils.char.items.get(this.actor, "melee");
        data.miracles = dc_utils.char.items.get(this.actor, "miracle");
        data.tricks = dc_utils.char.items.get(this.actor, "trick");
        data.hexes = dc_utils.char.items.get(this.actor, "hex");
        data.favors = dc_utils.char.items.get(this.actor, "favor");
        data.hinderances = dc_utils.char.items.get(this.actor, "hinderance");
        data.edges = dc_utils.char.items.get(this.actor, "edge");
        //data.level_headed_available = game.dc.level_headed_available;
        data.goods = dc_utils.char.items.compress(this.actor, dc_utils.char.items.get(this.actor, "goods"));
        data.huckster_deck = dc_utils.deck.sort(dc_utils.char.items.get(this.actor, "huckster_deck"));
        if (data.huckster_deck.length > 0) data.huckster_hand = dc_utils.deck.evaluate_hand(data.huckster_deck);
        data.action_deck = this.actor.data.data.action_cards;
        let fate_chips = dc_utils.char.items.get(this.actor, "chip");
        data.targets = dc_utils.called_shots;
        data.fate_chips = [
            {name: "White", bounty: "1", amount: fate_chips.filter(function(i){return i.name == 'White'}).length},
            {name: "Red", bounty: "2", amount: fate_chips.filter(function(i){return i.name == 'Red'}).length},
            {name: "Blue", bounty: "3", amount: fate_chips.filter(function(i){return i.name == 'Blue'}).length},
            {name: "Legendary", bounty: "5", amount: fate_chips.filter(function(i){return i.name == 'Legendary'}).length},
        ];
        let lh = data.items.filter(function (item) {return item.type == "edge" && item.name == "Level Headed"})
        if (data.combat_active) {
        }else{
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                setTimeout(() => {card.delete()}, c * 100);
            }
        }
        return data;
    }

    activateListeners(html) {
        html.find(".die-buff").click(this._on_die_buff.bind(this));
        html.find(".skill-roll").click(this._on_skill_roll.bind(this));
        html.find(".skill-buff").click(this._on_skill_buff.bind(this));
        html.find(".magic-buff").click(this._on_magic_buff.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".play-card").click(this._on_play_card.bind(this));
        html.find(".play-item-card").click(this._on_play_item_card.bind(this));
        html.find(".discard-hand").click(this._on_discard_hand.bind(this));
        html.find(".aim-button").click(this._on_aim.bind(this));
        html.find(".recycle-card").click(this._on_recycle.bind(this));
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".roll-quickness").click(this._on_roll_init.bind(this));
        html.find(".spend-fate").click(this._on_spend_fate.bind(this));
        html.find(".use-fate").click(this._on_use_fate.bind(this));
        html.find(".attack").click(this._on_attack.bind(this));
        html.find(".gun-attack").click(this._on_firearm_attack.bind(this));
        html.find(".gun-reload").click(this._on_gun_reload.bind(this));
        html.find(".sling-trick").click(this._on_cast_trick.bind(this));
        html.find(".sling-hex").click(this._on_cast_hex.bind(this));
        html.find(".cast-miracle").click(this._on_cast_miracle.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        html.find(".equip-select").change(this._on_item_equip.bind(this));

        var traits = document.getElementsByClassName("trait_scroller");
        traits[0].addEventListener("scroll", () => {
            game.dc.trait_scroll = document.querySelector(".trait_scroller").scrollTop;
        });
        traits[0].scrollTop = game.dc.trait_scroll;
        return super.activateListeners(html);
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
        let cost = skill.level + 1
        if (skill.level + 1 > 5) {
            cost *= 2
        }
        if (dc_utils.char.bounty.get(this.actor) >= cost){
            dc_utils.char.bounty.remove(this.actor, cost);
            dc_utils.char.skill.add_level(this.actor, skill.key, 1);
        }
    }

    _on_die_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = dc_utils.char.skill.get(element.closest(".skill-data").dataset.skill);
        let cost = (trait.sides + trait.modifier) * 3
        let bounty = dc_utils.char.bounty.get(this.actor);
        if (bounty >= cost){
            dc_utils.char.skill.increase_die_type(this.actor, trait.key);
        }
    }

    _on_magic_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let name = item.name;
        let level = parseInt(item.data.data.level);
        let bounty = this.actor.data.data.bounty.value;
        let cost = level + 1
        console.log(`Attempting to increase ${name}`);
        if (level >= 5) {
            cost *= 2
        }
        console.log(name, level, bounty, cost, item,);
        if (bounty >= cost) {
            this.actor.update({data: {bounty: {value: bounty - cost}}});
            item.update({'data.level': level + 1});
        }
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
        let item = this.actor.items.get(itemId);
        return item.sheet.render(true);
    }

    _on_item_equip(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let slot = element.closest(".item").dataset.slot;
        let itemId = element.value;
        let char = dc_utils.get_actor(this.actor.name);
        dc_utils.char.items.equip(char, slot, itemId);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Discard', `${this.actor.name} discards ${item.name}`);
        ChatMessage.create({ content: `
            Discarding ${item.type} ${item.name}
        `});
        dc_utils.char.items.delete(this.actor, itemId);
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
        let choice = Math.floor(Math.random() * 100);
        for (let p = 0; p < percs.length; p++) {
            const el = percs[p];
            if (choice >= el.limit){
                ChatMessage.create({ content: `Draws a ${chips[el.chip].name} fate chip`, whisper: ChatMessage.getWhisperRecipients('GM')});
                return this.actor.createOwnedItem(chips[el.chip])
            }
        }
    }

    _on_spend_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let chip_type = element.closest(".fate-data").dataset.chip;
        let bounty = element.closest(".fate-data").dataset.bounty;
        let act = this.getData();
        let fate_chips = act.items.filter(function (item) {return item.type == "chip"});
        for (let chip of fate_chips) {
            if (chip.name == chip_type) {
                let new_val = parseInt(act.data.data.bounty.value) + parseInt(bounty);
                let new_max = parseInt(act.data.data.bounty.max) + parseInt(bounty);
                let suffix = 'points';
                if (bounty == '1') {
                    suffix = 'point'
                }
                ChatMessage.create({ content: `
                    <h3 style="text-align:center">Bounty: ${chip_type}</h3>
                    <p style="text-align:center">${this.actor.name.split(' ')[0]} gains ${bounty} bounty ${suffix}.</p>
                `});
                this.actor.update({data: {bounty: {value: new_val}}});
                this.actor.update({data: {bounty: {max: new_max}}});
                this.actor.deleteOwnedItem(chip._id);
                break;
            }
        }
    }

    _on_use_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let chip_type = element.closest(".fate-data").dataset.chip;
        let act = this.getData();
        let fate_chips = act.items.filter(function (item) {return item.type == "chip"});
        for (let chip of fate_chips) {
            if (chip.name == chip_type) {
                ChatMessage.create({ content: `
                    <h3 style="text-align:center">Fate</h3>
                    <p style="text-align:center">${this.actor.name.split(' ')[0]} uses a ${chip_type} fate chip.</p>
                `});
                this.actor.deleteOwnedItem(chip._id);
                break;
            }
        }
    }

    _on_roll_init(event){
        event.preventDefault();
        let reply = `There ain't no combat right now, is ${this.actor.name} wantin' to start somethin'?`
        let data = this.getData();
        if (data.combat_active == true) {
            let element = event.currentTarget;
            let act = this.getData();
            let trait = act.data.data.traits.quickness;
            let roll = `${trait.level}${trait.die_type}ex + ${trait.modifier}`
            let draw = 1
            let r = new Roll(roll).roll();
            if (r._total >= 5) {
                draw = Math.min(1 + Math.ceil((r._total - 4) / 5), 5)
                reply = `You get ${draw} cards`
            }else{
                reply = 'You draw 1 card'
            }
            r.toMessage({whisper: ChatMessage.getWhisperRecipients('GM')})
            game.socket.emit("system.deadlands_classic", {
                operation: "request_cards",
                data: {
                    user: game.userId,
                    char: this.actor.name,
                    amount: draw
                }
            });
            this.actor.update({'data.perks.level_headed': true});
        }
        let msg = `
            <h3 style="text-align: center">Action Deck</h3>
            <p style="text-align: center">${reply}</p>
        `;
        ChatMessage.create({content: msg, whisper: ChatMessage.getWhisperRecipients('GM')});
    }

    _on_play_item_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Magic', `${this.actor.name} plays ${item.name}`);
        dc_utils.char.items.delete(this.actor, itemId);
    }

    _on_play_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = parseInt(element.closest(".item").dataset.itemindex);
        let card = this.actor.data.data.action_cards[index];
        card.char = this.actor.name;
        dc_utils.socket.emit('discard_card', card);
        dc_utils.combat.remove_card(this.actor, index);
    }

    _on_discard_hand(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let deck = element.dataset.type;
        let cards = dc_utils.deck.sort(dc_utils.char.items.get(this.actor, deck));
        let hand = dc_utils.deck.evaluate_hand(cards);
        let card_str = '';
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            card_str += ` ${card.name}`
            dc_utils.char.items.delete(this.actor, card.id);
        }
        dc_utils.chat.send('Magic', `${this.actor.name} plays ${hand}`, card_str);
    }

    _on_aim(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = parseInt(element.closest(".item").dataset.itemindex);
        let card = this.actor.data.data.action_cards[index];
        card.char = this.actor.name;
        let bonus = this.actor.data.data.aim_bonus + 2
        if (bonus <= 6) {
            this.actor.update({data: {aim_bonus: bonus}});
            dc_utils.socket.emit('discard_card', card);
            dc_utils.combat.remove_card(this.actor, index);
            dc_utils.chat.send('Aim', `${this.actor.name} takes a moment to aim. [+${bonus}]`);
        }else{
            dc_utils.chat.send('Aim', `${this.actor.name} can't aim any more, time to shoot 'em`);
        }
    }

    _on_recycle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemindex;
        let card = this.actor.data.data.action_cards[index];
        card.char = this.actor.name;
        let reply = `You have already cycled a card this round.`;
        let level_headed_available = this.actor.data.data.perks.level_headed;
        if (level_headed_available){
            dc_utils.combat.remove_card(this.actor, index);
            dc_utils.socket.emit('recycle_card',
                {
                    char: this.actor.name,
                    card: card
                }
            );
            reply = `
                <h3 style="text-align:center">Discard</h3>
                <p style="text-align:center">${this.actor.name.split(' ')[0]} discards ${card.name} hoping for better luck next time.</p>
            `;
            this.actor.update({'data.perks.level_headed': false});
        }
        ChatMessage.create({ content: `
            <h3 style="text-align:center">Level Headed</h3>
            <p>${reply}</p>
        `});
    }

    _on_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        console.log(element)
        let itemId  = element.dataset.itemid;
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

    _on_melee_attack(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let target = get_target()
        if (target == false) {
            console.log('DC:', 'Target not found.');
            return;
        }
        let skl = 'fightin'
        let skill = dc_utils.char.skill.get(this.actor, skl);
        let data = {
            type: 'melee',
            roller: this.actor.name,
            target: target.name,
            attacker: this.actor.name,
            weapon: itemId,
            amt: skill.level,
            dice: skill.die_type,
            skill_name: skill.name,
            skill: skl,
            tn: dc_utils.roll.get_tn(),
            name: this.actor.name,
            modifier: skill.modifier
        }
        dc_utils.socket.emit("declare_attack", data);
    }

    _on_firearm_attack(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        let target = get_target()
        if (target == false) {
            console.log('DC:', 'Target not found.');
            return;
        }
        let skl = `shootin_${item.data.data.gun_type}`
        let skill = dc_utils.char.skill.get(this.actor, skl);
        let data = {
            type: 'ranged',
            roller: this.actor.name,
            target: target.name,
            attacker: this.actor.name,
            weapon: itemId,
            amt: skill.level,
            dice: skill.die_type,
            skill_name: skill.name,
            skill: skl,
            tn: dc_utils.roll.get_tn(),
            name: this.actor.name,
            modifier: skill.modifier
        }
       dc_utils.socket.emit("declare_attack", data);
    }

    _on_gun_reload(event) {
        event.preventDefault();
        let reply = 'You failed your speed load skill check and manage to get 1 bullet into the gun.'
        let element = event.currentTarget;
        let itemId = element.dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let shots = parseInt(item.data.data.chamber);
        let max = item.data.data.max;
        let ammo = this.actor.items.find(i => i.name == item.data.data.calibur) ;
        console.log(max);
        if (shots >= max) {
            reply = 'Your gun is full of ammo!';
            shots = max;
        }else{
            max -= shots;
            console.log('- shots remaining.', max);
            let act = this.getData();
            let trait = act.data.data.traits.deftness;
            let skill = trait.skills.speed_load;
            let lvl = skill.level;
            if (ammo){
                if (ammo.data.data.amount <= max) {
                    max = ammo.data.data.amount;
                    console.log('less ammo than needed.', max);
                }
                let roll = `${lvl}${trait.die_type}ex + ${skill.modifier} + ${trait.modifier}`
                if (lvl < 1){
                    roll = `${trait.level}${trait.die_type}ex + ${skill.modifier} + ${trait.modifier}`
                }
                reply = 'You failed your speed load skill check and manage to get 1 bullet into the gun.'
                let r = new Roll(roll).roll()
                r.toMessage({rollMode: 'gmroll'})
                if(r._total >= 5){
                    reply = 'You passed your speed load skill check and manage to cram your gun full of bullets!'
                    shots += max
                }else{
                    max = 1;
                    shots += max;
                    console.log('Failed check.', max);
                }
                ammo.update({"data.amount": ammo.data.data.amount - max});
                item.update({"data.chamber": shots});
            }else{
                reply = `Looks like you ain't got no more ammo left, I hope you brought another gun!`
            }
        }
        ChatMessage.create({
            content: `
                <h3 style="text-align:center">Reload</h3>
                <p style="text-align:center">${reply}</p>
            `,
            whisper: ChatMessage.getWhisperRecipients('GM')
        });
    }

    _on_cast_trick(event) {
        event.preventDefault();
        let reply = 'You fail in your attempt to contact the Hunting Grounds.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let deck = dc_utils.deck.new('huckster_deck');
        let roll_str = `${act.data.data.traits[item.data.data.trait].level}${act.data.data.traits[item.data.data.trait].die_type}ex + ${act.data.data.traits[item.data.data.trait].modifier}`;
        let r = new Roll(roll_str).roll();
        let draw = 0;
        if (r._total >= 5) {
            draw = Math.floor(r._total / 5)
            reply = `You rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500);
        }
        r.toMessage({rollMode: 'gmroll'});
        ChatMessage.create({ 
            content: `
                <h3 style="text-align:center">Trick</h3>
                <p style="text-align:center">${reply}</p>
            `,
            whisper: ChatMessage.getWhisperRecipients('GM')
        });
    }

    _on_cast_hex(event) {
        event.preventDefault();
        let reply = 'You fail in your attempt to contact the Hunting Grounds.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let deck = dc_utils.deck.new('huckster_deck')
        let roll_str = `${item.data.data.level}${act.data.data.traits[item.data.data.trait].die_type}ex + ${act.data.data.traits[item.data.data.trait].modifier}`
        let r = new Roll(roll_str).roll()
        let draw = 0
        if (r._total >= 5) {
            draw = 5 + (Math.floor(r._total / 5))
            reply = `You rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500)
        }
        r.toMessage({rollMode: 'gmroll'})
        ChatMessage.create({
            content: `
                <h3 style="text-align:center">Hex</h3>
                <p style="text-align:center">${reply}</p>
            `,
            whisper: ChatMessage.getWhisperRecipients('GM')
        });
    }

    _on_cast_miracle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let roll_str = `Casts ${item.name}: [[${act.data.data.traits.spirit.skills.faith.level}${act.data.data.traits.spirit.die_type}ex + ${act.data.data.traits.spirit.modifier}]] against a TN of ${item.data.data.tn}`
        ChatMessage.create({ 
            content: `
                <h3 style="text-align:center">Miracle</h3>
                <p style="text-align:center">${roll_str}</p>
            `,
            whisper: ChatMessage.getWhisperRecipients('GM')
        });
    }
}