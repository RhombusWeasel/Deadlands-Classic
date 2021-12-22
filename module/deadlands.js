import {dc} from "./config.js"
import item_sheet from "./sheets/item.js";
import actor_sheet from "./sheets/actor.js"
import generator_sheet from "./sheets/generator.js"
import marshal_sheet from "./sheets/gm.js"
import mook_sheet from "./sheets/mook.js"
import vehicle_sheet from "./sheets/vehicle.js"
import merchant_sheet from "./sheets/merchant.js"

async function preload_handlebars_templates() {
    const template_paths = [
        "systems/deadlands_classic/templates/partials/reuseable/deck.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip_mods.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip_opts.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/fate-chips.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/merchant_item.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/skill-dropdown.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/trade-sell.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/trade-buy.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/wound_location.hbs",
        "systems/deadlands_classic/templates/partials/tabs/chi.hbs",
        "systems/deadlands_classic/templates/partials/tabs/combat.hbs",
        "systems/deadlands_classic/templates/partials/tabs/core.hbs",
        "systems/deadlands_classic/templates/partials/tabs/description.hbs",
        "systems/deadlands_classic/templates/partials/tabs/favor.hbs",
        "systems/deadlands_classic/templates/partials/tabs/goods.hbs",
        "systems/deadlands_classic/templates/partials/tabs/gm.hbs",
        "systems/deadlands_classic/templates/partials/tabs/gm-combat.hbs",
        "systems/deadlands_classic/templates/partials/tabs/gm-quest.hbs",
        "systems/deadlands_classic/templates/partials/tabs/hexes.hbs",
        "systems/deadlands_classic/templates/partials/tabs/miracles.hbs",
        "systems/deadlands_classic/templates/partials/tabs/science.hbs",
        "systems/deadlands_classic/templates/partials/tabs/merchant.hbs",
        "systems/deadlands_classic/templates/partials/tabs/traits.hbs",
        "systems/deadlands_classic/templates/partials/tabs/vehicle-goods.hbs",
        "systems/deadlands_classic/templates/partials/generator-core.hbs",
        "systems/deadlands_classic/templates/partials/generator-traits.hbs",
        "systems/deadlands_classic/templates/partials/generator-sidebar.hbs",
        "systems/deadlands_classic/templates/partials/mook-core.hbs",
        "systems/deadlands_classic/templates/partials/mook-traits.hbs",
        "systems/deadlands_classic/templates/partials/mook-sidebar.hbs",
        "systems/deadlands_classic/templates/sheets/poker/partials/gm-poker-opts.hbs"
    ]
    return loadTemplates(template_paths)
}

