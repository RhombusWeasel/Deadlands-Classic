export default class MerchantSheet extends PlayerSheet {
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
        const data         = super.getData();
        console.log(data);
    }

}