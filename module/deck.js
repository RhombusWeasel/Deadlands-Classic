let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
let bounty = {"White": 1, "Red": 2, "Blue": 3, "Legendary": 5};
let locations = ['Left Leg','Right Leg','Left Leg','Right Leg','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Gizzards','Left Arm','Right Arm','Left Arm','Right Arm','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Noggin'];
let loc_lookup = ['leg_left','leg_right','leg_left','leg_right','lower_guts','lower_guts','lower_guts','lower_guts','lower_guts','gizzards','arm_left','arm_right','arm_left','arm_right','guts','guts','guts','guts','guts','noggin'];

function restore_discard() {
    for (let c = 0; c < game.dc.action_discard.length; c++) {
        game.dc.action_deck.push(game.dc.action_discard.pop());
    }
    game.dc.action_deck = shuffle_deck(game.dc.action_deck);
}

function shuffle_deck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function new_deck(id) {
    let deck = [];
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
    deck = shuffle_deck(deck)
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

function assemble_image_urls() {
    let suit_lookup = [
        '_2.png',
        '_1.png',
        '_0.png',
        '.png',
    ]
    let base_url = `https://opengameart.org/sites/default/files/styles/medium/public/oga-textures/92832/`;
    let url_dict = {};
    url_dict['Joker (Red)'] = `https://opengameart.org/sites/default/files/styles/medium/public/oga-textures/92832/joker_2.png`;
    url_dict['Joker (Black)'] = `https://opengameart.org/sites/default/files/styles/medium/public/oga-textures/92832/joker_1.png`;
    for (let suit = 0; suit < suits.length; suit++) {
        for (let card = 1; card < cards.length; card++) {
            let full_name = `${cards[card]} of ${suits[suit]}`;
            url_dict[full_name] = base_url + `${cards[card].toLowerCase()}${suit_lookup[suit]}`;
            console.log(url_dict[full_name]);
        }        
    }
    return url_dict;
}

function emit(op, data) {
    console.log('EMIT:', op, data);
    game.socket.emit("system.deadlands_classic", {
        operation: op,
        data: data
    });
}

function get_tn() {
    let mods = game.actors.getName('Marshal').data.data.modifiers;
    let tn = 5;
    for (const [key, mod] of Object.entries(mods)){
        if (mod.active) {
            tn -= mod.mod;
        }
    }
    return tn;
}

function new_roll(data) {
    let r_data = {
        success: false,
        crit_fail: false,
        tn: data.tn,
        total: 0,
        dice: data.dice,
        amt: data.amt,
        modifier: data.modifier,
        raises: 0,
        pass: 0,
        ones: 0,
        results: [],
    };
    let roll = new Roll(`${data.amt}${data.dice}ex + ${data.modifier}`).roll();
    r_data.total = roll._total;
    let count = 0
    roll.terms[0].results.forEach(die => {
        if (die.result + data.modifier >= data.tn && count < r_data.amt) {
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
}

function evaluate_roll(data) {
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
            <div>
                <h1 style="text-align:center">${data.roller} rolled ${data.roll.total}</h1>
                <table style="table-layout: fixed;">
                    <tr style="text-align:center">
    `;
    for (let i = 0; i < data.roll.results.length; i++) {
        const res = data.roll.results[i];
        form += `
                        <td>${res}</td>
        `;
    }
    form += `
                    </tr>
                </table>
    `;
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
            <h1 style="text-align: center">${data.name}</h1>
            <h3 style="text-align: center">It's ${data.char}'s turn</h3>
        </form>
    `;
}

function build_sleeve_dialog(data) {
    let char = game.actors.getName(data.char);
    let sleeved = char.data.data.sleeved.name
    return `
        <form>
            <h1 style="text-align: center">Not much room for two!</h1>
            <p style="text-align: center">You already have the ${sleeved} up your sleeve, you will lose it if you continue.</p>
            <p style="text-align: center">You want to replace it with the ${data.name}</p>
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

function spend_fate_chip(data, label) {
    let char = game.actors.getName(data.roller);
    for (let item of char.items.values()) {
        if(item.name == label && item.type == 'chip') {
            char.deleteOwnedItem(item._id);
            let reply = `
                <h3 style="text-align:center">Fate</h3>
                <p style="text-align:center">${data.roller} spends a ${label} fate chip.</p>
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
        <h3 style="text-align:center">${data.roller} has no ${label} chips.</h3>
    `});
    return false;
}

function soak_damage(data, label){
    if (spend_fate_chip(data, label)){
        data.wounds -= bounty[label]
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
            <h3 style="text-align:center">Range: ${data.range} yards [-${data.range_mod}]</h3>
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
        if (game.user.isGM) {
            game.dc.action_deck = []
            game.dc.discard_deck = []
            game.dc.aim_bonus = 0
            for (let i = 0; i < game.dc.chars.length; i++) {
                const name = game.dc.chars[i];
                let char = game.actors.get(name);
                char.update({data: {sleeved: false}});
            }
        }
    },
    request_cards: function(data){
        if (game.user.isGM) {
            let cards = data.amount
            if (!(game.dc.chars.includes(data.char))) {
                game.dc.chars.push(data.char);
            }
            if (game.dc.action_deck.length <= cards){
                restore_discard()
            }
            for (let i=0; i<cards; i++){
                data.card = game.dc.action_deck.pop();
                emit('recieve_card', data);
            }
        };
    },
    recieve_card: function(data){
        let actor = game.actors.getName(data.char);
        if (actor.owner){
            console.log('Card:', data);
            let c = Math.random();
            setTimeout(() => {actor.createOwnedItem(data.card)}, c * 100);
        }
    },
    discard_card: function(data) {
        if (game.user.isGM) {
            let content = `
            <div>
                <style>
                    center {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        width: 50%;
                    }
                </style>
            `;
            if (data.name == "Joker (Black)") {
                content += `
                <h3 style="text-align: center;">Black Joker!</h3>
                <div class="center"><img src="${game.dc.url_dict[data.name]}"></img></div>
                <p style="text-align: center;">You lose your next highest card.</p>
                <p style="text-align: center;">The combat deck will be reshuffled at the end of the round.</p>
                <p style="text-align: center;">The Marshal draws a Fate Chip.</p>
                `;
                game.dc.combat_shuffle = true
            }else if (data.name == "Joker (Red)") {
                content += `
                <h3 style="text-align: center;">Red Joker!</h3>
                <div class="center"><img src="${game.dc.url_dict[data.name]}"></img></div>
                <p style="text-align: center;">You may act first or if sleeved may interrupt any card.</p>
                <p style="text-align: center;">${data.char} may draw a Fate Chip.</p>
                `;
            }else{
                content += `
                <h3 style="text-align: center;">Action Deck</h3>
                <div class="center"><img src="${game.dc.url_dict[data.name]}"></img></div>
                <p style="text-align: center;">${data.char} plays ${data.name}</p>
                `;
            }
            content += `
            </div>
            `;
            ChatMessage.create({content: content});
            let char = game.actors.getName(data.char);
            let itm = char.items.find(data.name);
            char.deleteOwnedItem(itm._id);
            game.dc.action_discard.push(data)
        }
    },
    recycle_card: function(data) {
        if (game.user.isGM) {
            game.dc.action_discard.push(data.card)
            data.card = game.dc.action_deck.pop()
            emit('recieve_card', data);
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
        if (char.owner) {
            let trait = char.data.data.traits[data.trait];
            let skill = char.data.data.traits[data.trait];
            if (data.skill) {
                skill = trait.skills[data.skill];
            }
            data.skill_name = skill.name;
            data.amt = skill.level;
            data.dice = trait.die_type;
            if (data.amt == 0) {
                data.amt = trait.level
            }
            data.modifier += parseInt(trait.modifier) + parseInt(skill.modifier) + parseInt(char.data.data.wound_modifier);
            data.roll = new_roll(data);
            operations.confirm_result(data);
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
                            if (spend_fate_chip(data, 'White')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let res = roll._total;
                                data.roll.results.unshift(res);
                                data.roll.amt += 1;
                                data.roll = evaluate_roll(data.roll);
                                roll.toMessage({rollMode: 'gmroll'});
                            }
                            operations.confirm_result(data);
                        },
                    },
                    red: {
                        label: 'Red',
                        callback: () => {
                            if (spend_fate_chip(data, 'Red')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let result = roll.terms[0].results[0].result;
                                let index = data.roll.results.indexOf(data.roll.total - data.roll.modifier);
                                data.roll.results[index] += result;
                                data.roll.total += result;
                                data.roll.results.push(result);
                                data.roll = evaluate_roll(data.roll);
                                roll.toMessage({rollMode: 'gmroll'});
                            }
                            operations.confirm_result(data);
                        },
                    },
                    blue: {
                        label: 'Blue',
                        callback: () => {
                            if (spend_fate_chip(data, 'Blue')) {
                                let roll = new Roll(`1${data.roll.dice} + ${data.modifier}`).roll();
                                let result = roll.terms[0].results[0].result;
                                let index = data.roll.results.indexOf(data.roll.total - data.roll.modifier);
                                data.roll.results[index] += result;
                                data.roll.total += result;
                                data.roll.results.push(result);
                                data.roll = evaluate_roll(data.roll);
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
                                emit(data.next_op, data);
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
                            if (char.data.data.sleeved) {
                                operations.alert_sleeve(data);
                            }else{
                                let itm = char.items.find(i => i.name == data.name);
                                let card = {
                                    name: data.name,
                                    id: itm._id,
                                }
                                char.update({data: {sleeved: card}});
                            }
                        }
                    },
                    play: {
                        label: 'Play',
                        callback: () => {
                            let itm = char.items.find(i => i.name == data.name);
                            char.deleteOwnedItem(itm._id);
                            emit('discard_card', data);
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
    alert_sleeve: function(data) {
        let char = game.actors.getName(data.char);
        if (char.owner) {
            data.roller = data.target;
            let form = new Dialog({
                title: `Your Turn.`,
                content: build_sleeve_dialog(data),
                buttons: {
                    sleeve: {
                        label: 'Sleeve it',
                        callback: () => {
                            let slv = char.items.find(i => i.name == char.data.data.sleeved.name);
                            char.deleteOwnedItem(slv._id);
                            let itm = char.items.find(i => i.name == data.name);
                            let card = {
                                name: data.name,
                                id: itm._id,
                            }
                            char.update({data: {sleeved: card}});
                        }
                    },
                    play: {
                        label: 'Play',
                        callback: () => {
                            let itm = char.items.find(i => i.name == data.name);
                            char.deleteOwnedItem(itm._id);
                            emit('discard_card', data);
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
            console.log('declare_attack', data);
            let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
            console.log('declare_attack: Attacker:', atk);
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            console.log('declare_attack: Target:', tgt);
            data.trait = 'nimbleness';
            data.skill = 'fightin';
            data.dodge_roll = 0
            if (data.type == 'ranged') {
                let itm = atk.actor.getOwnedItem(data.weapon);
                data.trait = 'deftness';
                data.skill = 'shootin_' + itm.data.data.gun_type;
            }
            if (atk.data.disposition == -1) {
                operations.attack(data);
            }else if (tgt.data.disposition != -1 && atk.actor.data.type == 'player') {
                emit('warn_friendly_fire', data);
            }else{
                emit('roll_to_hit', data);
            }
        }else{
            let char = canvas.tokens.placeables.find(i => i.name == data.target);
            if (char.owner) {
                emit('check_dodge', data);
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
                    content: build_friendly_fire_dialog(data, sort_deck(cards)),
                    buttons: {
                        yes: {
                            label: 'Screw it!',
                            callback: () => {
                                if (tgt.actor.isPC) {
                                    emit('check_dodge', data);
                                }else{
                                    emit('roll_to_hit', data);
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
            emit('check_dodge', data);
        }else if (char.owner) {
            let cards = [];
            for (let item of char.actor.items.values()) {
                if (item.type == 'action_deck') {
                    cards.push(item);
                }
            }
            cards = sort_deck(cards);
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
                                emit('discard_card', {
                                    name: data.card_name,
                                    type: 'action_deck',
                                    char: data.target
                                });
                                setTimeout(() => {char.actor.deleteOwnedItem(data.card_id)}, 500);
                                console.log('check_dodge', data);
                                emit('skill_roll', data);
                            }
                        },
                        no: {
                            label: 'Take yer chances.',
                            callback: () => {
                                console.log('check_dodge', data);
                                data.dodge_roll = 0;
                                emit('roll_to_hit', data);
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
                emit('roll_to_hit', data);
            }
        }
    },
    roll_to_hit: function(data) {
        console.log('roll_to_hit:', data);
        let char = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (char.actor.isPC && game.user.isGM) {
            emit('roll_to_hit', data);
        }else if(!(char.actor.isPC) && game.user.isGM){
            operations.proceed_attack(data);
        }else if (char.owner) {
            data.roller = data.attacker
            data.next_op = 'roll_damage'
            data.write_value = 'hit_roll'
            data.trait = 'nimbleness'
            data.skill = 'fightin'
            data.modifier = 0
            let itm = char.actor.getOwnedItem(data.weapon);
            if (data.type == 'ranged') {
                let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
                let dist = Math.floor(canvas.grid.measureDistance(char, tgt));
                data.range = dist;
                data.range_mod = Math.max(Math.floor(dist / parseInt(itm.data.data.range)), 0);
                data.modifier -= data.range_mod;
                data.trait = 'deftness';
                data.skill = 'shootin_' + itm.data.data.gun_type;
            }
            if (itm.data.data.off_hand) {
                data.modifier += char.actor.data.data.off_hand_modifier;
            }
            emit('check_tn', data);
        }
    },
    roll_damage: function(data) {
        console.log('roll_damage:', data);
        let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (game.user.isGM) {
            emit('roll_damage', data);
        }else if (atk.owner) {
            let itm = atk.actor.getOwnedItem(data.weapon);
            data.weapon_name = itm.name;
            let shots = 1;
            if (data.type == 'ranged') {
                shots = itm.data.data.chamber;
            }
            if (shots < 1) {
                //Out of ammo
                ChatMessage.create({content: `
                    <h3 style="text-align:center">Out of Ammo!</h3>
                    <p style="text-align:center">Click...</p>
                    <p style="text-align:center">Click Click!</p>
                    <p style="text-align:center">Looks like you're empty partner.</p>
                `});
                return;
            }
            shots = shots - 1;
            game.dc.aim_bonus = 0;
            itm.update({"data.chamber": shots});
            if (data.hit_roll < data.tn) {
                //Missed
                let msg = `
                    <h3 style="text-align:center">Attack! [${data.tn}]</h3>
                    <p style="text-align:center">${data.attacker} fired at ${data.target} but missed.</p>
                `;
                if (data.roll.ones > data.roll.pass) {
                    msg += `
                    <p style="text-align:center">It was a critical failure!</p>
                    `;
                }
                ChatMessage.create({content: msg});
                return;
            }
            if (data.hit_roll < data.dodge_roll) {
                //Dodged
                ChatMessage.create({content: `
                    <h3 style="text-align:center">Attack! [${data.tn}]</h3>
                    <p style="text-align:center">${data.attacker} attacked ${data.target} but missed.</p>
                    <p style="text-align:center">They saw it coming and managed to dodge.</p>
                `});
                return;
            }
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            let dmg = itm.data.data.damage.split('d');
            let dmg_mod = itm?.data?.data?.damage_bonus || 0;
            let loc_roll = new Roll('1d20').roll();
            loc_roll.toMessage({rollMode: 'gmroll'});
            let tot = loc_roll._total - 1;
            let found = [];
            let range = data.roll.raises * 2
            for (let i = 0; i < locations.length; i++) {
                if (i >= tot - range && i <= tot + range && i < 19){
                    if (!(found.includes(loc_lookup[i]))) {
                        found.push(loc_lookup[i]);
                    }
                }
            }
            console.log('roll_damage: Location:', found, found.length - 1);
            let loc_key = found[found.length - 1];
            console.log('roll_damage: Location:', loc_key);
            //Armour Check
            data.av = (tgt.actor.data.data.armour[loc_key] || 0) * 2;
            //Damage
            let amt = parseInt(dmg[0]);
            let die = Math.max(parseInt(dmg[1]) - data.av, 4);
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
                data.loc_label = locations[loc_lookup.indexOf(loc_key)];
            }
            console.log('roll_damage: Location:', loc_lookup.indexOf(loc_key));
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
                if (tgt.actor.isPC) {
                    op = 'apply_damage';
                }
                emit(op, data);
            }
            ChatMessage.create({content: battle_report(data)});
        }
    },
    //OLD COMBAT OPERATIONS
    check_tn: function(data) {
        if (game.user.isGM) {
            data.tn = get_tn();
            if (data.type == 'skill') {
                emit('skill_roll', data);
            }else{
                emit('skill_roll', data);
            }
        }
    },
    proceed_attack: function(data) {
        console.log('proceed_attack', data);
        let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
        if (atk.owner) {
            //Attack roll
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
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
                let atk_roll = new_roll(data);
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
                        for (let i = 0; i < locations.length; i++) {
                            if (i >= tot - range && i <= tot + range && i < 19){
                                if (!(found.includes(loc_lookup[i]))) {
                                    found.push(loc_lookup[i]);
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
                            data.loc_label = locations[loc_lookup.indexOf(loc_key)];
                        }
                        console.log('proceed_attack: Location:', loc_lookup.indexOf(loc_key));
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
                        if (data.wounds > 0) {
                            if (tgt.actor.isPC) {
                                op = 'apply_damage';
                            }
                            emit(op, data);
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
                            emit('soak', data);
                        }
                    },
                    red: {
                        label: 'Red [2]',
                        callback: () => {
                            data = soak_damage(data, 'Red');
                            emit('soak', data);
                        }
                    },
                    blue: {
                        label: 'Blue [3]',
                        callback: () => {
                            data = soak_damage(data, 'Blue');
                            emit('soak', data);
                        }
                    },
                    legend: {
                        label: 'Legendary [5]',
                        callback: () => {
                            data = soak_damage(data, 'Legendary');
                            emit('soak', data);
                        }
                    },
                    take: {
                        label: 'Take Damage.',
                        callback: (html) => {
                            emit('enemy_damage', data);
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
        let char = canvas.tokens.placeables.find(i => i.actor.name == data.target);
        if (!(char)) {
            for (let t = 0; t < 5; t++) {
                ChatMessage.create({ content: `
                    Target Not Found! Retrying...
                `});
                char = canvas.tokens.placeables.find(i => i.actor.name == data.target);
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
        if (game.user.isGM) {
            console.log('enemy_damage:', data, char);
            let current = parseInt(char.actor.data.data.wounds[data.loc_key]) || 0;
            let wind_roll = new Roll(`${data.wounds}d6`).roll();
            wind_roll.toMessage({rollMode: 'gmroll'});
            let w_data = {
                data: {
                    wind: {
                        value: char.actor.data.data.wind.value - wind_roll._total
                    },
                    wounds: {
                        [data.loc_key]: current + data.wounds
                    }
                }
            };
            if (data.wounds > 0) {
                char.toggleEffect('icons/svg/blood.svg', {active: true});
            }
            if (char.actor.data.data.wind.value - wind_roll._total <= 0) {
                char.toggleEffect('icons/svg/skull.svg', {active: true, overlay: true});
                char.toggleEffect('icons/svg/blood.svg', {active: false});
            }
            let critical = ['noggin', 'guts', 'lower_guts', 'gizzards']
            if (data.loc_key in critical) {
                if (current + data.wounds >= 5) {
                    char.toggleEffect('icons/svg/skull.svg', {active: true, overlay: true});
                    char.toggleEffect('icons/svg/blood.svg', {active: false});
                }
            }
            char.actor.update(w_data);
            let highest = 0;
            Object.keys(char.actor.data.data.wounds).forEach(function(key) {
                if (char.actor.data.data.wounds[key] >= highest) {
                    highest = char.actor.data.data.wounds[key];
                }
            });
            let m_data = {data: {wound_modifier: highest * -1}};
            char.actor.update(m_data);
        }
    },
    soak: function(data) {
        if (game.user.isGM) {
            console.log('soak:', data);
            if (data.wounds > 0) {
                emit('apply_damage', data);
            }
        }
    }
}

Hooks.on("ready", () => {
    game.dc = {
        combat_active: false,
        aim_bonus: 0,
        level_headed_available: true,
        url_dict: assemble_image_urls()
    }
    if (game.user.isGM) {
        game.dc.action_deck = new_deck('action_deck');
        game.dc.action_discard = [];
        game.dc.chars = [];
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