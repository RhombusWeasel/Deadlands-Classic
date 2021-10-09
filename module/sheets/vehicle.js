export default class VehicleSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/vehicle.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "passengers" }],
            width: 500,
            height: 665
        });
    }

    getData() {
        const data     = super.getData();
        data.config    = CONFIG.dc;
        data.hit_locations = this.actor.data.data.hit_locations;
        data.driver = this.actor.data.data.driver;
        data.passengers = this.actor.data.data.passengers.onboard;
        data.melee_weapons = dc_utils.char.items.get(this.actor, "melee");
        data.firearms = dc_utils.char.items.get(this.actor, "firearm", "gun_type");
        data.goods = dc_utils.char.items.get(this.actor, "goods");
        return data;
    }

    activateListeners(html) {
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        return super.activateListeners(html);
    }

    
}