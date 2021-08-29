class Poker extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['doc'],
            popOut: true,
            template: `systems/deadlands_classic/templates/sheets/poker/poker.html`,
            id: 'poker-app',
            title: 'Poker',
            width: 800,
            height: 600,
        });
    }
  
    getData() {
        // Return data to the template
        let data = super.getData();
        data.players = game.dc.poker.players;
        return data;
    }
  
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-player").click(this._on_add_player.bind(this));
    }
    
    _on_add_player(event) {
        event.preventDefault();
        let element    = event.currentTarget;
        let name       = dc_utils.char.random_name('male');
        let gamblin    = element.closest('difficulty-gamblin').value;
        let bluff      = element.closest('difficulty-bluff').value;
        let scrutinize = element.closest('difficulty-scrutinize').value;
        let cash       = element.closest('player-cash').value;
        this.add_ai(name, gamblin, bluff, scrutinize, cash);
    }

    add_ai(name, gam, blf, scr, cash){
        let diff = {
            sucker: {
                level:    1,
                die_type: 'd6',
                modifier: -8
            },
            player: {
                level:    2,
                die_type: 'd8',
                modifier: 0
            },
            gambler: {
                level:    3,
                die_type: 'd10',
                modifier: 0
            },
            huckster: {
                level:    5,
                die_type: 'd12',
                modifier: 2
            }
        }
        game.dc.poker_game.players[name] = {
            hasPlayerOwner: false,
            name: name,
            cash: cash,
            skills: {
                gamblin:    `${diff[gam].level}${diff[gam].die_type} + ${diff[gam].modifier}`,
                bluff:      `${diff[blf].level}${diff[blf].die_type} + ${diff[blf].modifier}`,
                scrutinize: `${diff[scr].level}${diff[scr].die_type} + ${diff[scr].modifier}`,
            }
        }
    }
}