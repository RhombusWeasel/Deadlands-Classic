import { dc } from "../config.js";
function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class GMSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/deadlands_classic/templates/sheets/actor/gm-sheet.html`,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "combat" }],
            classes: ["doc"],
            width: 500,
            height: 700
        });
    }

    getData() {
        if (game.user.isGM && this.actor.data.type == 'gm') {
            const data = super.getData();
            data.config = CONFIG.dc;
            let fate_chips = dc_utils.char.items.get(this.actor, "chip");
            data.fate_chips = [
                {name: "White", bounty: "1", amount: fate_chips.filter(function(i){return i.name == 'White'}).length},
                {name: "Red", bounty: "2", amount: fate_chips.filter(function(i){return i.name == 'Red'}).length},
                {name: "Blue", bounty: "3", amount: fate_chips.filter(function(i){return i.name == 'Blue'}).length},
                {name: "Legendary", bounty: "5", amount: fate_chips.filter(function(i){return i.name == 'Legendary'}).length},
            ];
            data.combat_active = game.settings.get('deadlands_classic','combat_active');
            data.action_deck   = this.actor.data.data.action_cards;
            data.modifiers = this.actor.data.data.modifiers;
            data.chars = dc_utils.gm.get_player_owned_actors();
            data.posse = [];
            for (let i = 0; i < game.user.character.data.data.posse.length; i++) {
                data.posse.push(game.actors.get(game.user.character.data.data.posse[i]));
            }
            data.posse_chips  = [];
            for (let i = 0; i < data.posse.length; i++) {
                const hero = data.posse[i];
                data.posse[i].chips = {
                    White: hero.items.filter(function(i){return i.name == 'White' && i.type == 'chip'}).length,
                    Red: hero.items.filter(function(i){return i.name == 'Red' && i.type == 'chip'}).length,
                    Blue: hero.items.filter(function(i){return i.name == 'Blue' && i.type == 'chip'}).length,
                    Legendary: hero.items.filter(function(i){return i.name == 'Legendary' && i.type == 'chip'}).length,
                }
            }
            data.tn = 5;
            for (const [key, mod] of Object.entries(data.modifiers)){
                if (mod.active) {
                    data.tn -= mod.mod;
                }
            }
            data.combat_active = game.settings.get('deadlands_classic','combat_active');
            if (data.combat_active) {
                let action_list = [];
                let users = dc_utils.gm.get_online_users();
                let pcs = dc_utils.gm.get_player_owned_actors();
                for (let i = 0; i < users.length; i++) {
                    if (!(users[i].isGM)) {
                        for (let p = 0; p < pcs.length; p++) {
                            let char = pcs[p];
                            let ad_cards = char.data.data.action_cards;
                            for (let c = 0; c < ad_cards.length; c++) {
                                const card = ad_cards[c];
                                let card_data = {'name': card.name, 'player': char.name};
                                action_list.push(card_data);
                            }
                        }
                    }
                }
                for (let c = 0; c < data.action_deck.length; c++) {
                    const card = data.action_deck[c];
                    let card_data = {'name': card.name, 'player': 'GM'};
                    action_list.push(card_data);
                }
                if (action_list.length > 0) {
                    data.action_list = dc_utils.deck.sort(action_list);
                }
            }else{
                if (this.actor.data.data.action_cards.length > 0) {
                    this.actor.update({data: {action_cards: []}});
                }
            }
            data.enemies = [];
            let enemies = canvas.tokens.placeables.filter(i => i.data.disposition == -1 && i.document.actor.data.data.wind.value > 0);
            for (let i = 0; i < enemies.length; i++) {
                const tkn = dc_utils.get_actor(enemies[i].name);
                data.enemies.push(tkn);
            }
            data.enemies = this.sort_entities_by_card(data.enemies);
            data.neutral = [];
            let neutral = canvas.tokens.placeables.filter(i => i.data.disposition != -1 && i.document.actor.data.data.wind.value > 0 && i.document.actor.hasPlayerOwner == false);
            for (let i = 0; i < neutral.length; i++) {
                const tkn = dc_utils.get_actor(neutral[i].name);
                data.neutral.push(tkn);
            }
            data.time = dc_utils.time.get_date();
            return data;
        }
    }

    activateListeners(html) {
        html.find(".time-up").click(this._on_time_up.bind(this));
        html.find(".time-down").click(this._on_time_down.bind(this));
        html.find(".draw-fate").click(this._on_draw_fate.bind(this));
        html.find(".use-fate").click(this._on_use_fate.bind(this));
        html.find(".item-delete").click(this._on_item_delete.bind(this));
        html.find(".start-combat").click(this._on_start_combat.bind(this));
        html.find(".new-round").click(this._on_new_round.bind(this));
        html.find(".end-combat").click(this._on_end_combat.bind(this));
        html.find(".draw-card").click(this._on_draw_card.bind(this));
        html.find(".play-card").click(this._on_play_card.bind(this));
        html.find(".play-action-card").click(this._on_play_posse_card.bind(this));
        html.find(".refresh").click(this._on_refresh.bind(this));
        html.find(".next-turn").click(this._on_next_turn.bind(this));
        html.find(".add-to-posse").click(this._on_add_posse.bind(this));
        html.find(".open-sheet").click(this._on_open_sheet.bind(this));
        html.find(".toggle-bleeding").click(this._on_toggle_bleeding.bind(this));
        html.find(".toggle-running").click(this._on_toggle_running.bind(this));
        html.find(".toggle-mounted").click(this._on_toggle_mounted.bind(this));
        html.find(".toggle-gm-moved").click(this._on_toggle_moved.bind(this));
        html.find(".remove-posse").click(this._on_remove_posse.bind(this));
        html.find(".attack-dominant").click(this._on_attack_dominant.bind(this));
        html.find(".attack-off").click(this._on_attack_off.bind(this));
        html.find(".target-player").click(this._on_target_player.bind(this));
        html.find(".select-token").click(this._on_select_token.bind(this));
        html.find(".draw-enemy-cards").click(this._on_draw_cards.bind(this));

        // Selections
        html.find(".add-posse-select").change(this._on_add_posse_select.bind(this));
        /* if (!(game.dc.gm_collapse)) {
            game.dc.gm_collapse = []
        }
        let colls = document.getElementsByClassName("gm-collapsible");
        for (let i = 0; i < colls.length; i++) {
            if (!(game.dc.gm_collapse[i])) {
                game.dc.gm_collapse[i] = false
            }
            colls[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let content = this.nextElementSibling;
                if (!(game.dc.gm_collapse[i])) {
                    content.style.maxHeight = null;
                    game.dc.gm_collapse[i] = true;
                }else{
                    content.style.maxHeight = content.scrollHeight + "px";
                    game.dc.gm_collapse[i] = false;
                }
            });
            if (game.dc.gm_collapse[i]) {
                colls[i].nextElementSibling.style.maxHeight = null;
            } else {
                colls[i].nextElementSibling.style.maxHeight = colls[i].nextElementSibling.scrollHeight + "px";
            }
        } */
        return super.activateListeners(html);
    }

    sort_entities_by_card(list) {
        let r_list = []
        let rj_found = false;
        let bj_found = false;
        for (let card = 0; card < dc_utils.cards.length ; card++) {
            const cur_card = dc_utils.cards[card];
            for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                for (let chk = 0; chk < list.length; chk++) {
                    const act = list[chk];
                    const chk_card = act.data.data.action_cards[0] ? act.data.data.action_cards[0].name : "2\u2663";
                    if (chk_card == `${cur_card}${cur_suit}`) {
                        if (cur_card == 'Joker') {
                            if (chk_card == `Joker ${dc_utils.suit_symbols.red_joker}` && !(rj_found)) {
                                r_list.push(list.splice(chk, 1)[0]);
                                rj_found = true;
                                break;
                            }else if(chk_card == `Joker ${dc_utils.suit_symbols.black_joker}` && !(bj_found)) {
                                r_list.push(list.splice(chk, 1)[0]);
                                bj_found = true;
                                break;
                            }
                        }else if(chk_card == `${cur_card}${cur_suit}`){
                            r_list.push(list.splice(chk, 1)[0]);
                            break;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            r_list.push(element);
        }
        return r_list;
    }

    _on_refresh(event) {
        event.preventDefault();
        this.getData();
        this.render();
    }

    _on_time_up(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let period = element.closest(".time").dataset.period;
        dc_utils.gm.update_time(this.actor, period, 1);
    }

    _on_time_down(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let period = element.closest(".time").dataset.period;
        dc_utils.gm.update_time(this.actor, period, -1);
    }

    _on_draw_fate(event) {
        let chips = [
            {
                name: game.i18n.localize("dc.fate_chips.white"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.white"),
                    bounty: 1
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.red"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.red"),
                    bounty: 2
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.blue"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.blue"),
                    bounty: 3
                }
            },
            {
                name: game.i18n.localize("dc.fate_chips.legend"),
                type: "chip",
                data: {
                    value: game.i18n.localize("dc.fate_chips.legend"),
                    bounty: 5
                }
            }
        ];
        let percs = [
            {limit: 99, chip:3},
            {limit: 88, chip:2},
            {limit: 58, chip:1},
            {limit: 0, chip:0},
        ]
        let choice = Math.floor(Math.random() * 100);
        for (let p = 0; p < percs.length; p++) {
            const el = percs[p];
            if (choice >= el.limit){
                ChatMessage.create({ content: `The Marshal draws a fate chip`});
                return this.actor.createOwnedItem(chips[el.chip])
            }
        }
    }

    _on_use_fate(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let chip_type = element.closest(".fate-data").dataset.chip;
        let fate_chips = this.actor.items.filter(function (item) {return item.type == "chip"});
        let responses = [
            `I think you might've pissed 'em off`,
            `Let's hope he doesn't have it in for ya.`,
            `I don't like it when he gets like this...`,
        ];
        for (let chip of fate_chips) {
            if (chip.name == chip_type) {
                let r_msg = responses[Math.floor(Math.random() * responses.length)]
                dc_utils.chat.send('Fate', `The Marshal uses a ${chip_type} fate chip.`, `${r_msg}`);
                dc_utils.char.items.delete(this.actor, chip._id);
                break;
            }
        }
    }

    _on_item_delete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemid;
        let item = this.actor.getOwnedItem(itemId);
        ChatMessage.create({ content: `Discarding ${item.type} ${item.name}`});
        return this.actor.deleteOwnedItem(itemId);
    }

    _on_start_combat(event) {
        event.preventDefault();
        let act = this.getData();
        this.actor.update({"combat_active": true});
        dc_utils.combat.new_combat();
        dc_utils.combat.new_round();
        ChatMessage.create({ content: `Combat Begins!`});
        game.socket.emit("system.deadlands_classic", {
            operation: 'roll_quickness',
            data: {}
        });
        game.settings.set('deadlands_classic', 'combat_active', true);
        return this.render();
    }

    _on_new_round(event) {
        event.preventDefault();
        dc_utils.combat.new_round();
        ChatMessage.create({ content: `New Round! Get Down with the Quickness!`});
        let pcs = dc_utils.gm.get_player_owned_actors();
        for (let i = 0; i < pcs.length; i++) {
            let char = pcs[i];
            dc_utils.char.wind.bleed(char);
        }
        game.socket.emit("system.deadlands_classic", {
            operation: 'roll_quickness',
            data: {}
        });
        return this.render();
    }

    _on_end_combat(event) {
        event.preventDefault();
        ChatMessage.create({ content: `Combat Ends!`});
        let pcs = dc_utils.gm.get_player_owned_actors();
        for (let i = 0; i < pcs.length; i++) {
            const char = pcs[i];
            char.update({data: {action_cards: []}});
            char.update({data: {aim_bonus: 0}});
            dc_utils.char.wind.reset(char);
        }
        game.socket.emit("system.deadlands_classic", {
            operation: 'end_combat',
            data: {}
        });
        game.settings.set('deadlands_classic', 'combat_active', false);
        return this.render();
    }

    _on_draw_card() {
        dc_utils.combat.deal_cards(this.actor, 1);
    }

    _on_play_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let index = parseInt(element.closest(".item").dataset.itemindex);
        let card = this.actor.data.data.action_cards[index];
        card.char = this.actor.name;
        operations.discard_card(card);
        dc_utils.combat.remove_card(this.actor, index);
    }

    _on_next_turn(event) {
        if (game.dc.combat_active) {
            let data = this.getData();
            let next = data.action_list.pop();
            //console.log(next);
        }
    }

    _on_add_posse_select(event) {
        event.preventDefault();
        let element = event.currentTarget;
        this.actor.update({data: {add_posse_name: element.value}});
    }

    _on_add_posse(event) {
        event.preventDefault();
        let posse = this.actor.data.data.posse;
        posse.push(this.actor.data.data.add_posse_name);
        let char = game.actors.get(this.actor.data.data.add_posse_name);
        char.update({data: {marshal: this.actor.name}});
        this.actor.update({data: {posse: posse}});
    }

    _on_remove_posse(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let posse = this.actor.data.data.posse;
        let index = element.closest(".posse").dataset.index;
        posse.splice(index, 1);
        this.actor.update({data: {posse: posse}});
    }

    _on_open_sheet(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let name = element.closest(".posse").dataset.name;
        let act = dc_utils.get_actor(name);
        if (!(act.sheet.rendered)) {
            act.sheet.render(true);
        }else{
            act.sheet.close();
        }
    }

    _on_toggle_bleeding(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let name = element.closest(".posse").dataset.name;
        let act = dc_utils.get_actor(name);
        act.update({data: {is_bleeding: !act.data.data.is_bleeding}});
        dc_utils.gm.update_sheet();
    }

    _on_toggle_running(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let name = element.closest(".posse").dataset.name;
        let act = dc_utils.get_actor(name);
        act.update({data: {is_running: !act.data.data.is_running}});
        dc_utils.gm.update_sheet();
    }

    _on_toggle_mounted(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let name = element.closest(".posse").dataset.name;
        let act = dc_utils.get_actor(name);
        act.update({data: {is_mounted: !act.data.data.is_mounted}});
        dc_utils.gm.update_sheet();
    }

    _on_toggle_moved(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let name = element.closest(".posse").dataset.name;
        let act = dc_utils.get_actor(name);
        act.update({data: {is_moved: !act.data.data.is_moved}});
        dc_utils.gm.update_sheet();
    }

    _on_attack_dominant(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let act  = dc_utils.get_actor(element.closest(".posse").dataset.name);
        let item = dc_utils.char.items.get_equipped(act, 'dominant');
        let data
        if (item == 'Nuthin') {
            data = dc_utils.roll.new_roll_packet(act, 'melee', 'fightin', 'Nuthin');
        }else{
            if (item.type == 'melee') {
                data = dc_utils.roll.new_roll_packet(act, 'melee', 'fightin', item.id);
            }else if (item.type == 'firearm') {
                let old = ['pistol', 'rifle', 'shotgun', 'automatic']
                if (old.includes(item.data.data.gun_type)) {
                    data = dc_utils.roll.new_roll_packet(act, 'ranged', `shootin_${item.data.data.gun_type}`, item.id);
                }else{
                    data = dc_utils.roll.new_roll_packet(act, 'ranged', `${item.data.data.gun_type}`, item.id);
                }
            }
        }
        operations.register_attack(data);
    }

    _on_attack_off(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let act  = dc_utils.get_actor(element.closest(".posse").dataset.name);
        let item = dc_utils.char.items.get_equipped(act, 'off');
        let data
        if (item == 'Nuthin') {
            data = dc_utils.roll.new_roll_packet(act, 'melee', 'fightin', 'Nuthin');
        }else{
            if (item.type == 'melee') {
                data = dc_utils.roll.new_roll_packet(act, 'melee', 'fightin', item.id);
            }else if (item.type == 'firearm') {
                let old = ['pistol', 'rifle', 'shotgun', 'automatic']
                if (old.includes(item.data.data.gun_type)) {
                    data = dc_utils.roll.new_roll_packet(act, 'ranged', `shootin_${item.data.data.gun_type}`, item.id);
                }else{
                    data = dc_utils.roll.new_roll_packet(act, 'ranged', `${item.data.data.gun_type}`, item.id);
                }
            }
        }
        operations.register_attack(data);
    }

    _on_target_player(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let tkn  = dc_utils.get_token(element.closest(".posse").dataset.name);
        tkn.setTarget({releaseOthers: true});
    }

    _on_select_token(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let tkn  = dc_utils.get_token(element.closest(".posse").dataset.name);
        tkn.control({releaseOthers: true});
    }

    _on_draw_cards(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let enemies = canvas.tokens.placeables.filter(i => i.data.disposition == -1 && i.document.actor.data.data.wind.value > 0);
        for (let i = 0; i < enemies.length; i++) {
            const tkn = dc_utils.get_actor(enemies[i].name);
            let t = setTimeout(() => {
                dc_utils.combat.deal_cards(tkn, 1);
                dc_utils.gm.update_sheet();
            }, Math.random() * 3000);
        }
    }

    _on_play_posse_card(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let tkn  = dc_utils.get_actor(element.closest(".posse").dataset.name);
        let card = tkn.data.data.action_cards[0];
        card.char = tkn.name;
        if (game.user.isGM){
            operations.discard_card(card);
        }else{
            dc_utils.socket.emit('discard_card', card);
        }
        dc_utils.combat.remove_card(tkn, 0);
        dc_utils.gm.update_sheet();
    }
}