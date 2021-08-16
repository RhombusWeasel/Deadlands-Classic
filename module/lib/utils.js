const dc_utils = {

    cards: ["Joker", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"],
    suits: ["Spades", "Hearts", "Diamonds", "Clubs"],
    suit_symbols: {Spades: "\u2660", Hearts: "\u2661", Diamonds: "\u2662", Clubs: "\u2663", red_joker: String.fromCodePoint(0x1F607), black_joker: String.fromCodePoint(0x1F608)},
    bounty: {"White": 1, "Red": 2, "Blue": 3, "Legendary": 5},
    skills: [
        {key: "cognition", label: "Cognition"},
        {key: "artillery", label: "Artillery"},
        {key: "art", label: "Art"},
        {key: "scrutinize", label: "Scrutinize"},
        {key: "search", label: "Search"},
        {key: "trackin", label: "Trackin"},
        {key: "deftness", label: "Deftness"},
        {key: "bow", label: "Bow"},
        {key: "filchin", label: "Filchin'"},
        {key: "lockpickin", label: "Lockpickin'"},
        {key: "shootin_pistol", label: "Shootin' Pistol"},
        {key: "shootin_rifle", label: "Shootin' Rifle"},
        {key: "shootin_shotgun", label: "Shootin' Shotgun"},
        {key: "shootin_automatic", label: "Shootin' Automatic"},
        {key: "sleight_o_hand", label: "Sleight o' hand"},
        {key: "speed_load", label: "Speed Load"},
        {key: "throwin", label: "Throwin'"},
        {key: "knowledge", label: "Knowledge"},
        {key: "academia", label: "Academia"},
        {key: "area_knowledge", label: "Area Knowledge"},
        {key: "demolition", label: "Demolition"},
        {key: "disguise", label: "Disguise"},
        {key: "mad_science", label: "Mad Science"},
        {key: "medicine", label: "Medicine"},
        {key: "professional", label: "Professional"},
        {key: "science", label: "Science"},
        {key: "trade", label: "Trade"},
        {key: "mien", label: "Mien"},
        {key: "animal_wranglin", label: "Animal Wranglin'"},
        {key: "leadership", label: "Leadership"},
        {key: "overawe", label: "Overawe"},
        {key: "performin", label: "Performin'"},
        {key: "persuasion", label: "Persuasion"},
        {key: "tale_tellin", label: "Tale Tellin"},
        {key: "nimbleness", label: "Nimbleness"},
        {key: "climbin", label: "Climbin'"},
        {key: "dodge", label: "Dodge"},
        {key: "drivin", label: "Drivin'"},
        {key: "fightin", label: "Fightin (Brawlin)"},
        {key: "horse_ridin", label: "Horse Ridin'"},
        {key: "sneak", label: "Sneak"},
        {key: "swimmin", label: "Swimmin'"},
        {key: "teamster", label: "Teamster"},
        {key: "quickness", label: "Quickness"},
        {key: "quick_draw", label: "Quick Draw"},
        {key: "smarts", label: "Smarts"},
        {key: "bluff", label: "Bluff"},
        {key: "gamblin", label: "Gamblin'"},
        {key: "ridicule", label: "Ridicule"},
        {key: "scroungin", label: "Scroungin'"},
        {key: "streetwise", label: "Streetwise"},
        {key: "survival", label: "Survival"},
        {key: "tinkerin", label: "Tinkerin'"},
        {key: "spirit", label: "Spirit"},
        {key: "faith", label: "Faith"},
        {key: "guts", label: "Guts"},
        {key: "strength", label: "Strength"},
        {key: "vigor", label: "Vigor"},
    ],
    called_shots: {
        any:  {name: "None" , mod:  0,  locations: ['any']},
        head: {name: "Head", mod: -6,  locations: ['noggin'], msg: `They're aimin' for the head!`},
        hand: {name: "Hand" , mod: -6,  locations: ['arm_left', 'arm_right'], msg: `They're aimin' fer their hand!`},
        arm:  {name: "Arm"  , mod: -4,  locations: ['arm_left', 'arm_right'], msg: `They're aimin' fer the arm!`},
        leg:  {name: "Leg"  , mod: -4,  locations: ['leg_left', 'leg_right'], msg: `They're aimin' fer the legs!`},
        body: {name: "Body" , mod: -2,  locations: ['guts', 'lower_guts', 'gizzards'], msg: `They're aimin' center of mass.`},
        eye:  {name: "Eye"  , mod: -10, locations: ['noggin'], msg: `The eye!?! This one's trying to blind someone!`}
    },
    hit_locations: {leg_left: 'Left Leg', leg_right: 'Right Leg', lower_guts: 'Lower Guts', gizzards: 'Gizzards', arm_left: 'Left Arm', arm_right: 'Right Arm', guts: 'Upper Guts', noggin: 'Noggin'},
    locations: ['Left Leg','Right Leg','Left Leg','Right Leg','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Gizzards','Left Arm','Right Arm','Left Arm','Right Arm','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Noggin'],
    loc_lookup: ['leg_left','leg_right','leg_left','leg_right','lower_guts','lower_guts','lower_guts','lower_guts','lower_guts','gizzards','arm_left','arm_right','arm_left','arm_right','guts','guts','guts','guts','guts','noggin'],
    hand_slots: [{key: 'dominant', label: 'Dominant'}, {key: 'off', label: 'Off'}],
    equip_slots: [{key: 'head', label: 'Head'}, {key: 'body', label: 'Body'}, {key: 'legs', label: 'Legs'}],

    /** UUID
    * Pass any number of integers, returns a uuid with char blocks equal to each int '-' seperated
    */
    uuid: function() {
        let str = ''
        for (let a = 0; a < arguments.length; a++) {
            for (let i = 0; i < arguments[a]; i++) {
                str += uuid_keys[Math.floor(Math.random() * uuid_keys.length)];
            }
            if (a < arguments.length - 1) {
                str += '-'
            }
        }
        return str
    },
    get_actor: function(name) {
        let char = game.actors.getName(name);
        if (char) {
            return char;
        }
        char = canvas.tokens.placeables.find(i => i.name == name);
        return char.document.actor;
    },
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
        },
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
            set_level: function(act, skill_name, lvl) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: lvl}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: lvl}}}}}});
                }
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
                let sk_mod = parseInt(skill.modifier) || 0;
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
            set_die_type: function(act, skill_name, sides) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                return act.update({data: {traits: {[skill.trait]: {die_type: `${sides}`}}}});
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
                        console.log('dc | dc_utils.char.item.unequip |', mod);
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.remove_modifier(act, mod.target, mod.modifier);
                        }else if (mod.type == 'armour_mod') {
                            dc_utils.char.armour.remove(act, mod.target, mod.modifier);
                        } else {
                            
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
                        console.log('dc | dc_utils.char.item.equip |', mod);
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.add_modifier(act, mod.target, mod.modifier);
                        }else if (mod.type == 'armour_mod') {
                            dc_utils.char.armour.add(act, mod.target, mod.modifier);
                        } else {
                            
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
                let item = act.items.get(id);
                if (item?.data?.data?.amount >= 2) {
                    return item.update({data: {amount: item.data.data.amount - 1}});
                }
                setTimeout(() => {act.deleteEmbeddedDocuments("Item", [id])}, 500);
            },
            compress: function(act, data) {
                let r_data = [];
                for (let a = 0; a < data.length; a++) {
                    let copies = act.items.filter(function (i) {return i.name == data[a].name});
                    let numParse = parseInt;
                    if (data[a].data.data.is_float) {
                        numParse = parseFloat;
                    }
                    let total = numParse(data[a].data.data.amount);
                    for (let i = 1; i < copies.length; i++) {
                        const copy = copies[i];
                        if (copy.id != data[a].id) {
                            total += numParse(copy.data.data.amount);
                            copy.delete();
                        }
                    }
                    data[a].update({data: {amount: total}});
                }
                return data
            },
            calculate_costs: function(act, items) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    let ppu = parseFloat(item.data.data.cost.splice(1));
                    if (item.data.data.boxed_multiple) {
                        ppu = ppu / item.data.data.box_amount
                    }
                    let total = '$' + (ppu * item.data.data.amount).toFixed(2);
                    console.log(item, ppu, total);
                    if (total != item.data.data.total_cost) {
                        item.update({data: {total_cost: total}});
                    }
                }
            },
        },
        wounds: {
            add: function(act, loc, amt) {
                let tot = act.data.data.wounds[loc] + amt;
                return setTimeout(() => {act.update({data: {wounds: {[loc]: tot}}})}, Math.random() * 500);
            },
            remove: function(act, loc, amt) {
                let tot = act.data.data.wounds[loc] - amt;
                return setTimeout(() => {act.update({data: {wounds: {[loc]: tot}}})}, Math.random() * 500);
            },
            calculate_wound_modifier: function(act) {
                let wm = act.data.data.wound_modifier
                let is_wounded = false
                for (const loc in act.data.data.wounds) {
                    if (Object.hasOwnProperty.call(act.data.data.wounds, loc)) {
                        let cur = act.data.data.wounds[loc];
                        if (cur * -1 < wm) {
                            wm = cur * -1
                            is_wounded = true
                        }else{
                            if (cur > 0) {
                                is_wounded = true
                            }
                        }
                    }
                }
                if (is_wounded) {
                    return act.update({data: {wound_modifier: wm}});
                }else{
                    return act.update({data: {wound_modifier: 0}});
                }
            },
            heal_roll: function(act, loc) {
                let tn = 3 + (act.data.data.wounds[loc] * 2);
                let data = dc_utils.new_roll_packet(act, 'skill', 'vigor', 'none');
                data.tn = tn
                data.roll = dc_utils.roll.new(data);
                if (data.roll.success) {
                    dc_utils.char.wounds.remove(act, loc, 1);
                }
            },
        },
        armour: {
            get: function(act, location) {
                return parseInt(act.data.data.armour[location]);
            },
            add: function(act, location, amt) {
                let cur = dc_utils.char.armour.get(act, location);
                console.log('dc | dc_utils.char.armour.add |', location, amt, cur);
                setTimeout(() => {act.update({data: {armour: {[location]: cur + parseInt(amt)}}})}, Math.random() * 500);
            },
            remove: function(act, location, amt) {
                let cur = dc_utils.char.armour.get(act, location);
                console.log('dc | dc_utils.char.armour.remove |', location, amt, cur);
                setTimeout(() => {act.update({data: {armour: {[location]: cur - parseInt(amt)}}})}, Math.random() * 500);
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
        money: {
            get: function(act) {
                return act.data.data.cash;
            },
            set: function(act, value) {
                return act.update({data: {cash: value}});
            },
            add: function(act, amt) {
                let tot = act.data.data.cash + amt;
                return act.update({data: {cash: tot}});
            },
            subtract: function(act, amt) {
                let tot = act.data.data.cash - amt;
                return act.update({data: {cash: tot}});
            },
        },
        weapon: {
            use_ammo: function(act, weapon_id) {
                let item = act.items.get(weapon_id);
                if (item) {
                    let shots = item.data.data.chamber;
                    if (shots < 1) {
                        return false;
                    }
                    shots = shots - 1;
                    item.update({"data.chamber": shots});
                    return true;
                }
                return false;
            },
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
    item: {
        add_modifier: function(item, data){
            console.log('DC | dc_utils.item.add_modifier |', data, item);
            item.update({data: {modifiers: data}});
        },
        remove_modifier: function(item, index) {
            let mods = item.data.data.modifiers;
            console.log('DC | dc_utils.item.remove_modifier |', index, item);
            mods.splice(index);
            item.update({data: {modifiers: mods}});
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
                if (type == 'melee' && dist > 2) {
                    dc_utils.chat.send('Out of range!', `You'll need to haul ass if you want to get there this round.`);
                    return false;
                }
            }
            let skill = dc_utils.char.skill.get(act, skl);
            let data = {
                uuid:       dc_utils.uuid(4, 4, 4, 4),
                type:       type,
                roller:     act.name,
                target:     target.name,
                attacker:   act.name,
                weapon:     wep,
                range:      dist,
                tn:         dc_utils.roll.get_tn(),
                name:       act.name,
                called:     act.data.data.called_shot,
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
            if (type == 'melee' || type == 'ranged') {
                if (act.data.data.aim_bonus > 0) {
                    data.modifiers.aim = {label: 'Aim', modifier: act.data.data.aim_bonus};
                    dc_utils.combat.clear_aim(act);
                }
            }
            let tgt = act.data.data.called_shot
            if (tgt != 'any') {
                data.modifiers.called = {label: `${dc_utils.called_shots[tgt].name} shot.`, modifier: dc_utils.called_shots[tgt].mod};
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
        location_roll(raises, key) {
            let loc_key
            if (key == 'any') {
                let loc_roll = new Roll('1d20').roll();
                loc_roll.toMessage({rollMode: 'gmroll'});
                let tot = loc_roll._total - 1;
                let found = [];
                let range = raises * 2
                for (let i = 0; i < dc_utils.locations.length; i++) {
                    if (i >= tot - range && i <= tot + range && i < 19){
                        if (!(found.includes(dc_utils.loc_lookup[i]))) {
                            found.push(dc_utils.loc_lookup[i]);
                        }
                    }
                }
                console.log('roll_damage: Location:', found, found.length - 1);
                loc_key = found[found.length - 1];
                console.log('roll_damage: Location:', loc_key);
            }else{
                let locs = dc_utils.called_shots[key].locations
                loc_key = locs[Math.floor(Math.random() * locs.length)]
            }
            return loc_key;
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
                        type: id,
                        sleeved: false
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
            let rj_found = false;
            let bj_found = false;
            for (let card = 0; card < dc_utils.cards.length ; card++) {
                const cur_card = dc_utils.cards[card];
                for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                    const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                    for (let chk = 0; chk < card_pile.length; chk++) {
                        const chk_card = card_pile[chk].name;
                        if(card_pile[chk].sleeved) {
                            r_pile.unshift(card_pile[chk]);
                            break;
                        }
                        if (cur_card == 'Joker') {
                            if (chk_card == `Joker ${dc_utils.suit_symbols.red_joker}` && !(rj_found)) {
                                r_pile.push(card_pile[chk]);
                                rj_found = true;
                                break;
                            }else if(chk_card == `Joker ${dc_utils.suit_symbols.black_joker}` && !(bj_found)) {
                                r_pile.push(card_pile[chk]);
                                bj_found = true;
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
                value = card.name.slice(0, 2);
            }
            return value;
        },
        calculate_straight: function(instances){
            let count = 0
            let cards = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"]
            for (let i = 1; i < cards.length; i++) { 
                if (instances[cards[i]]) {
                    count += 1
                }else{
                    count = 0
                }
                if (count >= 5) {
                    return true;
                }
            }
            return false;
        },
        evaluate_hand: function(card_pile) {
            let card_instances = {};
            let suit_instances = {};
            for (let c = 0; c < card_pile.length; c++) {
                const card = card_pile[c];
                let value = dc_utils.deck.get_card_value(card);
                let suit = card.name.slice(-1);
                if (card_instances[value]){
                    card_instances[value] += 1;
                }else{
                    card_instances[value] = 1;
                }
                if (suit_instances[suit]) {
                    suit_instances[suit] += 1;
                }else{
                    suit_instances[suit] = 1;
                }
            }
            console.log(card_instances, suit_instances);
            let flush = false;
            for (const key in suit_instances) {
                const count = suit_instances[key];
                if (count >= 5) {
                    // Flush draw, check for straight
                    if (dc_utils.deck.calculate_straight(card_instances)) {
                        return 'Straight Flush';
                    }else{
                        flush = key;
                    }
                }
            }
            // check for quads, check trips, pairs etc while we're here.
            let found_3 = false;
            let found_2 = false;
            let found_2_2 = false;
            for (const key in card_instances) {
                if (Object.hasOwnProperty.call(card_instances, key)) {
                    const tot = card_instances[key];
                    if (tot == 4) return `4 ${key}'s`;
                    if (tot == 3) found_3 = key;
                    if (tot == 2 && found_2) found_2_2 = key;
                    if (tot == 2 && !(found_2)) found_2 = key;
                }
            }
            if (found_3 && found_2) return `Full House ${found_3}'s over ${found_2}'s`;
            if (flush) return `Flush (${flush})`;
            // Check for straight
            if (dc_utils.deck.calculate_straight(card_instances)) {
                return 'Straight'
            }
            if (found_3) return `Three ${found_3}'s`;
            if (found_2_2) return `Two Pair ${found_2_2}'s and ${found_2}'s`;
            if (found_2) return `Pair of ${found_2}'s`;
            return `High Card: ${card_pile[0].name}`;
        },
    },
    chat: {
        send: function(title) {
            let sheet = `
                <h3 class="center typed">${title}</h3>
            `
            for (let i = 1; i < arguments.length; i++) {
                sheet += `
                <p class="center typed">${arguments[i]}</p>
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
    },
    journal: {
        new_data: function(name, content) {
            return JournalEntry.create({
                name: name,
                content: JSON.stringify(content)
            });
        },
        load: function(name, content) {
            let journal = game.journal.getName(name);
            if (journal) {
                return JSON.parse(journal.data.content);
            }else{
                dc_utils.journal.new_data(name, content);
                return content;
            }
        },
        save: function(name, content) {
            let journal = game.journal.getName(name);
            if (journal) {
                return journal.update({content: JSON.stringify(content)});
            } else {
                return dc_utils.journal.new_data(name, content);
            }
        },
    },
    combat: {
        aim: function(act, index) {
            let bonus = act.data.data.aim_bonus + 2
            if (bonus < 6) {
                act.update({data: {aim_bonus: bonus}});
                dc_utils.combat.remove_card(this.actor, index);
                dc_utils.chat.send('Aim', `${act.name} takes a moment to aim. [+${bonus}]`);
            }else{
                dc_utils.chat.send('Aim', `${act.name} can't aim any more, time to shoot 'em`);
            }
        },
        clear_aim: function(act) {
            act.update({data: {aim_bonus: 0}});
        },
        sleeve_card: function(act, card) {
            if (act.data.data.sleeved_card != 'none') {
                let confirmation = Dialog.confirm({
                    title: 'Hold up.',
                    content: `
                        <p class="center">You have the ${act.data.data.sleeved_card} up your sleeve already,</p>
                        <p class="center">If you sleeve the ${card.name} you'll lose the ${act.data.data.sleeved_card}.</p>
                    `,
                });
                if (!(confirmation)) {
                    return false;
                }
            }
            act.update({data: {sleeved_card: card.name}});
        },
        new_combat: function() {
            let deck = {
                deck: dc_utils.deck.new('action_deck'),
                discard: []
            }
            dc_utils.journal.save('action_deck', deck);
            game.dc.action_deck = deck;
        },
        new_round: function() {
            game.dc.combat_active = true
            game.dc.level_headed_available = true
            if (game.dc.combat_shuffle) {
                game.dc.combat_shuffle = false;
                dc_utils.combat.restore_discard();
            }
        },
        restore_discard: function() {
            game.dc.action_deck.discard.forEach(card => {
                game.dc.action_deck.deck.push(card);
            });
            game.dc.action_deck.discard = []
            game.dc.action_deck.deck = dc_utils.deck.shuffle(game.dc.action_deck.deck);
            dc_utils.journal.save('action_deck', game.dc.action_deck);
        },
        deal_cards: function(act, amt) {
            if (game.dc.action_deck.deck.length <= amt){
                dc_utils.combat.restore_discard();
            }
            let hand = act.data.data.action_cards
            for (let i = 0; i < amt; i++) {
                let card = game.dc.action_deck.deck.pop();
                hand.push(card);
            }
            act.update({data: {action_cards: dc_utils.deck.sort(hand)}});
            dc_utils.journal.save('action_deck', game.dc.action_deck);
        },
        remove_card: function(act, index) {
            let hand = act.data.data.action_cards;
            hand.splice(index, 1);
            act.update({data: {action_cards: hand}});
        },
        get_cards: function(act) {

        },
        new_attack: function(atk, tgt, type, skill, wep) {
            let data = {
                attacker:    atk,
                target:      tgt,
                type:        type,
                skill:       skill,
                weapon:      wep,
                location:    'unrolled',
                attack_roll: 'unrolled',
                dodge_roll:  'unrolled',
                uuid:        dc_utils.uuid(4, 4, 4, 4)
            }
            game.dc.combat_actions[data.uuid] = data;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            return data;
        },
    },
};