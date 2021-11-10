import actor_sheet from "./actor.js"
export default class MerchantSheet extends actor_sheet {
    static get defaultOptions() {
        if (!(game.user.isGM)) {
            return mergeObject(super.defaultOptions, {
                template: `systems/deadlands_classic/templates/sheets/merchant.html`,
                classes: ["player-sheet", "doc"],
                width: 800,
                height: 600
            });
        }else{
            return mergeObject(super.defaultOptions, {
                template: `systems/deadlands_classic/templates/sheets/actor/player-sheet.html`,
                classes: ["player-sheet", "doc"],
                tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "merchant" }],
                width: 500,
                height: 700
            });
        }
    }

    getData() {
        const data         = super.getData();
        data.sale_list     = this.actor.data.data.sale_list;
        data.buy_modifier  = this.actor.data.data.buy_modifier;
        if (!(game.user.isGM)) {
            let p_name = game.user.character.id;
            data.customers = this.actor.data.data.customers;
            this._check_existing_customer(game.user.character);
            data.current_trade = data.customers[p_name].current.trade;
            // Get the players items
            data.cust_melee    = dc_utils.char.items.get(game.user.character, 'melee');
            data.cust_guns     = dc_utils.char.items.get(game.user.character, 'firearm', 'gun_type');
            data.cust_goods    = dc_utils.char.items.get(game.user.character, 'goods');
            // Filter for items the merchant buys
            data.cust_melee    = data.cust_melee.filter(pl_item => data.sale_list.some(buy_itm => pl_item.name == buy_itm.name));
            data.cust_guns     = data.cust_guns.filter(pl_item => data.sale_list.some(buy_itm => pl_item.name == buy_itm.name));
            data.cust_goods    = data.cust_goods.filter(pl_item => data.sale_list.some(
                buy_itm => pl_item.name == buy_itm.name && (
                buy_itm.data.boxed_multiple && pl_item.data.data.amount >= buy_itm.data.box_amount
            )));
            // Filter for items in the current trade
            data.cust_melee   = data.cust_melee.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item._id == buy_itm._id));
            data.cust_guns    = data.cust_guns.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item._id == buy_itm._id));
            data.cust_goods   = data.cust_goods.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item._id == buy_itm._id));
        }
        return data;
    }

    activateListeners(html) {
        // Clicks:
        html.find(".item-sell").click(this._on_item_sell.bind(this));
        html.find(".item-sell-remove").click(this._on_item_sell_remove.bind(this));
        html.find(".buy-item").click(this._on_buy_item.bind(this));
        html.find(".remove-buy-item").click(this._on_remove_buy_item.bind(this));
        html.find(".sell-item").click(this._on_sell_item.bind(this));
        html.find(".remove-sell-item").click(this._on_remove_sell_item.bind(this));
        // Changes:
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

    _on_buy_item(event) {
        // Player clicks buy button so we add this to the merchants trade BUY list
        event.preventDefault();
        let element = event.currentTarget;
        let itemId  = element.closest(".item").dataset.id;
        let trade   = this.actor.data.data.customers;
        let item    = this.actor.items.get(itemId);
        trade[game.user.character.id].current.trade.buy.push(item);
        trade[game.user.character.id].current.trade.total = this._calculate_trade(game.user.character);
        console.log('Buy Item: ', trade);
        this.actor.update({data: {customers: trade}});
    }

    _on_remove_buy_item(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index   = element.closest(".item").dataset.index;
        let trade   = this.actor.data.data.customers;
        trade[game.user.character.id].current.trade.buy.splice(index, 1);
        trade[game.user.character.id].current.trade.total = this._calculate_trade(game.user.character);
        console.log('Remove Buy Item: ', trade);
        this.actor.update({data: {customers: trade}});
    }

    _on_sell_item(event) {
        // Player clicks sell button so we add this to the merchants trade SELL list
        event.preventDefault();
        let element = event.currentTarget;
        let itemId  = element.closest(".item").dataset.id;
        let trade   = this.actor.data.data.customers;
        let item    = game.user.character.items.get(itemId);
        trade[game.user.character.id].current.trade.sell.push(item);
        trade[game.user.character.id].current.trade.total = this._calculate_trade(game.user.character);
        console.log('Sell Item: ', trade);
        this.actor.update({data: {customers: trade}});
    }

    _on_remove_sell_item(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index   = element.closest(".item").dataset.index;
        let trade   = this.actor.data.data.customers;
        trade[game.user.character.id].current.trade.sell.splice(index, 1);
        trade[game.user.character.id].current.trade.total = this._calculate_trade(game.user.character);
        console.log('Remove Sell Item: ', trade);
        this.actor.update({data: {customers: trade}});
    }

    _check_existing_customer(act) {
        let p_name = act.id;
        let customers = this.actor.data.data.customers;
        let exists = Object.keys(customers).includes(p_name);
        console.log(exists);
        if (!(exists)) {
            this._add_customer(act);
            console.log(`${this.actor.name} created customer data for ${act.name}`);
        }
    }

    _new_trade() {
        return {
            open: Math.floor(Date.now() / 1000),
            trade: {
                buy: [],
                sell: [],
                total: 0
            }
        }
    }

    _add_customer(act) {
        let customers = this.actor.data.data.customers
        customers[act.id] = {
            opinion: 0,
            current: this._new_trade(),
        }
        this.actor.update({data: {customers: customers}});
    }

    _reset_trade(act) {
        let p_name = act.id;
        let customers = this.actor.data.data.customers;
        customers[p_name].current = this._new_trade();
        this.actor.update({data: {customers: customers}});
    }

    _calculate_trade(act) {
        let t = 0;
        let p_name = act.id;
        let customers = this.actor.data.data.customers;
        for (let i = 0; i < customers[p_name].current.trade.sell.length; i++) {
            const item = customers[p_name].current.trade.sell[i];
            let price  = parseFloat(item.data.cost.slice(1, item.data.cost.length));
            t -= (price * this.actor.data.data.buy_modifier);
        }
        for (let i = 0; i < customers[p_name].current.trade.buy.length; i++) {
            const item = customers[p_name].current.trade.buy[i];
            let price  = parseFloat(item.data.cost.slice(1, item.data.cost.length));
            t += price;
        }
        return t;
    }
}