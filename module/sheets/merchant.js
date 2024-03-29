import actor_sheet from "./actor.js"
export default class MerchantSheet extends actor_sheet {
    static get defaultOptions() {
        if (!(game.user.isGM)) {
            return mergeObject(super.defaultOptions, {
                template: `systems/deadlands_classic/templates/sheets/merchant.html`,
                classes: ["player-sheet", "doc"],
                width: 800,
                height: 670
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
        data.cash          = this.actor.data.data.cash;
        if (!(game.user.isGM)) {
            let p_name = game.user.character.id;
            data.buy_modifier    = this.actor.data.data.buy_modifier;
            data.player_cash     = game.user.character.data.data.cash;
            data.customers       = this.actor.data.data.customers;
            this._check_existing_customer(game.user.character);
            data.current_trade   = data.customers[p_name].current.trade;
            // Get the players items
            data.cust_melee      = dc_utils.char.items.get(game.user.character, 'melee');
            data.cust_guns       = dc_utils.char.items.get(game.user.character, 'firearm', 'gun_type');
            data.cust_goods      = dc_utils.char.items.get(game.user.character, 'goods');
            data.cust_components = dc_utils.char.items.get(game.user.character, 'components');
            data.cust_lit        = dc_utils.char.items.get(game.user.character, 'literature');
            // Filter for items the merchant buys
            data.cust_melee      = data.cust_melee.filter(pl_item => data.melee_weapons.some(buy_itm => pl_item.name == buy_itm.name && buy_itm.data.data.will_buy));
            data.cust_guns       = data.cust_guns.filter(pl_item => data.firearms.some(buy_itm => pl_item.name == buy_itm.name && buy_itm.data.data.will_buy));
            data.cust_goods      = data.cust_goods.filter(pl_item => data.goods.some(buy_itm => pl_item.name == buy_itm.name && buy_itm.data.data.will_buy));
            data.cust_components = data.cust_components.filter(pl_item => data.components.some(buy_itm => pl_item.name == buy_itm.name && buy_itm.data.data.will_buy));
            data.cust_lit        = data.cust_lit.filter(pl_item => data.documents.some(buy_itm => pl_item.name == buy_itm.name && buy_itm.data.data.will_buy));
            // Filter for items in the current trade
            data.cust_melee      = data.cust_melee.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item.id == buy_itm.id));
            data.cust_guns       = data.cust_guns.filter(pl_item  => !data.current_trade.sell.some(buy_itm => pl_item.id == buy_itm.id));
            data.cust_goods      = data.cust_goods.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item.id == buy_itm.id));
            data.cust_components = data.cust_components.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item.id == buy_itm.id));
            data.cust_lit        = data.cust_lit.filter(pl_item => !data.current_trade.sell.some(buy_itm => pl_item.id == buy_itm.id));
            // Remove items we don't sell
            data.melee_weapons   = data.melee_weapons.filter(i => i.data.data.will_sell == true);
            data.firearms        = data.firearms.filter(i => i.data.data.will_sell == true);
            data.goods           = data.goods.filter(i => i.data.data.will_sell == true);
            data.components      = data.components.filter(i => i.data.data.will_sell == true);
            data.documents       = data.documents.filter(i => i.data.data.will_sell == true);
        }
        return data;
    }

    activateListeners(html) {
        // Clicks:
        // GM Sheet:
        html.find(".buy-toggle").click(this._on_toggle_buy.bind(this));
        html.find(".sell-toggle").click(this._on_toggle_sell.bind(this));
        html.find(".limit-toggle").click(this._on_toggle_limit.bind(this));
        // Player Sheet:
        html.find(".buy-item").click(this._on_buy_item.bind(this));
        html.find(".remove-buy-item").click(this._on_remove_buy_item.bind(this));
        html.find(".sell-item").click(this._on_sell_item.bind(this));
        html.find(".remove-sell-item").click(this._on_remove_sell_item.bind(this));
        html.find(".cancel-trade").click(this._reset_trade.bind(this));
        html.find(".confirm-trade").click(this._process_trade.bind(this));
        // Changes:
        html.find(".set-base-cost").change(this._on_set_base_cost.bind(this));
        // Return Listeners
        return super.activateListeners(html);
    }

    _on_toggle_buy(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.random_update(item, {data: {will_buy: !item.data.data.will_buy}});
    }

    _on_toggle_sell(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.random_update(item, {data: {will_sell: !item.data.data.will_sell}});
    }

    _on_toggle_limit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.random_update(item, {data: {limit_stock: !item.data.data.limit_stock}});
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
        let element  = event.currentTarget;
        let itemId   = element.closest(".item").dataset.id;
        let trade    = this.actor.data.data.customers[game.user.character.id];
        let item     = this.actor.items.get(itemId);
        let parseAmt = (item?.data?.data?.is_float) && parseInt || parseFloat;
        let found    = false;
        if (trade.current.trade.buy.length > 0) {
            trade.current.trade.buy.forEach(existing => {
                if (found == false) {
                    if (existing.name == item.name) {
                        existing.amount = parseAmt(item.data.data.amount) + parseAmt(existing.amount);
                        let t = ((parseFloat(item.data.data.cost.slice(1, item.data.data.cost.length)) / item.data.data.box_amount) * this.actor.data.data.sell_modifier) * existing.amount;
                        let total = `$${t.toFixed(2)}`
                        existing.total  = total;
                        found = true;
                    }
                }
            });
        }
        if(found == false) {
            let t = ((parseFloat(item.data.data.cost.slice(1, item.data.data.cost.length)) / item.data.data.box_amount) * this.actor.data.data.sell_modifier) * parseAmt(item.data.data.amount);
            let total = `$${t.toFixed(2)}`
            trade.current.trade.buy.push({
                id: item.id,
              name: item.name,
              type: item.type,
            amount: parseAmt(item.data.data.amount),
             total: total,
              data: item.data.data
            });
        }
        trade.current.trade.total = this._calculate_trade(trade);
        this.actor.update({data: {customers: {[game.user.character.id]: trade}}});
    }

    _on_remove_buy_item(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index   = element.closest(".item").dataset.index;
        let trade   = this.actor.data.data.customers[game.user.character.id];
        trade.current.trade.buy.splice(index, 1);
        trade.current.trade.total = this._calculate_trade(trade);
        this.actor.update({data: {customers: {[game.user.character.id]: trade}}});
    }

    _on_sell_item(event) {
        // Player clicks sell button so we add this to the merchants trade SELL list
        event.preventDefault();
        let element = event.currentTarget;
        let itemId  = element.closest(".item").dataset.id;
        let trade   = this.actor.data.data.customers[game.user.character.id];
        let item    = game.user.character.items.get(itemId);
        this._confirm_amount(trade, game.user.character, item, this.actor.name);
    }

    _on_remove_sell_item(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index   = element.closest(".item").dataset.index;
        let trade   = this.actor.data.data.customers[game.user.character.id];
        trade.current.trade.sell.splice(index, 1);
        trade.current.trade.total = this._calculate_trade(trade);
        this.actor.update({data: {customers: {[game.user.character.id]: trade}}});
    }

    _check_existing_customer(act) {
        let p_name = act.id;
        let customers = this.actor.data.data.customers;
        let exists = Object.keys(customers).includes(p_name);
        if (!(exists)) {
            this._add_customer(act);
        }
    }

    _new_trade() {
        return {
            open: Math.floor(Date.now() / 1000),
            trade: {
                buy: [],
                sell: [],
                total: "$0.00"
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

    _reset_trade(event) {
        let p_name    = game.user.character.id;
        let customers = this.actor.data.data.customers;
        customers[p_name].current = this._new_trade();
        this.actor.update({data: {customers: customers}});
        this.render(true);
    }

    _process_trade(event) {
        let p_name    = game.user.character.id;
        let customers = this.actor.data.data.customers;
        let trade     = customers[p_name];
        let total     = this._calculate_trade(trade);
        let p_cash    = game.user.character.data.data.cash;
        let t_cash    = total.slice(1, total.length);
        if (p_cash > t_cash) {
            this.generate_receipt(trade);
            total = total.slice(1, total.length);
            for (let b = 0; b < trade.current.trade.buy.length; b++) {
                const item = trade.current.trade.buy[b];
                this.add(game.user.character, item);
            }
            for (let s = 0; s < trade.current.trade.sell.length; s++) {
                const item = trade.current.trade.sell[s];
                this.remove(game.user.character, item, item.amount);
            }
            customers[p_name].current = this._new_trade();
            this.actor.update({data: {customers: customers}});
            game.user.character.update({data: {cash: parseFloat((p_cash - t_cash).toFixed(2))}});
        }
        setTimeout(() => {this.render(true)}, 1100);
    }

    _confirm_amount(trade, act, item, target) {
        if (item.type == 'melee' || item.type == 'firearm' || item.data.data.amount == 1) {
            trade.current.trade.sell.push({
                    id: item.id,
                  name: item.name,
                  type: item.type,
                amount: 1,
                 total: item.data.data.cost,
                  data: item.data.data
            });
            trade.current.trade.total = this._calculate_trade(trade);
            this.actor.update({data: {customers: {[act.id]: trade}}});
            return true;
        }
        let dialog = new Dialog({
            title: `Confirm Amount`,
            content: `
                <div class="center">
                    <h1>Select Amount</h1>
                    <input type="range" min="0" max="${item.data.data.amount}" value="0" class="slider" name="amount-slider" oninput="this.nextElementSibling.value = this.value"/>
                    <output>0</output>
                </div>
            `,
            buttons: {
                send: {
                    label: `Sell ${item.name} to ${target}`,
                    callback: (html) => {
                        let amount = html.find('[name="amount-slider"]')[0].value;
                        trade.current.trade.sell.push({
                                id: item.id,
                              name: item.name,
                              type: item.type,
                            amount: amount,
                             total: item.data.data.cost,
                              data: item.data.data
                        });
                        trade.current.trade.total = this._calculate_trade(trade);
                        this.actor.update({data: {customers: {[act.id]: trade}}});
                        return true;
                    }
                }
            }
        });
        dialog.render(true)
    }

    _calculate_trade(trade) {
        let t = 0;
        for (let i = 0; i < trade.current.trade.sell.length; i++) {
            const item = trade.current.trade.sell[i];
            let price  = (parseFloat(item.data.cost.slice(1, item.data.cost.length)) / item.data.box_amount) * item.amount;
            t -= (price * this.actor.data.data.buy_modifier);
        }
        for (let i = 0; i < trade.current.trade.buy.length; i++) {
            const item = trade.current.trade.buy[i];
            let price = 0;
            if (item.data.boxed_multiple) {
                price = (parseFloat(item.data.cost.slice(1, item.data.cost.length)) / item.data.box_amount) * item.amount;
            }else{
                price = parseFloat(item.data.cost.slice(1, item.data.cost.length)) * item.amount;
            }
            t += (price * this.actor.data.data.sell_modifier);
        }
        return `$${t.toFixed(2)}`;
    }

    add(act, item) {
        if (dc_utils.stackable.includes(item.type)) {
            let found_item = act.items.filter(function (i) {return i.name == item.name});
            if (found_item.length > 0) {
                let numParse = parseInt;
                if (found_item[0].data.data.is_float) {
                    numParse = parseFloat;
                }
                let has = numParse(found_item[0].data.data.amount);
                let amt = numParse(item.data.amount);
                if (found_item.length > 0) {
                    dc_utils.char.items.update(found_item[0], {amount: has + amt});
                    return;
                }
            }
        }
        setTimeout(() => {act.createEmbeddedDocuments('Item', [item])}, Math.random() * 1000);
    }

    remove(act, item, amt) {
        if (item.data.equippable) {
            if (dc_utils.char.items.is_equipped(act, item.data.slot, item.id)) {
                dc_utils.char.items.unequip(act, item.data.slot);
            }
        }
        if (dc_utils.stackable.includes(item.type)) {
            if (item.data.amount > amt) {
                let i = act.items.get(item.id);
                dc_utils.char.items.update(i, {amount: item.data.amount - amt});
                return;
            }
        }
        setTimeout(() => {act.deleteEmbeddedDocuments("Item", [item.id])}, Math.random() * 1000);
    }

    generate_receipt(trade) {
        let log = `
        <div class="typed">
            <h2 class="center">Receipt</h2>
            <h3 class="center">${game.user.character.name}</h3>
        `;
        if (trade.current.trade.buy.length > 0) {
            log += `
                <h3 class="center">Bought</h3>
                <table>
            `;
            for (let i = 0; i < trade.current.trade.buy.length; i++) {
                const item = trade.current.trade.buy[i];
                log += `
                    <tr>
                        <td class="center">[${item.amount}]</td>
                        <td class="center">${item.name}</td>
                        <td class="right">${item.data.cost}</td>
                    </tr>
                `;
            }
            log += `
                </table>
            `;
        }
        if (trade.current.trade.sell.length > 0) {
            log += `
                <h3 class="center">Sold</h3>
                <table>
            `;
            for (let i = 0; i < trade.current.trade.sell.length; i++) {
                const item = trade.current.trade.sell[i];
                let total  = ((parseFloat(item.data.cost.slice(1, item.data.cost.length)) / item.data.box_amount) * item.amount) * this.actor.data.data.buy_modifier;
                log += `
                    <tr>
                        <td class="center">[${item.amount}]</td>
                        <td class="center">${item.name}</td>
                        <td class="right">$${total.toFixed(2)}</td>
                    </tr>
                `;
            }
            log += `
                </table>
            `;
        }
        log += `
            <h3 class="center">${trade.current.trade.total}</h3>
        </div>
        `;
        ChatMessage.create({content: log});
    }
}