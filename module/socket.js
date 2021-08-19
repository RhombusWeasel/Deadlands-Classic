function restore_discard() {
    game.dc.action_deck.discard.forEach(card => {
        game.dc.action_deck.push(card);
    });
    game.dc.action_deck.discard = []
    dc_utils.journal.save('action_deck', game.dc.action_deck);
}

function build_skill_template(data) {
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

function build_dodge_dialog(data, card_name) {
    return `
        <form>
            <div>
                <h2 style="text-align: center;">Incoming Attack!</h2>
                <p style="text-align: center;">${data.attacker} is attacking you!</p>
                <p style="text-align: center;">It'll cost your ${card_name} to vamoose,</p>
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
                <p style="text-align: center;">${data.target} has taken 1 wound to the ${dc_utils.hit_locations[data.location]}</p>
        `;
    }else{
        form += `
                <p style="text-align: center;">${data.target} has taken ${data.wounds - data.soak} wounds to the ${dc_utils.hit_locations[data.location]}</p>
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
            let cards = data.amount;
            let act = game.actors.getName(data.char);
            dc_utils.combat.deal_cards(act, cards);
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
            game.dc.action_deck.discard.push({
                name: data.name,
                type: data.type
            });
            dc_utils.journal.save('action_deck', game.dc.action_deck);
        }
    },
    recycle_card: function(data) {
        if (game.user.isGM) {
            game.dc.action_deck.discard.push({
                name: data.card.name,
                type: data.card.type
            });
            let act = game.actors.getName(data.char);
            setTimeout(() => {dc_utils.combat.deal_cards(act, 1)}, 500);
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
        let char = dc_utils.get_actor(data.roller);
        if (char.isOwner) {
            if(data == false) {
                data = dc_utils.roll.new_roll_packet()
            }
            data.roll = dc_utils.roll.evaluate(dc_utils.roll.new(data));
            operations.confirm_result(data);
        }else if (game.user.isGM) {
            data.roll = dc_utils.roll.evaluate(dc_utils.roll.new(data));
            operations.confirm_result(data);
        }
    },
    confirm_result: function(data) {
        let char = dc_utils.get_actor(data.roller);
        if (char.owner) {
            let form = new Dialog({
                title: `Confirm skill roll`,
                content: build_roll_dialog(data),
                buttons: {
                    white: {
                        label: 'White',
                        callback: () => {
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
                                dc_utils.socket.emit('lock_result', data);
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
    lock_result: function(data) {
        if (game.user.isGM) {
            game.dc.rolls[data.uuid] = data;
            dc_utils.journal.save('roll_data', game.dc.rolls);
            if (data.combat_id) {
                if (data.gm_action) {
                    return operations[data.next_op](data);
                }
                return dc_utils.socket.emit(data.next_op, data);
            }
        }
    },
    request_roll: function(data) {
        let char = dc_utils.get_actor(data.roller);
        if (char.owner) {
            operations.skill_roll(data);
        }
    },
    register_attack: function(data) {
        if (game.user.isGM) {
            let attack = dc_utils.combat.new_attack(data.attacker, data.target, data.type, data.skill, data.weapon);
            let tgt = dc_utils.get_actor(data.target);
            let dodge = dc_utils.roll.new_roll_packet(tgt, 'skill', 'dodge');
            dodge.combat_id = attack.uuid;
            dodge.next_op = 'roll_attack';
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            if (tgt.hasPlayerOwner) {
                dc_utils.socket.emit('roll_dodge', dodge);
            }else{
                dodge.roll = {total: 0};
                dodge.gm_action = true;
                operations.roll_attack(dodge);
            }
        }else{
            // GM is attacking a player, that player should bounce back the message.
            let act = dc_utils.get_actor(data.target);
            if (act.owner) {
                setTimeout(() => {dc_utils.socket.emit('register_attack', data)}, 500);
            }
        }
    },
    roll_dodge: function(data) {
        let char = dc_utils.get_actor(data.roller);
        if (char.owner) {
            let cards = char.data.data.action_cards;
            if (cards.length > 0) {
                let card_name = cards[0].name;
                let form = new Dialog({
                    title: `Dodge!`,
                    content: build_dodge_dialog(data, card_name),
                    buttons: {
                        yes: {
                            label: 'Dodge',
                            callback: () => {
                                dc_utils.socket.emit('discard_card', {
                                    name: card_name,
                                    type: 'action_deck',
                                    char: data.target
                                });
                                dc_utils.combat.remove_card(char, 0);
                                operations.skill_roll(data);
                            }
                        },
                        no: {
                            label: 'Take yer chances.',
                            callback: () => {
                                data.roll = {total: 0};
                                dc_utils.socket.emit('roll_attack', data);
                            }
                        }
                    },
                    close: () => {
                        console.log('Dodge Dialog Closed');
                    }
                });
                form.render(true);
            }else{
                data.roll = {total: 0};
                dc_utils.socket.emit('roll_attack', data);
            }
        }
    },
    roll_attack: function(data) {
        if (game.user.isGM) {
            let ca             = game.dc.combat_actions[data.combat_id];
            ca.dodge_roll      = data.roll.total;
            game.dc.combat_actions[data.combat_id] = ca;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            let act            = dc_utils.get_actor(ca.attacker);
            let atk_roll       = dc_utils.roll.new_roll_packet(act, ca.type, ca.skill, ca.weapon, ca.target);
            if (!(atk_roll)) {
                for (let i = 0; i < 5; i++) {
                    atk_roll = dc_utils.roll.new_roll_packet(act, ca.type, ca.skill, ca.weapon);
                    if (atk_roll) {
                        break;
                    }
                }
            }
            atk_roll.combat_id = ca.uuid;
            atk_roll.next_op   = 'check_hit';
            if (act.hasPlayerOwner){
                return dc_utils.socket.emit('skill_roll', atk_roll);
            }
            atk_roll.gm_action = true;
            operations.skill_roll(atk_roll);
        }
    },
    check_hit: function(data) {
        if (game.user.isGM) {
            let ca         = game.dc.combat_actions[data.combat_id];
            ca.attack_roll = data.roll.total;
            ca.range       = data.range;
            ca.modifiers   = data.modifiers;
            game.dc.combat_actions[data.combat_id] = ca;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            let act = dc_utils.get_actor(ca.attacker);
            if (data.type == 'ranged') {
                //Check ammo
                if (!(dc_utils.char.weapon.use_ammo(act, ca.weapon))) {
                    return dc_utils.chat.send('Out of Ammo!', 'Click...', 'Click Click!', 'looks like you\'re empty partner.');
                }
            }
            // Check if dodged
            if (ca.dodge_roll != 'none') {
                if (ca.dodge_roll > ca.attack_roll) {
                    return dc_utils.chat.send('Attack', `${ca.attacker} tried to hit ${ca.target}`, `${ca.target} saw it coming and managed to dodge.`);
                }
            }
            // Check Crit Fail

            // Check hit
            if (ca.attack_roll >= 5) {
                operations.apply_hit(ca);
            }else {
                dc_utils.chat.send('Attack', `${ca.attacker} tried to hit ${ca.target}`, `${ca.attacker} missed.`);
            }
        }else{
            let act = dc_utils.get_actor(data.target);
            if (act.owner) {
                dc_utils.socket.emit('check_hit', data);
            }
        }
    },
    apply_hit: function(data) {
        if (game.user.isGM) {
            let act = dc_utils.get_actor(data.attacker);
            let raises    = Math.floor((data.attack_roll - 5) / 5);
            let called    = act.data.data.called_shot;
            data.location = dc_utils.roll.location_roll(raises, called);
            game.dc.combat_actions[data.uuid] = data;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            let tgt = dc_utils.get_actor(data.target);
            let wep = act.items.filter(function (item) {return item.id == data.weapon})[0];
            let armour_val =  (tgt.data.data.armour[data.location] || 0) * 2;
            let dmg = wep?.data?.data?.damage?.split('d') || ['0', '0'];
            if (data.location == 'noggin') {
                dmg[0] = parseInt(dmg[0]) + 2
            }else if (data.location == 'gizzards') {
                dmg[0] = parseInt(dmg[0]) + 1
            }
            let amt = parseInt(dmg[0]);
            let die = Math.max(parseInt(dmg[1]) - armour_val, 4);
            let dmg_mod = wep?.data?.data?.damage_bonus || 0;
            let dmg_formula = `${amt}d${die}x= + ${dmg_mod}`;
            if (data.type == 'melee') {
                let str = act.data.data.traits.strength;
                dmg_formula += ` + ${str.level}${str.die_type}ex`;
            }
            let dmg_roll = new Roll(dmg_formula).roll();
            dmg_roll.toMessage({rollMode: 'gmroll'});
            data.damage = dmg_roll._total;
            data.wounds = Math.floor(data.damage / parseInt(tgt.data.data.size));
            data.soak   = 0;
            game.dc.combat_actions[data.uuid] = data;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            console.log(data);
            ChatMessage.create({content: battle_report(data)})
            if (tgt.hasPlayerOwner) {
                dc_utils.socket.emit('apply_damage', data);
            }else{
                operations.enemy_damage(data);
            }
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
            let current = parseInt(char.document.actor.data.data.wounds[data.location]) || 0;
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
                    [data.location]: current + data.wounds
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
            if (data.location in critical) {
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
                dc_utils.socket.emit('soak', data);
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
        // Initialize action deck
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
        // Initialize roll tracking
        let rolls = game.journal.getName('roll_data');
        if (rolls) {
            game.dc.rolls = dc_utils.journal.load('roll_data');
        }else{
            game.dc.rolls = dc_utils.journal.load('roll_data', {});
        }
        // Initialize combat action tracking
        let ca = game.journal.getName('combat_actions');
        if (ca) {
            game.dc.combat_actions = dc_utils.journal.load('combat_actions');
        }else{
            game.dc.combat_actions = dc_utils.journal.load('combat_actions', {});
        }
    };
    console.log("DC | Initializing socket listeners...")
    game.socket.on(`system.deadlands_classic`, (data) => {
        console.log('RECIEVE:', data.operation, data.data);
        if (data.operation in operations) {
            console.log('RECIEVE:', data.operation, data.data);
            operations[data.operation](data.data);
            return false;
        }
    });
});