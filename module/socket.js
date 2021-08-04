function restore_discard() {
    game.dc.action_deck.discard.forEach(card => {
        game.dc.action_deck.push(card);
    });
    game.dc.action_deck.discard = []
    dc_utils.journal.save('action_deck', game.dc.action_deck);
}

function build_skill_template(data) {
    console.log('build_skill_temlpate', data);
    let r_str = `
        <h3 style="text-align:center">${data.skill_name} [${data.tn}]</h3>
        <h3 style="text-align:center">Modifier: ${data.modifier}</h3>
        <h3 style="text-align:center">${data.roll.total}</h3>
        <table style="table-layout: fixed;">
            <tr style="text-align:center">
    `;
    r_str += dc_utils.roll.get_result_template(data);
    if (data.roll.success) {
        //Winning
        if (data.roll.raises == 1) {
            r_str += `
                <p style="text-align:center">${data.roller} passed with a raise</p>
            `;
        }else if (data.roll.raises > 0) {
            r_str += `
                <p style="text-align:center">${data.roller} passed with ${data.roll.raises} raises</p>
            `;
        }else{
            r_str += `
                <p style="text-align:center">${data.roller} passed</p>
            `;
        }
    }else if (data.roll.ones > data.roll.pass) {
        r_str += `
            <p style="text-align:center">${data.roller} critically failed!</p>
        `;
    }else{
        r_str += `
            <p style="text-align:center">${data.roller} failed.</p>
        `;
    }
    return r_str;
}

function build_no_fate_chip_message(col) {
    return `
        <h3 style="text-align:center">Fate</h3>
        <p style="text-align:center">You have no ${col} fate chips.</p>
    `;
}

function build_marshal_draw_message(col) {
    return `
        <h3 style="text-align:center">Fate</h3>
        <p style="text-align:center">The Marshal may draw a fate chip.</p>
    `;
}

function build_roll_dialog(data) {
    let form = `
        <form>
            <div>`
    ;
    form += dc_utils.roll.get_result_template(data);
    if (data.roll.success) {
        if (data.roll.raises == 1) {
            form += `
                <p style="text-align:center">You passed with a raise.</p>
            `;
        }else{
            form += `
                <p style="text-align:center">You passed with ${data.roll.raises} raises.</p>
            `;
        }
    }else if (data.roll.ones > data.roll.pass) {
        form += `
                <h2 style="text-align:center">Critical Failure!</h2>
        `;
    }else {
        form += `
                <h3 style="text-align:center">Failure!</h3>
        `;
    }
    return form += `
                <p style="text-align:center">Spend Fate Chips?</p>
            </div>
        </form>
    `;
}

function build_friendly_fire_dialog(data) {
    return `
    <form>
        <div>
            <h2 style="text-align: center;">Friendly Fire!</h2>
            <p style="text-align: center;">${data.target} is not attacking you!</p>
            <p style="text-align: center;">You can continue but you'll become wanted and have a bounty placed on your head.</p>
            <p style="text-align: center;">Would you like to attack ${data.target}?</p>
        </div>
    </form>
    `;
}

function build_dodge_dialog(data) {
    return `
        <form>
            <div>
                <h2 style="text-align: center;">Incoming Attack!</h2>
                <p style="text-align: center;">${data.attacker} is attacking you!</p>
                <p style="text-align: center;">It'll cost your ${data.card_name} to vamoose,</p>
                <p style="text-align: center;">would you like to try and dodge?</p>
            </div>
        </form>
    `;
}

function build_turn_dialog(data) {
    return `
        <form>
            <h1 style="text-align: center">${data.card_name}</h1>
            <h3 style="text-align: center">It's ${data.char}'s turn</h3>
        </form>
    `;
}

