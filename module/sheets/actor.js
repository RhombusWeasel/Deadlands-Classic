export default class PlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/player-sheet.html`,
            classes: ["player-sheet"]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.firearms = data.items.filter(function (item) {return item.type == "firearm"});
        data.melee_weapons = data.items.filter(function (item) {return item.type == "melee"});
        data.miracles = data.items.filter(function (item) {return item.type == "miracle"});
        data.hexes = data.items.filter(function (item) {return item.type == "hex"});
        data.favors = data.items.filter(function (item) {return item.type == "favor"});
        data.hinderances = data.items.filter(function (item) {return item.type == "hinderance"});
        data.edges = data.items.filter(function (item) {return item.type == "edge"});

        return data;
    }

    // activateListeners(html) {
    //     html.find(".inline-edit").change(this._on_entry_change.bind(this))
    //     return super.activateListeners(html);
    // }

    // _on_entry_changed(event) {
    //     event.preventDefault();
    //     let element = event.currentTarget;
    //     let itemId = element.closest(".item").dataset.itemId;
    //     let item = this.actor.getOwnedItem(itemId);
    //     let field = element.dataset.field;

    //     return item.update({ [field]: element.value });
    // }
}