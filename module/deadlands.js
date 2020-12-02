import {dc} from "./config.js"
import item_sheet from "./sheets/item.js";
import actor_sheet from "./sheets/actor.js"

async function preload_handlebars_templates() {
    const template_paths = [
        "systems/deadlands_classic/templates/partials/core.hbs",
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

    preload_handlebars_templates();
});