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
        data.players = [
            {
                name: 'Jeff',
                hasPlayerOwner: false,
                data: {
                    data: {
                        cash: 250,
                        traits: {
                            smarts: {
                                level: 3,
                                die_type: 'd10',
                                skills: {
                                    gamblin: {
                                        level: 3,
                                        modifier: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ];
      return data;
    }
  
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-player").click(this._on_add_player.bind(this));
    }
    
    _on_add_player(event) {

    }
  }