export default class DCVehicle extends ActorSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/actor/vehicle.html`;
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