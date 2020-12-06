# Deadlands-Classic
A system for playing Deadlands Classic in Foundry VTT.

Install with the link for system.json in the releases page in the usual Foundry method.

## Marshal Sheet:
Very simple currently, I plan on adding much more to this in time.  Buttons for starting and ending Combat and a place for you to draw Fate Chips.

## Player Sheet:
The Character Sheet starts with just a list of skills, the core stat block and an Image.
Each of the skills has a roll button which will send an inline roll to chat naming the skill clicked, enter the skill level and any modifiers.
I split the shootin' skill into the 4 main categories, Pistol, Rifle, Shotgun and Automatic as weapons can all be given a type to determine which skill to use.
There is a button under the image to draw a fate chip so players can do this for themselves without Marshal interaction. It will whisper a message to the Marshal whenever clicked however.  You can click the trash icon to 'Use' the chip and a message will be sent to chat saying you spent it or click the '$' icon to trade them in for bounty points which will get added to your character.
You can add items in the usual way by dragging them onto the sheet, each adds buttons for the player to interact with it.

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
|Name        | The name of the weapon each copy placed on a sheet is seperate so players can name their guns.|
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
