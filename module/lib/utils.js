let dc_utils = {
    char: {
        /*  Get Skill:
                Will return a dict containing level, die type and modifiers for any skill or trait.
        */
        get_skill: function(actor_name, skill_name) {
            let act = game.actors.getName(actor_name);
            for (const trait_name in act.data.data.traits) {
                const trait = act.data.data.traits[trait_name];
                if (trait_name == skill_name) {
                    return {
                        level: trait.level,
                        die_type: trait.die_type,
                        modifier: trait.modifier
                    };
                }else if (Object.hasOwnProperty.call(trait.skills, skill_name)) {
                    const skill = act.data.data.traits[trait_name].skills[skill_name];
                    if (skill.level > 0) {
                        return {
                            level: skill.level,
                            die_type: trait.die_type,
                            modifier: skill.modifier + trait.modifier
                        }
                    }else{
                        return {
                            level: trait.level,
                            die_type: trait.die_type,
                            modifier: skill.modifier + trait.modifier
                        }
                    }
                }
            }
            throw 'DC | ERROR: skill not found.';
        },
        get_armour: function(actor_name, location) {
            let act = game.actors.getName(actor_name);
            return act.data.data.armour[location];
        },
        get_items: function(actor_name, type) {
            
        }
    }
};