function build_damage_dialog(data) {
    let form = `
        <form>
            <div id="data" data-wounds="${data.wounds}" data-char="${data.target}" data-loc_key="${data.loc_key}" data-loc_label=${data.loc_label} data-soak="${data.soak}">
                <h1 style="text-align: center;">Damage!</h1>
    `;
    if (data.wounds - data.soak == 1){
        form += `
                <p style="text-align: center;">${data.target} has taken 1 wound to the ${data.loc_label}</p>
        `;
    }else{
        form += `
                <p style="text-align: center;">${data.target} has taken ${data.wounds - data.soak} wounds to the ${data.loc_label}</p>
        `;
    }
    return form += `
            </div>
        </form>
    `;
}

function soak_damage(data, label){
    if (dc_utils.char.chips.spend(game.actors.getName(data.target), label)){
        data.wounds -= dc_utils.bounty[label]
    }
    return data;
}

function battle_report(data) {
    let msg =  `
        <h3 style="text-align:center">Combat Report:</h3>
        <table style="table-layout: fixed;">
            <tr style="text-align:center table-layout: fixed;">
                <th style="text-align:center">Attack</th>
                <th style="text-align:center">Mod</th>
                <th style="text-align:center">Dodge</th>
                <th style="text-align:center">TN</th>
            </tr>
            <tr style="text-align:center table-layout: fixed;">
                <td style="text-align:center">${data.hit_roll}</td>
                <td style="text-align:center">${data.modifier}</td>
                <td style="text-align:center">${data.dodge_roll}</td>
                <td style="text-align:center">${data.tn}</td>
            </tr>
        </table>
    `;
    if (data.type == 'ranged'){
        msg += `
            <h3 style="text-align:center">Range: ${data.range} yards [-${data.modifiers.range.modifier}]</h3>
            <p style="text-align:center">${data.attacker} fired their ${data.weapon_name} at ${data.target}</p>
        `;
    }else{
        msg += `
            <p style="text-align:center">${data.attacker} swung their ${data.weapon_name} at ${data.target}</p>
        `;
    }
    if (data.dodge_roll > 0) {
        msg += `
            <p style="text-align:center">${data.target} tries to dodge but can't get out of the way!</p>
        `;
    }
    if (data.av) {
        msg += `
            <p style="text-align:center">Their armour reduced the damage!</p>
        `;
    }
    if (data.wounds == 1) {
        msg += `
            <p style="text-align:center">They suffer 1 wound to the ${data.loc_label}</p>
        `;
    }else{
        msg += `
            <p style="text-align:center">They suffer ${data.wounds} wounds to the ${data.loc_label}</p>
        `;
    }
    return msg;
}

