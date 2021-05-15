let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let locations = ['Left Leg','Right Leg','Left Leg','Right Leg','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Gizzards','Left Arm','Right Arm','Left Arm','Right Arm','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Noggin'];

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
                    if (chk_card == 'Joker (Red)') {
                        card_pile[chk].name += ' HooWEE!'
                        r_pile.push(card_pile[chk]);
                        break;
                    }else if(chk_card == 'Joker (Black)') {
                        card_pile[chk].name += ' Dang it!'
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

export default class PlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/player-sheet.html`,
            classes: ["player-sheet", "doc"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.combat_active = game.settings.get('deadlands_classic','combat_active');
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
        data.huckster_deck = sort_deck(data.items.filter(function (item) {return item.type == "huckster_deck"}));
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
        html.find(".trait-roll").click(this._on_trait_roll.bind(this));
        html.find(".trait-buff").click(this._on_trait_buff.bind(this));
        html.find(".die-buff").click(this._on_die_buff.bind(this));
        html.find(".skill-roll").click(this._on_skill_roll.bind(this));
        html.find(".skill-buff").click(this._on_skill_buff.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".play-card").click(this._on_play_card.bind(this));
        html.find(".aim-button").click(this._on_aim.bind(this));
        html.find(".dodge-button").click(this._on_dodge.bind(this));
        html.find(".recycle-card").click(this._on_recycle.bind(this));
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".roll-quickness").click(this._on_roll_init.bind(this));
        html.find(".spend-fate").click(this._on_spend_fate.bind(this));
        html.find(".use-fate").click(this._on_use_fate.bind(this));
        html.find(".melee-attack").click(this._on_melee_attack.bind(this));
        //html.find(".gun-attack").click(this._on_gun_attack.bind(this));
        html.find(".gun-attack").click(this._on_firearm_attack.bind(this));
        html.find(".gun-reload").click(this._on_gun_reload.bind(this));
        html.find(".sling-trick").click(this._on_cast_trick.bind(this));
        html.find(".sling-hex").click(this._on_cast_hex.bind(this));
        html.find(".cast-miracle").click(this._on_cast_miracle.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        return super.activateListeners(html);
    }

    _on_trait_roll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        console.log(element);
        let trait = element.closest(".trait-data").dataset.trait;
        let die_type = element.closest(".trait-data").dataset.die;
        let mod   = element.closest(".trait-data").dataset.mod;
        console.log(trait, die_type, mod);
        let wound_mod = this.actor.data.data.wound_modifier;
        console.log(this.actor);
        let content = "";
        let skill_level = parseInt(this.actor.data.data.traits[trait].level);
        content = `
            <div>
                <h3 style="text-align:center">${trait}</h3>
                <p style="text-align:center">[[${skill_level}${die_type}ex + ${mod} + ${wound_mod}]]</p>
            </div>
        `;
        ChatMessage.create({
            content: content
        });
    }

    _on_trait_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = element.closest(".trait-data").dataset.trait;
        let level = parseInt(element.closest(".trait-data").dataset.level);
        let cost = (level + 1) * 2;
        let bounty = this.actor.data.data.bounty.value;
        let traits = {};
        traits[trait] = {
            level: level + 1
        };
        if (bounty >= cost){
            console.log(`Attempting to increase ${trait} level from ${level} to ${level + 1}`);
            this.actor.update({data: {bounty: {value: bounty - cost}}});
            this.actor.update({data: {traits: traits}});
        }
    }

    _on_die_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = element.closest(".trait-data").dataset.trait;
        let die = element.closest(".trait-data").dataset.die;
        let upgrades = {
            d4:  {next: "d6", cost: 18},
            d6:  {next: "d8", cost: 24},
            d8:  {next: "d10", cost: 30},
            d10: {next: "d12", cost: 36},
            d12: {next: "d12+2", cost: 40},
        };
        let cost = upgrades[die].cost;
        let bounty = this.actor.data.data.bounty.value;
        let traits = {}
        traits[trait] = {
            die_type: upgrades[die].next
        }
        if (bounty >= cost){
            console.log(`Attempting to increase ${trait} die type from ${die} to ${upgrades[die].next}`);
            this.actor.update({data: {bounty: {value: bounty - cost}}})
            this.actor.update({data: {traits: traits}})
        }
    }

    _on_skill_roll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = element.closest(".skill-data").dataset.trait;
        let skill = element.closest(".skill-data").dataset.skill;
        let mod   = element.closest(".skill-data").dataset.mod;
        console.log(element);
        let wound_mod = this.actor.data.data.wound_modifier;
        console.log(this.actor);
        let content = "";
        let skill_level = parseInt(this.actor.data.data.traits[trait].skills[skill].level);
        let die_type    = this.actor.data.data.traits[trait].die_type
        if (skill_level > 0){
            content = `
                <div>
                    <h3 style="text-align:center">${skill}</h3>
                    <p style="text-align:center">[[${skill_level}${die_type}ex + ${mod} + ${wound_mod}]]</p>
                </div>
            `;
        }else{
            let trait_level = parseInt(this.actor.data.data.traits[trait].level);
            content = `
                <div>
                    <h3 style="text-align:center">${skill}</h3>
                    <p style="text-align:center">[[${trait_level}${die_type}ex + ${mod} + ${wound_mod}]]</p>
                </div>
            `;
        };
        ChatMessage.create({
            content: content
        });
    }

    _on_skill_buff(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let trait = element.closest(".skill-data").dataset.trait;
        let skill = element.closest(".skill-data").dataset.skill;
        let level = parseInt(element.closest(".skill-data").dataset.level);
        let mod = parseInt(element.closest(".skill-data").dataset.mod);
        console.log(trait,skill,level,mod);
        let cost = level + 1
        if (level + 1 > 5) {
            cost = cost * 2
        }
        let bounty = this.actor.data.data.bounty.value;
        if (bounty >= cost){
            console.log(bounty, cost);
            this.actor.update({data: {bounty: {value: bounty - cost}}});
            let traits = {}
            traits[trait] = {skills: {}}
            traits[trait].skills[skill] = {
                level: level + 1,
                modifier: mod
            }
            if(level + 1 == 1){
                console.log('Adding modifier for first level skill.')
                traits[trait].skills[skill].modifier = mod + 8
            }
            console.log(`Attempting to increase ${skill} level from ${level} to ${traits[trait].skills[skill].level}`);
            console.log('Before:', this.actor.data.data.traits[trait].skills[skill].level, this.actor.data.data.traits[trait].skills[skill].modifier);
            this.actor.update({data: {traits: traits}});
            console.log('After:', this.actor.data.data.traits[trait].skills[skill].level, this.actor.data.data.traits[trait].skills[skill].modifier);
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
        let item = this.actor.getOwnedItem(itemId);
        return item.sheet.render(true);
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
        let found = false
        fate_chips.forEach(chip => {
            console.log(chip.name, chip_type);
            if (found == false) {
                if (chip.name == chip_type) {
                    let new_val = parseInt(act.data.bounty.value) + parseInt(bounty);
                    let new_max = parseInt(act.data.bounty.max) + parseInt(bounty);
                    let suffix = 'points';
                    if (bounty == '1') {
                        suffix = 'point'
                    }
                    ChatMessage.create({ content: `
                        <h3 style="text-align:center">Bounty: ${chip_type}</h3>
                        <p style="text-align:center">${this.actor.name.split(' ')[0]} gains ${bounty} bounty ${suffix}.</p>
                    `});
                    this.actor.update({"data.bounty.value": new_val});
                    this.actor.update({"data.bounty.max": new_max});
                    this.actor.deleteOwnedItem(chip._id);
                    found = true;
                }
            }
        });
    }

    _on_use_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let chip_type = element.closest(".fate-data").dataset.chip;
        let act = this.getData();
        let fate_chips = act.items.filter(function (item) {return item.type == "chip"});
        let found = false
        fate_chips.forEach(chip => {
            console.log(chip.name, chip_type);
            if (found == false) {
                if (chip.name == chip_type) {
                    ChatMessage.create({ content: `
                        <h3 style="text-align:center">Fate</h3>
                        <p style="text-align:center">${this.actor.name.split(' ')[0]} uses a ${chip_type} fate chip.</p>
                    `});
                    this.actor.deleteOwnedItem(chip._id);
                    found = true;
                }
            }
        });
    }

    _on_roll_init(event){
        event.preventDefault();
        let reply = `There ain't no combat right now, is ${this.actor.name} wantin' to start somethin'?`
        let data = this.getData();
        if (data.combat_active == true) {
            let element = event.currentTarget;
            let act = this.getData();
            let trait = act.data.traits.quickness;
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
                    amount: draw
                }
            });
            this.actor.update({'data.perks.level_headed': true});
        }
        ChatMessage.create({content: reply, whisper: ChatMessage.getWhisperRecipients('GM')});
    }

    _on_play_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `Playing ${item.name}`});
        game.socket.emit("system.deadlands_classic", {
            operation: 'discard_card',
            data: {
                name: item.name,
                type: item.type
            }
        });
        setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, 500);
        return this.getData();
    }

    _on_aim(event) {
        event.preventDefault();
        let reply = `You can't aim no more! Time to shoot 'em!`
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let bonus = game.dc.aim_bonus + 2
        if (bonus <= 6) {
            game.dc.aim_bonus = bonus
            reply = `Spends the ${item.name} to aim [ +${bonus} ]`;
        }
        ChatMessage.create({content: reply});
        game.socket.emit("system.deadlands_classic", {
            operation: 'discard_card',
            data: {
                name: item.name,
                type: item.type
            }
        });
        setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, 500);
        return this.getData();
    }

    _on_dodge(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        this.actor.deleteOwnedItem(itemId);
        let act = this.getData();
        let trait = act.data.traits.nimbleness;
        let skill = trait.skills.dodge;
        let lvl = skill.level;
        if (lvl == 0){
            lvl = trait.level;
        }
        let roll = `
            <h3 style="text-align:center">Dodge!</h3>
            <p>${this.actor.name.split(' ')[0]} tries to jump out o' the way!</p>
            <div>
            Dodge: [[${lvl}${trait.die_type} + ${skill.modifier} + ${act.data.wound_modifier}]]
            </div>
        `;
        ChatMessage.create({content: roll});
        game.socket.emit("system.deadlands_classic", {
            operation: 'discard_card',
            data: {
                name: item.name,
                type: item.type
            }
        });
        console.log(`Removing ${item.name} ${itemId} ${item}`)
        setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, 500);
        return this.getData();
    }

    _on_recycle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let reply = `You have already cycled a card this round.`
        let act = this.getData()
        console.log(act)
        let level_headed_available = act.data.perks.level_headed
        if (level_headed_available){
            game.socket.emit('system.deadlands_classic', {
                operation: 'recycle_card',
                data:{
                    _id : itemId,
                    user: game.userId,
                    card: {
                        name: item.name,
                        type: item.type
                    }
                }
            });
            reply = `
                <h3 style="text-align:center">Discard</h3>
                <p>${this.actor.name.split(' ')[0]} discards ${item.name} hoping fer better luck next time.</p>
            `;
            let c = Math.random()
            setTimeout(() => {this.actor.deleteOwnedItem(itemId)}, c * 100);
            this.actor.update({'data.perks.level_headed': false});
        }
        ChatMessage.create({content: reply});
        return this.getData()
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
            <div>
            <h3 style="text-align:center">Fist Fight!</h3>
            <p style="text-align:center">Brawlin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${game.dc.aim_bonus} + ${this.actor.data.data.wound_modifier}]]</p>
            <p style="text-align:center">Damage: [[${act.data.traits.strength.level}${act.data.traits.strength.die_type}ex + ${dmg}x=]]</p>
            <p style="text-align:center">Location: [[1d20]]</p>
            </div>
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
                <div>
                <h3 style="text-align:center">Gunfire!</h3>
                <p style="text-align:center">Shootin: [[${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${game.dc.aim_bonus} + ${this.actor.data.data.wound_modifier}]]</p>
                <p style="text-align:center">Damage: [[${dmg}x=]]</p>
                <p style="text-align:center">Location: [[1d20]]</p>
                </div>
            `;
            ChatMessage.create({ content: roll});
            shots = shots - 1;
            game.dc.aim_bonus = 0;
        }else{
            ChatMessage.create({ content: `Click... Click Click! Looks like you're empty partner`});
        }
        item.update({ "data.chamber": shots});
    }

    _on_firearm_attack(event){
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
                <div>
                    <h3 style="text-align:center">Gunfire!</h3>
            `
            let mods = game.actors.getName('Marshal').data.data.modifiers;
            let tn = 5;
            for (const [key, mod] of Object.entries(mods)){
                if (mod.active) {
                    tn -= mod.mod;
                }
            }
            let shootin = `${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${game.dc.aim_bonus} + ${this.actor.data.data.wound_modifier}`
            let raise = 0;
            let s = new Roll(shootin).roll();
            roll += `
                    <p style="text-align:center">Target ${tn}</p>
                    <p style="text-align:center">You rolled ${s._total}</p>
            `
            if (s._total >= tn) {
                raise = Math.floor((s._total - tn) / 5);
                if (raise == 1){
                    roll += `
                    <p style="text-align:center">a success and 1 raise.</p>
                    `;
                }else{
                    roll += `
                    <p style="text-align:center">a success and ${raise} raises.</p>
                    `;
                }
                let loc = new Roll('1d20').roll();
                let tot = loc._total - 1;
                roll += `
                    <p style="text-align:center">Location: ${locations[tot]}</p>
                    <table>
                `
                let found = []
                for (let i = 0; i < locations.length; i++) {
                    if (i >= tot - (raise * 2) && i <= tot + (raise * 2)){
                        if (found.includes(locations[i])) {
                            console.log(locations[i]);
                        }else{
                            roll += `
                        <tr class="location" data-loc="${locations[i]}">
                            <td style="text-align:center">${locations[i]}</td>
                        </tr>
                            `
                            found.push(locations[i]);
                        }
                    }
                }
                roll += `
                    </table>
                `
                let dmg_split = dmg.split('d');
                let amt = parseInt(dmg_split[0]);
                let die = parseInt(dmg_split[1]);
                if (found.includes('Noggin')) {
                    amt += 2
                }else if (found.includes('Gizzards')) {
                    amt += 1
                }
                roll += `
                    <p style="text-align:center">Damage: [[${amt}d${die}x= + ${dmg_mod}]]</p>
                </div>
                `;
            }else{
                roll += '<p>You missed</p>'
            }
            ChatMessage.create({content: roll});
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
        ChatMessage.create({ content: `
        <h3 style="text-align:center">Reload</h3>
            ${reply}
        `});
    }

    _on_cast_trick(event) {
        event.preventDefault();
        let reply = 'You fail in your attempt to contact the Hunting Grounds.'
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let deck = new_deck('huckster_deck')
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
        //r.toMessage();
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
        let deck = new_deck('huckster_deck')
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
        //r.toMessage()
        ChatMessage.create({ content: `
            <h3 style="text-align:center">Hex</h3>
            <p style="text-align:center">${reply}</p>
        `});
    }

    _on_cast_miracle(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        let act = this.getData();
        let roll_str = `Casts ${item.name}: [[${act.data.traits.spirit.skills.faith.level}${act.data.traits.spirit.die_type}ex + ${act.data.traits.spirit.modifier}]] against a TN of ${item.data.data.tn}`
        ChatMessage.create({ content: `
            <h3 style="text-align:center">Trick</h3>
            ${roll_str}
        `});
    }
}