class Poker extends FormApplication {
    constructor(exampleOption) {
      super();
      this.exampleOption = exampleOption;
    }
  
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
        classes: ['doc'],
        popOut: true,
        template: `systems/deadlands_classic/templates/misc/poker.html`,
        id: 'poker-app',
        title: 'Poker',
      });
    }
  
    getData() {
      // Return data to the template
      let data = super.getData();
      data.players = {}
      return data;
    }
  
    activateListeners(html) {
      super.activateListeners(html);
    }
  
    async _updateObject(event, formData) {
      console.log(formData.exampleInput);
    }
  }