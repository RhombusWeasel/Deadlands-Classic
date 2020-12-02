export default class Firearm extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dc;
        return data;
    }
}