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
        html.find(".item-sell").click(this._on_item_sell.bind(this));
        html.find(".item-sell-remove").click(this._on_item_sell_remove.bind(this));
        html.find(".set-base-cost").change(this._on_set_base_cost.bind(this));
        // Return Listeners
        return super.activateListeners(html);
    }

    _on_item_sell(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        let sale_list = this.actor.data.data.sale_list;
        sale_list.push({
            name: item.name,
            type: item.type,
            data: item.data.data
        });
        this.actor.update({data: {sale_list: sale_list}});
    }

    _on_item_sell_remove(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.index;
        let sale_list = this.actor.data.data.sale_list;
        sale_list.splice(index, 1);
        this.actor.update({data: {sale_list: sale_list}});
    }

    _on_set_base_cost(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.index;
        let sale_list = this.actor.data.data.sale_list;
        sale_list[index].data.cost = element.value;
        this.actor.update({data: {sale_list: sale_list}});
    }
}

class Merchant extends FormApplication{
    constructor(shop, cust) {
        super();
        this.shop = shop;
        this.cust = cust;
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['doc'],
            popOut: true,
            template: `systems/deadlands_classic/templates/sheets/poker/poker.html`,
            id: 'poker-app',
            title: 'Poker',
            width: 800,
            height: 600,
        });
    }
  
    getData() {
        // Return data to the template
        let data = super.getData();
        data.shop = this.shop;
        data.cust = this.cust;
        return data;
    }
  
    activateListeners(html) {
        //html.find(".add-player").click(this._on_add_player.bind(this));
        return super.activateListeners(html);
    }
}

Hooks.on('controlToken', function(token, bool) {
    if (token.document.actor.type == 'merchant') {
        if (!(game.user.isGM)) {
            let merchant = new Merchant(token, game.user.character).render(true);
        }
    }
});