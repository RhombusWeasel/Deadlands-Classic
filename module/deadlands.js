import {dc} from "./config.js"
import item_sheet from "./sheets/item.js";
import actor_sheet from "./sheets/actor.js"
import generator_sheet from "./sheets/generator.js"
import marshal_sheet from "./sheets/gm.js"
import mook_sheet from "./sheets/mook.js"

async function preload_handlebars_templates() {
    const template_paths = [
        "systems/deadlands_classic/templates/partials/reuseable/deck.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip_mods.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip_opts.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/equip.hbs",
        "systems/deadlands_classic/templates/partials/reuseable/fate-chips.hbs",
        "systems/deadlands_classic/templates/partials/tabs/combat.hbs",
        "systems/deadlands_classic/templates/partials/tabs/core.hbs",
        "systems/deadlands_classic/templates/partials/tabs/description.hbs",
        "systems/deadlands_classic/templates/partials/tabs/favor.hbs",
        "systems/deadlands_classic/templates/partials/tabs/goods.hbs",
        "systems/deadlands_classic/templates/partials/tabs/hexes.hbs",
        "systems/deadlands_classic/templates/partials/tabs/miracles.hbs",
        "systems/deadlands_classic/templates/partials/tabs/traits.hbs",
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

function get_token_count(t) {
    let count = 0;
    let tokens = canvas.tokens.placeables;
    if (tokens) {
        tokens.forEach(tkn => {
            if (tkn.name.search(t.name) != -1) {
                count += 1;
            }
        });
    }
    return count;
}

Hooks.once("init", function () {
    console.log("DC | Initializing Deadlands Classic.");

    CONFIG.dc = dc;

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("deadlands_classic", item_sheet, { makeDefault: true});

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("deadlands_classic", actor_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", generator_sheet, { makeDefault: true});
    Actors.registerSheet("deadlands_classic", marshal_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", mook_sheet, { makeDefault: false});

    game.settings.register('deadlands_classic', 'combat_active', {
        name: 'Combat Active',
        scope: 'world',     // "world" = sync to db, "client" = local storage 
        config: false,       // false if you dont want it to show in module config
        type: Boolean,       // Number, Boolean, String,  
        default: false,
        onChange: value => {
          console.log('Combat Active: ', value)
        }
    });

    game.settings.register('deadlands_classic', 'updated_unskilled_checked', {
        name: 'Combat Active',
        scope: 'world',
        config: true,
        type: Boolean,  
        default: false,
        onChange: value => {
          console.log('Updated unskilled checks: ', value)
        }
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
        if (item?.data?.data?.multi_slot == false) {
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

    Handlebars.registerHelper('isGM', function (options) {
        if (game.user.isGM) {
            return options.fn(this);
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
            default:
                return options.inverse(this);
        }
    });

    preload_handlebars_templates();
});

Hooks.on('preCreateToken', function (document, createData, options, userId) {
    let act = game.actors.getName(document.name);
    if (!(act.hasPlayerOwner)) {
        let same = canvas.tokens.placeables.find(i => i.data.actorId == arguments[1].actorId);
        let amt = get_token_count(act);
        document.data.update({name: createData.name += ` ${amt}`});
    }
});

Hooks.on('hoverToken', function () {
    if (game.user.isGM) {
        let tkn = arguments[0]
        if (tkn?.data?.data?.name != tkn?.document?.actor?.name && !(tkn?.document?.actor?.hasPlayerOwner)) {
            tkn.document.actor.update({name: tkn.data.name});
        }
    }
});