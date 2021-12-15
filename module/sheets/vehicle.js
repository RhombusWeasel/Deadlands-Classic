export default class VehicleSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/vehicle.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "passengers" }],
            width: 500,
            height: 665
        });
    }

    getData() {
        const data         = super.getData();
        data.config        = CONFIG.dc;
        data.hit_locations = this.actor.data.data.hit_locations;
        data.driver        = this.actor.data.data.driver;
        data.throttle      = this.actor.data.data.throttle;
        data.turnin        = this.actor.data.data.turnin;
        data.passengers    = this.actor.data.data.passengers.onboard;
        data.weapons       = this.actor.data.data.weapons;
        data.mountable     = dc_utils.vehicle.weapons.get_mountable(this.actor);
        data.owners        = dc_utils.gm.get_online_actors();
        data.melee_weapons = dc_utils.char.items.get(this.actor, "melee");
        data.firearms      = dc_utils.char.items.get(this.actor, "firearm", "gun_type");
        data.goods         = dc_utils.char.items.get(this.actor, "goods");
        let vroom          = document.getElementsByName("handle1")[0];
        if (vroom) {
            console.log(vroom);
        }
        return data;
    }

    activateListeners(html) {
        //Click Binds:
        html.find(".edit-toggle").click(this._on_edit_toggle.bind(this));
        html.find(".info-button").click(this._on_item_open.bind(this));
        html.find(".item-give").click(this._on_item_pass.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".add-passenger").click(this._on_passenger_add.bind(this));
        html.find(".remove-passenger").click(this._on_passenger_remove.bind(this));
        html.find(".add-hit-location").click(this._on_hit_location_add.bind(this));
        html.find(".remove-hit-location").click(this._on_hit_location_remove.bind(this));
        html.find(".enter-vehicle").click(this._on_enter_vehicle.bind(this));
        html.find(".exit-vehicle").click(this._on_exit_vehicle.bind(this));
        //Selector Binds
        html.find(".vehicle-weapon-select").change(this._on_equip_weapon.bind(this));

        return super.activateListeners(html);
    }

    _on_edit_toggle(event) {
        this.actor.update({data: {show_editor: !(this.actor.data.data.show_editor)}});
    }

    _on_item_open(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        return item.sheet.render(true);
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        dc_utils.chat.send('Discard', `${this.actor.name} discards ${item.name}`);
        dc_utils.char.items.delete(this.actor, itemId);
    }

    _on_item_pass(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.items.get(itemId);
        let target = game.user.character.name;
        if (item.type == 'melee' || item.type == 'firearm' || item.data.data.amount == 1) {
            dc_utils.vehicle.cargo.get(this.actor, target, itemId, 1);
            return true;
        }
        let dialog = new Dialog({
            title: `Select amount`,
            content: `
                <div>
                    <h1>Select Amount</h1>
                    <input type="range" min="0" max="${item.data.data.amount}" value="0" class="slider" name="amount-slider" oninput="this.nextElementSibling.value = this.value"/>
                    <output>0</output>
                </div>
            `,
            buttons: {
                send: {
                    label: `Give ${item.name} to ${target}`,
                    callback: (html) => {
                        let amount = html.find('[name="amount-slider"]').val();
                        dc_utils.vehicle.cargo.get(this.actor, target, itemId, amount);
                    }
                }
            }
        });
        dialog.render(true)
    }

    _on_passenger_add(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let details = this.actor.data.data.passenger_add;
        dc_utils.vehicle.passenger.add_slot(this.actor, details.name, details.driver, details.gunner);
    }

    _on_passenger_remove(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        dc_utils.vehicle.passenger.remove_slot(this.actor, index);
    }

    _on_hit_location_add(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let details = this.actor.data.data.hit_add;
        dc_utils.vehicle.locations.add_location(this.actor, details.name, details.min, details.max, details.armour, details.malfunctions);
    }

    _on_hit_location_remove(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        dc_utils.vehicle.locations.remove_location(this.actor, index);
    }

    _on_enter_vehicle(event) {
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        let char = game.user.character;
        let tkn = dc_utils.char.token.get_name(this.actor.name);
        let tgt = dc_utils.char.token.get_name(char.name);
        if (tkn && tgt) {
            let dist = Math.floor(canvas.grid.measureDistance(tkn, tgt));
            if (dist > 2) {
                dc_utils.chat.send('Out of range!', `You're too far away from ${this.actor.name} to get in.`);
                return false;
            }
            dc_utils.vehicle.passenger.enter(this.actor, char, index);
            dc_utils.random_update(game.user.character, {data: {current_vehicle: this.actor.name}});
            dc_utils.socket.emit('remove_token', {name: char.name});
        }else{
            dc_utils.chat.send('Missing Token', `Failed to find tokens for ${char.name} and ${this.actor.name}.`, 'Check both tokens exist on the current map.');
        }
    }

    _on_exit_vehicle(event) {
        let element = event.currentTarget;
        let index = element.closest(".item").dataset.itemid;
        let tkn = dc_utils.char.token.get_name(this.actor.name);
        let char = game.user.character;
        if (tkn) {
            dc_utils.vehicle.passenger.exit(this.actor, index);
            dc_utils.random_update(char, {data: {current_vehicle: 'None'}});
            dc_utils.socket.emit('spawn_token', {name: char.name, x: tkn.x + 100, y: tkn.y});
        }else{
            dc_utils.chat.send('Missing Token', `Failed to find token for ${this.actor.name}.`, 'Check the token exists on the current map.');
        }
    }

    _on_equip_weapon(event) {
        let element = event.currentTarget;
        let slot    = element.closest(".item").dataset.itemid;
        let item_id = element.value;
        let item_name = 'Empty';
        let wep = this.actor.items.get(item_id);
        if (wep) {
            item_name = wep.name;
        }
        dc_utils.vehicle.weapons.equip(this.actor, slot, item_id, item_name);
    }
}