Hooks.once("init", function () {
    console.log("DC | Initializing Deadlands Classic.");

    CONFIG.dc = dc;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("deadlands_classic", item_sheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("deadlands_classic", actor_sheet, { makeDefault: true});
    Actors.registerSheet("deadlands_classic", generator_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", marshal_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", mook_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", vehicle_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", merchant_sheet, { makeDefault: false});

    game.settings.register('deadlands_classic', 'combat_active', {
        name: 'Combat Active',
        scope: 'world',     // "world" = sync to db, "client" = local storage 
        config: false,       // false if you dont want it to show in module config
        type: Boolean,       // Number, Boolean, String,  
        default: false,
        onChange: value => {
            console.log('Combat Active: ', value);
        }
    });

    game.settings.register('deadlands_classic', 'updated_unskilled_checks', {
        name: 'Revised Skill Checks',
        hint: 'Unskilled checks (1 trait die, -4)',
        scope: 'world',
        config: true,
        type: Boolean,  
        default: false,
        onChange: value => {
            console.log('Updated unskilled checks: ', value);
        }
    });

    game.settings.register('deadlands_classic', 'chip_bounty', {
        name: 'Bounty:',
        hint: 'Fate chips can be traded by players for Bounty Points.',
        scope: 'world',
        config: true,
        type: Boolean,  
        default: false,
        onChange: value => {
            console.log('Fate chips give Bounty Points: ', value);
        }
    });

    game.settings.register('deadlands_classic', 'unixtime', {
        name: 'Unix time for the campaign.',
        scope: 'world',
        config: false,
        type: Number,
        default: -299790720000,
        onChange: value => {
            console.log('Unix time updated: ', value);
        }
    });

    Handlebars.registerHelper('chip_bounty', function (options) {
        if (game.settings.get('deadlands_classic', 'chip_bounty')) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('if_has', function (type, val, options) {
        let act = game.actors.get(options.data.root.id);
        if (dc_utils.char.has(act, type, val)) {
            return options.fn(this);
        }
    });

    Handlebars.registerHelper('if_equipped', function (slot, id, options) {
        let act = dc_utils.get_actor(options.data.root.actor.name);
        if (dc_utils.char.items.is_equipped(act, slot, id)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('has_joker', function (deck, options) {
        let act = dc_utils.get_actor(options.data.root.actor.name);
        let hand = dc_utils.char.items.get(act, deck);
        for (const card of hand) {
            let val = dc_utils.deck.get_card_value(card)
            if (val == 'Jo') {
                return options.fn(this);
            }
        }
    });

    Handlebars.registerHelper('is_one_handed', function(options) {
        let act = dc_utils.get_actor(options.data.root.actor.name);
        let item = act.items.get(act.data.data.equipped.dominant);
        if (act.data.data.equipped.dominant == 'Nuthin' || item?.data?.data?.multi_slot == false) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('lvl_head', function (options) {
        if (!(game.user.isGM)) {
            let act_data = game.actors.get(game.user.data.character);
            if (act_data.items.filter(function (item) {return item.type == "edge" && item.name == "Level Headed"}).length > 0){
                if (act_data.data.data.perks.level_headed == true) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('has_bounty', function (val, type, options) {
        if (!(game.user.isGM)) {
            let v = parseInt(val);
            let cost = v + 1;
            if (type == 'trait' || (type == 'skill' && v >= 5)){
                cost = cost * 2
            }
            let act_data = game.actors.get(game.user.data.character);
            if (act_data.data.data.bounty.value >= cost){
                return options.fn(this);
            }
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('die_upgrade', function (val, options) {
        // This needs fixing so it checks at the start for the d12 and calculates cost based on the characters modifier.
        if (!(game.user.isGM)) {
            let upgrades = {
                d4:  {next: "d6", cost: 18},
                d6:  {next: "d8", cost: 24},
                d8:  {next: "d10", cost: 30},
                d10: {next: "d12", cost: 36},
                d12: {next: "d12+2", cost: 40},
            };
            let cost = upgrades[val].cost
            let act_data = game.actors.get(game.user.data.character);
            if (act_data.data.data.bounty.value >= cost){
                return options.fn(this);
            }
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('hex_bounty', function (val, options) {
        if (!(game.user.isGM)) {
            let v = parseInt(val);
            let cost = v + 1;
            if(v >= 5){
                cost *= 2;
            }
            let act_data = game.actors.get(game.user.data.character);
            if (act_data.data.data.bounty.value >= cost){
                return options.fn(this);
            }
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('wound_timer', function (val, options) {
        let date = game.settings.get('deadlands_classic', 'unixtime');
        return Math.floor((((((val - date) / 1000)/ 60)/ 60)/ 24));
    });

    Handlebars.registerHelper('location_name', function (val, options) {
        return dc_utils.locations[dc_utils.loc_lookup.indexOf(val)]
    });

    Handlebars.registerHelper('location_data', function (tab, loc, options) {
        let act = dc_utils.get_actor(options.data.root.actor.name);
        return act.data.data[tab][loc];
    });

    Handlebars.registerHelper('strain_max', function (vig, options) {
        return vig.die_type.substring(1, vig.die_type.length);
    });

    Handlebars.registerHelper('isGM', function (options) {
        if (game.user.isGM) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('combat_active', function (name, options) {
        let act = dc_utils.get_actor(name);
        return act.data.data.action_cards[0] ? act.data.data.action_cards[0].name : '-';
    });

    Handlebars.registerHelper('check_combat', function (options) {
        let ca = game.settings.get('deadlands_classic', 'combat_active')
        if (ca == true) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('isDriver', function (vehicle, options) {
        let onboard = vehicle.actor.data.data.passengers.onboard;
        if (game.user.isGM) return options.fn(this);
        for (let i = 0; i < onboard.length; i++) {
            const pos = onboard[i].driver;
            if (pos) {
                if (game.user.character.name == onboard[i].character) {
                    return options.fn(this);
                }
                return options.inverse(this);
            }
        }
    });

    Handlebars.registerHelper('isGunner', function (vehicle, options) {
        let onboard = vehicle.actor.data.data.passengers.onboard;
        if (game.user.isGM) return options.fn(this);
        for (let i = 0; i < onboard.length; i++) {
            const pos = onboard[i].gunner;
            if (pos) {
                if (game.user.character.name == onboard[i].character) {
                    return options.fn(this);
                }
                return options.inverse(this);
            }
        }
    });

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    Handlebars.registerHelper("sum", function(lvalue, operator, rvalue, options) {
        if (typeof(lvalue) == 'string') {
            lvalue = parseFloat(lvalue.slice(1, lvalue.length));
        }else {
            lvalue = parseFloat(lvalue);
        }
        rvalue = parseFloat(rvalue);
        return {
            "+": `$${(lvalue + rvalue).toFixed(2)}`,
            "-": `$${(lvalue - rvalue).toFixed(2)}`,
            "*": `$${(lvalue * rvalue).toFixed(2)}`,
            "/": `$${(lvalue / rvalue).toFixed(2)}`,
            "%": `$${(lvalue % rvalue).toFixed(2)}`,
        }[operator];
    });

    preload_handlebars_templates();
});

Hooks.on('preCreateToken', function (document, createData, options, userId) {
    let act = game.actors.getName(document.name);
    let name
    if (act.data.data.random_name == true) {
        let eth = act.data.data.ethnicity;
        if (act.data.data.male_names && act.data.data.female_names) {
            let rn = Math.random();
            name = dc_utils.char.random_name(eth, 'male');
            if (rn > 0.5) {
                name = dc_utils.char.random_name(eth, 'female');
            }
        }else if(act.data.data.female_names) {
            name = dc_utils.char.random_name(eth, 'female');
        }else{
            name = dc_utils.char.random_name(eth, 'male');
        }
        document.data.update({name: name});
        // This is stupid and wrong, don't be like me.
        setTimeout(() => {
            canvas.tokens.placeables.find(i => i.name == name).document.actor.update({name: name});
        }, 500);
    }
});

Hooks.on('dropActorSheetData', function(actor, sheet, data) {
    if (data.type == 'Item') {
        let item = game.items.get(data.id);
        let stackable = ['goods', 'components']
        if (stackable.includes(item.type)) {
            let found_item = actor.items.filter(function (i) {return i.name == item.name});
            let numParse = parseInt;
            if (found_item[0].data.data.is_float) {
                numParse = parseFloat;
            }
            let has = numParse(found_item[0].data.data.amount);
            let amt = numParse(item.data.data.amount);
            if (found_item.length > 0) {
                found_item[0].update({data: {amount: has + amt}});
                return false;
            }
        }
    }
});