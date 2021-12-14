# Deadlands-Classic
A system for playing Deadlands Classic in Foundry VTT.

# Updated for 0.8.x

Install by copy/pasting this link into the manifest URL textbox in the install system screen in foundry.
https://raw.githubusercontent.com/RhombusWeasel/Deadlands-Classic/main/system.json

You will also need a companion module I made to add Deadlands style exploding dice to the Foundry dice roller.
This is installed in the 'Add-on Modules' tab in the Foundry menu, same method, paste the below link into the URL box at the bottom of the window.
https://raw.githubusercontent.com/RhombusWeasel/Deadlands-Classic-Dice-Explosion/main/module.json

# We now have a Discord: https://discord.gg/ZMg8eQvNzm
If you have any trouble getting this all set up I'll be easier to reach there.

# Getting Started:
First thing's first, you'll need a GM Actor.  This is like a players character sheet but it gives you the Marshal a place to draw Fate Chips and action cards, it's also got a calendar at the top to let you set the date and time for the campaign.  So, once you've created the GM player then open up the sheet for it and set it to the GM Sheet in the menu at the top of the character sheet labelled 'Sheet'.  Once that's done, you're all set on the Marshal side, then you'll need a Player.
Same as the Marshal create a new actor only this time select 'Player' from the dropdown, on the plus side, the player should already be set to the correct sheet so you're good to go there.  Once your player is created and has a cool new name you can go back to your GM Sheet and add the player to the Posse using the dropdown on the 'Combat' tab.  Select the player from the dropdown and click 'Add', once done this character is controlled by the GM Sheet you linked it to, this is useful if you want to run a second Posse through the campaign you made.  If you want a second Posse then create a second GM Sheet and add the new Posse to the new GM Sheet.
OK, so we've got a Marshal and a Player setup, now it's time to launch a Private Browsing Window and login as the player you just made.  From this split view you can test the dice rolls etc.  If you set a TN on the Marshal Sheet then it will apply to the Players rolls and you can toggle their bleeding/running/mounted states from the GM Sheet too as well as see how many fate chips and wind they have left.

## Combat Automation Update
The latest version has now got fully automated combat.  Players must have a weapon with which to attack and set a target, once this is done the player can click the attack 
button on their sheet and the attack roll will be made.  All skill rolls now have popups attached so players can choose to spend fate chips on the rolls.
If a player is shot at and they have an action card left then they will recieve a dodge popup so they can decide if they want to use the card to vamoose or take their chances.  
Choosing to dodge results in a skill roll being made by the player (with the ability to further spend chips) which is then checked against the attack roll once made.
If the attack beats the TN set by the Marshal on the Marshal Sheet then the attack succeeds and hit location is rolled, the system checks for any armour in that location and reduces the damage dice accordingly and adds any additional dice for a Gizzards or Noggin shot.  Raises are taken into account for the location roll, 
the system currently just selects a location based on the highest amount of damage dice it can get so if the d20 + raises would make it to the Noggin then you'll get the extra 2 dice.
If players take damage then a popup will appear on their screen to allow spending fate chips to soak the damage, it's worth noting that this combat system is incredibly lethal.
Make sure your players have plenty of fate chips, I killed at least 6 characters in a single shot while testing this.

## Combat Automation Gotcha's
The system currently uses the tokens disposition to determine a few things so player characters tokens must be set to friendly, Friendly NPC's should be set to Neutral and Enemies set to Hostile.  This allows for warning players that they are about to break the law by shooting a bystander and give a chance to cancel an attack made against another player.  This warning can be ignored by the player.

The reloading system now uses ammo from the players inventory so each guns Calibur stat must have a goods item with the same name on the players sheet to function.

## Marshal Sheet:
Buttons for starting and ending Combat and a place for you to draw Fate Chips.  Each Character Sheet has a button to roll Quickness in the Combat Hand section, this does nothing until you hit 'Start Combat' on the Marshal Sheet.
Once you do that button will roll their Quickness and deal the correct amount of cards to the player, these show up on the sheet in the same section. Clicking this button also adds them to the combat and once you've seen that all the players have drawn cards there is a button for you to draw a card from the action deck, click this as many times as you feel comfortable.  Below the cards you are dealt you should now see the action queue, each card owned by a character in the combat is listed in turn order so you can easily see who is next.  Once the players have played cards you can click the refresh button on the Marshal sheet to update the list.
One side of the Marshal sheet is filled with checkboxes, these all add modifiers to the global TN for all skill rolls, make sure the TN is set correctly before rolls are made.
There's also a button for you to draw fate chips.

## Generator Sheet
This sheet should be set for new players as it has a button on it to draw 12 cards from a deck and displays them in the sidebar with the amount and dice type each card is worth.
All fields on this sheet are text inputs for allowing you to customise the sheet but once the character has been finalized then the Marshal should set the character to use the Player sheet.

## Player Sheet:
The Player Sheet once activated removes the skill inputs so all skills can only be improved by using bounty points.  Players can get bounty points by clicking the $ icon on fate chips, once they have enough to increase a skill / trait then a [+] icon will appear next to the skill for them to click to raise the level.
Any items added to the sheet will be displayed in the Trappin's section of the sheet and each will reveal buttons for actions they allow, see individual items listed below.

## Mook Sheets:
Mooks are an Idea I borrowed from the game Feng Shui, these are short lived combat NPC's for when you need a quick posse of Bandits or whatever.
Each has a reduced list of skills available, just enough for combat. Make a Mook character and set the sheet to the NPC sheet and you will see a button to generate some stats for them.  You can drag weapons and other items onto a mook and they will work just the same as for players.  
This combined with https://foundryvtt.com/packages/token-hud-wildcard/ allows you to setup a Bandit or Townsfolk class with a random token assigned every time you add one to the map, if you make sure you uncheck link actor data on the prototype token dialog you can double click these tokens to make fresh stats for each one on the sheet that opens.  These stats are stored to the token however and any changes made to them are only saved to that token.

