export default class DCItem extends ItemSheet {
    get template() {
        return `systems/deadlands_classic/templates/sheets/items/${this.item.data.type}-sheet.html`;
    }

    getData() {
        const data     = super.getData();
        data.config    = CONFIG.dc;
        data.locations = dc_utils.hit_locations;
        data.skills    = dc_utils.skills;
        data.documents = dc_utils.documents;
        if (this.object.actor) {
            data.modifiers = this.object.actor.items.get(this.item.id).data.data.modifiers;
        }else{
            data.modifiers = game.items.get(this.item.id).data.data.modifiers;
        }
        if (this.item.data.data.template == 'book' && this.item.data.data.prefab.book.skill_check) {
            console.log('Setting skill check timer.');
            setTimeout(() => {
                if (!(game.user.isGM)) {
                    let act = dc_utils.get_actor(game.user.character.name);
                    if (act.isOwner) {
                        let data = dc_utils.roll.new_roll_packet(act, 'skill', this.item.data.data.prefab.book.skill);
                        data.next_op = 'reveal_clue';
                        data.clue    = this.item.data.data.prefab.book.clue;
                        operations.skill_roll(data);
                    }
                }
            }, this.item.data.data.prefab.book.timer * 1000);
        }
        return data;
    }

    activateListeners(html) {
        // On Click
        html.find(".add-modifier").click(this._on_add_modifier.bind(this));
        html.find(".item-delete").click(this._on_remove_modifier.bind(this));
        html.find(".render-preview").click(this._on_render_preview.bind(this));
        html.find(".toggle-clue").click(this._on_toggle_clue.bind(this));
        html.find(".toggle-typed").click(this._on_toggle_typed.bind(this));

        // On Change
        html.find(".document-template").change(this._on_document_select.bind(this));
        return super.activateListeners(html);
    }

    _on_add_modifier(event) {
        event.preventDefault();
        let item;
        if (this.object.actor) {
            item = this.object.actor.items.get(this.item.id);
        } else {
            item = game.items.get(this.item.id);
        }
        let mods = item.data.data.modifiers;
        mods.push({
            name: item.name,
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

    _on_document_select(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let type    = element.value;
        if(dc_utils.documents[type]?.build) {
            let data = this.item.data.data.prefab[type];
            data.img = this.item.img;
            this.item.update({data: {output: dc_utils.documents[type].build(data)}});
        }
    }

    _on_render_preview(event) {
        event.preventDefault();
        let type = this.item.data.data.template;
        console.log(this.item.data.data.template);
        if(dc_utils.documents[type]?.build) {
            let data = this.item.data.data.prefab[type];
            data.img = this.item.img;
            this.item.update({data: {output: dc_utils.documents[type].build(data)}});
        }
    }

    _on_toggle_clue(event) {
        event.preventDefault();
        this.item.update({data: {prefab: {book: {skill_roll: !(this.item.data.data.prefab.book.skill_roll)}}}});
    }

    _on_toggle_typed(event) {
        event.preventDefault();
        this.item.update({data: {prefab: {[this.item.data.data.template]: {hand_written: !(this.item.data.data.prefab[this.item.data.data.template].hand_written)}}}});
    }
}