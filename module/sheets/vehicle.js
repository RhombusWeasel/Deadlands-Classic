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
        const data         = super.getData();
        data.config        = CONFIG.dc;
        data.hit_locations = this.actor.data.data.hit_locations;
        data.driver        = this.actor.data.data.driver;
        data.passengers    = this.actor.data.data.passengers.onboard;
        data.owners        = dc_utils.gm.get_online_actors();
        data.melee_weapons = dc_utils.char.items.get(this.actor, "melee");
        data.firearms      = dc_utils.char.items.get(this.actor, "firearm", "gun_type");
        data.goods         = dc_utils.char.items.get(this.actor, "goods");
        return data;
    }

    activateListeners(html) {
        html.find(".edit-toggle").click(this._on_edit_toggle.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".add-passenger").click(this._on_passenger_add.bind(this));
        html.find(".enter-vehicle").click(this._on_enter_vehicle.bind(this));
        html.find(".exit-vehicle").click(this._on_exit_vehicle.bind(this));
        return super.activateListeners(html);
    }

    _on_edit_toggle(event) {
        this.actor.update({data: {show_editor: !(this.actor.data.data.show_editor)}});
    }

    _on_item_open(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        return item.sheet.render(true);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Discard', `${this.actor.name} discards ${item.name}`);
        ChatMessage.create({ content: `
            Discarding ${item.type} ${item.name}
        `});
        dc_utils.char.items.delete(this.actor, itemId);
    }

    _on_passenger_add(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let details = this.actor.data.data.passenger_add
        dc_utils.vehicle.passenger.add_slot(this.actor, details.name, details.driver, details.gunner);
    }

    _on_enter_vehicle(event) {
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        let char = game.user.character;
        dc_utils.vehicle.passenger.enter(this.actor, char, index);
    }

    _on_exit_vehicle(event) {
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        dc_utils.vehicle.passenger.exit(this.actor, index);
    }
}