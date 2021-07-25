export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        data.modifiers = game.items.find(i => function(){return i.name == this.object.name}).data.data.modifiers;
        console.log(data.modifiers);
        return data;
    }

    activateListeners(html) {
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault();
        let data = {
            modifiers: [
                {
                    type: 'skill_mod',
                    target: 'cognition',
                    modifier: 2
                }
            ]
        };
        this.item.update(data);
        console.log(this);
        return this.getData();
    }
}