## Item Sheets:
As I can't bundle any compendiums with this pack each item type has been broken down into different categories each has a page where you can enter the values for the item and add a description.  Once you've made a few items then you can start to drag and drop them onto character sheets to put a copy of the item on that character.

### Firearms:
Firearms have the following attributes:
|  Attribute  | Description |
--------------|--------------
|Name         | The name of the weapon each copy placed on a sheet is seperate so players can name their guns.|
|Image        | Any image you wish to add
|Description  | Any text you'd like, I've been using the top paragraph on wikipedia from a given google search.
|Calibur      | The calibur of bullet required.
|Type         | The type of firearm, accepted values are; pistol, rifle, shotgun or automatic currently. all must be lower case.
|Speed        | How many actions to fire the weapon (Depending on the version you're playing, in later versions just leave this at 1, earlier versions rifles took 2 actions to fire.)
|Range        | The range increment of the weapon.
|R.O.F        | The rate of fire for the weapon
|Chamber      | The current number of bullets loaded
|Clip         | The maximum number of bullets allowed
|Damage       | The amount and die type of damage - exploding damage is handled by the system so just [x]d[y] will do.
|Damage Bonus | Specifically for the Winchester '76 which for some reason has +2 to damage rolls and is the only gun that does.

Placed on a character they reveal 4 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|Fire    | Rolls an attack roll for the weapon using the characters stats, the gun's damage and a d20 for location.  Ammo is tracked on the weapon and they can't be fired when empty.|
|Reload  | Rolls a speed load check and adds bullets to the weapon.|
|Trash   | Removes the weapon from the sheet.|

### Melee Weapons:
There are a few edge cases for melee weapons that I haven't accounted for but I am working on getting these fixed.
Melee weapons (currently) have the following attributes:
| Attribute  | Description |
-------------|--------------
|Name        | The name of the weapon each copy placed on a sheet is seperate so players can name their knives.|
|Image       | Any image you wish to add|
|Description | Any text you'd like, I've been using the top paragraph on wikipedia from a given google search.|
|Damage      | The amount and die type of damage - exploding damage and the additional strength roll are handled by the system so just [x]d[y] will do.|

Placed on a character they reveal 3 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|attack  | Rolls an attack roll for the weapon using the characters stats, strength plus the weapon's damage and a d20 for location.|
|Trash   | Removes the weapon from the sheet.|

### Tricks:
Tricks are dealt with using the rules from Hucksters and Hexes.
Tricks have the following attributes:
| Attribute  | Description |
-------------|--------------
|Name        | The name of the Trick|
|Image       | Any image you wish to add|
|Description | Any text you'd like, I'd recommend some handy rules.|
|Level       | Each copy of the trick on a player sheet can set this to any value, number of dice to roll.|
|Trait       | The trait associated with this trick, write the trait in full all lowercase eg deftness|
|Speed       | The amount of actions required to cast the trick|
|Duration    | The duration of the trick|
|Range       | The range of the trick|

Placed on a character they reveal 3 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|Cast    | Rolls the Hex's level of the Hex's trait dice then deals them the correct amount of cards from a deck.  They can trash the cards on their sheet to show them in chat.|
|Trash   | Removes the Hex from the sheet.|

### Hexes:
Hexes are dealt with using the rules from Hucksters and Hexes.
Hexes have the following attributes:|
| Attribute  | Description |
-------------|--------------
|Name        | The name of the weapon each copy placed on a sheet is seperate so players can name their guns.|
|Image       | Any image you wish to add|
|Description | Any text you'd like, I'd recommend some handy rules.|
|Level       | Each copy of the hex on a player sheet can set this to any value, number of dice to roll.|
|Trait       | The trait associated with this Hex, write the trait in full all lowercase eg deftness|
|Hand        | The minimum hand required for the Hex to be cast|
|Speed       | The amount of actions required to cast the Hex|
|Duration    | The duration of the Hex|
|Range       | The range of the Hex|

Placed on a character they reveal 3 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|Cast    | Rolls the Hex's level of the Hex's trait dice then deals them the correct amount of cards from a deck.  They can trash the cards on their sheet to show them in chat.|
|Trash   | Removes the Hex from the sheet.|

### Miracles:
Miracles have the following attributes:
| Attribute  | Description |
-------------|--------------
|Name        | The name of the weapon each copy placed on a sheet is seperate so players can name their guns.|
|Image       | Any image you wish to add|
|Description | Any text you'd like, I'd recommend some handy rules.|
|TN          | The target number for the Miracle.|
|Speed       | The number of actions to cast the Miracle|
|Duration    | The Duration of the Miracle|
|Range       | The range of the Miracle|

Placed on a character they reveal 3 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|Cast    | Rolls a faith check against the target number listed.|
|Trash   | Removes the Miracle from the sheet.|

### Favors:
Favors have the following attributes:
| Attribute  | Description |
-------------|--------------
|Name        | The name of the weapon each copy placed on a sheet is seperate so players can name their guns.|
|Image       | Any image you wish to add|
|Description | Any text you'd like, I'd recommend some handy rules.|
|Appeasement | The amount of appeasement needed for the Favor.|
|Duration    | The duration of the Favor|
|Range       | The range of the Favor|

Placed on a character they reveal 3 Buttons:
| Button | Description |
---------|--------------
|Info    | Shows the info panel for this item and lets the players modify names and attributes.|
|Cast    | Currently does nothing.|
|Trash   | Removes the Favor from the sheet.|
