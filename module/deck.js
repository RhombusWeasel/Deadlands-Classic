let cards = ["Joker", "Ace", "King", "Queen", "Jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
let suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
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

function emit(op, data) {
    game.socket.emit("system.deadlands_classic", {
        operation: op,
        data: data
    });
}

function check_roll(roll, tn, mod) {
    console.log(roll);
    let r_data = {
        success: false,
        tn: tn,
        total: roll._total,
        raises: 0,
        pass: 0,
        ones: 0,
    }
    roll.terms[0].results.forEach(die => {
        if (die.result + mod >= tn) {
            r_data.pass += 1
        }else if (die.result == 1) {
            r_data.ones += 1
        }
    });
    if (r_data.pass > r_data.ones && roll._total >= tn) {
        r_data.success = true;
        r_data.raises = Math.floor((roll._total - tn) / 5);
    }
    return r_data;
}

function build_friendly_fire_dialog(data) {
    return `
    <form>
        <div id="data" data-typ="${data.type}" data-atk="${data.attacker}" data-tgt="${data.target}" data-wep="${data.weapon}">
            <h2 style="text-align: center;">Friendly Fire!</h2>
            <p style="text-align: center;">${data.target} is not attacking you!</p>
            <p style="text-align: center;">You can continue but you'll become wanted and have a bounty placed on your head.</p>
            <p style="text-align: center;">Would you like to attack ${data.target}?</p>
        </div>
    </form>
    `;
}

function build_dodge_dialog(data, cards) {
    return `
        <form>
            <div id="data" data-typ="${data.type}" data-atk="${data.attacker}" data-tgt="${data.target}" data-wep="${data.weapon}" data-crd="${cards[0].name}" data-cid="${cards[0]._id}">
                <h2 style="text-align: center;">Incoming Attack!</h2>
                <p style="text-align: center;">${data.attacker} is attacking you!</p>
                <p style="text-align: center;">It'll cost your ${cards[0].name} to vamoose,</p>
                <p style="text-align: center;">would you like to try and dodge?</p>
            </div>
        </form>
    `;
}

function build_damage_dialog(char, data, saved) {
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

function battle_report(data) {
    let msg =  `
        <h2 style="text-align:center">Combat Report:</h2>
    `;
    if (data.type == 'ranged'){
        msg += `
            <p style="text-align:center">${data.attacker} fired their ${data.weapon_name} at ${data.target}</p>
        `;
    }else{
        msg += `
            <p style="text-align:center">${data.attacker} swung their ${data.weapon_name} at ${data.target}</p>
        `;
    }
    if (data.dodge > 0) {
        msg += `
            <p style="text-align:center">${data.target} tries to dodge but can't get out of the way!</p>
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
        }
    },
    request_cards: function(data){
        if (game.user.isGM) {
            let cards = data.amount
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
        if (game.userId == data.user){
            console.log(data);
            let actor = game.actors.getName(data.char);
            console.log(actor);
            let c = Math.random();
            setTimeout(() => {actor.createOwnedItem(data.card)}, c * 100);
        }
    },
    discard_card: function(data) {
        if (game.user.isGM) {
            if (data.name == "Joker (Black)") {
                ChatMessage.create({ content: `
                    <h2 style="text-align: center;">Black Joker!</h2>
                    <p style="text-align: center;">You lose your next highest card.</p>
                    <p style="text-align: center;">The combat deck will be reshuffled at the end of the round.</p>
                    <p style="text-align: center;">The Marshal draws a Fate Chip.</p>
                `});
                game.dc.combat_shuffle = true
            }
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
    check_target: function(data) {
        if (game.user.isGM) {
            console.log('check_target', data);
            let atk = canvas.tokens.placeables.find(i => i.name == data.attacker);
            console.log('check_target: Attacker:', atk);
            let tgt = canvas.tokens.placeables.find(i => i.name == data.target);
            console.log('check_target: Target:', tgt);
            if (atk.data.disposition == -1) {
                emit('attack', data);
            }else if (tgt.data.disposition != -1 && atk.actor.data.type == 'player') {
                emit('warn_law', data);
            }else{
                operations.attack(data);
            }
        }else{
            let char = canvas.tokens.placeables.find(i => i.name == data.target);
            if (char.owner) {
                emit('check_target', data);
            }
        }
    },
    warn_law: function(data) {
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
                                let el = document.getElementById('data');
                                let d = {
                                    type: el.dataset.typ,
                                    attacker: el.dataset.atk,
                                    target: el.dataset.tgt,
                                    weapon: el.dataset.wep,
                                }
                                emit('attack', d);
                            }
                        },
                        no: {
                            label: '[slowly put gun away]',
                            callback: () => {
                                let el = document.getElementById('data');
                                let d = {
                                    type: el.dataset.typ,
                                    attacker: el.dataset.atk,
                                    target: el.dataset.tgt,
                                    weapon: el.dataset.wep,
                                }
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
    attack: function(data) {
        let char = canvas.tokens.placeables.find(i => i.name == data.target);
        if (char.owner) {
            let cards = [];
            for (let item of char.actor.items.values()) {
                if (item.type == 'action_deck') {
                    cards.push(item);
                }
            }
            if (cards.length > 0) {
                let form = new Dialog({
                    title: `Dodge!`,
                    content: build_dodge_dialog(data, sort_deck(cards)),
                    buttons: {
                        yes: {
                            label: 'Dodge',
                            callback: () => {
                                let el = document.getElementById('data');
                                let crd = el.dataset.crd;
                                let cid = el.dataset.cid;
                                let d = {
                                    type: el.dataset.typ,
                                    attacker: el.dataset.atk,
                                    target: el.dataset.tgt,
                                    weapon: el.dataset.wep,
                                }
                                let chr = game.actors.getName(d.target);
                                let trt = chr.data.data.traits.nimbleness;
                                let dge = trt.skills.dodge;
                                let lvl = dge.level;
                                let die = trt.die_type;
                                if (lvl == 0) {
                                    lvl = trt.level;
                                }
                                let frm = `${lvl}${die}ex + ${dge.modifier} + ${chr.data.data.wound_modifier}`;
                                let rll = new Roll(frm).roll();
                                d.dodge = rll._total;
                                chr.deleteOwnedItem(cid);
                                rll.toMessage({rollMode: 'gmroll'});
                                game.socket.emit("system.deadlands_classic", {
                                    operation: 'proceed_attack',
                                    data: d
                                });
                            }
                        },
                        no: {
                            label: 'Take yer chances.',
                            callback: () => {
                                let el = document.getElementById('data');
                                let d = {
                                    type: el.dataset.typ,
                                    attacker: el.dataset.atk,
                                    target: el.dataset.tgt,
                                    weapon: el.dataset.wep,
                                    dodge: 0
                                }
                                game.socket.emit("system.deadlands_classic", {
                                    operation: 'proceed_attack',
                                    data: d
                                });
                            }
                        }
                    },
                    close: () => {
                        console.log('Dodge Dialog Closed');
                    }
                });
                form.render(true);
            }else{
                data.dodge = 0
                emit('proceed_attack', data);
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
            let wound_mod = atk.actor.data.data.wound_modifier;
            if(data.type == 'ranged') {
                let dist = Math.floor(canvas.grid.measureDistance(atk, tgt));
                trait = atk.actor.data.data.traits.deftness;
                skill = trait.skills["shootin_".concat(itm.data.data.gun_type)];
                shots = itm.data.data.chamber;
                range_mod = Math.max(Math.floor(dist / parseInt(itm.data.data.range)), 0);
            }
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
                let atk_mod = trait.modifier + skill.modifier + game.dc.aim_bonus + wound_mod;
                let atk_formula = `${lvl}${trait.die_type}ex + ${trait.modifier} + ${skill.modifier} + ${game.dc.aim_bonus} + ${wound_mod}`
                let atk_roll = new Roll(atk_formula).roll();
                let atk_data = check_roll(atk_roll, data.tn, atk_mod);
                data.result = atk_roll._total;
                atk_roll.toMessage({rollMode: 'gmroll'});
                console.log('proceed_attack: Roll Data:', atk_data);
                if (atk_data.success) {
                    if (atk_roll._total > data.dodge) {
                        //Location roll
                        let loc_roll = new Roll('1d20').roll();
                        loc_roll.toMessage({rollMode: 'gmroll'});
                        let tot = loc_roll._total - 1;
                        let found = [];
                        let range = atk_data.raises * 2
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
                        if (found.includes('noggin')) {
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
                    if (atk_data.ones > atk_data.pass) {
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
            let form = new Dialog({
                title: `You've been hit!`,
                content: build_damage_dialog(char, data, 0),
                buttons: {
                    white: {
                        label: 'White [1]',
                        callback: () => {
                            let val = 1
                            let el = document.getElementById('data');
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc_key = el.dataset.loc_key;
                            let loc_label = el.dataset.loc_label;
                            let soak = el.dataset.soak;
                            let char = game.actors.getName(name);
                            let itemId = false;
                            for (let item of char.items.values()) {
                                if(item.name == 'White' && item.type == 'chip') {
                                    itemId = item._id;
                                }
                            }
                            if (itemId) {
                                char.deleteOwnedItem(itemId);
                                soak += val
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }else{
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }
                        }
                    },
                    red: {
                        label: 'Red [2]',
                        callback: () => {
                            let val = 2
                            let el = document.getElementById('data');
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc_key = el.dataset.loc_key;
                            let loc_label = el.dataset.loc_label;
                            let soak = el.dataset.soak;
                            let char = game.actors.getName(name);
                            let itemId = false;
                            for (let item of char.items.values()) {
                                if(item.name == 'Red' && item.type == 'chip') {
                                    itemId = item._id;
                                }
                            }
                            if (itemId) {
                                char.deleteOwnedItem(itemId);
                                soak += val
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }else{
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }
                        }
                    },
                    blue: {
                        label: 'Blue [3]',
                        callback: () => {
                            let val = 3
                            let el = document.getElementById('data');
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc_key = el.dataset.loc_key;
                            let loc_label = el.dataset.loc_label;
                            let soak = el.dataset.soak;
                            let char = game.actors.getName(name);
                            let itemId = false;
                            for (let item of char.items.values()) {
                                if(item.name == 'Blue' && item.type == 'chip') {
                                    itemId = item._id;
                                }
                            }
                            if (itemId) {
                                char.deleteOwnedItem(itemId);
                                soak += val
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }else{
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }
                        }
                    },
                    legend: {
                        label: 'Legendary [5]',
                        callback: () => {
                            let val = 5
                            let el = document.getElementById('data');
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc_key = el.dataset.loc_key;
                            let loc_label = el.dataset.loc_label;
                            let soak = el.dataset.soak;
                            let char = game.actors.getName(name);
                            let itemId = false;
                            for (let item of char.items.values()) {
                                if(item.name == 'Legendary' && item.type == 'chip') {
                                    itemId = item._id;
                                }
                            }
                            if (itemId) {
                                char.deleteOwnedItem(itemId);
                                soak += val
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }else{
                                game.socket.emit('system.deadlands_classic', {
                                    operation: 'soak', 
                                    data: {
                                        target: name,
                                        wounds: wounds,
                                        loc_key: loc_key,
                                        loc_label: loc_label,
                                        soak: soak
                                    }
                                });
                            }
                        }
                    },
                    take: {
                        label: 'Take Damage.',
                        callback: (html) => {
                            let el = document.getElementById('data');
                            let name = el.dataset.char;
                            let wounds = parseInt(el.dataset.wounds);
                            let loc = el.dataset.loc_key;
                            let char = game.actors.getName(name);
                            console.log('take_damage:', data, char);
                            let current = parseInt(char.data.data.wounds[loc]) || 0;
                            let wind_roll = new Roll(`${wounds}d6`).roll();
                            wind_roll.toMessage({rollMode: 'gmroll'});
                            let w_data = {
                                data: {
                                    wind: {
                                        value: char.data.data.wind.value - wind_roll._total
                                    },
                                    wounds: {
                                        [loc]: current + wounds
                                    }
                                }
                            };
                            char.update(w_data);
                            let highest = 0
                            Object.keys(char.data.data.wounds).forEach(function(key) {
                                if (char.data.data.wounds[key] >= highest) {
                                    highest = char.data.data.wounds[key]
                                }
                            });
                            let m_data = {data: {wound_modifier: highest * -1}}
                            char.update(m_data);
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
            if (data.soak < data.wounds) {
                emit('apply_damage', data);
            }
        }
    }
}

Hooks.on("ready", () => {
    game.dc = {
        combat_active: false,
        action_deck: [],
        action_discard: [],
        aim_bonus: 0,
        level_headed_available: true
    }
    if (game.user.isGM) {
        game.dc.action_deck = new_deck('action_deck');
    };
    console.log("DC | Initializing socket listeners...")
    game.socket.on(`system.deadlands_classic`, (data) => {
        if (data.operation in operations) {
            operations[data.operation](data.data);
            return false;
        }
    });
});