export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        return data;
    }

    activateListeners(html) {
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault()
        console.log(this);
    }
}