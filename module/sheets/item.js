export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.modifiers = game.items.get(this.item.id).data.data.modifiers;
        console.log(data.modifiers);
        return data;
    }

    activateListeners(html) {
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault();
        let item = game.items.get(this.item.id)
        let mods = item.data.data.modifiers;
        mods.push({
            type: 'skill_mod',
            skill: 'cognition',
            modifier: 2
        });
        item.update({data: mods});
        console.log(this);
        return this.getData();
    }
}