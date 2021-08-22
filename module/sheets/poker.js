class Poker extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['doc'],
            popOut: true,
            template: `systems/deadlands_classic/templates/sheets/misc/poker.html`,
            id: 'poker-app',
            title: 'Poker',
            width: 500,
            height: 300,
        });
    }
  
    getData() {
        // Return data to the template
        let data = super.getData();
        data.players = [
            {
                name: 'Jeff',
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
    }
  
    async _updateObject(event, formData) {
        console.log(formData.exampleInput);
    }
  }