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
            height: 800
        });
    }

    getData() {
        if (game.user.isGM && this.actor.data.type == 'gm') {
            if (!(game.user?.character?.id)) dc_utils.chat.send('System', `You are not currently set as ${this.actor.name}`, `Set your character to ${this.actor.name} in the configure player settings menu at the bottom left of the screen.`, `Right click the GM player and select 'User Configuration' then select ${this.actor.name} from the list.`);
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
            if (data.chars.length > 0) {
                if (this.actor.data.data.add_posse_name == '') {
                    this.actor.update({data: {add_posse_name: data.chars[0].id}})
                }
            }else{
                dc_utils.chat.send('System', `There are no player owned actors.`, `Create an actor and assign a player as the owner.`);
            }
            data.posse = [];
            if (game.user.character.data.data.posse.length > 0) {
                for (let i = 0; i < game.user.character.data.data.posse.length; i++) {
                    let char = game.actors.get(game.user.character.data.data.posse[i]);
                    if (char) data.posse.push(char);
                }
            }
            data.posse_chips  = [];
            if (data.posse.length > 0) {
                for (let i = 0; i < data.posse.length; i++) {
                    const hero = data.posse[i];
                    data.posse[i].chips = {
                        White: hero.items.filter(function(i){return i.name == 'White' && i.type == 'chip'}).length,
                        Red: hero.items.filter(function(i){return i.name == 'Red' && i.type == 'chip'}).length,
                        Blue: hero.items.filter(function(i){return i.name == 'Blue' && i.type == 'chip'}).length,
                        Legendary: hero.items.filter(function(i){return i.name == 'Legendary' && i.type == 'chip'}).length,
                    }
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
            data.tn = 5;
            for (const [key, mod] of Object.entries(data.modifiers)){
                if (mod.active) {
                    data.tn -= mod.mod;
                }
            }
            data.combat_active = game.settings.get('deadlands_classic','combat_active');
            if (data.combat_active) {
                let action_list = [];
                let tokens = [];
                let combatants = canvas.tokens.placeables.filter(i => i.document.actor.data.data.wind.value > 0);
                for (let i = 0; i < combatants.length; i++) {
                    const tkn = dc_utils.get_actor(combatants[i].name);
                    tokens.push(tkn);
                }
                for (let t = 0; t < tokens.length; t++) {
                    let act = tokens[t];
                    let cards = act.data.data.action_cards;
                    for (let c = 0; c < cards.length; c++) {
                        const card = cards[c];
                        if (card.name != act.data.data.sleeved_card) {
                            let card_data = {'name': card.name, 'player': act.name};
                            action_list.push(card_data);
                        }
                    }
                }
                if (action_list.length > 0) {
                    data.action_list = dc_utils.deck.sort(action_list);
                    console.log(data.action_list);
                }
            }else{
                if (this.actor.data.data.action_cards.length > 0) {
                    this.actor.update({data: {action_cards: []}});
                }
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
        html.find(".toggle-mod").click(this._on_toggle_modifier.bind(this));

        // Selections
        html.find(".add-posse-select").change(this._on_add_posse_select.bind(this));

        if (!(game.dc.gm_collapse)) {
            game.dc.gm_collapse = []
        }
        let gm_colls = document.getElementsByClassName("gm-collapsible");
        for (let i = 0; i < gm_colls.length; i++) {
            if (!(game.dc.gm_collapse[i])) {
                game.dc.gm_collapse[i] = false
            }
            gm_colls[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let gm_content = this.nextElementSibling;
                if (!(game.dc.gm_collapse[i])) {
                    gm_content.style.maxHeight = null;
                    game.dc.gm_collapse[i] = true;
                }else{
                    gm_content.style.maxHeight = gm_content.scrollHeight + "px";
                    game.dc.gm_collapse[i] = false;
                }
            });
            if (game.dc.gm_collapse[i]) {
                gm_colls[i].nextElementSibling.style.maxHeight = null;
            } else {
                gm_colls[i].nextElementSibling.style.maxHeight = gm_colls[i].nextElementSibling.scrollHeight + "px";
            }
        }
        /* let data_box = document.getElementsByClassName("gm-data")[0];
        var container_height = data_box.offsetHeight;
        var lastChild = data_box.childNodes[data_box.childNodes.length - 1];
        var vertical_offset = lastChild.offsetTop + lastChild.offsetHeight;
        data_box.style.height = (container_height - vertical_offset) + "px"; */
        return super.activateListeners(html);
    }

    sort_all_cards(list) {
        let r_list = []
        let rj_found = false;
        let bj_found = false;
        let cards = dc_utils.cards
        for (let card = 0; card < cards.length ; card++) {
            const cur_card = cards[card];
            for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                for (let chk = 0; chk < list.length; chk++) {
                    const act = list[chk];
                    const chk_list = act.data.data.action_cards;
                    let found = false;
                    for (let cd = 0; cd < chk_list.length; cd++) {
                        const chk_card = chk_list[cd] ? chk_list[cd] : {name: "--"};
                        const card_data = {name: chk_card.name, player: act.name};
                        if (card_data.is_sleeved) break;
                        if (cur_card == 'Joker') {
                            if (chk_card.name == `Joker ${dc_utils.suit_symbols.red_joker}` && !(rj_found)) {
                                r_list.push(card_data);
                                rj_found = true;
                                found = true;
                                break;
                            }else if(chk_card.name == `Joker ${dc_utils.suit_symbols.black_joker}` && !(bj_found)) {
                                r_list.push(card_data);
                                bj_found = true;
                                found = true;
                                break;
                            }
                        }else if(chk_card.name == `${cur_card}${cur_suit}`){
                            r_list.push(card_data);
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        break
                    }
                }
            }
        }
        return r_list;
    }

    sort_entities_by_card(list) {
        let r_list = []
        let rj_found = false;
        let bj_found = false;
        let cards = dc_utils.cards
        for (let card = 0; card < cards.length ; card++) {
            const cur_card = cards[card];
            for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                for (let chk = 0; chk < list.length; chk++) {
                    const act = list[chk];
                    const chk_card = act.data.data.action_cards[0] ? act.data.data.action_cards[0].name : "-\u2663";
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
        for (let chip of fate_chips) {
            if (chip.name == chip_type) {
                let r_msg = dc_utils.marshal_fate_responses[Math.floor(Math.random() * dc_utils.marshal_fate_responses.length)]
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
        return dc_utils.gm.update_sheet();
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
        return dc_utils.gm.update_sheet();
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
        return dc_utils.gm.update_sheet();
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
        if (char) {
            char.update({data: {marshal: this.actor.name}});
            this.actor.update({data: {posse: posse}});
        }
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
        operations.discard_card(card);
        dc_utils.combat.remove_card(tkn, 0);
        dc_utils.gm.update_sheet();
    }

    _on_toggle_modifier(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let mod     = element.closest(".modifier").dataset.index;
        let mods    = this.actor.data.data.modifiers;
        mods[mod].active = !mods[mod].active;
        this.actor.update({data: {modifiers: mods}});
    }
}