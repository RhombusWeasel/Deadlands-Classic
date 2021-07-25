export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data     = super.getData();
        data.config    = CONFIG.dc;
        data.locations = dc_utils.hit_locations;
        data.skills    = dc_utils.skills;
        if (this.object.actor) {
            data.modifiers = this.object.actor.items.get(this.item.id).data.data.modifiers;
        } else {
            data.modifiers = game.items.get(this.item.id).data.data.modifiers;
        }
        return data;
    }

    activateListeners(html) {
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        html.find(".item-delete").click(this._on_remove_modifier.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault();
        let item
        if (this.object.actor) {
            item = this.object.actor.items.get(this.item.id);
        } else {
            item = game.items.get(this.item.id);
        }
        let mods = item.data.data.modifiers;
        mods.push({
            type: item.data.data.type_select,
            target: item.data.data.target_select,
            modifier: item.data.data.value_select
        });
        item.update({data: {modifiers: mods}});
        return this.getData();
    }

    _on_remove_modifier(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = parseInt(element.closest(".item").dataset.id);
        let item;
        if (this.object.actor) {
            item = this.object.actor.items.get(this.item.id);
        } else {
            item = game.items.get(this.item.id);
        }
        let mods = item.data.data.modifiers;
        mods.splice(index, 1);
        item.update({data: {modifiers: mods}});
    }
}