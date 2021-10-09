export default class VehicleSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/player-sheet.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "combat" }],
            width: 500,
            height: 700
        });
    }

    getData() {
        const data     = super.getData();
        data.config    = CONFIG.dc;
        data.hit_locations = this.actor.data.data.hit_locations;
        data.driver = this.actor.data.data.driver;
        data.passengers = this.actor.data.data.passengers.onboard;
        return data;
    }

    activateListeners(html) {
        //html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        //html.find(".item-delete").click(this._on_remove_modifier.bind(this));
        return super.activateListeners(html);
    }

    
}