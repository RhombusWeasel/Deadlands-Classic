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
    let r_str = `
        <h2 class="center typed">${data.skill_name}</h2>
    `;
    r_str += dc_utils.roll.get_result_template(data);
    if (data.roll.success) {
        //Winning
        if (data.roll.raises == 1) {
            r_str += `
                <p class="center typed">${data.name} passed with a raise</p>
            `;
        }else if (data.roll.raises > 0) {
            r_str += `
                <p class="center typed">${data.name} passed with ${data.roll.raises} raises</p>
            `;
        }else{
            r_str += `
                <p class="center typed">${data.name} passed</p>
            `;
        }
    }else if (data.roll.ones > data.roll.pass) {
        r_str += `
            <p class="center typed">${data.name} critically failed!</p>
        `;
    }else{
        r_str += `
            <p class="center typed">${data.name} failed.</p>
        `;
    }
    return r_str;
}

export default class PlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/player-sheet.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "combat" }],
            width: 500,
            height: 700
        });
    }

    getData() {
        const data         = super.getData();
        data.config        = CONFIG.dc;
        data.id            = this.actor.id;
        data.time          = dc_utils.time.get_date();
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
        data.gen_deck      = dc_utils.deck.sort(data.items.filter(function (item) {return item.type == "gen_deck"}));
        data.firearms      = dc_utils.char.items.get(this.actor, "firearm", "gun_type");
        data.equippable    = dc_utils.char.items.get_equippable(this.actor);
        data.hand_slots    = dc_utils.hand_slots;
        data.equip_slots   = dc_utils.equip_slots;
        data.melee_weapons = dc_utils.char.items.get(this.actor, "melee");
        data.miracles      = dc_utils.char.items.get(this.actor, "miracle");
        data.tricks        = dc_utils.char.items.get(this.actor, "trick");
        data.hexes         = dc_utils.char.items.get(this.actor, "hex");
        data.favors        = dc_utils.char.items.get(this.actor, "favor");
        data.components    = dc_utils.char.items.get(this.actor, "components");
        data.hinderances   = dc_utils.char.items.get(this.actor, "hinderance");
        data.edges         = dc_utils.char.items.get(this.actor, "edge");
        data.chi_powers    = dc_utils.char.items.get(this.actor, "chi");
        //data.level_headed_available = game.dc.level_headed_available;
        data.goods         = dc_utils.char.items.get(this.actor, "goods");
        data.boons         = dc_utils.char.items.get(this.actor, "boon");
        dc_utils.char.items.calculate_costs(this.actor, data.goods);
        data.cards         = dc_utils.joker_cards;
        data.suits         = dc_utils.joker_suits;
        let owned  = dc_utils.user.get_owned_actors();
        let online = dc_utils.gm.get_online_actors();
        data.players       = owned.concat(online.filter((item) => owned.indexOf(item) < 0));
        data.gms           = game.actors.filter(i => i.type == 'gm');
        data.huckster_deck = dc_utils.deck.sort(dc_utils.char.items.get(this.actor, "huckster_deck"));
        if (data.huckster_deck.length > 0) data.huckster_hand = dc_utils.deck.evaluate_hand(data.huckster_deck);
        data.action_deck   = this.actor.data.data.action_cards;
        let fate_chips     = dc_utils.char.items.get(this.actor, "chip");
        data.targets       = dc_utils.called_shots;
        data.fate_chips    = [
            {name: "White", bounty: "1", amount: fate_chips.filter(function(i){return i.name == 'White'}).length},
            {name: "Red", bounty: "2", amount: fate_chips.filter(function(i){return i.name == 'Red'}).length},
            {name: "Blue", bounty: "3", amount: fate_chips.filter(function(i){return i.name == 'Blue'}).length},
            {name: "Legendary", bounty: "5", amount: fate_chips.filter(function(i){return i.name == 'Legendary'}).length},
        ];
        let lh = data.items.filter(function (item) {return item.type == "edge" && item.name == "Level Headed"});
        if (data.combat_active) {
        }else{
            for (let c = 0; c < data.action_deck.length; c++) {
                const card = data.action_deck[c];
                setTimeout(() => {card.delete()}, c * 100);
            }
        }
        if (this.actor.type == 'merchant') {
            data.sale_list = this.actor.data.data.sale_list;
        }
        return data;
    }

    activateListeners(html) {
        // Buttons:
        html.find(".edit-toggle").click(this._on_edit_toggle.bind(this));
        html.find(".draw-gen-cards").click(this._on_draw_gen_cards.bind(this));
        html.find(".die-buff").click(this._on_die_buff.bind(this));
        html.find(".skill-roll").click(this._on_skill_roll.bind(this));
        html.find(".skill-buff").click(this._on_skill_buff.bind(this));
        html.find(".magic-buff").click(this._on_magic_buff.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-give").click(this._on_item_pass.bind(this));
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
        html.find(".blueprint").click(this._on_new_blueprint.bind(this));
        html.find(".sling-trick").click(this._on_cast_trick.bind(this));
        html.find(".sling-hex").click(this._on_cast_hex.bind(this));
        html.find(".use-chi").click(this._on_use_chi.bind(this));
        html.find(".cast-miracle").click(this._on_cast_miracle.bind(this));
        html.find(".heal-roll").click(this._on_heal_roll.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        html.find(".wild-joker-hex").click(this._on_joker_wild_hex.bind(this));
        html.find(".bleeding-toggle").click(this._on_bleed_toggle.bind(this));
        html.find(".running-toggle").click(this._on_run_toggle.bind(this));
        html.find(".mounted-toggle").click(this._on_mount_toggle.bind(this));
        html.find(".name-toggle").click(this._on_name_toggle.bind(this));
        html.find(".male-toggle").click(this._on_male_toggle.bind(this));
        html.find(".female-toggle").click(this._on_female_toggle.bind(this));
        // Selector Boxes:
        html.find(".equip-select").change(this._on_item_equip.bind(this));
        html.find(".joker-value-select").change(this._on_joker_value.bind(this));
        html.find(".joker-suit-select").change(this._on_joker_suit.bind(this));
        html.find(".type-select").change(this._on_type_select.bind(this));
        html.find(".set-trait-value").change(this._on_set_trait_value.bind(this));

        var traits = document.getElementsByClassName("trait_scroller")[0];
        if (traits) {
            traits.addEventListener("scroll", () => {
                game.dc.trait_scroll = document.querySelector(".trait_scroller").scrollTop;
            });
            traits.scrollTop = game.dc.trait_scroll;
        }
        return super.activateListeners(html);
    }

    _on_edit_toggle(event) {
        this.actor.update({data: {show_editor: !(this.actor.data.data.show_editor)}});
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

    _on_set_trait_value(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        console.log('set_trait_value', event, itemId, item, element.value);
        if (element.value == 'unassigned') {
            this.actor.update({data: {traits: {[item.data.data.trait]: {level: 1, die_type: "d4"}}}});
        }else{
            this.actor.update({data: {traits: {[element.value]: {level: item.data.data.level, die_type: item.data.data.die_type}}}});
        }
        item.update({data: {trait: element.value}});
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
        let cost = skill.level + 1;
        if (skill.trait_fb) {
            cost = 1;
        }else if (skill.level + 1 > 5) {
            cost *= 2;
        }
        if (dc_utils.char.bounty.get(this.actor) >= cost){
            dc_utils.char.bounty.remove(this.actor, cost);
            dc_utils.char.skill.add_level(this.actor, skill.key, 1);
        }
    }

    _on_die_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = dc_utils.char.skill.get(this.actor, element.closest(".skill-data").dataset.skill);
        let cost = (trait.die_sides + trait.modifier) * 3
        let bounty = dc_utils.char.bounty.get(this.actor);
        if (bounty >= cost){
            dc_utils.char.bounty.remove(this.actor, cost);
            if (trait.die_sides == 12) {
                dc_utils.char.skill.add_modifier(this.actor, trait.key, 2);
            }else{
                dc_utils.char.skill.increase_die_type(this.actor, trait.key);
            }
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
        if (level >= 5) {
            cost *= 2
        }
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
        dc_utils.char.items.equip(this.actor, slot, itemId);
    }

    _on_item_pass(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        let target = this.actor.data.data.send_target;
        if (item.type == 'melee' || item.type == 'firearm' || item.data.data.amount == 1) {
            dc_utils.char.items.pass(this.actor, target, itemId, 1);
            return true;
        }
        let dialog = new Dialog({
            title: `Confirm item transfer`,
            content: `
                <div class="center">
                    <h1>Select Amount</h1>
                    <input type="range" min="0" max="${item.data.data.amount}" value="0" class="slider" name="amount-slider" oninput="this.nextElementSibling.value = this.value"/>
                    <output>0</output>
                </div>
            `,
            buttons: {
                send: {
                    label: `Give ${item.name} to ${target}`,
                    callback: (html) => {
                        let amount = html.find('[name="amount-slider"]')[0].value;
                        dc_utils.char.items.pass(this.actor, target, itemId, amount);
                    }
                }
            }
        });
        dialog.render(true)
    }

    _on_joker_value(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let value = element.value;
        let char = dc_utils.get_actor(this.actor.name);
        char.update({data: {joker_value: value}});
    }

    _on_joker_suit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let value = element.value;
        this.actor.update({data: {joker_suit: value}});
    }

    _on_joker_wild_hex(event) {
        event.preventDefault();
        let jk = dc_utils.char.items.get_card(this.actor, 'Jo', 'huckster_deck');
        let card = {
            name: `${this.actor.data.data.joker_value}${this.actor.data.data.joker_suit}`,
            type: 'huckster_deck'
        };
        dc_utils.chat.send(`Hex`, `${this.actor.name} uses the ${jk.name} as ${card.name}`);
        jk.delete();
        setTimeout(() => {this.actor.createOwnedItem(card)}, 500);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Discard', `${this.actor.name} discards ${item.name}`);
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
        let act = dc_utils.get_actor(this.actor.name);
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
        let draw = 1;
        if (data.combat_active == true) {
            let element = event.currentTarget;
            let data = dc_utils.roll.new_roll_packet(this.actor, 'skill', 'quickness');
            data.roll = dc_utils.roll.new(data);
            data.roll = dc_utils.roll.evaluate(data.roll, data.tn, data.modifier);
            ChatMessage.create({content: build_skill_template(data)});
            if (data.roll.total >= 5) {
                draw = Math.min(1 + Math.ceil((data.roll.total - 4) / 5), 5)
            }
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
        dc_utils.chat.send('Action Deck', `${this.actor.name} gets ${dc_utils.pluralize(draw, 'card', 'cards')}`)
    }

    _on_play_item_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Magic', `${this.actor.name} discards ${item.name}`);
        dc_utils.char.items.delete(this.actor, itemId);
    }

    _on_play_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = parseInt(element.closest(".item").dataset.itemindex);
        let card = this.actor.data.data.action_cards[index];
        card.char = this.actor.name;
        if (game.user.isGM){
            operations.discard_card(card);
        }else{
            dc_utils.socket.emit('discard_card', card);
        }
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
            setTimeout(() => {dc_utils.char.items.delete(this.actor, card.id)}, i * 500);
        }
        dc_utils.chat.send('Hex', `${this.actor.name} plays ${hand}`, card_str);
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
        let itemId  = element.dataset.itemid;
        let item = this.actor.items.get(itemId);
        let data
        if (itemId == 'Nuthin') {
            data = dc_utils.roll.new_roll_packet(this.actor, 'melee', 'fightin', 'Nuthin');
        }else{
            if (item.type == 'melee') {
                data = dc_utils.roll.new_roll_packet(this.actor, 'melee', 'fightin', itemId);
            }else if (item.type == 'firearm') {
                let old = ['pistol', 'rifle', 'shotgun', 'automatic']
                if (old.includes(item.data.data.gun_type)) {
                    data = dc_utils.roll.new_roll_packet(this.actor, 'ranged', `shootin_${item.data.data.gun_type}`, itemId);
                }else{
                    data = dc_utils.roll.new_roll_packet(this.actor, 'ranged', `${item.data.data.gun_type}`, itemId);
                }
            }
        }
        if (!(game.user.isGM)) {
            dc_utils.socket.emit("register_attack", data);
        }else{
            operations.register_attack(data);
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
        if (shots >= max) {
            reply = 'Your gun is full of ammo!';
            shots = max;
        }else{
            max -= shots;
            let act = this.getData();
            let trait = act.data.data.traits.deftness;
            let skill = trait.skills.speed_load;
            let lvl = skill.level;
            if (ammo){
                if (ammo.data.data.amount <= max) {
                    max = ammo.data.data.amount;
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

    _on_bleed_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {is_bleeding: !this.actor.data.data.is_bleeding}});
    }

    _on_run_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {is_running: !this.actor.data.data.is_running}});
    }

    _on_mount_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {is_mounted: !this.actor.data.data.is_mounted}});
    }

    _on_new_blueprint(event) {
        event.preventDefault();
        
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
            reply = `${this.actor.name} rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500);
        }
        r.toMessage({rollMode: 'gmroll'});
        dc_utils.chat.send('Trick', reply);
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
            reply = `${this.actor.name} rolled ${r._total} granting ${draw} cards.`
        }
        for (let i = 0; i < draw; i++) {
            setTimeout(() => {this.actor.createOwnedItem(deck.pop())}, i * 500)
        }
        r.toMessage({rollMode: 'gmroll'});
        dc_utils.chat.send('Hex', reply);
    }

    _on_use_chi(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let strain = parseInt(this.actor.data.data.strain);
        let max_strain = parseInt(this.actor.data.data.traits.vigor.die_type.split(1, this.actor.data.data.traits.vigor.die_type.length));
        let data = dc_utils.roll.new_roll_packet(this.actor, 'skill', 'chi');
        data.roll = dc_utils.roll.new(data);
        let reply = `
            <div>
                <h2 class="center">Ancient Mastery</h2>
                <p class="center">${this.actor.name} tries to focus their Chi to perform ${item.name}!</p>
            </div>
        `;
        if (strain + item.data.data.strain > max_strain) {
            reply += `
            <div>
                <p class="center">This would take ${this.actor.name} over their max strain.</p>
            </div>
            `
        }else{
            reply += `${build_skill_template(data)}`
            this.actor.update({data: {strain: strain + item.data.data.strain}});
        }
        dc_utils.chat.send(reply);
    }

    _on_cast_miracle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let data = dc_utils.roll.new_roll_packet(this.actor, 'skill', 'faith');
        data.roll = dc_utils.roll.new(data);
        let reply = `
            <div>
                <h2 class="center">Divine Intervention</h2>
                <p class="center">${this.actor.name} prays to the one true God to use ${item.name}!</p>
                ${build_skill_template(data)}
            </div>

        `;
        dc_utils.chat.send(reply);
    }

    _on_type_select(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let value = element.value;
        let char = dc_utils.get_actor(this.actor.name);
        char.update({type: value});
    }

    // GM Tab:
    _on_name_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {random_name: !this.actor.data.data.random_name}});
    }

    _on_male_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {male_names: !this.actor.data.data.male_names}});
    }

    _on_female_toggle(event) {
        event.preventDefault();
        this.actor.update({data: {female_names: !this.actor.data.data.female_names}});
    }

    _on_heal_roll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let loc  = element.closest('.location').dataset.location;
        if (dc_utils.hit_locations[loc]) {
            dc_utils.char.wounds.heal_roll(this.actor, loc);
        }else{
            throw `ERROR actor.js [_on_heal_roll()] ${loc} undefined.`
        }
    }
}