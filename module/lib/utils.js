const dc_utils = {

    cards: ["Joker", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"],
    suits: ["Spades", "Hearts", "Diamonds", "Clubs"],
    suit_symbols: {Spades: "\u2660", Hearts: "\u2661", Diamonds: "\u2662", Clubs: "\u2663", red_joker: String.fromCodePoint(0x1F607), black_joker: String.fromCodePoint(0x1F608)},
    bounty: {"White": 1, "Red": 2, "Blue": 3, "Legendary": 5},
    locations: ['Left Leg','Right Leg','Left Leg','Right Leg','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Gizzards','Left Arm','Right Arm','Left Arm','Right Arm','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Noggin'],
    loc_lookup: ['leg_left','leg_right','leg_left','leg_right','lower_guts','lower_guts','lower_guts','lower_guts','lower_guts','gizzards','arm_left','arm_right','arm_left','arm_right','guts','guts','guts','guts','guts','noggin'],
    hand_slots: [{key: 'dominant', label: 'Dominant'}, {key: 'off', label: 'Off'}],
    equip_slots: [{key: 'head', label: 'Head'}, {key: 'body', label: 'Body'}, {key: 'legs', label: 'Legs'}],

    sort: {
        compare: function(object1, object2, key) {
            let obj1
            let obj2
            if (key == 'name' || key == 'type') {
                obj1 = object1.data[key].toUpperCase();
                obj2 = object2.data[key].toUpperCase();
            }else{
                obj1 = object1.data.data[key].toUpperCase();
                obj2 = object2.data.data[key].toUpperCase();
            }
        
            if (obj1 < obj2) {
                return -1;
            }
            if (obj1 > obj2) {
                return 1;
            }
            return 0;
        }
    },
    gm: {
        get_online_users: function() {
            return game.users.entities.filter(function(i) {return i.active});
        },
        get_player_owned_actors: function() {
            return game.actors.entities.filter(function(i) {return i.hasPlayerOwner});
        }
    },
    char: {
        has: function(act, type, name) {
            let items = dc_utils.char.items.get(act, type);
            for (const item of items) {
                if (item.name == name) {
                    return true;
                }
            }
            return false;
        },
        bounty: {
            get: function(act) {
                return act.data.data.bounty.value;
            },
            add: function(act, amt) {
                let bty = act.data.data.bounty
                return act.update({data: {bounty: {value: bty.value + amt, max: bty.max + amt}}})
            },
            remove: function(act, amt) {
                let bty = act.data.data.bounty
                return act.update({data: {bounty: {value: bty.value - amt}}})
            },
        },
        skill: {
            get: function(act, skill_name) {
                for (const trait_name in act.data.data.traits) {
                    const trait = act.data.data.traits[trait_name];
                    if (trait_name == skill_name) {
                        return {
                            name:      trait.name,
                            key:       skill_name,
                            trait:     trait_name,
                            level:     parseInt(trait.level),
                            die_type:  trait.die_type,
                            die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                            trait_fb:  false,
                            modifier:  parseInt(trait.modifier)
                        };
                    }else if (Object.hasOwnProperty.call(trait.skills, skill_name)) {
                        const skill = act.data.data.traits[trait_name].skills[skill_name];
                        if (parseInt(skill.level) > 0) {
                            return {
                                name:      skill.name,
                                key:       skill_name,
                                trait:     trait_name,
                                level:     parseInt(skill.level),
                                die_type:  trait.die_type,
                                die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                                trait_fb:  false,
                                modifier:  parseInt(skill.modifier) + parseInt(trait.modifier)
                            }
                        }else{
                            return {
                                name:      skill.name,
                                key:       skill_name,
                                trait:     trait_name,
                                level:     parseInt(trait.level),
                                die_type:  trait.die_type,
                                die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                                trait_fb:  true,
                                modifier:  parseInt(skill.modifier) + parseInt(trait.modifier)
                            }
                        }
                    }
                }
                throw 'DC | ERROR: skill not found.';
            },
            add_level: function(act, skill_name, amt) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait_fb) {
                    skill.level = 0;
                    dc_utils.char.skill.add_modifier(act, skill_name, 8);
                }
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: skill.level + amt}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: skill.level + amt}}}}}});
                }
            },
            add_modifier: function(act, skill_name, mod) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                let sk_mod = parseInt(skill.modifier);
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {modifier: sk_mod + mod}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {modifier: sk_mod + mod}}}}}});
                }
            },
            remove_level: function(act, skill_name, amt) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.level <= 1) {
                    skill.level = amt;
                    dc_utils.char.skill.add_modifier(act, skill_name, -8);
                }
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: skill.level - amt}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: skill.level - amt}}}}}});
                }
            },
            remove_modifier: function(act, skill_name, mod) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {modifier: skill.modifier - mod}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {modifier: skill.modifier - mod}}}}}});
                }
            },
            increase_die_type: function(act, skill_name) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.sides < 12) {
                    return act.update({data: {traits: {[skill.trait]: {die_type: `d${skill.sides + 2}`}}}});
                }else{
                    return act.update({data: {traits: {[skill.trait]: {modifier: skill.modifier + 2}}}});
                }
            },
        },
        items: {
            get: function(act, item_type, sort_key = 'name') {
                return act.items
                    .filter(function (item) {return item.type == item_type})
                    .sort((a, b) => {return dc_utils.sort.compare(a, b, sort_key)});
            },
            get_equippable: function(act) {
                let eq = act.data.data.equipped
                return act.items.filter(function(i) {return i.data.data.equippable == true})
                    .sort((a, b) => {return dc_utils.sort.compare(a, b, 'type')});
            },
            get_equipped: function(act, slot) {
                return act.items.get(act.data.data.equipped[slot]);
            },
            unequip: function(act, slot) {
                let item = dc_utils.char.items.get_equipped(act, slot);
                if (item?.data?.data?.modifiers) {
                    for (let mod of item.data.data.modifiers) {
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.remove_modifier(act, mod.skill);
                        }
                    }
                }
                return act.update({data: {data: {equipped: {[slot]: 'Nuthin'}}}});
            },
            equip: function(act, slot, id) {
                dc_utils.char.items.unequip(act, slot);
                let item = act.items.get(id);
                if (item?.data?.data?.modifiers) {
                    for (let mod of item.data.data.modifiers) {
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.add_modifier(act, mod.skill);
                        }
                    }
                }
                return act.update({data: {data: {equipped: {[slot]: id}}}});
            },
            is_equipped: function(act, slot, id) {
                if (id == act.data.data.equipped[slot]) {
                    return true;
                }
                return false;
            },
            delete: function(act, id) {
                setTimeout(() => {act.deleteEmbeddedDocuments("Item", [id])}, 500);
            },
        },
        armour: {
            get: function(act, location) {
                return act.data.data.armour[location];
            },
        },
        chips: {
            get: function(act) {
                return act.items
                    .filter(function (item) {return item.type == 'chip'})
            },
            spend: function(act, label) {
                let chips = dc_utils.char.chips.get(act, 'chip');
                for (let item of chips.values()) {
                    if(item.name == label && item.type == 'chip') {
                        console.log('DC | dc_utils.char.chips.spend |', item);
                        dc_utils.char.items.delete(act, item.id);
                        let reply = `
                            <h3 style="text-align:center">Fate</h3>
                            <p style="text-align:center">${act.name} spends a ${label} fate chip.</p>
                        `
                        if (label == 'Red'){
                            reply += `
                                <p style="text-align:center">The Marshal may draw a fate chip.</p>
                            `;
                        }
                        ChatMessage.create({content: reply});
                        return true;
                    }
                }
                ChatMessage.create({content: `
                    <h3 style="text-align:center">${act.name} has no ${label} chips.</h3>
                `});
                return false;
            }
        },
        token: {
            get: function(act) {
                let owned = canvas.tokens.placeables.find(i => i.owner == true);
                for (let t = 0; t < owned.length; t++) {
                    let tgt = owned[t]
                    if (tgt.owner) {
                        if (tgt.name == act.name){
                            return tgt;
                        }
                    }
                }
                return false;
            },
            get_name: function(name) {
                return canvas.tokens.placeables.find(i => i.name == name);
            },
        },
        target: {
            get: function() {
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
        },
    },
    roll: {
        new_roll_packet: function(act, type, skl, wep) {
            let item = act.items.get(wep);
            let dist = 1
            if (!(item)) {
                wep = 'unarmed'
            }
            let target = dc_utils.char.target.get(act);
            if (target == false && !(type == 'skill')) {
                console.log('DC | dc_utils.roll.new_attack_packet', 'Target not found.', act, type, skl, wep);
                return false;
            }
            if (target) {
                let tkn = dc_utils.char.token.get_name(act.name);
                let tgt = dc_utils.char.token.get_name(target.name);
                dist = Math.floor(canvas.grid.measureDistance(tkn, tgt));
                console.log('DC | dc_utils.roll.new_attack_packet', dist);
                if (type == 'melee' && dist > 2) {
                    dc_utils.chat.send('Out of range!', `You'll need to haul ass if you want to get there this round.`);
                    return false;
                }
            }
            let skill = dc_utils.char.skill.get(act, skl);
            let data = {
                type:       type,
                roller:     act.name,
                target:     target.name,
                attacker:   act.name,
                weapon:     wep,
                range:      dist,
                tn:         dc_utils.roll.get_tn(),
                name:       act.name,
                skill:      skl,
                amt:        skill.level,
                dice:       skill.die_type,
                skill_name: skill.name,
                modifiers:  {
                    skill: {label: 'Skill + Trait', modifier: skill.modifier},
                    wound: {label: 'Wounds', modifier: act.data.data.wound_modifier},
                }
            }
            if (item) {
                if (data.type == 'ranged') {
                    data.modifiers.range = {label: 'Range', modifier: -(Math.max(Math.floor(dist / parseInt(item.data.data.range)), 0))};
                }
                if (act.data.data.equipped.off == item.id) {
                    if (dc_utils.char.has(act, 'edge', 'Two Fisted')) {
                        data.modifiers.off_hand = {label: 'Off Hand', modifier: -2}
                    }else{
                        data.modifiers.off_hand = {label: 'Off Hand', modifier: -6}
                    }
                }
            }
            return data;
        },
        new: function(data) {
            let modifier = 0
            for (let key of Object.keys(data.modifiers)) {
                modifier += parseInt(data.modifiers[key].modifier);
            }
            let r_data = {
                success: false,
                crit_fail: false,
                tn: data.tn,
                total: 0,
                dice: data.dice,
                amt: data.amt,
                modifier: modifier,
                raises: 0,
                pass: 0,
                ones: 0,
                results: [],
            };
            data.modifier = modifier
            let roll = new Roll(`${data.amt}${data.dice}ex + ${modifier}`).roll();
            r_data.total = roll._total;
            let count = 0
            roll.terms[0].results.forEach(die => {
                if (die.result + modifier >= data.tn && count < r_data.amt) {
                    r_data.pass += 1;
                }else if (die.result == 1 && count < r_data.amt) {
                    r_data.ones += 1;
                }
                r_data.results.push(die.result);
            });
            if (r_data.pass >= r_data.ones && r_data.total >= data.tn) {
                r_data.success = true;
                r_data.raises = Math.floor((roll._total - r_data.tn) / 5);
            }
            if (r_data.pass < r_data.ones) {
                r_data.success = false;
                r_data.crit_fail = true;
            }
            console.log('new_roll:', r_data);
            roll.toMessage({rollMode: 'gmroll'});
            return r_data;
        },
        evaluate: function(data) {
            data.pass = 0;
            data.ones = 0;
            for (let i = 0; i < data.amt; i++) {
                const res = data.results[i]
                if (res + data.modifier >= data.tn) {
                    data.pass += 1;
                }else if (res == 1) {
                    data.ones += 1;
                }
                if (res + data.modifier > data.total) {
                    data.total = res + data.modifier
                }
            }
            if (data.pass > data.ones) {
                data.crit_fail = false;
            }
            if (data.pass > data.ones && data.total >= data.tn) {
                data.success = true;
                data.raises = Math.floor((data.total - data.tn) / 5);
            }
            return data;
        },
        get_tn: function() {
            let mods = game.actors.getName('Marshal').data.data.modifiers;
            let tn = 5;
            for (const [key, mod] of Object.entries(mods)){
                if (mod.active) {
                    tn -= mod.mod;
                }
            }
            return tn;
        },
        get_result_template: function(data) {
            let r_str = `
                <p style="text-align:center">${data.roller} rolled ${data.roll.total}</p>
                <table style="table-layout: fixed;">
                    <tr style="text-align:center">
            `;
            for (let i = 0; i < data.roll.amt; i++) {
                const res = data.roll.results[i];
                if(res){
                    if (res + data.modifier >= data.tn) {
                        r_str += `
                            <td style="color: green">${res}</td>
                        `;
                    }else if (res == 1) {
                        r_str += `
                            <td style="color: red">${res}</td>
                        `;
                    }else {
                        r_str += `
                            <td>${res}</td>
                        `;
                    }
                }
            }
            r_str += `
                        </tr>
                    </table>
            `;
            if (data.modifier != 0) {
                r_str += `
                    <h3 class="center">Modifiers</h3>
                    <table>`;
                for (let key of Object.keys(data.modifiers)) {
                    if (data.modifiers[key].modifier != 0) {
                        r_str += `
                            <tr class="center">
                                <td>${data.modifiers[key].label}</td>
                                <td>${data.modifiers[key].modifier}</td>
                            </tr>
                        `;
                    }
                }
                r_str += `
                    </table>
                `;
            }
            return r_str
        },
    },
    deck: {
        new: function(id) {
            let deck = [];
            for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                let suit_label = dc_utils.suits[suit]
                for (let card = 1; card < dc_utils.cards.length; card++) {
                    deck.push({
                        name: `${dc_utils.cards[card]}${dc_utils.suit_symbols[suit_label]}`,
                        type: id
                    });
                }        
            }
            deck.push({name: `Joker ${dc_utils.suit_symbols.red_joker}`, type: id})
            deck.push({name: `Joker ${dc_utils.suit_symbols.black_joker}`, type: id})
            deck = dc_utils.deck.shuffle(deck);
            return deck
        },
        shuffle: function(deck) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            return deck;
        },
        sort: function(card_pile) {
            let r_pile = [];
            for (let card = 0; card < dc_utils.cards.length ; card++) {
                const cur_card = dc_utils.cards[card];
                for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                    const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                    for (let chk = 0; chk < card_pile.length; chk++) {
                        const chk_card = card_pile[chk].name;
                        if (cur_card == 'Joker') {
                            if (chk_card == `Joker ${dc_utils.suit_symbols.red_joker}`) {
                                card_pile[chk].name += ' '
                                r_pile.push(card_pile[chk]);
                                break;
                            }else if(chk_card == `Joker ${dc_utils.suit_symbols.red_joker}`) {
                                card_pile[chk].name += ' '
                                r_pile.push(card_pile[chk]);
                                break;
                            }
                        }else if(chk_card == `${cur_card}${cur_suit}`){
                            r_pile.push(card_pile[chk]);
                            break;
                        }
                    }
                }
            }
            return r_pile;
        },
        get_card_value: function(card) {
            let value = card.name.charAt(0);
            if (card.name.length > 2) {
                value = card.name.slice(0, 1);
            }
            return value;
        },
    },
    chat: {
        format: function(title) {
            let sheet = `
                <h3 style="text-align: center;">${title}</h3>
            `
            for (let i = 0; i < arguments.length; i++) {
                sheet += `
                <p style="text-align: center;">${arguments[i]}</p>
                `
            }
            return sheet
        },
        send: function(title) {
            let sheet = `
                <h3 style="text-align: center;">${title}</h3>
            `
            for (let i = 1; i < arguments.length; i++) {
                sheet += `
                <p style="text-align: center;">${arguments[i]}</p>
                `
            }
            ChatMessage.create({content: sheet})
        },
    },
    socket: {
        emit: function(op, data) {
            console.log('EMIT:', op, data);
            game.socket.emit("system.deadlands_classic", {
                operation: op,
                data: data
            });
        }
    }
};