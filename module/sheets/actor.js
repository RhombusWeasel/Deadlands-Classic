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

    activateListeners(html) {
        html.find(".info-button").click(this._on_item_open.bind(this));
        return super.activateListeners(html);
    }

    _on_item_open(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        console.log(element.closest(".item").dataset)
        let item = this.actor.getOwnedItem(itemId);
        item.sheet.render(true);
    }
}