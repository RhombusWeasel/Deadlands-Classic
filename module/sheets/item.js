export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.modifiers = this.object.data.data.modifiers
        return data;
    }

    activateListeners(html) {
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault()
        this.object.data.data.modifiers.push({
            type: 'skill_mod',
            target: 'cognition',
            modifier: 2
        })
        this.object.update(this.object.data);
        return this.getData();
    }
}