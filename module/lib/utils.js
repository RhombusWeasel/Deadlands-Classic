const dc_utils = {
    // Raw Data:
    uuid_keys: `0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ`,
    cards: ["Joker", "A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"],
    suits: ["Spades", "Hearts", "Diamonds", "Clubs"],
    suit_symbols: {Spades: "\u2660", Hearts: "\u2661", Diamonds: "\u2662", Clubs: "\u2663", red_joker: String.fromCodePoint(0x1F607), black_joker: String.fromCodePoint(0x1F608)},
    joker_cards: ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"],
    joker_suits: {Spades: "\u2660", Hearts: "\u2661", Diamonds: "\u2662", Clubs: "\u2663"},
    bounty: {"White": 1, "Red": 2, "Blue": 3, "Legendary": 5},
    skills: [
        {key: "cognition", label: "Cognition"},
        {key: "artillery", label: "Artillery"},
        {key: "art", label: "Art"},
        {key: "scrutinize", label: "Scrutinize"},
        {key: "search", label: "Search"},
        {key: "trackin", label: "Trackin"},
        {key: "deftness", label: "Deftness"},
        {key: "bow", label: "Bow"},
        {key: "filchin", label: "Filchin'"},
        {key: "lockpickin", label: "Lockpickin'"},
        {key: "shootin_pistol", label: "Shootin' Pistol"},
        {key: "shootin_rifle", label: "Shootin' Rifle"},
        {key: "shootin_shotgun", label: "Shootin' Shotgun"},
        {key: "shootin_automatic", label: "Shootin' Automatic"},
        {key: "sleight_o_hand", label: "Sleight o' hand"},
        {key: "speed_load", label: "Speed Load"},
        {key: "throwin", label: "Throwin'"},
        {key: "knowledge", label: "Knowledge"},
        {key: "academia", label: "Academia"},
        {key: "area_knowledge", label: "Area Knowledge"},
        {key: "demolition", label: "Demolition"},
        {key: "disguise", label: "Disguise"},
        {key: "mad_science", label: "Mad Science"},
        {key: "medicine", label: "Medicine"},
        {key: "professional", label: "Professional"},
        {key: "science", label: "Science"},
        {key: "trade", label: "Trade"},
        {key: "mien", label: "Mien"},
        {key: "animal_wranglin", label: "Animal Wranglin'"},
        {key: "leadership", label: "Leadership"},
        {key: "overawe", label: "Overawe"},
        {key: "performin", label: "Performin'"},
        {key: "persuasion", label: "Persuasion"},
        {key: "tale_tellin", label: "Tale Tellin"},
        {key: "nimbleness", label: "Nimbleness"},
        {key: "climbin", label: "Climbin'"},
        {key: "dodge", label: "Dodge"},
        {key: "drivin", label: "Drivin'"},
        {key: "fightin", label: "Fightin (Brawlin)"},
        {key: "horse_ridin", label: "Horse Ridin'"},
        {key: "sneak", label: "Sneak"},
        {key: "swimmin", label: "Swimmin'"},
        {key: "teamster", label: "Teamster"},
        {key: "quickness", label: "Quickness"},
        {key: "quick_draw", label: "Quick Draw"},
        {key: "smarts", label: "Smarts"},
        {key: "bluff", label: "Bluff"},
        {key: "gamblin", label: "Gamblin'"},
        {key: "ridicule", label: "Ridicule"},
        {key: "scroungin", label: "Scroungin'"},
        {key: "streetwise", label: "Streetwise"},
        {key: "survival", label: "Survival"},
        {key: "tinkerin", label: "Tinkerin'"},
        {key: "spirit", label: "Spirit"},
        {key: "faith", label: "Faith"},
        {key: "guts", label: "Guts"},
        {key: "strength", label: "Strength"},
        {key: "vigor", label: "Vigor"},
    ],
    names: {
        american: {
            surnames: [
                "Ahlborn",
                "Albers",
                "Allis",
                "Allum",
                "Anderson",
                "Andley",
                "Badger",
                "Barmes",
                "Barnett",
                "Baunaf",
                "Baylis",
                "Becker",
                "Berry",
                "Bershini",
                "Bien",
                "Bigs",
                "Book",
                "Bosworth",
                "Brady",
                "Brenker",
                "Bresnahan",
                "Briedekamp",
                "Brodrick",
                "Brooks",
                "Brown",
                "Bruir",
                "Bruno",
                "Bungh",
                "Burke",
                "Burnes",
                "Cabanne",
                "Café",
                "Cahill",
                "Cain",
                "Callahan",
                "Campbell",
                "Carter",
                "Clay",
                "Coboy?",
                "Collins",
                "Conely",
                "Conn",
                "Conner",
                "Conway",
                "Cook",
                "Cooley",
                "Corceran?",
                "Craven",
                "Creuser",
                "Criley",
                "Cullinan",
                "Cullivan",
                "Cumming",
                "Daffern",
                "Davis",
                "Denerwald",
                "Denning",
                "Derne",
                "Devlin",
                "Devoll",
                "Diamond",
                "Dickmeyer",
                "Dionysius",
                "Dollenberg",
                "Donahoe",
                "Donnelly",
                "Downey",
                "Doyle",
                "Droste",
                "Dryer",
                "Duhring",
                "Eagers",
                "East",
                "Eicherman",
                "Ellay",
                "Elly",
                "Elwein",
                "Estha",
                "Evans",
                "Evecker",
                "Evert",
                "Faile",
                "Farrelley",
                "Fink",
                "Fisher",
                "Flannery",
                "Flint",
                "Flower",
                "Fluchel",
                "Flynn",
                "Frohrmann",
                "Fulkos",
                "Geitz",
                "Gettins",
                "Gillrohy",
                "Gleisen",
                "Gobson",
                "Goodall",
                "Graham",
                "Gratiot",
                "Graves",
                "Gray",
                "Griffeth",
                "Groeh",
                "Haas",
                "Hall",
                "Hampsted",
                "Hanrahan",
                "Harrison",
                "Havely",
                "Heanley",
                "Heides",
                "Heines",
                "Heinkel",
                "Hennessy",
                "Henry",
                "Hill",
                "Hoffmeister",
                "Hollan",
                "Holton",
                "Hondoff",
                "Hopkins",
                "Howard",
                "Humes",
                "Hunter",
                "Hussey",
                "Jackson",
                "Jefeat",
                "Jephson",
                "Johnson",
                "Jones",
                "Keath",
                "Kehaler",
                "Keif",
                "Kelly",
                "Kemeny",
                "Kenke",
                "Kennedy",
                "Kenny",
                "Kiebler",
                "Kimball",
                "King",
                "Kinker",
                "Kleinschmidt",
                "Kruse",
                "Kruul",
                "Lafs",
                "Lancaster",
                "Lane",
                "Lauman",
                "Legler",
                "Lewis",
                "Litzinger",
                "Loftus",
                "Logan",
                "Lovey",
                "Low",
                "Lubering",
                "LuGafs",
                "Lynch",
                "Maher",
                "Martin",
                "Maxfield",
                "McCarty",
                "McCormac",
                "McDonald",
                "McKenzie",
                "McSweeney",
                "Meier",
                "Merriman",
                "Merrimann",
                "Meyer",
                "Mitchell",
                "Mode",
                "Moledord",
                "Montgomery",
                "Morgan",
                "Mormans",
                "Muegge",
                "Munson",
                "Music",
                "Nicholson",
                "Noel",
                "O'Brien",
                "O'Gorman",
                "Owens",
                "Parker",
                "Parms",
                "Parry",
                "Pittman",
                "Pitts",
                "Pollman",
                "Powell",
                "Powells",
                "Powers",
                "Quayle",
                "Quinn",
                "Ragan",
                "Rannells",
                "Reigert",
                "Reily",
                "Rhode",
                "Richard",
                "Rickel",
                "Rickhardt",
                "Roberts",
                "Robinson",
                "Rohaugh",
                "Ryan",
                "Schaefer",
                "Schiefer",
                "Schield",
                "Schillinger",
                "Schoney",
                "Schwake",
                "Schweneck",
                "Schwenker",
                "Sennett",
                "Sexton",
                "Shepard",
                "Shepherd",
                "Simes",
                "Smith",
                "Sohriss",
                "Sprott",
                "St.",
                "Stack",
                "Stapleton",
                "Stein",
                "Steinroder",
                "Steinrooks",
                "Stephens",
                "Stigerwald",
                "Stoope",
                "Suedmeier",
                "Sullivan",
                "Swable",
                "Sweeney",
                "Tarrants",
                "Taveril",
                "Thomas",
                "Thresen",
                "Tice",
                "Toban",
                "Tulley",
                "Uding",
                "Unn",
                "Vaden",
                "Valentine",
                "Vinsot",
                "Vitery",
                "Vogel",
                "Volz",
                "Vonderheist",
                "Walker",
                "Walsh",
                "Ward",
                "Washington",
                "Wayne",
                "Weinand",
                "Weise",
                "Weston",
                "White",
                "Wilkerson",
                "William",
                "Williams",
                "Wingart",
                "Wise",
                "Wyatt",
                "Yates"
            ],
            forenames: {
                male: [
                    "A.",
                    "A.S.",
                    "Adolph",
                    "Albert",
                    "Alden",
                    "Alexander",
                    "Allen",
                    "Almoth",
                    "Andre",
                    "Andrew",
                    "Anthony",
                    "Antone",
                    "August",
                    "Barney",
                    "Barnhard",
                    "Beaumont",
                    "Benard",
                    "Benj",
                    "Benjamin",
                    "Benton",
                    "Bernard",
                    "Bernhard",
                    "Bernhardt",
                    "C.B.",
                    "Carl",
                    "Charles",
                    "Chas",
                    "Christ",
                    "Claus",
                    "Conrad",
                    "Cornelius",
                    "Daniel",
                    "David",
                    "Dennis",
                    "Eddie",
                    "Edward",
                    "Edwin",
                    "Elias",
                    "Eliot",
                    "Emil",
                    "Englebert",
                    "Ernst",
                    "Eugene",
                    "Ezekiel",
                    "Felix",
                    "Ferdinand",
                    "Florance",
                    "Francis",
                    "Frank",
                    "Fred",
                    "Fritz",
                    "George",
                    "Gotleib",
                    "Gred",
                    "Gumer",
                    "Gust",
                    "Gustave",
                    "H.",
                    "H.F.A.",
                    "Harry",
                    "Henry",
                    "Herman",
                    "Hiram",
                    "Hugh",
                    "Hunter",
                    "Isaac",
                    "J.D.",
                    "J.H.",
                    "J.M.",
                    "J.W.",
                    "Jack",
                    "Jackson",
                    "Jacob",
                    "James",
                    "Jas",
                    "Jeremiah",
                    "John",
                    "Joseph",
                    "Julious",
                    "Julius",
                    "Langdon",
                    "Lawrence",
                    "Leo",
                    "Leonard",
                    "Leopold",
                    "Levestus",
                    "Louis",
                    "Lucy",
                    "Lugar",
                    "M.",
                    "Martin",
                    "Mason",
                    "Mathais",
                    "Michael",
                    "Morris",
                    "Ned",
                    "Nicholas",
                    "Orson",
                    "Oswald",
                    "Otto",
                    "Patrick",
                    "Peter",
                    "Philip",
                    "Phillip",
                    "Rich",
                    "Richard",
                    "Robert",
                    "Robt",
                    "Roda",
                    "Saml",
                    "Sampson",
                    "Sampson?",
                    "Samuel",
                    "Sandy",
                    "Sebastian",
                    "Sherman",
                    "Shompine",
                    "Sieg",
                    "Siegfried",
                    "Solomon",
                    "Stanislaw",
                    "Stephen",
                    "Thomas",
                    "Timothy",
                    "Toby",
                    "Tom",
                    "Tusta",
                    "Vincent",
                    "Waldo",
                    "Willard",
                    "William",
                    "Willie",
                    "Wm",
                    "Zachariah"
                ],
                female: [
                    "Abbie",
                    "Abigal",
                    "Adeline",
                    "Alice",
                    "Amanda",
                    "America",
                    "Angerona",
                    "Ann",
                    "Anna",
                    "Annie",
                    "Augusa",
                    "Barbara",
                    "Belle",
                    "Bertha",
                    "Bessie",
                    "Birdie",
                    "Bridget",
                    "Caroline",
                    "Catherine",
                    "Celeste",
                    "Charles",
                    "Charlotte",
                    "Christena",
                    "Christina",
                    "Clara",
                    "Cora",
                    "Cornelia",
                    "Cresentia?",
                    "Dora",
                    "Dortha",
                    "E.M.",
                    "Eda",
                    "Edith",
                    "Eleanor",
                    "Elija",
                    "Eliza",
                    "Elizabeth",
                    "Ellen",
                    "Emily",
                    "Emma",
                    "Essie",
                    "Etta",
                    "Fannie",
                    "Feronica",
                    "Frances",
                    "Fredericka",
                    "Fredreka",
                    "Genevia",
                    "Gertrude",
                    "Gumia?",
                    "Gusta",
                    "Gustine",
                    "Hannah",
                    "Hanora",
                    "Harriet",
                    "Henrietta",
                    "Hulda",
                    "Ida",
                    "Isabella",
                    "Isoline",
                    "Jane",
                    "Jennie",
                    "Johannah",
                    "Josephine",
                    "Julia",
                    "Kate",
                    "Katie",
                    "Laura",
                    "Lavinia",
                    "Lena",
                    "Lizzetta",
                    "Lizzie",
                    "Lora",
                    "Louisa",
                    "Louise",
                    "Lucy",
                    "Lyda",
                    "Magdalene",
                    "Maggie",
                    "Mamie",
                    "Manda",
                    "Margaret",
                    "Maria",
                    "Mary",
                    "Matilda",
                    "Maud",
                    "Mena",
                    "Metta",
                    "Mildet",
                    "Mira",
                    "Monica",
                    "Nancy",
                    "Nannie",
                    "Nellie",
                    "Nottlie",
                    "Octavia",
                    "Ophelia",
                    "Phoeba",
                    "Rachael",
                    "Rachel",
                    "Rebecca",
                    "Rega",
                    "Rosa",
                    "Rose",
                    "Ruth",
                    "S.E.",
                    "Sally",
                    "Samantha",
                    "Sarah",
                    "Savina",
                    "Severn",
                    "Sophia",
                    "Susan",
                    "Susanna",
                    "Tamar",
                    "Theresa",
                    "Victoria",
                    "Virginia",
                    "Winnie"
                ]
            },
        },
        native_american: {
            male: [
                "Abooksigun (Wildcat)",
                "Abornazine (Keeper of the flame.)",
                "Abukcheech (Mouse)",
                "Achak (Spirit)",
                "Adahy (Lives in the woods)",
                "Aditsan (Listener)",
                "Adriel (beaver, symbol of skill)",
                "Ahanu (He laughs)",
                "Ahiga (He fights)",
                "Ahmik (Beaver)",
                "Ahote (Restless one)",
                "Ahtunowhiho (One who lives below)",
                "Ahusaka (Wings)",
                "Akando (ambush)",
                "Akecheta (Fighter)",
                "Akule (Looks up)",
                "Alahmoot (Elm branch)",
                "Aleekcheaahoosh (Accomplished)",
                "Alikkees (Haircut)",
                "Allahkoliken (Antlers)",
                "Alo (Spiritual guide)",
                "Anakausuen (Worker)",
                "Angvariationu (Another day)",
                "Annawan (Chief)",
                "Annawon (Chief)",
                "Anoki (Actor)",
                "Apash (Flint necklace)",
                "Apenimon (Worthy of trust)",
                "Apiatan (Lance)",
                "Aponivi (Where the wind blows down the gap)",
                "Appanoose (Sauk word for child.)",
                "Ar-ke-kee-tah (Stay)",
                "Aranck (Stars)",
                "Arapoosh (Stomach ache.)",
                "Arre-catte (Large elk.)",
                "Ashishishe (Crow)",
                "Ashkii (Boy)",
                "Ashkii (Sacred child; Holy child.)",
                "Askook (Snake)",
                "Askuwheteau (He keeps watch)",
                "Ata'halne' (He interrupts)",
                "Atagulkalu (Pitched trees)",
                "Atsidi (Blacksmith)",
                "Attakullakulla (Pitched trees)",
                "Avonaco (Lean bear)",
                "Awan (Somebody)",
                "Ayawamat (One who follows orders)",
                "Bagwunagijik (Hole in the sky)",
                "Bemidii (River by a lake)",
                "Bemossed (Walker)",
                "Beshiltheeni (Metalworker)",
                "Bidziil (He is strong)",
                "Bilagaana (White person)",
                "Bimisi (Slippery)",
                "Bisahalani (Speaker)",
                "Bodaway (Fire maker)",
                "Bornbazine (Keeper of the flame)",
                "Buegoneguig (Hole in the sky)",
                "Canowicakte (Forest hunter)",
                "Cashesegra (Tracks of a large animal)",
                "Cetanwakuwa (Attacking hawk.)",
                "Cha'akmongwi (Crier chief)",
                "Cha'tima (The caller)",
                "Chankoowashtay (Good road)",
                "Chansomps (Locust)",
                "Chas (chunk a Wave)",
                "Chaska (Sioux name given to the first son born.)",
                "Chavatangakwunua (Short rainbow)",
                "Chayton (Falcon)",
                "Cheasequah (Cherokee name meaning red bird.)",
                "Cheauka (Hopi name meaning clay.)",
                "Chebona (Bula Creek name meaning laughing boy.)",
                "Cherokee (People of a different speech. One of the largest American Indian tribes.)",
                "Chesmu (Rough; abrasive; witty.)",
                "Cheveyo (Spirit warrior)",
                "Chitto (Creek name meaning brave.)",
                "Chochmo (Mud mound)",
                "Chochokpi (Throne for the clouds)",
                "Chochuschuvio (White tailed deer)",
                "Chogan (Blackbird)",
                "Choovio (Antelope)",
                "Choviohoya (Young deer)",
                "Chowilawu (Joined together by water)",
                "Chu'a (Snake)",
                "Chuchip (Deer spirit)",
                "Chunta (Cheating)",
                "Chuslum (Moxmox Nez Perce name meaning yellow bull.)",
                "Ciqala (Little one)",
                "Cochise (Wood. Renowned warrior chief of the Chiricahua Apache.)",
                "Coowescoowe (Cherokee name meaning egret.)",
                "Dadgayadoh (Seneca name meaning gambling men.)",
                "Dakota (Friend; ally. Tribal name.)",
                "Dakotah (Friend; ally. Tribal name.)",
                "Dasan (Chief.)",
                "Deganawidah (Variant of Dekanawida: Iroquois name meaning two rivers running.)",
                "Degataga (Cherokee name meaning gathering.)",
                "Dekanawida (Iroquois name meaning two rivers running.)",
                "Delsin (he is so)",
                "Delsy (Variant of Delsin: He is so.)",
                "Demothi (Talks while walking.)",
                "Dichali (Talks later; speaks a lot.)",
                "Diwali (Cherokee name meaning bowl.)",
                "Dohasan (Kiowa name meaning cliff.)",
                "Dohate (Variant of Dohasan: Kiowa name meaning cliff.)",
                "Dohosan (Variant of Dohasan: Kiowa name meaning cliff.)",
                "Dyami (eagle)",
                "Ealahweemah (Nez Perce name meaning sleep.)",
                "Ealaot (Wadass Nez Perce name meaning earth.)",
                "Ealaothek (Kaunis Nez Perce name meaning birds landing.)",
                "Eapalekthiloom (Nez Perce name meaning mound of clouds.)",
                "Edensaw (Tlingit name meaning glacier.)",
                "Elan (Friendly.)",
                "Elaskolatat (Nez Perce name meaning animal running into the ground.)",
                "Elki (Draping over.)",
                "Elsu (Flying falcon.)",
                "Elu (full of grace)",
                "Eluwilussit (Holy one)",
                "Enapay (Brave)",
                "Enkoodabaoo (One who lives alone)",
                "Enkoodabooaoo (One who lives alone)",
                "Enli (I saw a dog.)",
                "Enyeto (Walks as a bear.)",
                "Eskaminzim (Apache name meaning big mouth.)",
                "Espowyes (Nez Perce name for light on the mountain.)",
                "Etchemin (Canoe man)",
                "Etlelooaat (Shouts)",
                "Etu (The sun.)",
                "Eyanosa (Sioux name meaning big both ways.)",
                "Eyota (Great.)",
                "Ezhno (Solitary.)",
                "Gaagii (Raven)",
                "Gad (Juniper tree)",
                "Gosheven (Leaper.)",
                "Guyapi (Frank.)",
                "Hahkethomemah (Little robe)",
                "Hahnee (Beggar.)",
                "Hakan (Fire.)",
                "Hania (Spirit warrior)",
                "Harkahome (Little robe)",
                "Hassun (Stone)",
                "Hastiin (Man)",
                "Hawiovi (Going down the ladder)",
                "He (lush ka Fighter (Winnebago).)",
                "Heammawihio (Wise one above)",
                "Hekli (Touch)",
                "Helaku (sunny day)",
                "Heskovizenako (Porcupine bear)",
                "Hesutu (Yellow jacket's nest rising out of the ground)",
                "Hevataneo (Hairyrope)",
                "Hevovitastamiutsto (Whirlwind)",
                "Hiamovi (High chief)",
                "Hinto (Blue)",
                "Hohnihohkaiyohos (High backed wolf)",
                "Hok'ee (Abandoned)",
                "Honani (Badger)",
                "Honaw (Bear)",
                "Honiahaka (Little wolf)",
                "Honon (Bear)",
                "Honovi (Strong.)",
                "Hotah (White)",
                "Hototo (Warrior spirit who sings)",
                "Hotuaekhaashtait (Tall bull)",
                "Howahkan (Of the mysterious voice)",
                "Howi (Turtle dove)",
                "Huritt (Handsome)",
                "Igasho (Wanders.)",
                "Illanipi (Amazing.)",
                "Inteus (Has no shame.)",
                "Istaqa (Coyote man)",
                "Istu (Sugar.)",
                "Jacy (the moon)",
                "Jolon (valley of the dead oaks)",
                "Kachada (White man)",
                "Kaga (Chronicler.)",
                "Kajika (Walks without sound.)",
                "Kangee (Raven)",
                "Kele (Sparrow)",
                "Keme (Secret Pajackok - thunder)",
                "Kesegowaase (Swift)",
                "Kestejoo (Slave)",
                "Kitchi (Brave)",
                "Knoton (Wind.)",
                "Kohana (Swift)",
                "Kohkahycumest (White crow or white antelope)",
                "Kolichiyaw (Skunk)",
                "Koshisigre (Tracks of a large animal.)",
                "Kosumi (Fishes for salmon with spear)",
                "Kotori (Screech owl spirit)",
                "Kuckunniwi (Little wolf)",
                "Kuruk (Bear)",
                "Kwahu (Eagle)",
                "Kwatoko (Bird with big beak)",
                "Langundo (Peaceful.)",
                "Lansa (Lance)",
                "Lapu (Cedar bark)",
                "Len (Flute)",
                "Lenno (Man.)",
                "Leyti (Shaped like an abalone shell)",
                "Lise (Salmon's head rising above water)",
                "Liwanu (Growl of a bear)",
                "Lokni (Rain falls through the roof)",
                "Lonato (Flint.)",
                "Lootah (Red)",
                "lye (Smoke.)",
                "Machakw (Horny toad)",
                "Machk (Bear)",
                "Mahkah (Earth)",
                "Mahpee (Sky)",
                "Makkapitew (He has large teeth)",
                "Makya (Eagle hunter)",
                "Mantotohpa (Four bears)",
                "Masichuvio (Gray deer)",
                "Maska (Strong.)",
                "Matchitehew (He has an evil heart)",
                "Matchitisiw (He has bad character)",
                "Matoskah (White bear)",
                "Matunaagd (Fights)",
                "Matwau (Enemy)",
                "Maza (blaska Flat iron)",
                "Megedagik (Kills many)",
                "Mekledoodum (Conceited)",
                "Meturato (Black kettle)",
                "Milap (Charitable.)",
                "Mingan (Gray wolf.)",
                "Minninnewah (Whirlwind)",
                "Misu (Rippling brook)",
                "Mochni (Talking bird)",
                "Mojag (Never silent.)",
                "Mokatavatah (Black kettle)",
                "Moki (Deer)",
                "Mokovaoto (Black kettle)",
                "Molimo (Bear walking into shade)",
                "Mona (Gathers jimson weed seed)",
                "Mongwau (Owl)",
                "Motavato (Black kettle)",
                "Motega (new arrow)",
                "Muata (Yellow jackets inside a nest)",
                "Mukki (Child)",
                "Muraco (White moon.)",
                "Naalnish (He works)",
                "Naalyehe (ya sidahi Trader)",
                "Nahcomence (Oldbark antelope)",
                "Nahele (Forest.)",
                "Nahiossi (Has three fingers)",
                "Napayshni (Strong or courageous)",
                "Nastas (Curve like foxtail grass)",
                "Nawat (Left handed.)",
                "Nawkaw (Wood (Winnebago).)",
                "Nayati (He who wrestles.)",
                "Neeheeoeewootis (High backed wolf)",
                "Neka (Wild goose.)",
                "Nigan (Ahead.)",
                "Niichaad (Swollen)",
                "Nikiti (Round or smooth.)",
                "Nitis (Friend.)",
                "Nixkamich (Grandfather)",
                "Niyol (Wind)",
                "Nodin (wind)",
                "Nootau (Fire)",
                "Nosh (Father)",
                "Noshi (Father)",
                "Nukpana (Evil)",
                "Ocumwhowurst (Yellow wolf)",
                "Ocunnowhurst (Yellow wolf)",
                "Odakota (Friend)",
                "Ogaleesha (Wears a red shirt)",
                "Ohanko (Reckless.)",
                "Ohanzee (Shadow)",
                "Ohcumgache (Little wolf)",
                "Ohitekah (Brave)",
                "Okhmhaka (Little wolf)",
                "Omawnakw (Cloud feather)",
                "Otaktay (Kills many)",
                "Otoahhastis (Tall bull)",
                "Otoahnacto (Bull bear)",
                "Ouray (Arrow.)",
                "Pachu'a (Feathered water snake)",
                "Paco (Eagle.)",
                "Pahana (Lost white brother)",
                "Pallaton (Warrior.)",
                "Pannoowau (He lies)",
                "Pat (Fish.)",
                "Patamon (raging)",
                "Patwin (Man.)",
                "Pay (He is coming.)",
                "Payat (He is coming.)",
                "Payatt (He is coming.)",
                "Paytah (Fire)",
                "Pilan (supreme essence)",
                "PiMne (Weasel)",
                "Powwaw (Priest)",
                "Qaletaqa (Guardian of the people)",
                "Qochata (White man)",
                "Rowtag (Fire)",
                "Sahale (above)",
                "Sakima (King.)",
                "Sani (The old one)",
                "Segenam (Lazy)",
                "Sewati (Curved bear claw)",
                "Shaman (holy man)",
                "Shilah (Brother)",
                "Shiriki (Coyote)",
                "Shishiesh (Crow)",
                "Shiye (Son)",
                "Shizhe'e (Father)",
                "Shoemowetochawcawe (High backed wolf)",
                "Sicheii (Grandfather)",
                "Sik'is (Friend)",
                "Sike (He sits at home)",
                "Sikyahonaw (Yellow bear)",
                "Sikyatavo (Yellow rabbit)",
                "Siwili (Tail of the fox.)",
                "Skah (White)",
                "Songaa (Strong.)",
                "Sowi'ngwa (Black tailed deer)",
                "Sucki (Black)",
                "Sunukkuhkau (He crushes)",
                "T'iis (Cottonwood)",
                "Tahkeome (Little robe)",
                "Tahmelapachme (Dull knife)",
                "Taima (Thunder.)",
                "Takoda (Friend to everyone)",
                "Tangakwunu (Rainbow)",
                "Tasunke (Horse)",
                "Tatanka (Short bull)",
                "Tate (He who talks too much.)",
                "Teetonka (Talks too much)",
                "Telutci (Bear making dust)",
                "Tihkoosue (Short)",
                "Tocho (Mountain lion)",
                "Togquos (Twin)",
                "Tohopka (Wild beast)",
                "Tokala (Fox)",
                "Tooantuh (Spring frog)",
                "Tse (Rock)",
                "Tsiishch'ili (Curly haired)",
                "Tuketu (Bear making dust)",
                "Tupi (To pull up)",
                "Tyee (chief)",
                "Uzumati (Bear)",
                "Vaive (atoish Alights on the cloud)",
                "Vaiveahtoish (Alights on the cloud)",
                "Viho (Chief)",
                "Vipponah (Slim face)",
                "Vohkinne (Roman nose)",
                "Voistitoevitz (White cow)",
                "Voisttitoevetz (White cow)",
                "Vokivocummast (White antelope)",
                "Wahanassatta (He who walks with his toes turned outward)",
                "Wahchinksapa (Wise)",
                "Wahchintonka (Has much Practice)",
                "Wahkan (Sacred)",
                "Wakiza (Desperate warrior.)",
                "Wamblee (Eagle)",
                "Wambleesha (White eagle)",
                "Wambli (waste Good eagle)",
                "Wanageeska (White spirit)",
                "Wanahton (Charger)",
                "Wanikiy (Savior)",
                "Wapi (Lucky.)",
                "Waquini (Hook nose)",
                "Weayaya (Setting sun)",
                "Wematin (Brother)",
                "Wemilat (Of wealthy parents.)",
                "Wicasa (Sage)",
                "Wikvaya (One who brings)",
                "Wohehiv (Dull knife)",
                "Wokaihwokomas (White antelope)",
                "Wuyi (Soaring turkey vulture)",
                "Wynono (First born.)",
                "Wyome (plain)",
                "Yahto (blue)",
                "Yanisin (Ashamed)",
                "Yas (Snow)",
                "Yiska (The night has passed)",
                "Yuma (Son of the chief)"
            ],
            female: [
                "Abey (Leaf)",
                "Aiyana (Eternal Bloom)",
                "Alaqua (Sweet-gum Tree)",
                "Aleshanee (She plays all the time)",
                "Alona (Oak Tree)",
                "Amitola (Rainbow)",
                "Angeni (Spirit Angel)",
                "Aponi (Butterfly)",
                "Aquene (Peace)",
                "Ayita (worker)",
                "Benquasha (daughter of Ben)",
                "Bly (high, tall)",
                "Chenoa (white dove)",
                "Cheyenne",
                "Chilali (snowbird)",
                "Chimalis (bluebird)",
                "Dyani (deer)",
                "Enola (magnolia)",
                "Etania (wealthy)",
                "Fala (crow)",
                "Halona (fortunate)",
                "Huyana (rain falling)",
                "Istas (snow)",
                "Kachine (Sacred Dancer)",
                "Kaniya",
                "Kiona (Brown Hills)",
                "Koko (Night)",
                "Laquetta",
                "Meda (Priestess)",
                "Miakoda (Power of the Moon)",
                "Minda (Knowledge)",
                "Mitena (Coming Moon)",
                "Mitexi (Sacred Moon)",
                "Nita (Bear)",
                "Nitika (Angel of Precious Stone)",
                "Olathe (Beautiful)",
                "Onida (The Expected One)",
                "Sakari (Sweet)",
                "Satinka (Magic Dancer)",
                "Shako (Mint)",
                "Shysie (Silent Little One)",
                "Taborri (Voices that Carry)",
                "Tacincala (Deer)",
                "Taima (Crash of Thunder)",
                "Tainn (New Moon)",
                "Takoda (Friend to all)",
                "Tala (Stalking Wolf)",
                "Tama (Thunderbolt)",
                "Tareva-Chine (Beautiful eyes)",
                "Tarsha",
                "Tayen (New Moon)",
                "Tehya (Precious)",
                "Waneta (Charger)",
                "Wapeka (Skillful)",
                "Winema (Female Chief)",
                "Zaltana (High Mountain)",
            ],
        },
    },
    called_shots: {
        any:  {name: "None" , mod:  0,  locations: ['any']},
        head: {name: "Head", mod: -6,  locations: ['noggin'], msg: `They're aimin' for the head!`},
        hand: {name: "Hand" , mod: -6,  locations: ['arm_left', 'arm_right'], msg: `They're aimin' fer their hand!`},
        arm:  {name: "Arm"  , mod: -4,  locations: ['arm_left', 'arm_right'], msg: `They're aimin' fer the arm!`},
        leg:  {name: "Leg"  , mod: -4,  locations: ['leg_left', 'leg_right'], msg: `They're aimin' fer the legs!`},
        body: {name: "Body" , mod: -2,  locations: ['guts', 'lower_guts', 'gizzards'], msg: `They're aimin' center of mass.`},
        eye:  {name: "Eye"  , mod: -10, locations: ['noggin'], msg: `The eye!?! This one's trying to blind someone!`}
    },
    hit_locations: {leg_left: 'Left Leg', leg_right: 'Right Leg', lower_guts: 'Lower Guts', gizzards: 'Gizzards', arm_left: 'Left Arm', arm_right: 'Right Arm', guts: 'Upper Guts', noggin: 'Noggin'},
    locations: ['Left Leg','Right Leg','Left Leg','Right Leg','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Lower Guts','Gizzards','Left Arm','Right Arm','Left Arm','Right Arm','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Upper Guts','Noggin'],
    loc_lookup: ['leg_left','leg_right','leg_left','leg_right','lower_guts','lower_guts','lower_guts','lower_guts','lower_guts','gizzards','arm_left','arm_right','arm_left','arm_right','guts','guts','guts','guts','guts','noggin'],
    hand_slots: [{key: 'dominant', label: 'Dominant'}, {key: 'off', label: 'Off'}],
    equip_slots: [{key: 'head', label: 'Head'}, {key: 'body', label: 'Body'}, {key: 'legs', label: 'Legs'}],
    stackable: ['goods', 'components'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    day_suffix: ['', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'],
    dow:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    moon_phases: ['New', 'Waxing Crescent', 'Quarter', 'Waxing Gibbous', 'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],

    // Helper Functions:
    /** UUID
    * Pass any number of integers, returns a uuid with char blocks equal to each int '-' seperated
    */
    uuid: function() {
        let str = ''
        for (let a = 0; a < arguments.length; a++) {
            for (let i = 0; i < arguments[a]; i++) {
                str += dc_utils.uuid_keys[Math.floor(Math.random() * dc_utils.uuid_keys.length)];
            }
            if (a < arguments.length - 1) {
                str += '-'
            }
        }
        return str
    },
    /** GET_ACTOR
     * Gets an actor from a name, will check actors and tokens and return just the Actor object.
     * @param {string} name 
     * @returns Actor
     */
    get_actor: function(name) {
        let char = game.actors.getName(name);
        if (char) {
            return char;
        }
        return canvas.tokens.placeables.find(i => i.name == name).document.actor;
    },
    get_token: function(name) {
        return canvas.tokens.placeables.find(i => i.name == name);
    },
    /** PLURALIZE
     * @param {INT} amt The numerical value to check against
     * @param {STR} a The Singular version
     * @param {STR} b The Plural version
     * @returns STR The singular or Plural provided as a and b
     */
    pluralize: function(amt, a, b) {
        if (amt == 1) return `${amt} ${a}`;
        return `${amt} ${b}`
    },
    pad: function(str, size) {
        while (str.length < (size || 2)) {str = "0" + str;}
        return str;
    },
    sort: {
        compare: function(object1, object2, key) {
            let obj1
            let obj2
            if (key == 'name' || key == 'type') {
                obj1 = object1.data[key].toUpperCase();
                obj2 = object2.data[key].toUpperCase();
            }else{
                obj1 = object1.data.data[key].toUpperCase();
                obj2 = object2.data.data[key].toUpperCase();
            }
        
            if (obj1 < obj2) {
                return -1;
            }
            if (obj1 > obj2) {
                return 1;
            }
            return 0;
        }
    },
    gm: {
        get_online_users: function() {
            return game.users.contents.filter(function(i) {return i.active});
        },
        get_player_owned_actors: function() {
            return game.actors.contents.filter(function(i) {return i.hasPlayerOwner});
        },
        get_online_actors: function(act) {
            let users = dc_utils.gm.get_online_users();
            let pcs   = dc_utils.gm.get_player_owned_actors();
            let r_tab = [
                //{
                //    name: "Empty"
                //}
            ]
            for (let i = 0; i < users.length; i++) {
                if (!(users[i].isGM)) {
                    for (let p = 0; p < pcs.length; p++) {
                        let char = pcs[p];
                        if ('permission' in char.data.data && users[i].id in char.data.data.permission) {
                            r_tab.push(char);
                        }
                    }
                }
            }
            return r_tab;
        },
        update_sheet: function() {
            if (game.user.isGM) {
                setTimeout(() => {
                    game.user.character.sheet.render(false)
                    dc_utils.socket.emit('force_update', {});
                }, 500);
            }
        },
        update_time: function(act, period, mult) {
            let val = {
                year: 31449600000,
                month: 2419200000,
                day:     86400000,
                hour:     3600000,
                minute:     60000 * 5
            }
            let new_val = act.data.data.timestamp + (val[period] * mult)
            act.update({data: {timestamp: new_val}});
            game.settings.set('deadlands_classic','unixtime', new_val);
            dc_utils.gm.update_sheet();
        },
    },
    user: {
        get_owned_actors: function() {
            return game.actors.filter(i => i.isOwner == true);
        },
    },
    char: {
        random_name: function(eth, sex) {
            if (eth == 'american') {
                let fn = Math.floor(Math.random() * dc_utils.names.american.forenames[sex].length)
                let sn = Math.floor(Math.random() * dc_utils.names.american.surnames.length)
                return `${dc_utils.names.american.forenames[sex][fn]} ${dc_utils.names.american.surnames[sn]}`
            }else if (eth == 'native_american') {
                let fn = Math.floor(Math.random() * dc_utils.names.native_american[sex].length);
                return `${dc_utils.names.native_american[sex][fn]}`;
            }
        },
        has: function(act, type, name) {
            let items = dc_utils.char.items.get(act, type);
            for (const item of items) {
                if (item.name == name) {
                    return item;
                }
            }
            return false;
        },
        bounty: {
            get: function(act) {
                return act.data.data.bounty.value;
            },
            add: function(act, amt) {
                let bty = act.data.data.bounty
                return act.update({data: {bounty: {value: bty.value + amt, max: bty.max + amt}}})
            },
            remove: function(act, amt) {
                let bty = act.data.data.bounty
                return act.update({data: {bounty: {value: bty.value - amt}}})
            },
        },
        skill: {
            get: function(act, skill_name) {
                for (const trait_name in act.data.data.traits) {
                    const trait = act.data.data.traits[trait_name];
                    if (trait_name == skill_name) {
                        return {
                            name:      trait.name,
                            key:       skill_name,
                            trait:     trait_name,
                            level:     parseInt(trait.level),
                            die_type:  trait.die_type,
                            die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                            trait_fb:  false,
                            modifier:  parseInt(trait.modifier)
                        };
                    }else if (Object.hasOwnProperty.call(trait.skills, skill_name)) {
                        const skill = act.data.data.traits[trait_name].skills[skill_name];
                        if (parseInt(skill.level) > 0) {
                            return {
                                name:      skill.name,
                                key:       skill_name,
                                trait:     trait_name,
                                level:     parseInt(skill.level),
                                die_type:  trait.die_type,
                                die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                                trait_fb:  false,
                                modifier:  parseInt(skill.modifier) + parseInt(trait.modifier)
                            }
                        }else{
                            return {
                                name:      skill.name,
                                key:       skill_name,
                                trait:     trait_name,
                                level:     parseInt(trait.level),
                                die_type:  trait.die_type,
                                die_sides: parseInt(trait.die_type.slice(1, trait.die_type.length)),
                                trait_fb:  true,
                                modifier:  parseInt(skill.modifier) + parseInt(trait.modifier)
                            }
                        }
                    }
                }
                throw `DC | ERROR: skill ${skill_name} not found.`;
            },
            set_level: function(act, skill_name, lvl) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: lvl}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: lvl}}}}}});
                }
            },
            add_level: function(act, skill_name, amt) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait_fb) {
                    skill.level = 0;
                    dc_utils.char.skill.add_modifier(act, skill_name, 8);
                }
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: skill.level + amt}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: skill.level + amt}}}}}});
                }
            },
            add_modifier: function(act, skill_name, mod) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                let sk_mod = parseInt(skill.modifier) || 0;
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {modifier: sk_mod + mod}}}});
                } else {
                    if (skill.trait_fb) {
                        let trait = dc_utils.char.skill.get(act, skill.trait);
                        sk_mod -= trait.modifier;
                    }
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {modifier: sk_mod + mod}}}}}});
                }
            },
            remove_level: function(act, skill_name, amt) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.level <= 1) {
                    skill.level = amt;
                    dc_utils.char.skill.add_modifier(act, skill_name, -8);
                }
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {level: skill.level - amt}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {level: skill.level - amt}}}}}});
                }
            },
            remove_modifier: function(act, skill_name, mod) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.trait == skill_name) {
                    return act.update({data: {traits: {[skill_name]: {modifier: skill.modifier - mod}}}});
                } else {
                    return act.update({data: {traits: {[skill.trait]: {skills: {[skill_name]: {modifier: skill.modifier - mod}}}}}});
                }
            },
            set_die_type: function(act, skill_name, sides) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                return act.update({data: {traits: {[skill.trait]: {die_type: `${sides}`}}}});
            },
            increase_die_type: function(act, skill_name) {
                let skill = dc_utils.char.skill.get(act, skill_name);
                if (skill.die_sides < 12) {
                    return act.update({data: {traits: {[skill.trait]: {die_type: `d${skill.die_sides + 2}`}}}});
                }
            },
        },
        items: {
            add: function(act, item) {
                if (dc_utils.stackable.includes(item.type)) {
                    let found_item = act.items.filter(function (i) {return i.name == item.name});
                    if (found_item.length > 0) {
                        let numParse = parseInt;
                        if (found_item[0].data.data.is_float) {
                            numParse = parseFloat;
                        }
                        let has = numParse(found_item[0].data.data.amount);
                        let amt = numParse(item.data.data.amount);
                        if (found_item.length > 0) {
                            dc_utils.char.items.update(found_item[0], {amount: has + amt});
                            return;
                        }
                    }
                }
                setTimeout(() => {act.createOwnedItem(item)}, Math.random() * 1000);
            },
            remove: function(act, item, amt) {
                if (item.data.data.equippable) {
                    if (dc_utils.char.items.is_equipped(act, item.data.data.slot, item.id)) {
                        dc_utils.char.items.unequip(act, item.data.data.slot);
                    }
                }
                if (dc_utils.stackable.includes(item.type)) {
                    if (item.data.data.amount > amt) {
                        dc_utils.char.items.update(item, {amount: item.data.data.amount - amt});
                        return;
                    }
                }
                setTimeout(() => {act.deleteEmbeddedDocuments("Item", [item.id])}, Math.random() * 1000);
            },
            update: function(item, data) {
                setTimeout(() => {item.update({data: data})}, Math.random() * 1000);
            },
            get: function(act, item_type, sort_key = 'name') {
                return act.items.filter(function (item) {return item.type == item_type})
                                .sort((a, b) => {return dc_utils.sort.compare(a, b, sort_key)});
            },
            get_card: function(act, name, deck) {
                let hand = dc_utils.char.items.get(act, deck);
                for (let card of hand) {
                    if (dc_utils.deck.get_card_value(card) == name) {
                        return card;
                    }
                }
            },
            get_equippable: function(act) {
                let eq = act.data.data.equipped
                return act.items.filter(function(i) {return i.data.data.equippable == true})
                    .sort((a, b) => {return dc_utils.sort.compare(a, b, 'type')});
            },
            get_equipped: function(act, slot) {
                return act.items.get(act.data.data.equipped[slot]);
            },
            unequip: function(act, slot) {
                let item = dc_utils.char.items.get_equipped(act, slot);
                if (item?.data?.data?.modifiers) {
                    for (let mod of item.data.data.modifiers) {
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.remove_modifier(act, mod.target, mod.modifier);
                        }else if (mod.type == 'armour_mod') {
                            dc_utils.char.armour.remove(act, mod.target, mod.modifier);
                        } else {
                            
                        }
                    }
                }
                if (item?.data?.data?.emits_light) {
                    dc_utils.socket.emit('toggle_light', {
                        name: act.name,
                        bright_light: 0,
                        dim_light: 0,
                        light_angle: 360
                    });
                }
                return act.update({data: {data: {equipped: {[slot]: 'Nuthin'}}}});
            },
            equip: function(act, slot, id) {
                dc_utils.char.items.unequip(act, slot);
                let item = act.items.get(id);
                if (item?.data?.data?.modifiers) {
                    for (let mod of item.data.data.modifiers) {
                        if (mod.type == 'skill_mod') {
                            dc_utils.char.skill.add_modifier(act, mod.target, mod.modifier);
                        }else if (mod.type == 'armour_mod') {
                            dc_utils.char.armour.add(act, mod.target, mod.modifier);
                        } else {
                            
                        }
                    }
                }
                if (item?.data?.data?.emits_light) {
                    dc_utils.socket.emit('toggle_light', {
                        name: act.name,
                        bright_light: item.data.data.bright_light,
                        dim_light: item.data.data.dim_light,
                        light_angle: item.data.data.light_angle
                    });
                }
                return act.update({data: {data: {equipped: {[slot]: id}}}});
            },
            is_equipped: function(act, slot, id) {
                if (id == act.data.data.equipped[slot]) {
                    return true;
                }
                return false;
            },
            delete: function(act, id) {
                let item = act.items.get(id);
                if (item?.data?.data?.amount > 1) {
                    return item.update({data: {amount: item.data.data.amount - 1}});
                }
                setTimeout(() => {act.deleteEmbeddedDocuments("Item", [id])}, 500);
            },
            compress: function(act, data) {
                let r_data = [];
                seen = [];
                /* for (let a = 0; a < data.length; a++) {
                    if (!(seen.includes(data[a].name))) {
                        seen.push(data[a].name);
                        let copies = act.items.filter(function (i) {return i.name == data[a].name});
                        let numParse = parseInt;
                        if (data[a].data.data.is_float) {
                            numParse = parseFloat;
                        }
                        let total = numParse(data[a].data.data.amount);
                        let del_list = [];
                        for (let i = 0; i < copies.length; i++) {
                            const copy = copies[i];
                            if (copy.id != data[a].id) {
                                if (!(del_list.includes(copy.id))) {
                                    total += numParse(copy.data.data.amount);
                                    del_list.push(copy.id);
                                }
                            }
                        }
                        if(data[a]) {
                            data[a].update({data: {amount: total}});
                        }
                        act.deleteEmbeddedDocuments("Item", del_list)
                    }
                } */
                return data
            },
            calculate_costs: function(act, items) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    let ppu = parseFloat(item.data.data.cost.slice(1));
                    if (item.data.data.boxed_multiple) {
                        ppu = ppu / item.data.data.box_amount
                    }
                    let total = '$' + (ppu * item.data.data.amount).toFixed(2);
                    if (total != item.data.data.total_cost) {
                        item.update({data: {total_cost: total}});
                    }
                }
            },
            recieve: function(act, item, amount) {
                let has_item = dc_utils.char.has(act, item.type, item.name);
                if (has_item) {
                    if (has_item.type == 'goods') {
                        has_item.update({data: {amount: has_item.data.data.amount + amount}});
                        return true;
                    }
                }
                let i = {
                    type: item.type,
                    name: item.name,
                    data: item.data.data
                }
                i.data.amount = amount;
                act.createOwnedItem(i);
            },
            pass: function(act, reciever, item_id, amount) {
                if (amount <= 0) return false;
                let item = act.items.get(item_id);
                let parseNum = parseInt;
                if (item.data.data.is_float){
                    parseNum = parseFloat
                }
                let total = parseNum(item.data.data.amount);
                amount = parseNum(amount);
                let rec = dc_utils.get_actor(reciever);
                let dist = Math.floor(canvas.grid.measureDistance(dc_utils.get_token(act.name), dc_utils.get_token(reciever)));
                if (dist > 2) {
                    dc_utils.chat.send('Out of range!', `You're too far away from ${rec.name} to pass items.`);
                    return false;
                }
                if (total >= amount) {
                    dc_utils.char.items.recieve(rec, item, amount);
                    if (total - amount <= 0) {
                        if (item.data.data.equippable) {
                            if (dc_utils.char.items.is_equipped(act, item.data.data.slot, item.id)) {
                                dc_utils.char.items.unequip(act, item.data.data.slot);
                            }
                        }
                        setTimeout(() => {act.deleteEmbeddedDocuments("Item", [item_id])}, 1000);
                        return true;
                    }else{
                        item.update({data: {amount: total - amount}});
                        return true;
                    }
                }
                return false;
            },
        },
        wounds: {
            add: function(act, loc, amt) {
                let ws = parseInt(act.data.data.wound_soak);
                let tot = act.data.data.wounds[loc] + amt;
                if (amt > 0) {
                    if (ws >= amt) {
                        act.update({data: {wound_soak: ws - amt}});
                        dc_utils.chat.send('Supernatural Vigor!', `${act.name} soaks ${dc_utils.pluralize(amt, 'wound', 'wounds')} supernaturally!`);
                        return true;
                    }else{
                        tot -= ws;
                        if (ws > 0) {
                            dc_utils.chat.send('Supernatural Vigor!', `${act.name} soaks ${dc_utils.pluralize(ws, 'wound', 'wounds')} supernaturally!`);
                        }
                        act.update({data: {wound_soak: 0}});
                    }
                    return setTimeout(() => {
                        act.update({data: {wounds: {[loc]: tot}}});
                        dc_utils.chat.send('Wound', `${act.name} takes ${dc_utils.pluralize(amt, 'wound', 'wounds')} to the ${dc_utils.hit_locations[loc]}`);
                        dc_utils.char.wounds.calculate_wound_modifier(act, amt);
                        dc_utils.char.wounds.apply_wind_damage(act, tot);
                    }, Math.random() * 500);
                }else{
                    dc_utils.chat.send('Wound', `${act.name} was lucky they just winged 'em.`);
                }
            },
            remove: function(act, loc, amt) {
                let tot = act.data.data.wounds[loc] - amt;
                return setTimeout(() => {act.update({data: {wounds: {[loc]: tot}}})}, Math.random() * 500);
            },
            apply_wind_damage: function(act, amt) {
                if (amt > 0) {
                    let wind_roll = new Roll(`${amt}d6`).roll();
                    wind_roll.toMessage({rollMode: 'gmroll'});
                    return setTimeout(() => {
                        act.update({data: {wind: {value: parseInt(act.data.data.wind.value) - wind_roll._total}}});
                        dc_utils.chat.send('Wind', `${act.name} takes ${wind_roll._total} wind.`);
                    }, Math.random() * 500);
                }
            },
            calculate_wound_modifier: function(act, amt) {
                let wm = act.data.data.wound_modifier
                let is_wounded = false
                for (const loc in act.data.data.wounds) {
                    if (Object.hasOwnProperty.call(act.data.data.wounds, loc) && loc != 'undefined') {
                        let cur = act.data.data.wounds[loc];
                        if (cur * -1 < wm) {
                            wm = cur * -1
                            is_wounded = true
                        }else{
                            if (cur > 0) {
                                is_wounded = true
                            }
                        }
                    }
                }
                if (wm * -1 < amt) {
                    wm = amt;
                }
                if (is_wounded) {
                    return setTimeout(() => {act.update({data: {wound_modifier: wm}})}, Math.random() * 1000);
                }else{
                    return setTimeout(() => {act.update({data: {wound_modifier: 0}})}, Math.random() * 1000);
                }
            },
            set_bleeding: function(act, bool) {
                act.update({data: {is_bleeding: bool}});
            },
            heal_roll: function(act, loc) {
                let tn = 3 + (act.data.data.wounds[loc] * 2);
                let data = dc_utils.new_roll_packet(act, 'skill', 'vigor', 'none');
                data.tn = tn;
                data.roll = dc_utils.roll.new(data);
                if (data.roll.success) {
                    dc_utils.char.wounds.remove(act, loc, 1);
                }
            },
        },
        armour: {
            get: function(act, location) {
                return parseInt(act.data.data.armour[location]);
            },
            add: function(act, location, amt) {
                let cur = dc_utils.char.armour.get(act, location);
                setTimeout(() => {act.update({data: {armour: {[location]: cur + parseInt(amt)}}})}, Math.random() * 500);
            },
            remove: function(act, location, amt) {
                let cur = dc_utils.char.armour.get(act, location);
                setTimeout(() => {act.update({data: {armour: {[location]: cur - parseInt(amt)}}})}, Math.random() * 500);
            },
        },
        chips: {
            get: function(act) {
                return act.items
                    .filter(function (item) {return item.type == 'chip'})
            },
            spend: function(act, label) {
                let chips = dc_utils.char.chips.get(act, 'chip');
                for (let item of chips.values()) {
                    if(item.name == label && item.type == 'chip') {
                        dc_utils.char.items.delete(act, item.id);
                        let reply = `
                            <h3 style="text-align:center">Fate</h3>
                            <p style="text-align:center">${act.name} spends a ${label} fate chip.</p>
                        `
                        if (label == 'Red'){
                            reply += `
                                <p style="text-align:center">The Marshal may draw a fate chip.</p>
                            `;
                        }
                        ChatMessage.create({content: reply});
                        return true;
                    }
                }
                ChatMessage.create({content: `
                    <h3 style="text-align:center">${act.name} has no ${label} chips.</h3>
                `});
                return false;
            }
        },
        money: {
            get: function(act) {
                return act.data.data.cash;
            },
            set: function(act, value) {
                return act.update({data: {cash: value}});
            },
            add: function(act, amt) {
                let tot = act.data.data.cash + amt;
                return act.update({data: {cash: tot}});
            },
            subtract: function(act, amt) {
                let tot = act.data.data.cash - amt;
                return act.update({data: {cash: tot}});
            },
        },
        weapon: {
            use_ammo: function(act, weapon_id) {
                let item = dc_utils.char.weapon.find(act, weapon_id);
                if (item) {
                    let shots = item.data.data.chamber;
                    if (shots < 1) {
                        return false;
                    }
                    shots = shots - 1;
                    item.update({"data.chamber": shots});
                    return true;
                }
                return false;
            },
            find: function(act, id) {
                let item = act.items.get(id);
                if (item) return item;
                if (act.data.data.current_vehicle != 'None') {
                    let v = dc_utils.get_actor(act.data.data.current_vehicle);
                    return v.items.get(id);
                }
            }
        },
        wind: {
            get: function(act) {
                return act.data.data.wind;
            },
            set: function(act, value) {
                act.update({data: {wind: {value: value}}});
            },
            reset: function(act) {
                let max = act.data.data.wind.max;
                act.update({data: {wind: {value: max}}});
            },
            bleed: function(act) {
                if (act.data.data.is_bleeding) {
                    let roll = new Roll(`1d6`).roll();
                    let wind = act.data.data.wind.value - roll._total;
                    roll.toMessage();
                    dc_utils.char.wind.set(act, wind);
                    dc_utils.chat.send('Bleeding', `${act.name} bleeds out for ${roll._total} wind!`);
                }
            },
        },
        token: {
            get: function(act) {
                let owned = canvas.tokens.placeables.find(i => i.owner == true);
                for (let t = 0; t < owned.length; t++) {
                    let tgt = owned[t]
                    if (tgt.owner) {
                        if (tgt.name == act.name){
                            return tgt;
                        }
                    }
                }
                return false;
            },
            get_name: function(name) {
                return canvas.tokens.placeables.find(i => i.name == name);
            },
        },
        target: {
            get: function() {
                for (let t = 0; t < canvas.tokens.placeables.length; t++) {
                    let tgt = canvas.tokens.placeables[t]
                    for (let u of tgt.targeted) {
                        if (u.id == game.user.id) {
                            return tgt;
                        }
                    }
                }
                return false;
            }
        },
    },
    token: {
        add: function(name, x, y) {
            let tk = duplicate(game.actors.getName(name).data.token);
            tk.x = x
            tk.y = y
            return canvas.scene.createEmbeddedDocuments("Token", [tk]);
        },
        remove: function(name) {
            let tkn = canvas.tokens.placeables.find(i => i.name == name);
            if (tkn) canvas.scene.deleteEmbeddedDocuments('Token', [tkn.id]);
        },
    },
    item: {
        add_modifier: function(item, data){
            item.update({data: {modifiers: data}});
        },
        remove_modifier: function(item, index) {
            let mods = item.data.data.modifiers;
            mods.splice(index);
            item.update({data: {modifiers: mods}});
        },
    },
    roll: {
        new_roll_packet: function(act, type, skl, wep, tgt) {
            let item = dc_utils.char.weapon.find(act, wep);
            let dist = 1
            if (!(item)) {
                wep = 'unarmed'
            }
            let target = dc_utils.char.target.get(act);
            if (tgt) {
                target = dc_utils.get_actor(tgt);
            }
            if (!(target) && !(type == 'skill')) {
                return false;
            }
            if (target) {
                let tkn = dc_utils.char.token.get_name(act.name);
                let tgt = dc_utils.char.token.get_name(target.name);
                dist = Math.floor(canvas.grid.measureDistance(tkn, tgt));
                if (type == 'melee' && dist > 2) {
                    dc_utils.chat.send('Out of range!', `You'll need to haul ass if you want to get there this round.`);
                    return false;
                }
            }
            let skill = dc_utils.char.skill.get(act, skl);
            let data = {
                uuid:       dc_utils.uuid(4, 4, 4, 4),
                type:       type,
                roller:     act.name,
                target:     target.name,
                attacker:   act.name,
                weapon:     wep,
                range:      dist,
                tn:         5,
                name:       act.name,
                called:     act.data.data.called_shot,
                skill:      skl,
                amt:        skill.level,
                dice:       skill.die_type,
                skill_name: skill.name,
                modifiers:  {
                    skill: {label: 'Skill + Trait', modifier: skill.modifier},
                    wound: {label: 'Wounds', modifier: act.data.data.wound_modifier},
                }
            };
            let mods = game.actors.getName(act.data.data.marshal).data.data.modifiers;
            for (const [key, mod] of Object.entries(mods)){
                if (mod.active) {
                    data.modifiers[key] = {
                        label: mod.name,
                        modifier: parseInt(mod.mod)
                    };
                }
            }
            let boons = dc_utils.char.items.get(act, "boon");
            for (let i = 0; i < boons.length; i++) {
                let boon = boons[i].data.data;
                for (let m = 0; m < boon.modifiers.length; m++) {
                    const mod = boon.modifiers[m];
                    if (mod.type == 'skill_mod' && boon.active) {
                        if (mod.target == skl) {
                            data.modifiers[`boon_${i}`] = {
                                label: boons[i].name,
                                modifier: parseInt(mod.modifier)
                            };
                        }
                    }
                }
            }
            if (skl == 'guts') {
                data.modifiers.grit = {
                    label: 'Grit',
                    modifier: act.data.data.grit,
                };
            }
            if (item) {
                if (data.type == 'ranged') {
                    data.modifiers.range = {label: 'Range', modifier: -(Math.max(Math.floor(dist / parseInt(item.data.data.range)), 0))};
                    if (target?.data?.data?.is_running) {
                        data.modifiers.moving_target = {label: 'Moving Target', modifier: -4};
                    }
                    if (act.data.data.is_running) {
                        data.modifiers.running = {label: 'Running', modifier: -4};
                    }
                    if (act.data.data.is_mounted) {
                        data.modifiers.mounted = {label: 'Mounted', modifier: -2};
                    }
                }
                if (act.data.data.equipped.off == item.id) {
                    if (dc_utils.char.has(act, 'edge', 'Two Fisted') && data.type == 'ranged') {
                        let tgk = dc_utils.char.has(act, 'edge', 'Two-Gun Kid')
                        if (tgk) {
                            if (Math.abs(parseInt(tgk.data.data.cost)) == 3) {
                                data.modifiers.off_hand = {label: 'Off Hand', modifier: -1}
                            }
                        }else{
                            data.modifiers.off_hand = {label: 'Off Hand', modifier: -2}
                        }
                    }else{
                        data.modifiers.off_hand = {label: 'Off Hand', modifier: -6}
                    }
                }
            }
            if (type == 'melee' || type == 'ranged') {
                if (act.data.data.aim_bonus > 0) {
                    data.modifiers.aim = {label: 'Aim', modifier: act.data.data.aim_bonus};
                    dc_utils.combat.clear_aim(act);
                }
                let tgt_loc = act.data.data.called_shot
                if (tgt_loc != 'any') {
                    data.modifiers.called = {label: `${dc_utils.called_shots[tgt_loc].name} shot.`, modifier: dc_utils.called_shots[tgt_loc].mod};
                }
            }
            return data;
        },
        new: function(data) {
            let modifier = 0
            for (let key of Object.keys(data.modifiers)) {
                modifier += parseInt(data.modifiers[key].modifier);
            }
            let r_data = {
                success: false,
                crit_fail: false,
                tn: data.tn,
                total: 0,
                dice: data.dice,
                amt: data.amt,
                modifier: modifier,
                raises: 0,
                pass: 0,
                ones: 0,
                results: [],
            };
            data.modifier = modifier
            let roll = new Roll(`${data.amt}${data.dice}ex + ${modifier}`).roll();
            r_data.total = roll._total;
            let count = 0;
            roll.terms[0].results.forEach(die => {
                if (die.result + modifier >= data.tn && count < r_data.amt) {
                    r_data.pass += 1;
                }else if (die.result == 1 && count < r_data.amt) {
                    r_data.ones += 1;
                }
                r_data.results.push(die.result);
            });
            if (r_data.pass >= r_data.ones && r_data.total >= data.tn) {
                r_data.success = true;
                r_data.raises = Math.floor((roll._total - r_data.tn) / 5);
            }
            if (r_data.pass < r_data.ones) {
                r_data.success = false;
                r_data.crit_fail = true;
            }
            //roll.toMessage({rollMode: 'gmroll'});
            return r_data;
        },
        evaluate: function(data) {
            data.pass = 0;
            data.ones = 0;
            for (let i = 0; i < data.amt; i++) {
                const res = data.results[i];
                if (res + data.modifier >= data.tn) {
                    data.pass += 1;
                }else if (res == 1) {
                    data.ones += 1;
                }
                if (res + data.modifier > data.total) {
                    data.total = res + data.modifier;
                }
            }
            if (data.pass >= data.ones) {
                data.crit_fail = false;
            }else{
                data.crit_fail = true;
            }
            if (data.pass >= data.ones && data.total >= data.tn) {
                data.success = true;
                data.raises = Math.floor((data.total - data.tn) / 5);
            }
            return data;
        },
        get_tn: function() {
            let mods = game.actors.getName('Marshal').data.data.modifiers;
            let tn = 5;
            for (const [key, mod] of Object.entries(mods)){
                if (mod.active) {
                    tn -= mod.mod;
                }
            }
            return tn;
        },
        location_roll(raises, key) {
            let loc_key
            if (key == 'any') {
                let loc_roll = new Roll('1d20').roll();
                //loc_roll.toMessage({rollMode: 'gmroll'});
                let tot = loc_roll._total - 1;
                let found = [];
                let range = raises * 2 || 0;
                if (range == 0) {
                    return dc_utils.loc_lookup[tot];
                }
                for (let i = tot - range; i < tot + range; i++) {
                    if (dc_utils.loc_lookup[i] != undefined) {
                        if (!(found.includes(dc_utils.loc_lookup[i]))) {
                            found.push(dc_utils.loc_lookup[i]);
                        }
                    }
                }
                if (found.includes('noggin')) {
                    return 'noggin';
                }else if (found.includes('gizzards')) {
                    return 'gizzards';
                }
                loc_key = found[found.length - 1];
            }else{
                let locs = dc_utils.called_shots[key].locations
                loc_key = locs[Math.floor(Math.random() * locs.length)]
            }
            return loc_key;
        },
        get_result_template: function(data) {
            let r_str = `
                <div class="center typed">
                    <p style="text-align:center">${data.roller} rolled:</p>
                    <table style="table-layout: fixed;">
                        <tr class="center">
            `;
            for (let i = 0; i < data.roll.amt; i++) {
                const res = data.roll.results[i];
                if(res){
                    if (res + data.modifier >= data.tn) {
                        r_str += `
                            <td class="center" style="color: green">${res}</td>
                        `;
                    }else if (res == 1) {
                        r_str += `
                            <td class="center" style="color: red">${res}</td>
                        `;
                    }else {
                        r_str += `
                            <td class="center">${res}</td>
                        `;
                    }
                }
            }
            r_str += `
                        </tr>
                    </table>
            `;
            if (data.modifier != 0) {
                r_str += `
                    <h3 class="center">Modifiers</h3>
                    <table>`;
                for (let key of Object.keys(data.modifiers)) {
                    if (data.modifiers[key].modifier != 0) {
                        r_str += `
                            <tr class="center typed">
                                <td class="center">${data.modifiers[key].label} [${data.modifiers[key].modifier}]</td>
                            </tr>
                        `;
                    }
                }
                r_str += `
                    </table>
                `;
            }
            return r_str + `
                    <p class="center typed">Total: ${data.roll.total}</p>
                </div>
            `;
        },
    },
    deck: {
        new: function(id) {
            let deck = [];
            for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                let suit_label = dc_utils.suits[suit]
                for (let card = 1; card < dc_utils.cards.length; card++) {
                    deck.push({
                        name: `${dc_utils.cards[card]}${dc_utils.suit_symbols[suit_label]}`,
                        type: id,
                        sleeved: false
                    });
                }        
            }
            deck.push({name: `Joker ${dc_utils.suit_symbols.red_joker}`, type: id})
            deck.push({name: `Joker ${dc_utils.suit_symbols.black_joker}`, type: id})
            deck = dc_utils.deck.shuffle(deck);
            return deck
        },
        shuffle: function(deck) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            return deck;
        },
        sort: function(card_pile) {
            let r_pile = [];
            let rj_found = false;
            let bj_found = false;
            for (let card = 0; card < dc_utils.cards.length ; card++) {
                const cur_card = dc_utils.cards[card];
                for (let suit = 0; suit < dc_utils.suits.length; suit++) {
                    const cur_suit = dc_utils.suit_symbols[dc_utils.suits[suit]];
                    for (let chk = 0; chk < card_pile.length; chk++) {
                        const chk_card = card_pile[chk].name;
                        if(card_pile[chk].sleeved) {
                            r_pile.unshift(card_pile[chk]);
                            break;
                        }
                        if (cur_card == 'Joker') {
                            if (chk_card == `Joker ${dc_utils.suit_symbols.red_joker}` && !(rj_found)) {
                                r_pile.push(card_pile[chk]);
                                rj_found = true;
                                break;
                            }else if(chk_card == `Joker ${dc_utils.suit_symbols.black_joker}` && !(bj_found)) {
                                r_pile.push(card_pile[chk]);
                                bj_found = true;
                                break;
                            }
                        }else if(chk_card == `${cur_card}${cur_suit}`){
                            r_pile.push(card_pile[chk]);
                            break;
                        }
                    }
                }
            }
            return r_pile;
        },
        get_card_value: function(card) {
            let value = card.name.charAt(0);
            if (card.name.length > 2) {
                value = card.name.slice(0, 2);
            }
            return value;
        },
        calculate_straight: function(instances){
            let count = 0;
            let cards = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"];
            let hand = '';
            for (let i = 0; i < cards.length; i++) {
                if (instances[cards[i]]) {
                    count += 1;
                    hand += ` ${cards[i]}`;
                }else{
                    count = 0;
                    hand = '';
                }
                if (count >= 5) {
                    return hand;
                }
            }
            return false;
        },
        evaluate_hand: function(card_pile) {
            let card_instances = {};
            let suit_instances = {};
            let str;
            for (let c = 0; c < card_pile.length; c++) {
                const card = card_pile[c];
                let value = dc_utils.deck.get_card_value(card);
                let suit = card.name.slice(-1);
                if (card_instances[value]){
                    card_instances[value] += 1;
                }else{
                    card_instances[value] = 1;
                }
                if (suit_instances[suit]) {
                    suit_instances[suit] += 1;
                }else{
                    suit_instances[suit] = 1;
                }
            }
            let flush = false;
            for (const key in suit_instances) {
                const count = suit_instances[key];
                if (count >= 5) {
                    // Flush draw, check for straight
                    str = dc_utils.deck.calculate_straight(card_instances);
                    if (str) {
                        return 'Straight Flush:'+str;
                    }else{
                        flush = key;
                    }
                }
            }
            // check for quads, check trips, pairs etc while we're here.
            let found_3 = false;
            let found_2 = false;
            let found_2_2 = false;
            for (const key in card_instances) {
                if (Object.hasOwnProperty.call(card_instances, key)) {
                    const tot = card_instances[key];
                    if (tot == 4) return `4 of a kind: ${key} ${key} ${key} ${key}` + dc_utils.deck.poker.get_best_kicker(card_pile, [key], 1);
                    if (tot == 3) found_3 = key;
                    if (tot == 2) {
                        if (found_2) {
                            if (dc_utils.cards.indexOf(key) < dc_utils.cards.indexOf(found_2)) {
                                found_2_2 = found_2;
                                found_2 = key;
                            }else if(found_2_2) {
                                if (dc_utils.cards.indexOf(key) < dc_utils.cards.indexOf(found_2_2)) {
                                    found_2_2 = key;
                                }
                            }
                        }else{
                            found_2 = key;
                        }
                    }
                }
            }
            if (found_3 && found_2) return `Full House: ${found_3}'s over ${found_2}'s`;
            if (flush) {
                str = ''
                for (let c = 0; c < card_pile.length; c++) {
                    let card = card_pile[c]
                    let suit = card.name.slice(-1);
                    if (suit == flush) {
                        str += ` ${dc_utils.deck.get_card_value(card)}`;
                    }
                }
                return `Flush:`+str;
            }
            // Check for straight
            str = dc_utils.deck.calculate_straight(card_instances);
            if (str) {
                return 'Straight:'+str;
            }
            if (found_3) return `Three of a kind: ${found_3} ${found_3} ${found_3}` + dc_utils.deck.poker.get_best_kicker(card_pile, [found_3], 2);
            if (found_2_2) return `Two Pair: ${found_2} ${found_2} ${found_2_2} ${found_2_2}` + dc_utils.deck.poker.get_best_kicker(card_pile, [found_2, found_2_2], 1);
            if (found_2) return `Pair: ${found_2} ${found_2}` + dc_utils.deck.poker.get_best_kicker(card_pile, [found_2], 3);
            let val = dc_utils.deck.get_card_value(card_pile[0])
            return `High Card: ${val}` + dc_utils.deck.poker.get_best_kicker(card_pile, [val], 4);
        },
        poker: {
            // Don't forget to sort the hand before calling this...
            get_best_kicker: function(hand, block_list, count=1) {
                if (hand.length <= count) return '';
                let r_str = '';
                for (let i = 0; i < hand.length; i++) {
                    let card = hand[i];
                    let val = dc_utils.deck.get_card_value(card);
                    if (!(block_list.includes(val))) {
                        r_str += ` ${val}`;
                        count -= 1;
                    }
                    if (count == 0) return r_str;
                }
            },
            generate_scoring_hands: function() {
                let hands =[];
                let cards = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "A"];
                // Straight flushes
                for (let c = 0; c < cards.length - 4; c++) {
                    let hand = 'Straight Flush:'
                    for (let i = c; i < c + 5; i++) {
                        hand += ` ${cards[i]}`;
                    }
                    hands.push(hand);
                }
                // Four of a kind
                for (let c = 0; c < cards.length - 1; c++) {
                    for (let k = 0; k < cards.length - 1; k++) {
                        if (k != c) {
                            hands.push(`Four of a kind: ${cards[c]} ${cards[c]} ${cards[c]} ${cards[c]} ${cards[k]}`);
                        }
                    }
                }
                // Full Houses
                for (let o = 0; o < cards.length - 1; o++) {
                    for (let u = 0; u < cards.length - 1; u++) {
                        if (o != u) {
                            hands.push(`Full House: ${cards[o]}'s over ${cards[u]}'s`);
                        }
                    }
                }
                // Flushes
                for (let c_1 = 0; c_1 < cards.length - 6; c_1++) {
                    for (let c_2 = c_1 + 1; c_2 < cards.length - 4; c_2++) {
                        for (let c_3 = c_2 + 1; c_3 < cards.length - 3; c_3++) {
                            for (let c_4 = c_3 + 1; c_4 < cards.length - 2; c_4++) {
                                for (let c_5 = c_4 + 1; c_5 < cards.length - 1; c_5++) {
                                    if (c_5 != c_4 + 1) {
                                        hands.push(`Flush: ${cards[c_1]} ${cards[c_2]} ${cards[c_3]} ${cards[c_4]} ${cards[c_5]}`);
                                    }
                                }
                            }
                        }
                    }
                }
                // Straights
                for (let c = 0; c < cards.length - 4; c++) {
                    let hand = 'Straight:'
                    for (let i = c; i < c + 5; i++) {
                        hand += ` ${cards[i]}`;
                    }
                    hands.push(hand);
                }
                // Trips
                for (let c = 0; c < cards.length - 1; c++) {
                    for (let k1 = 0; k1 < cards.length - 2; k1++) {
                        for (let k2 = k1 + 1; k2 < cards.length - 1; k2++) {
                            if (c != k1 && c != k2 && k1 != k2) {
                                hands.push(`Three of a kind: ${cards[c]} ${cards[c]} ${cards[c]} ${cards[k1]} ${cards[k2]}`);
                            }
                        }
                    }
                }
                // Two Pair
                for (let o = 0; o < cards.length - 1; o++) {
                    for (let u = 0; u < cards.length - 1; u++) {
                        if (o != u) {
                            for (let k = 0; k < cards.length - 1; k++) {
                                if (k != o && k != u) {
                                    hands.push(`Two Pair: ${cards[o]} ${cards[o]} ${cards[u]} ${cards[u]} ${cards[k]}`);
                                }
                            }
                        }
                    }
                }
                // Pair
                for (let c = 0; c < cards.length - 1; c++) {
                    for (let k = 0; k < cards.length - 1; k++) {
                        for (let k1 = k + 1; k1 < cards.length - 1; k1++) {
                            for (let k2 = k1 + 1; k2 < cards.length - 1; k2++) {
                                if (k != c && k1 != c && k2 != c) {
                                    hands.push(`Pair: ${cards[c]} ${cards[c]} ${cards[k]} ${cards[k1]} ${cards[k2]}`);
                                }
                            }
                        }
                    }
                }
                //High Card
                for (let c_1 = 0; c_1 < cards.length - 5; c_1++) {
                    for (let c_2 = c_1 + 1; c_2 < cards.length - 4; c_2++) {
                        for (let c_3 = c_2 + 1; c_3 < cards.length - 3; c_3++) {
                            for (let c_4 = c_3 + 1; c_4 < cards.length - 2; c_4++) {
                                for (let c_5 = c_4 + 1; c_5 < cards.length - 1; c_5++) {
                                    if (!(dc_utils.deck.calculate_straight({[cards[c_1]]: 1, [cards[c_2]]: 1, [cards[c_3]]: 1, [cards[c_4]]: 1, [cards[c_5]]: 1}))) {
                                        hands.push(`High Card: ${cards[c_1]} ${cards[c_2]} ${cards[c_3]} ${cards[c_4]} ${cards[c_5]}`);
                                    }
                                }
                            }
                        }
                    }
                }
                return hands;
            },
        }
    },
    chat: {
        send: function(title) {
            let sheet = `
                <h3 class="center typed">${title}</h3>
            `;
            for (let i = 1; i < arguments.length; i++) {
                sheet += `
                <p class="center typed">${arguments[i]}</p>
                `;
            }
            ChatMessage.create({content: sheet});
        },
    },
    socket: {
        emit: function(op, data) {
            console.log('EMIT:', op, data);
            game.socket.emit("system.deadlands_classic", {
                operation: op,
                data: data
            });
        }
    },
    journal: {
        new_data: function(name, content) {
            return JournalEntry.create({
                name: name,
                content: JSON.stringify(content)
            });
        },
        load: function(name, content) {
            let journal = game.journal.getName(name);
            if (journal) {
                return JSON.parse(journal.data.content);
            }else{
                dc_utils.journal.new_data(name, content);
                return content;
            }
        },
        save: function(name, content) {
            let journal = game.journal.getName(name);
            if (journal) {
                return journal.update({content: JSON.stringify(content)});
            } else {
                return dc_utils.journal.new_data(name, content);
            }
        },
    },
    combat: {
        aim: function(act, index) {
            let bonus = act.data.data.aim_bonus + 2
            if (bonus < 6) {
                act.update({data: {aim_bonus: bonus}});
                dc_utils.combat.remove_card(this.actor, index);
                dc_utils.chat.send('Aim', `${act.name} takes a moment to aim. [+${bonus}]`);
            }else{
                dc_utils.chat.send('Aim', `${act.name} can't aim any more, time to shoot 'em`);
            }
        },
        clear_aim: function(act) {
            act.update({data: {aim_bonus: 0}});
        },
        sleeve_card: function(act, card) {
            if (act.data.data.sleeved_card != 'none') {
                let confirmation = Dialog.confirm({
                    title: 'Hold up.',
                    content: `
                        <p class="center">You have the ${act.data.data.sleeved_card} up your sleeve already,</p>
                        <p class="center">If you sleeve the ${card.name} you'll lose the ${act.data.data.sleeved_card}.</p>
                    `,
                });
                if (!(confirmation)) {
                    return false;
                }
            }
            act.update({data: {sleeved_card: card.name}});
        },
        new_combat: function() {
            let deck = {
                deck: dc_utils.deck.new('action_deck'),
                discard: []
            }
            dc_utils.journal.save('action_deck', deck);
            game.dc.action_deck = deck;
        },
        new_round: function() {
            game.dc.combat_active = true
            game.dc.level_headed_available = true
            if (game.dc.combat_shuffle) {
                game.dc.combat_shuffle = false;
                dc_utils.combat.restore_discard();
            }
        },
        restore_discard: function() {
            game.dc.action_deck.discard.forEach(card => {
                game.dc.action_deck.deck.push(card);
            });
            game.dc.action_deck.discard = []
            game.dc.action_deck.deck = dc_utils.deck.shuffle(game.dc.action_deck.deck);
            dc_utils.journal.save('action_deck', game.dc.action_deck);
        },
        deal_cards: function(act, amt) {
            if (game.dc.action_deck.deck.length <= amt){
                dc_utils.combat.restore_discard();
            }
            let hand = act.data.data.action_cards
            for (let i = 0; i < amt; i++) {
                let card = game.dc.action_deck.deck.pop();
                hand.push(card);
            }
            act.update({data: {action_cards: dc_utils.deck.sort(hand)}});
            dc_utils.journal.save('action_deck', game.dc.action_deck);
        },
        remove_card: function(act, index) {
            let hand = act.data.data.action_cards;
            hand.splice(index, 1);
            act.update({data: {action_cards: hand}});
        },
        get_cards: function(act) {

        },
        new_attack: function(atk, tgt, type, skill, wep) {
            let data = {
                attacker:    atk,
                target:      tgt,
                type:        type,
                skill:       skill,
                weapon:      wep,
                location:    'unrolled',
                attack_roll: 'unrolled',
                dodge_roll:  'unrolled',
                uuid:        dc_utils.uuid(4, 4, 4, 4)
            }
            game.dc.combat_actions[data.uuid] = data;
            dc_utils.journal.save('combat_actions', game.dc.combat_actions);
            return data;
        },
    },
    vehicle: {
        passenger: {
            add_slot: function(act, name, driver, gunner) {
                let onboard = act.data.data.passengers.onboard;
                onboard.push({
                    name: name,
                    driver: driver,
                    gunner: gunner,
                    character: 'Empty'
                });
                act.update({data: {passengers: {onboard: onboard}}});
                if (gunner) {
                    dc_utils.vehicle.weapons.add_slot(act, onboard.length - 1);
                }
            },
            remove_slot: function(act, index) {
                let onboard = act.data.data.passengers.onboard;
                onboard.splice(index, 1);
                act.update({data: {passengers: {onboard: onboard}}});
            },
            enter: function(act, passenger, seat) {
                let data = {
                    passengers: { onboard: act.data.data.passengers.onboard },
                    weapons: act.data.data.weapons
                }
                data.passengers.onboard[seat].character = passenger.name
                if (data.passengers.onboard[seat].gunner) {
                    for (let i = 0; i < data.weapons.length; i++) {
                        const gun = data.weapons[i];
                        if (gun.gunner_slot == seat) {
                            data.weapons[i].gunner = passenger.name;
                            break;
                        }
                    }
                }
                act.update({data: data});
            },
            exit: function(act, seat) {
                let data = {
                    passengers: {
                        onboard: act.data.data.passengers.onboard
                    },
                    weapons: act.data.data.weapons
                }
                data.passengers.onboard[seat].character = 'Empty'
                if (data.passengers.onboard[seat].gunner) {
                    for (let i = 0; i < data.weapons.length; i++) {
                        const gun = data.weapons[i];
                        if (gun.gunner_slot == seat) {
                            data.weapons[i].gunner = 'Empty';
                            break;
                        }
                    }
                }
                act.update({data: data});
            }
        },
        locations: {
            add_location: function(act, name, min, max, armour, malfunctions) {
                let locs = act.data.data.hit_locations;
                locs.push({
                    name,
                    min,
                    max,
                    armour,
                    malfunctions
                });
                act.update({
                    data: {
                        hit_locations: locs
                    }
                });
            },
            remove_location: function(act, index) {
                let locs = act.data.data.hit_locations;
                locs.splice(index, 1);
                act.update({
                    data: {
                        hit_locations: locs
                    }
                });
            },
        },
        weapons: {
            add_slot: function(act, index) {
                let weapons = act.data.data.weapons;
                weapons.push({
                    gunner: 'Empty',
                    gunner_slot: index,
                    weapon: 'Empty',
                    weapon_name: 'Empty'
                });
                act.update({data: {weapons: weapons}});
            },
            remove_slot: function(act, index) {
                let weapons = act.data.data.weapons;
                weapons.splice(index, 1);
                act.update({data: {weapons: weapons}});
            },
            set_gunner: function(act, name, seat) {
                let weapons = act.data.data.weapons;
                for (let i = 0; i < weapons.length; i++) {
                    const gun = weapons[i];
                    if (gun.gunner_slot == seat) {
                        weapons[i].gunner = name;
                        break;
                    }
                }
                act.update({data: {weapons: weapons}});
            },
            get_mountable: function(act) {
                return act.items.filter(function(i) {return i.data.data.vehicle_mountable == true})
                    .sort((a, b) => {return dc_utils.sort.compare(a, b, 'type')});
            },
            equip: function(act, slot, item_id, item_name) {
                let weapons = act.data.data.weapons;
                weapons[slot].weapon = item_id;
                weapons[slot].weapon_name = item_name;
                act.update({data: {weapons: weapons}});
            },
        },
        cargo: {
            get: function(act, reciever, item_id, amount) {
                if (amount <= 0) return false;
                let item = act.items.get(item_id);
                let name = dc_utils.pluralize(amount, item.name, `${item.name}s`);
                dc_utils.chat.send('Cargo', `${act.name} takes ${amount} ${name} from ${reciever}`);
                let parseNum = parseInt;
                if (item.data.data.is_float){
                    parseNum = parseFloat
                }
                let total = parseNum(item.data.data.amount);
                amount = parseNum(amount);
                if (total >= amount) {
                    let rec = dc_utils.get_actor(reciever);
                    dc_utils.char.items.recieve(rec, item, amount);
                    if (total - amount <= 0) {
                        setTimeout(() => {act.deleteEmbeddedDocuments("Item", [item_id])}, 1000);
                        return true;
                    }else{
                        item.update({data: {amount: total - amount}});
                        return true;
                    }
                }
                return false;
            },
        },
    },
    ui: {
        mouse: {
            get_position: function(event) {
                return {
                    x: event.data.global.x,
                    y: event.data.global.y
                }
            },
            get_grid_position: function(event) {
                let tr = canvas.tokens.worldTransform;
                return {
                    x: (event.data.global.x - tr.tx) / canvas.stage.scale.x,
                    y: (event.data.global.y - tr.ty) / canvas.stage.scale.y
                }
            },
        },
    },
    time: {
        get_date: function() {
            let ut = game.settings.get('deadlands_classic', 'unixtime');
            let date = new Date(ut);
            return {
                weekday: dc_utils.dow[date.getDay()],
                month:   dc_utils.months[date.getMonth()],
                day:     `${date.getDate()}${dc_utils.day_suffix[date.getDate()]}`,
                year:    `${date.getFullYear()}`,
                hour:    dc_utils.pad(`${date.getHours()}`, 2),
                minute:  dc_utils.pad(`${date.getMinutes()}`, 2),
                moon:    dc_utils.moon_phases[dc_utils.time.get_moon_phase(date.getFullYear(), date.getMonth() + 1, date.getDate())]
            };
        },
        /* GET_MOON_PHASE
        * Gets the moon phase for a given date.
        * Plagerised from https://gist.github.com/endel/dfe6bb2fbe679781948c
        * All credit to Endel Drayder https://github.com/endel
        */
        get_moon_phase: function(year, month, day) {
            var c = e = jd = b = 0;
            if (month < 3) {
                year--;
                month += 12;
            }
            ++month;
            c = 365.25 * year;
            e = 30.6 * month;
            jd = c + e + day - 694039.09; //jd is total days elapsed
            jd /= 29.5305882; //divide by the moon cycle
            b = parseInt(jd); //int(jd) -> b, take integer part of jd
            jd -= b; //subtract integer part to leave fractional part of original jd
            b = Math.round(jd * 8); //scale fraction from 0-8 and round
            b %= 8;
            return Math.abs(b);
        },
    },
};