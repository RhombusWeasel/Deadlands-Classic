export default class VehicleSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/vehicle.html`,
            classes: ["player-sheet", "doc"],
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "passengers" }],
            width: 496,
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

        // Line stuffs for drivin helpers.
        let tkn = dc_utils.get_token(this.actor.name);
        let drv = dc_utils.vehicle.passenger.get_driver(this.actor);
        if (drv) {
            drv = dc_utils.get_actor(drv);
        }
        if (tkn && drv && (game.user.isGM || drv.isOwner) && this._tabs[0].active == 'drivin') {
            let grid_size = canvas.grid.size;
            let grid_half = grid_size / 2;
            let line = dc_utils.pixi.add(`${this.actor.id}_drive_helper`);
            line.clear();
            line.position.set(tkn.data.x + grid_half, tkn.data.y + grid_half);
            let px = 0;
            let py = 0;
            let forces = this.actor.data.data.forces;
            for (let i = 0; i < this.actor.data.data.forces.length; i++) {
                const force = this.actor.data.data.forces[i];
                px += force.x;
                py += force.y;
                line.moveTo(0, 0).lineStyle(5, f_col[i]).lineTo(force.x * grid_size, force.y * grid_size);
            }
            line.moveTo(0, 0).lineStyle(5, 0x00FF00).lineTo(forces.vel.x * grid_size, forces.vel.y * grid_size);
            line.moveTo(0, 0).lineStyle(5, 0x0000FF).lineTo(forces.acc.x * grid_size, forces.acc.y * grid_size);
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
        html.find(".apply-throttle").click(this._on_apply_throttle.bind(this));
        html.find(".apply-brakes").click(this._on_apply_brake.bind(this));
        html.find(".apply-turn").click(this._on_apply_turn.bind(this));
        //Selector Binds
        html.find(".vehicle-weapon-select").change(this._on_equip_weapon.bind(this));
        //JQuery
        $("#arc-slider").roundSlider({
            sliderType: "min-range",
            circleShape: "custom-quarter",
            min: -180,
            max: 180,
            value: 0,
            startAngle: 45,
            editableTooltip: true,
            radius: 150,
            width: 4,
            handleSize: "+16",
            tooltipFormat: function (args) {
                return args.value + "°";
            },
        });
        $("#fuel-slider").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 50,
            width: 8,
            min: 0,
            max: this.actor.data.data.fuel_max,
            value: this.actor.data.data.fuel,
            handleSize: 0,
            handleShape: "square",
            circleShape: "custom-quarter",
            startAngle: 315,
            actor: this.actor.name,
            valueChange: function(args) {
                
            },
            tooltipFormat: function (args) {
                var val = args.value;
                return '<div class="center">Fuel:</div>' + val;
            },
        });
        $("#handle1").roundSlider({
            sliderType: "min-range",
            editableTooltip: false,
            radius: 50,
            width: 8,
            value: this.actor.data.data.speed,
            handleSize: 0,
            handleShape: "square",
            circleShape: "pie",
            startAngle: 315,
            valueChange: function(args) {},
            tooltipFormat: function (args) {
                var val = args.value;
                return '<div class="center">Speed:</div>' + val + " m/h";
            },
        });
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
        event.preventDefault();
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
        event.preventDefault();
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
        event.preventDefault();
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

    _on_apply_throttle(event) {
        event.preventDefault();
        if (game.user.isGM || dc_utils.vehicle.passenger.check_job(this.actor, game.user.character.name, 'driver')) {
            let angle = this.actor.data.token.rotation;
            let speed = this.actor.data.data.speed + this.actor.data.data.throttle
            let accel = {
                x: speed * Math.cos(angle),
                y: speed * Math.sin(angle),
            };
            let vel   = {
                x: this.actor.data.data.forces.vel.x + accel.x,
                y: this.actor.data.data.forces.vel.y + accel.y,
            }
            this.actor.update({data: {
                speed: speed,
                throttle: 0,
                forces: {
                    vel: vel
                }
            }});
        }
    }

    _on_apply_brake(event) {
        event.preventDefault();
        if (game.user.isGM || dc_utils.vehicle.passenger.check_job(this.actor, game.user.character.name, 'driver')) { 
            this.actor.update({data: {
                speed: this.actor.data.data.speed + this.actor.data.data.brake,
                brake: 0,
            }});
        }
    }

    _on_apply_turn(event) {
        event.preventDefault();
        let data = dc_utils.roll.new_roll_packet(game.user.character, 'skill', 'drivin');
        data.next_op = 'turn_vehicle';
        data.turn    = $("#arc-slider").data('roundSlider').getValue();
        data.vehicle = this.actor.name;
        if (this.actor.data.data.speed < (this.actor.data.data.pace / 2)) data.modifiers.slow = {label: 'Half pace or less', modifier: 2};
        if (this.actor.data.data.speed > this.actor.data.data.pace) data.modifiers.fast = {label: `Moving faster than pace`, modifier: -2};
        if (Math.abs(data.turn) > 45) data.modifiers.big_turn = {label: `More than 45°`, modifier: -2};
        data.modifiers.mo_turns = {label: `Previous Turns`, modifier: -(game.dc.turns_made * 2)};
        game.dc.turns_made += 1
        operations.skill_roll(data);
        $("#arc-slider").data('roundSlider').setValue(0, 0);
    }
}