let operations = {
    //COMBAT DECK OPERATIONS
    test_event: function(data) {
        console.log('Test event recieved.');
    },
    roll_quickness: function(data) {
        game.dc.combat_active = true
        game.dc.level_headed_available = true
        if (game.dc.combat_shuffle) {
            game.dc.combat_shuffle = false;
            restore_discard();
        }
    },
    end_combat: function(data) {
        game.dc.combat_active = false
    },
    request_cards: function(data){
        if (game.user.isGM) {
            let cards = data.amount
            if (game.dc.action_deck.deck.length <= cards){
                dc_utils.combat.restore_discard();
            }
            let act = game.actors.getName(data.char);
            for (let i=0; i<cards; i++){
                dc_utils.combat.deal_card(act);
            }
        };
    },
    discard_card: function(data) {
        if (game.user.isGM) {
            if (data.name == "Joker "+dc_utils.suit_symbols.black_joker) {
                dc_utils.chat.send('Black Joker', 'You lose your next highest card.', 'The combat deck will be reshuffled at the end of the round.', 'The Marshal draws a Fate Chip.');
                game.dc.combat_shuffle = true
            }else{
                dc_utils.chat.send('Action Deck', `${data.char} plays ${data.name}`)
            }
            game.dc.action_discard.push(data)
        }
    },
    recycle_card: function(data) {
        if (game.user.isGM) {
            game.dc.action_discard.push(data.card)
            data.card = game.dc.action_deck.pop()
           dc_utils.socket.emit('recieve_card', data);
        }
    },
    //SKILL ROLL OPERATIONS
    //A skill roll data object must contain: {
    //  roller: 'character name',   (STRING)
    //  trait: 'trait_key',         (STRING)
    //  skill: 'skill_key',         (STRING OPTIONAL)
    //  modifier: 0,                (INTEGER)
    //  next_op: 'next_operation'   (STRING OPTIONAL)
    //}
    skill_roll: function(data) {
        let char = game.actors.getName(data.roller);
        if (char.isOwner) {
            let skill = dc_utils.roll.new_roll_packet(char, data.type, data.skill);
            data.roll = dc_utils.roll.new(data);
            operations.confirm_result(data);
        }else if (game.user.isGM) {
            console.log('SKILL_ROLL:', data);
        }
    },
    confirm_result: function(data) {
        let char = game.actors.getName(data.roller);
        if (char.owner) {
            let form = new Dialog({
                title: `Confirm skill roll`,
                content: build_roll_dialog(data),
                buttons: {
                    white: {
                        label: 'White',
                        callback: () => {
                            console.log('DC | confirm_result |', char);
                            console.log('DC | confirm_result |', dc_utils.char.chips.spend(char, 'White'));
                            if (dc_utils.char.chips.spend(char, 'White')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let res = roll._total;
                                data.roll.results.unshift(res);
                                data.roll.amt += 1;
                                data.roll = dc_utils.roll.evaluate(data.roll);
                                roll.toMessage({rollMode: 'gmroll'});
                            }
                            operations.confirm_result(data);
                        },
                    },
                    red: {
                        label: 'Red',
                        callback: () => {
                            if (dc_utils.char.chips.spend(char, 'Red')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let result = roll.terms[0].results[0].result;
                                let index = data.roll.results.indexOf(data.roll.total - data.roll.modifier);
                                data.roll.results[index] += result;
                                data.roll.total += result;
                                data.roll.results.push(result);
                                data.roll = dc_utils.roll.evaluate(data.roll);
                                roll.toMessage({rollMode: 'gmroll'});
                            }
                            operations.confirm_result(data);
                        },
                    },
                    blue: {
                        label: 'Blue',
                        callback: () => {
                            if (dc_utils.char.chips.spend(char, 'Blue')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let result = roll.terms[0].results[0].result;
                                let index = data.roll.results.indexOf(data.roll.total - data.roll.modifier);
                                data.roll.results[index] += result;
                                data.roll.total += result;
                                data.roll.results.push(result);
                                data.roll = dc_utils.roll.evaluate(data.roll);
                                roll.toMessage({rollMode: 'gmroll'});
                            }
                            operations.confirm_result(data);
                        },
                    },
                    confirm: {
                        label: 'Confirm',
                        callback: () => {
                            if (data.next_op) {
                                if(data.write_value) {
                                    data[data.write_value] = data.roll.total
                                }
                                dc_utils.socket.emit(data.next_op, data);
                                ChatMessage.create({content: build_skill_template(data)});
                            }else{
                                ChatMessage.create({content: build_skill_template(data)});
                            }
                        }
                    }
                },
                close: () => {
                    console.log('Skill Dialog Closed');
                }
            });
            form.render(true);
        }
    },
    //NEW COMBAT OPERATIONS
    //prompt turn is sent by the GM to the players.
    prompt_turn: function(data) {
        let char = game.actors.getName(data.char);
        if (char.owner) {
            data.roller = data.target;
            let form = new Dialog({
                title: `Your Turn.`,
                content: build_turn_dialog(data),
                buttons: {
                    sleeve: {
                        label: 'Sleeve it',
                        callback: () => {
                            dc_utils.combat.sleeve_card(act, itm);
                        }
                    },
                    play: {
                        label: 'Play',
                        callback: () => {
                            let itm = char.items.find(i => i.name == data.name);
                            char.deleteOwnedItem(itm._id);
                            dc_utils.socket.emit('discard_card', data);
                        }
                    }
                },
                close: () => {
                    console.log('Damage Dialog Closed');
                }
            });
            form.render(true);
        }
    },
    //declare an attack is emitted by players to a gm
    declare_attack: function(data) {
        if (game.user.isGM) {
            let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            data.dodge_roll = 0
            if (atk.data.disposition == -1) {
                //Attacker is the GM, proceed to roll to hit.
                operations.proceed_attack(data);
            }else if (tgt.data.disposition != -1 && atk.actor.data.type == 'player') {
                //Target is a player or neutral party, warn players of crimes.
                dc_utils.socket.emit('warn_friendly_fire', data);
            }else{
                //Target is hostile, roll to hit
                dc_utils.socket.emit('roll_to_hit', data);
            }
        }else{
            let char = canvas.tokens.placeables.find(i => i.name == data.target);
            if (char.owner) {
                dc_utils.socket.emit('check_dodge', data);
            }
        }
    },
    warn_friendly_fire: function(data) {
        console.log('warn_friendly_fire', data);
        let char = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (char.owner) {
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            if (tgt.data.disposition != -1) {
                let form = new Dialog({
                    title: `Breakin' the Law!`,
                    content: build_friendly_fire_dialog(data, dc_utils.deck.sort(cards)),
                    buttons: {
                        yes: {
                            label: 'Screw it!',
                            callback: () => {
                                if (tgt.actor.isPC) {
                                    dc_utils.socket.emit('check_dodge', data);
                                }else{
                                    dc_utils.socket.emit('roll_to_hit', data);
                                }
                            }
                        },
                        no: {
                            label: '[slowly put gun away]',
                            callback: () => {
                                
                            }
                        }
                    },
                    close: () => {
                        console.log('Friendly Fire Dialog Closed');
                    }
                });
                form.render(true);
            }
        }
    },
    check_dodge: function(data) {
        let char = canvas.tokens.placeables.find(i => i.name == data.target);
        if (game.user.isGM) {
            dc_utils.socket.emit('check_dodge', data);
        }else if (char.owner) {
            let cards = [];
            for (let item of char.actor.items.values()) {
                if (item.type == 'action_deck') {
                    cards.push(item);
                }
            }
            cards = dc_utils.deck.sort(cards);
            console.log('dodge:', cards);
            if (cards.length > 0) {
                data.next_op = 'roll_to_hit'
                data.write_value = 'dodge_roll'
                data.trait = 'nimbleness'
                data.skill = 'dodge'
                data.roller = data.target
                data.tn = 0
                data.modifier = 0
                data.card_name = cards[0].name
                data.card_id = cards[0]._id
                console.log('dodge:', data)
                let form = new Dialog({
                    title: `Dodge!`,
                    content: build_dodge_dialog(data),
                    buttons: {
                        yes: {
                            label: 'Dodge',
                            callback: () => {
                                dc_utils.socket.emit('discard_card', {
                                    name: data.card_name,
                                    type: 'action_deck',
                                    char: data.target
                                });
                                setTimeout(() => {char.actor.deleteOwnedItem(data.card_id)}, 500);
                                console.log('check_dodge', data);
                                operations.skill_roll(data);
                            }
                        },
                        no: {
                            label: 'Take yer chances.',
                            callback: () => {
                                console.log('check_dodge', data);
                                data.dodge_roll = 0;
                                dc_utils.socket.emit('roll_to_hit', data);
                            }
                        }
                    },
                    close: () => {
                        console.log('Dodge Dialog Closed');
                    }
                });
                form.render(true);
            }else{
                data.dodge_roll = 0;
                dc_utils.socket.emit('roll_to_hit', data);
            }
        }
    },
    roll_to_hit: function(data) {
        console.log('roll_to_hit:', data);
        let char = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (char.actor.isPC && game.user.isGM) {
            dc_utils.socket.emit('roll_to_hit', data);
        }else if(!(char.actor.isPC) && game.user.isGM){
            operations.proceed_attack(data);
        }else if (char.owner) {
            data.roller = data.attacker
            data.next_op = 'roll_damage'
            data.write_value = 'hit_roll'
            data.modifier = 0
            let itm = char.actor.getOwnedItem(data.weapon);
            operations.skill_roll(data);
        }
    },
    roll_damage: function(data) {
        console.log('roll_damage:', data);
        let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (game.user.isGM) {
            dc_utils.socket.emit('roll_damage', data);
        }else if (atk.owner) {
            let itm = atk.actor.items.get(data.weapon);
            data.weapon_name = itm.name;
            if (data.type == 'ranged') {
                //Check ammo
                if (!(dc_utils.char.weapon.use_ammo(atk.actor, data.weapon))) {
                    return dc_utils.chat.send('Out of Ammo!', 'Click...', 'Click Click!', 'looks like you\'re empty partner.');
                }
            }
            if (data.hit_roll < data.tn) {
                //Missed
                if (data.roll.ones > data.roll.pass) {
                    dc_utils.chat.send(`Attack! [${data.tn}]`, `${data.attacker} fired at ${data.target} but missed.`, 'It was a critical failure!')
                }else{
                    dc_utils.chat.send(`Attack! [${data.tn}]`, `${data.attacker} fired at ${data.target} but missed.`)
                }
                return;
            }
            if (data.hit_roll < data.dodge_roll) {
                //Dodged
                return dc_utils.chat.send(`Attack! [${data.tn}]`, `${data.attacker} fired at ${data.target} but missed.`, 'They saw it coming and managed to dodge.');
            }
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            console.log(tgt);
            let dmg = itm?.data?.data?.damage?.split('d') || ['0', '0'];
            let dmg_mod = itm?.data?.data?.damage_bonus || 0;
            let loc_key = dc_utils.roll.location_roll(data.roll.raises, atk.actor.data.data.called_shot);
            //Armour Check
            data.av = (tgt.actor.data.data.armour[loc_key] || 0) * 2;
            //Damage
            let amt = parseInt(dmg[0]);
            let die = Math.max(parseInt(dmg[1]) - data.av, 4);
            data.loc_key = loc_key;
            data.loc_label = dc_utils.hit_locations[loc_key]
            if (loc_key == 'noggin') {
                amt += 2;
            }else if (loc_key == 'gizzards') {
                amt += 1;
            }else{
                data.loc_label = dc_utils.locations[dc_utils.loc_lookup.indexOf(loc_key)];
            }
            console.log('roll_damage: Location:', dc_utils.loc_lookup.indexOf(loc_key));
            console.log('roll_damage:', data);
            let dmg_formula = `${amt}d${die}x= + ${dmg_mod}`;
            if (data.type == 'melee') {
                let str = atk.actor.data.data.traits.strength
                dmg_formula += ` + ${str.level}${str.die_type}ex`
            }
            let dmg_roll = new Roll(dmg_formula).roll();
            dmg_roll.toMessage({rollMode: 'gmroll'});
            data.damage = dmg_roll._total;
            data.wounds = Math.floor(data.damage / tgt.actor.data.data.size);
            data.soak = 0;
            let op = 'enemy_damage';
            if (data.wounds > 0) {
                console.log(tgt);
                if (tgt.data.document.hasPlayerOwner) {
                    op = 'apply_damage';
                }
                dc_utils.socket.emit(op, data);
            }
            ChatMessage.create({content: battle_report(data)});
        }
    },
    //OLD COMBAT OPERATIONS
    check_tn: function(data) {
        if (game.user.isGM) {
            dc_utils.socket.emit('skill_roll', data);
        }
    },
    trait_check: function(data) {
        let char = game.actors.getName(data.name);
        if (char.owner) {
            let trait = char.data.data.traits[data.trait];
            let lvl = trait.level;
            let die = trait.die_type;
            let mod = trait.modifier;
            let wound_mod = char.data.data.wound_modifier;
            let formula = `${lvl}${die}ex + ${mod} + ${wound_mod}`;
            let roll = new Roll(formula).roll();
            let r_data = dc_utils.roll.evaluate(roll, data.tn, mod + wound_mod);
            data.skill_name = trait.name
            ChatMessage.create({content: build_skill_template(data, r_data)});
            roll.toMessage({rollMode: 'gmroll'});
        }
    },
    skill_check: function(data) {
        let char = game.actors.getName(data.name);
        console.log(data, char);
        if (char.owner) {
            let trait = char.data.data.traits[data.trait];
            let skill = trait.skills[data.skill];
            let lvl = skill.level;
            let die = trait.die_type;
            let mod = skill.modifier;
            let wound_mod = char.data.data.wound_modifier;
            if (lvl == 0) {
                lvl = trait.level;
            }
            let formula = `${lvl}${die}ex + ${mod} + ${wound_mod}`;
            let roll = new Roll(formula).roll();
            let r_data = dc_utils.roll.evaluate(roll, data.tn, mod + wound_mod);
            data.skill_name = skill.name
            ChatMessage.create({content: build_skill_template(data, r_data)});
            roll.toMessage({rollMode: 'gmroll'});
        }
    },
    check_target: function(data) {
        if (game.user.isGM) {
            console.log('check_target', data);
            let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
            console.log('check_target: Attacker:', atk);
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            console.log('check_target: Target:', tgt);
            if (atk.data.disposition == -1) {
                dc_utils.socket.emit('attack', data);
            }else if (tgt.data.disposition != -1 && atk.actor.data.type == 'player') {
                dc_utils.socket.emit('warn_law', data);
            }else{
                dc_utils.socket.operations.attack(data);
            }
        }else{
            let char = canvas.tokens.placeables.find(i => i.name == data.target);
            if (char.owner) {
                dc_utils.socket.emit('check_target', data);
            }
        }
    },
    proceed_attack: function(data) {
        console.log('proceed_attack', data);
        let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (atk.owner) {
            //Attack roll
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            console.log(tgt);
            let itm = atk.actor.getOwnedItem(data.weapon);
            data.weapon_name = itm.name;
            let range_mod = 0;
            let trait = atk.actor.data.data.traits.nimbleness;
            let skill = trait.skills.fightin;
            let shots = 1;
            let dmg = itm.data.data.damage.split('d');
            let dmg_mod = itm.data.data.damage_bonus || 0;
            let off_hand_mod = 0;
            let dist = Math.floor(canvas.grid.measureDistance(atk, tgt));
            data.range = dist;
            if(data.type == 'ranged') {
                trait = atk.actor.data.data.traits.deftness;
                skill = trait.skills["shootin_".concat(itm.data.data.gun_type)];
                shots = itm.data.data.chamber;
                range_mod = Math.max(Math.floor(dist / parseInt(itm.data.data.range)), 0);
            }
            data.range_mod = range_mod;
            if (shots > 0) {
                if (itm.data.data.off_hand) {
                    off_hand_mod = atk.actor.data.off_hand_modifier
                }
                let lvl = skill.level
                if (lvl == 0) {
                    lvl = trait.level
                }
                let mods = game.actors.getName('Marshal').data.data.modifiers;
                data.tn = 5 + range_mod;
                for (const [key, mod] of Object.entries(mods)){
                    if (mod.active) {
                        data.tn -= mod.mod;
                    }
                }
                data.roller = data.attacker;
                data.trait = 'deftness';
                data.skill = "shootin_".concat(itm.data.data.gun_type);
                data.amt = lvl;
                data.dice = trait.die_type;
                data.write_value = 'hit_roll';
                data.modifier = 0;
                let atk_roll = dc_utils.roll.new(data);
                data.hit_roll = atk_roll.total;
                data.result = atk_roll.total;
                if (atk_roll.success) {
                    if (atk_roll.total > data.dodge_roll) {
                        //Location roll
                        let loc_roll = new Roll('1d20').roll();
                        loc_roll.toMessage({rollMode: 'gmroll'});
                        let tot = loc_roll._total - 1;
                        let found = [];
                        let range = atk_roll.raises * 2
                        for (let i = 0; i < dc_utils.locations.length; i++) {
                            if (i >= tot - range && i <= tot + range && i < 19){
                                if (!(found.includes(dc_utils.loc_lookup[i]))) {
                                    found.push(dc_utils.loc_lookup[i]);
                                }
                            }
                        }
                        console.log('proceed_attack: Location:', found, found.length - 1);
                        let loc_key = found[found.length - 1];
                        console.log('proceed_attack: Location:', loc_key);
                        //Armour Check
                        let av = (tgt.actor.data.data.armour[loc_key] || 0) * 2;
                        //Damage
                        let amt = parseInt(dmg[0]);
                        let die = Math.max(parseInt(dmg[1]) - av, 4);
                        if (found.includes('noggin') || loc_roll._total == 20) {
                            data.loc_key = 'noggin';
                            data.loc_label = 'Noggin';
                            amt += 2;
                        }else if (found.includes('gizzards')) {
                            data.loc_key = 'gizzards';
                            data.loc_label = 'Gizzards';
                            amt += 1;
                        }else{
                            data.loc_key = loc_key;
                            data.loc_label = dc_utils.locations[dc_utils.loc_lookup.indexOf(loc_key)];
                        }
                        console.log('proceed_attack: Location:', dc_utils.loc_lookup.indexOf(loc_key));
                        console.log('proceed_attack:', data);
                        let dmg_formula = `${amt}d${die}x= + ${dmg_mod}`;
                        if (data.type == 'melee') {
                            let str = atk.actor.data.data.traits.strength
                            dmg_formula += ` + ${str.level}${str.die_type}ex`
                        }
                        let dmg_roll = new Roll(dmg_formula).roll();
                        dmg_roll.toMessage({rollMode: 'gmroll'});
                        data.damage = dmg_roll._total;
                        data.wounds = Math.floor(data.damage / tgt.actor.data.data.size);
                        data.soak = 0;
                        let op = 'enemy_damage';
                        console.log(tgt);
                        if (data.wounds > 0) {
                            if (tgt.document._actor.hasPlayerOwner) {
                                op = 'apply_damage';
                            }
                            dc_utils.socket.emit(op, data);
                        }
                        ChatMessage.create({content: battle_report(data)});
                    }else{
                        //Dodge Success Message
                        ChatMessage.create({content: `
                            <h2 style="text-align:center">Attack! [${data.tn}]</h2>
                            <p style="text-align:center">${data.attacker} attacked ${data.target} but missed.</p>
                            <p style="text-align:center">They saw it coming and managed to dodge.</p>
                        `});
                    }
                }else{
                    //Missed Message.
                    let msg = `
                        <h2 style="text-align:center">Attack! [${data.tn}]</h2>
                        <p style="text-align:center">${data.attacker} fired at ${data.target} but missed.</p>
                    `;
                    if (atk_roll.ones > atk_roll.pass) {
                        msg += `
                        <p style="text-align:center">It was a critical failure!</p>
                        `;
                    }
                    ChatMessage.create({content: msg});
                }
                if (data.type == 'ranged') {
                    //Remove the bullet just fired and reset any aim bonus applied.
                    shots = shots - 1;
                    game.dc.aim_bonus = 0;
                    itm.update({"data.chamber": shots})
                }
            }else{
                //Out of Ammo Message
                ChatMessage.create({content: `
                    <h2 style="text-align:center">Out of Ammo!</h2>
                    <p style="text-align:center">Click...</p>
                    <p style="text-align:center">Click Click!</p>
                    <p style="text-align:center">Looks like you're empty partner.</p>
                `});
            }
        }
    },
    apply_damage: function(data) {
        let char = game.actors.getName(data.target);
        if (char.owner) {
            data.roller = data.target;
            let form = new Dialog({
                title: `You've been hit!`,
                content: build_damage_dialog(data),
                buttons: {
                    white: {
                        label: 'White [1]',
                        callback: () => {
                            data = soak_damage(data, 'White');
                            dc_utils.socket.emit('soak', data);
                        }
                    },
                    red: {
                        label: 'Red [2]',
                        callback: () => {
                            data = soak_damage(data, 'Red');
                            dc_utils.socket.emit('soak', data);
                        }
                    },
                    blue: {
                        label: 'Blue [3]',
                        callback: () => {
                            data = soak_damage(data, 'Blue');
                            dc_utils.socket.emit('soak', data);
                        }
                    },
                    legend: {
                        label: 'Legendary [5]',
                        callback: () => {
                            data = soak_damage(data, 'Legendary');
                            dc_utils.socket.emit('soak', data);
                        }
                    },
                    take: {
                        label: 'Take Damage.',
                        callback: (html) => {
                            operations.enemy_damage(data);
                        }
                    }
                },
                close: () => {
                    console.log('Damage Dialog Closed');
                }
            });
            form.render(true);
        }
    },
    enemy_damage: function(data) {
        let char = canvas.tokens.placeables.find(i => i?.actor?.name == data.target);
        if (!(char)) {
            for (let t = 0; t < 5; t++) {
                ChatMessage.create({ content: `
                    Target Not Found! Retrying...
                `});
                char = canvas.tokens.placeables.find(i => i?.actor?.name == data.target);
                if (char) {
                    break;
                }
            }
            if (!(char)) {
                ChatMessage.create({ content: `
                Target Not Found! ERROR Finding Target: ${data.target}
            `});
            }
        }
        if (char.isOwner) {
            console.log('enemy_damage:', data, char);
            let current = parseInt(char.document.actor.data.data.wounds[data.loc_key]) || 0;
            let wind_roll = new Roll(`${data.wounds}d6`).roll();
            wind_roll.toMessage({rollMode: 'gmroll'});
            let highest = 0;
            Object.keys(char.document.actor.data.data.wounds).forEach(function(key) {
                if (char.document.actor.data.data.wounds[key] >= highest) {
                    highest = char.document.actor.data.data.wounds[key];
                }
            });
            if ((highest == 0 && data.wounds > 0) || data.wounds > highest) {
                highest = data.wounds
            }
            let w_data = {
                wind: {
                    value: char.document.actor.data.data.wind.value - wind_roll._total
                },
                wounds: {
                    [data.loc_key]: current + data.wounds
                },
                wound_modifier: highest * -1
            };
            if (data.wounds > 0) {
                char.toggleEffect('icons/svg/blood.svg', {active: true});
            }
            if (char.document.actor.data.data.wind.value - wind_roll._total <= 0) {
                char.toggleEffect('icons/svg/skull.svg', {active: true, overlay: true});
                char.toggleEffect('icons/svg/skull.svg', {active: true});
                char.toggleEffect('icons/svg/blood.svg', {active: false});
            }
            let critical = ['noggin', 'guts', 'lower_guts', 'gizzards']
            if (data.loc_key in critical) {
                if (current + data.wounds >= 5) {
                    char.toggleEffect('icons/svg/skull.svg', {active: true, overlay: true});
                    char.toggleEffect('icons/svg/skull.svg', {active: true});
                    char.toggleEffect('icons/svg/blood.svg', {active: false});
                }
            }
            if (char.document.actor.hasPlayerOwner) {
                Actor.updateDocuments([{_id: char.document.actor._id, data: w_data}]);
            } else {
                char.document.actor.update({data: w_data});
            }
        }
    },
    soak: function(data) {
        if (game.user.isGM) {
            console.log('soak:', data);
            if (data.wounds > 0) {
                dc_utils.socket.emit('apply_damage', data);
            }
        }
    }
}

Hooks.on("ready", () => {
    game.dc = {
        combat_active: false,
        aim_bonus: 0,
        level_headed_available: true
    }
    if (game.user.isGM) {
        let journal = game.journal.getName('action_deck');
        if (journal) {
            game.dc.action_deck = dc_utils.journal.load('action_deck');
        }else{
            let deck = {
                deck: dc_utils.deck.new('action_deck'),
                discard: []
            }
            game.dc.action_deck = dc_utils.journal.load('action_deck', deck);
        }
    };
    console.log("DC | Initializing socket listeners...")
    game.socket.on(`system.deadlands_classic`, (data) => {
        if (data.operation in operations) {
            console.log('RECIEVE:', data.operation, data.data);
            operations[data.operation](data.data);
            return false;
        }
    });
});