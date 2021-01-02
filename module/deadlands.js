import {dc} from "./config.js"
import item_sheet from "./sheets/item.js";
import actor_sheet from "./sheets/actor.js"
import marshal_sheet from "./sheets/gm.js"
import mook_sheet from "./sheets/mook.js"

async function preload_handlebars_templates() {
    const template_paths = [
        "systems/deadlands_classic/templates/partials/core.hbs",
        "systems/deadlands_classic/templates/partials/mook-core.hbs",
        "systems/deadlands_classic/templates/partials/sidebar.hbs",
        "systems/deadlands_classic/templates/partials/mook-sidebar.hbs",
        "systems/deadlands_classic/templates/partials/traits.hbs"
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
    Actors.registerSheet("deadlands_classic", marshal_sheet, { makeDefault: false});
    Actors.registerSheet("deadlands_classic", mook_sheet, { makeDefault: false});

    Handlebars.registerHelper('lvl_head', function (options) {
        if (!(game.user.isGM)) {
            let act_data = game.actors.get(game.user.data.character);
            if (act_data.items.filter(function (item) {return item.type == "edge" && item.name == "Level Headed"}).length > 0){
                if (game.dc.level_headed_available == true) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
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