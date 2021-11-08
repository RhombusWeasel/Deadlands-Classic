import actor_sheet from "./actor.js"
export default class MerchantSheet extends actor_sheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/player-sheet.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "merchant" }],
            width: 500,
            height: 700
        });
    }

    getData() {
        const data         = super.getData();
        data.sell_list     = this.actor.data.data.sell_list;
        return data;
    }

    activateListeners(html) {
        // Buttons:

        // Return Listeners
        return super.activateListeners(html);
    }

}