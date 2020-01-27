type MonData = {
  types: string[],
}

const MON_DATA: { [key: string]: MonData } = {
  "bulbasaur": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "ivysaur": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "venusaur": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "charmander": {
    "types": [
      "fire"
    ]
  },
  "charmeleon": {
    "types": [
      "fire"
    ]
  },
  "charizard": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "squirtle": {
    "types": [
      "water"
    ]
  },
  "wartortle": {
    "types": [
      "water"
    ]
  },
  "blastoise": {
    "types": [
      "water"
    ]
  },
  "caterpie": {
    "types": [
      "bug"
    ]
  },
  "metapod": {
    "types": [
      "bug"
    ]
  },
  "butterfree": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "weedle": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "kakuna": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "beedrill": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "pidgey": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "pidgeotto": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "pidgeot": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "rattata": {
    "types": [
      "normal"
    ]
  },
  "raticate": {
    "types": [
      "normal"
    ]
  },
  "spearow": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "fearow": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "ekans": {
    "types": [
      "poison"
    ]
  },
  "arbok": {
    "types": [
      "poison"
    ]
  },
  "pikachu": {
    "types": [
      "electric"
    ]
  },
  "raichu": {
    "types": [
      "electric",
    ]
  },
  "sandshrew": {
    "types": [
      "ground",
    ]
  },
  "sandslash": {
    "types": [
      "ground",
    ]
  },
  "nidoran": {
    "types": [
      "poison"
    ]
  },
  "nidorina": {
    "types": [
      "poison"
    ]
  },
  "nidoqueen": {
    "types": [
      "poison",
      "ground"
    ]
  },
  "nidorino": {
    "types": [
      "poison"
    ]
  },
  "nidoking": {
    "types": [
      "poison",
      "ground"
    ]
  },
  "clefairy": {
    "types": [
      "fairy"
    ]
  },
  "clefable": {
    "types": [
      "fairy"
    ]
  },
  "vulpix": {
    "types": [
      "fire"
    ]
  },
  "ninetales": {
    "types": [
      "fire",
    ]
  },
  "jigglypuff": {
    "types": [
      "normal",
      "fairy"
    ]
  },
  "wigglytuff": {
    "types": [
      "normal",
      "fairy"
    ]
  },
  "zubat": {
    "types": [
      "poison",
      "flying"
    ]
  },
  "golbat": {
    "types": [
      "poison",
      "flying"
    ]
  },
  "oddish": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "gloom": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "vileplume": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "paras": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "parasect": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "venonat": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "venomoth": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "diglett": {
    "types": [
      "ground",
    ]
  },
  "dugtrio": {
    "types": [
      "ground",
    ]
  },
  "meowth": {
    "types": [
      "normal"
    ]
  },
  "persian": {
    "types": [
      "normal"
    ]
  },
  "psyduck": {
    "types": [
      "water"
    ]
  },
  "golduck": {
    "types": [
      "water"
    ]
  },
  "mankey": {
    "types": [
      "fighting"
    ]
  },
  "primeape": {
    "types": [
      "fighting"
    ]
  },
  "growlithe": {
    "types": [
      "fire"
    ]
  },
  "arcanine": {
    "types": [
      "fire"
    ]
  },
  "poliwag": {
    "types": [
      "water"
    ]
  },
  "poliwhirl": {
    "types": [
      "water"
    ]
  },
  "poliwrath": {
    "types": [
      "water",
      "fighting"
    ]
  },
  "abra": {
    "types": [
      "psychic"
    ]
  },
  "kadabra": {
    "types": [
      "psychic"
    ]
  },
  "alakazam": {
    "types": [
      "psychic"
    ]
  },
  "machop": {
    "types": [
      "fighting"
    ]
  },
  "machoke": {
    "types": [
      "fighting"
    ]
  },
  "machamp": {
    "types": [
      "fighting"
    ]
  },
  "bellsprout": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "weepinbell": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "victreebel": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "tentacool": {
    "types": [
      "water",
      "poison"
    ]
  },
  "tentacruel": {
    "types": [
      "water",
      "poison"
    ]
  },
  "geodude": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "graveler": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "golem": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "ponyta": {
    "types": [
      "fire"
    ]
  },
  "rapidash": {
    "types": [
      "fire"
    ]
  },
  "slowpoke": {
    "types": [
      "water",
      "psychic"
    ]
  },
  "slowbro": {
    "types": [
      "water",
      "psychic"
    ]
  },
  "magnemite": {
    "types": [
      "electric",
      "steel"
    ]
  },
  "magneton": {
    "types": [
      "electric",
      "steel"
    ]
  },
  "farfetch'd": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "doduo": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "dodrio": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "seel": {
    "types": [
      "water"
    ]
  },
  "dewgong": {
    "types": [
      "water",
      "ice"
    ]
  },
  "grimer": {
    "types": [
      "poison",
    ]
  },
  "muk": {
    "types": [
      "poison",
    ]
  },
  "shellder": {
    "types": [
      "water"
    ]
  },
  "cloyster": {
    "types": [
      "water",
      "ice"
    ]
  },
  "gastly": {
    "types": [
      "ghost",
      "poison"
    ]
  },
  "haunter": {
    "types": [
      "ghost",
      "poison"
    ]
  },
  "gengar": {
    "types": [
      "ghost",
      "poison"
    ]
  },
  "onix": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "drowzee": {
    "types": [
      "psychic"
    ]
  },
  "hypno": {
    "types": [
      "psychic"
    ]
  },
  "krabby": {
    "types": [
      "water"
    ]
  },
  "kingler": {
    "types": [
      "water"
    ]
  },
  "voltorb": {
    "types": [
      "electric"
    ]
  },
  "electrode": {
    "types": [
      "electric"
    ]
  },
  "exeggcute": {
    "types": [
      "grass",
      "psychic"
    ]
  },
  "exeggutor": {
    "types": [
      "grass",
      "psychic"
    ]
  },
  "cubone": {
    "types": [
      "ground"
    ]
  },
  "marowak": {
    "types": [
      "ground",
    ]
  },
  "hitmonlee": {
    "types": [
      "fighting"
    ]
  },
  "hitmonchan": {
    "types": [
      "fighting"
    ]
  },
  "lickitung": {
    "types": [
      "normal"
    ]
  },
  "koffing": {
    "types": [
      "poison"
    ]
  },
  "weezing": {
    "types": [
      "poison"
    ]
  },
  "rhyhorn": {
    "types": [
      "ground",
      "rock"
    ]
  },
  "rhydon": {
    "types": [
      "ground",
      "rock"
    ]
  },
  "chansey": {
    "types": [
      "normal"
    ]
  },
  "tangela": {
    "types": [
      "grass"
    ]
  },
  "kangaskhan": {
    "types": [
      "normal"
    ]
  },
  "horsea": {
    "types": [
      "water"
    ]
  },
  "seadra": {
    "types": [
      "water"
    ]
  },
  "goldeen": {
    "types": [
      "water"
    ]
  },
  "seaking": {
    "types": [
      "water"
    ]
  },
  "staryu": {
    "types": [
      "water"
    ]
  },
  "starmie": {
    "types": [
      "water",
      "psychic"
    ]
  },
  "mr. mime": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "scyther": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "jynx": {
    "types": [
      "ice",
      "psychic"
    ]
  },
  "electabuzz": {
    "types": [
      "electric"
    ]
  },
  "magmar": {
    "types": [
      "fire"
    ]
  },
  "pinsir": {
    "types": [
      "bug"
    ]
  },
  "tauros": {
    "types": [
      "normal"
    ]
  },
  "magikarp": {
    "types": [
      "water"
    ]
  },
  "gyarados": {
    "types": [
      "water",
      "flying"
    ]
  },
  "lapras": {
    "types": [
      "water",
      "ice"
    ]
  },
  "ditto": {
    "types": [
      "normal"
    ]
  },
  "eevee": {
    "types": [
      "normal"
    ]
  },
  "vaporeon": {
    "types": [
      "water"
    ]
  },
  "jolteon": {
    "types": [
      "electric"
    ]
  },
  "flareon": {
    "types": [
      "fire"
    ]
  },
  "porygon": {
    "types": [
      "normal"
    ]
  },
  "omanyte": {
    "types": [
      "rock",
      "water"
    ]
  },
  "omastar": {
    "types": [
      "rock",
      "water"
    ]
  },
  "kabuto": {
    "types": [
      "rock",
      "water"
    ]
  },
  "kabutops": {
    "types": [
      "rock",
      "water"
    ]
  },
  "aerodactyl": {
    "types": [
      "rock",
      "flying"
    ]
  },
  "snorlax": {
    "types": [
      "normal"
    ]
  },
  "articuno": {
    "types": [
      "ice",
      "flying"
    ]
  },
  "zapdos": {
    "types": [
      "electric",
      "flying"
    ]
  },
  "moltres": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "dratini": {
    "types": [
      "dragon"
    ]
  },
  "dragonair": {
    "types": [
      "dragon"
    ]
  },
  "dragonite": {
    "types": [
      "dragon",
      "flying"
    ]
  },
  "mewtwo": {
    "types": [
      "psychic"
    ]
  },
  "mew": {
    "types": [
      "psychic"
    ]
  },
  "chikorita": {
    "types": [
      "grass"
    ]
  },
  "bayleef": {
    "types": [
      "grass"
    ]
  },
  "meganium": {
    "types": [
      "grass"
    ]
  },
  "cyndaquil": {
    "types": [
      "fire"
    ]
  },
  "quilava": {
    "types": [
      "fire"
    ]
  },
  "typhlosion": {
    "types": [
      "fire"
    ]
  },
  "totodile": {
    "types": [
      "water"
    ]
  },
  "croconaw": {
    "types": [
      "water"
    ]
  },
  "feraligatr": {
    "types": [
      "water"
    ]
  },
  "sentret": {
    "types": [
      "normal"
    ]
  },
  "furret": {
    "types": [
      "normal"
    ]
  },
  "hoothoot": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "noctowl": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "ledyba": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "ledian": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "spinarak": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "ariados": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "crobat": {
    "types": [
      "poison",
      "flying"
    ]
  },
  "chinchou": {
    "types": [
      "water",
      "electric"
    ]
  },
  "lanturn": {
    "types": [
      "water",
      "electric"
    ]
  },
  "pichu": {
    "types": [
      "electric"
    ]
  },
  "cleffa": {
    "types": [
      "fairy"
    ]
  },
  "igglybuff": {
    "types": [
      "normal",
      "fairy"
    ]
  },
  "togepi": {
    "types": [
      "fairy"
    ]
  },
  "togetic": {
    "types": [
      "fairy",
      "flying"
    ]
  },
  "natu": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "xatu": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "mareep": {
    "types": [
      "electric"
    ]
  },
  "flaaffy": {
    "types": [
      "electric"
    ]
  },
  "ampharos": {
    "types": [
      "electric"
    ]
  },
  "bellossom": {
    "types": [
      "grass"
    ]
  },
  "marill": {
    "types": [
      "water",
      "fairy"
    ]
  },
  "azumarill": {
    "types": [
      "water",
      "fairy"
    ]
  },
  "sudowoodo": {
    "types": [
      "rock"
    ]
  },
  "politoed": {
    "types": [
      "water"
    ]
  },
  "hoppip": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "skiploom": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "jumpluff": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "aipom": {
    "types": [
      "normal"
    ]
  },
  "sunkern": {
    "types": [
      "grass"
    ]
  },
  "sunflora": {
    "types": [
      "grass"
    ]
  },
  "yanma": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "wooper": {
    "types": [
      "water",
      "ground"
    ]
  },
  "quagsire": {
    "types": [
      "water",
      "ground"
    ]
  },
  "espeon": {
    "types": [
      "psychic"
    ]
  },
  "umbreon": {
    "types": [
      "dark"
    ]
  },
  "murkrow": {
    "types": [
      "dark",
      "flying"
    ]
  },
  "slowking": {
    "types": [
      "water",
      "psychic"
    ]
  },
  "misdreavus": {
    "types": [
      "ghost"
    ]
  },
  "unown": {
    "types": [
      "psychic"
    ]
  },
  "wobbuffet": {
    "types": [
      "psychic"
    ]
  },
  "girafarig": {
    "types": [
      "normal",
      "psychic"
    ]
  },
  "pineco": {
    "types": [
      "bug"
    ]
  },
  "forretress": {
    "types": [
      "bug",
      "steel"
    ]
  },
  "dunsparce": {
    "types": [
      "normal"
    ]
  },
  "gligar": {
    "types": [
      "ground",
      "flying"
    ]
  },
  "steelix": {
    "types": [
      "steel",
      "ground"
    ]
  },
  "snubbull": {
    "types": [
      "fairy"
    ]
  },
  "granbull": {
    "types": [
      "fairy"
    ]
  },
  "qwilfish": {
    "types": [
      "water",
      "poison"
    ]
  },
  "scizor": {
    "types": [
      "bug",
      "steel"
    ]
  },
  "shuckle": {
    "types": [
      "bug",
      "rock"
    ]
  },
  "heracross": {
    "types": [
      "bug",
      "fighting"
    ]
  },
  "sneasel": {
    "types": [
      "dark",
      "ice"
    ]
  },
  "teddiursa": {
    "types": [
      "normal"
    ]
  },
  "ursaring": {
    "types": [
      "normal"
    ]
  },
  "slugma": {
    "types": [
      "fire"
    ]
  },
  "magcargo": {
    "types": [
      "fire",
      "rock"
    ]
  },
  "swinub": {
    "types": [
      "ice",
      "ground"
    ]
  },
  "piloswine": {
    "types": [
      "ice",
      "ground"
    ]
  },
  "corsola": {
    "types": [
      "water",
      "rock"
    ]
  },
  "remoraid": {
    "types": [
      "water"
    ]
  },
  "octillery": {
    "types": [
      "water"
    ]
  },
  "delibird": {
    "types": [
      "ice",
      "flying"
    ]
  },
  "mantine": {
    "types": [
      "water",
      "flying"
    ]
  },
  "skarmory": {
    "types": [
      "steel",
      "flying"
    ]
  },
  "houndour": {
    "types": [
      "dark",
      "fire"
    ]
  },
  "houndoom": {
    "types": [
      "dark",
      "fire"
    ]
  },
  "kingdra": {
    "types": [
      "water",
      "dragon"
    ]
  },
  "phanpy": {
    "types": [
      "ground"
    ]
  },
  "donphan": {
    "types": [
      "ground"
    ]
  },
  "porygon2": {
    "types": [
      "normal"
    ]
  },
  "stantler": {
    "types": [
      "normal"
    ]
  },
  "smeargle": {
    "types": [
      "normal"
    ]
  },
  "tyrogue": {
    "types": [
      "fighting"
    ]
  },
  "hitmontop": {
    "types": [
      "fighting"
    ]
  },
  "smoochum": {
    "types": [
      "ice",
      "psychic"
    ]
  },
  "elekid": {
    "types": [
      "electric"
    ]
  },
  "magby": {
    "types": [
      "fire"
    ]
  },
  "miltank": {
    "types": [
      "normal"
    ]
  },
  "blissey": {
    "types": [
      "normal"
    ]
  },
  "raikou": {
    "types": [
      "electric"
    ]
  },
  "entei": {
    "types": [
      "fire"
    ]
  },
  "suicune": {
    "types": [
      "water"
    ]
  },
  "larvitar": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "pupitar": {
    "types": [
      "rock",
      "ground"
    ]
  },
  "tyranitar": {
    "types": [
      "rock",
      "dark"
    ]
  },
  "lugia": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "ho-oh": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "celebi": {
    "types": [
      "psychic",
      "grass"
    ]
  },
  "treecko": {
    "types": [
      "grass"
    ]
  },
  "grovyle": {
    "types": [
      "grass"
    ]
  },
  "sceptile": {
    "types": [
      "grass"
    ]
  },
  "torchic": {
    "types": [
      "fire"
    ]
  },
  "combusken": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "blaziken": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "mudkip": {
    "types": [
      "water"
    ]
  },
  "marshtomp": {
    "types": [
      "water",
      "ground"
    ]
  },
  "swampert": {
    "types": [
      "water",
      "ground"
    ]
  },
  "poochyena": {
    "types": [
      "dark"
    ]
  },
  "mightyena": {
    "types": [
      "dark"
    ]
  },
  "zigzagoon": {
    "types": [
      "normal"
    ]
  },
  "linoone": {
    "types": [
      "normal"
    ]
  },
  "wurmple": {
    "types": [
      "bug"
    ]
  },
  "silcoon": {
    "types": [
      "bug"
    ]
  },
  "beautifly": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "cascoon": {
    "types": [
      "bug"
    ]
  },
  "dustox": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "lotad": {
    "types": [
      "water",
      "grass"
    ]
  },
  "lombre": {
    "types": [
      "water",
      "grass"
    ]
  },
  "ludicolo": {
    "types": [
      "water",
      "grass"
    ]
  },
  "seedot": {
    "types": [
      "grass"
    ]
  },
  "nuzleaf": {
    "types": [
      "grass",
      "dark"
    ]
  },
  "shiftry": {
    "types": [
      "grass",
      "dark"
    ]
  },
  "taillow": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "swellow": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "wingull": {
    "types": [
      "water",
      "flying"
    ]
  },
  "pelipper": {
    "types": [
      "water",
      "flying"
    ]
  },
  "ralts": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "kirlia": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "gardevoir": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "surskit": {
    "types": [
      "bug",
      "water"
    ]
  },
  "masquerain": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "shroomish": {
    "types": [
      "grass"
    ]
  },
  "breloom": {
    "types": [
      "grass",
      "fighting"
    ]
  },
  "slakoth": {
    "types": [
      "normal"
    ]
  },
  "vigoroth": {
    "types": [
      "normal"
    ]
  },
  "slaking": {
    "types": [
      "normal"
    ]
  },
  "nincada": {
    "types": [
      "bug",
      "ground"
    ]
  },
  "ninjask": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "shedinja": {
    "types": [
      "bug",
      "ghost"
    ]
  },
  "whismur": {
    "types": [
      "normal"
    ]
  },
  "loudred": {
    "types": [
      "normal"
    ]
  },
  "exploud": {
    "types": [
      "normal"
    ]
  },
  "makuhita": {
    "types": [
      "fighting"
    ]
  },
  "hariyama": {
    "types": [
      "fighting"
    ]
  },
  "azurill": {
    "types": [
      "normal",
      "fairy"
    ]
  },
  "nosepass": {
    "types": [
      "rock"
    ]
  },
  "skitty": {
    "types": [
      "normal"
    ]
  },
  "delcatty": {
    "types": [
      "normal"
    ]
  },
  "sableye": {
    "types": [
      "dark",
      "ghost"
    ]
  },
  "mawile": {
    "types": [
      "steel",
      "fairy"
    ]
  },
  "aron": {
    "types": [
      "steel",
      "rock"
    ]
  },
  "lairon": {
    "types": [
      "steel",
      "rock"
    ]
  },
  "aggron": {
    "types": [
      "steel",
      "rock"
    ]
  },
  "meditite": {
    "types": [
      "fighting",
      "psychic"
    ]
  },
  "medicham": {
    "types": [
      "fighting",
      "psychic"
    ]
  },
  "electrike": {
    "types": [
      "electric"
    ]
  },
  "manectric": {
    "types": [
      "electric"
    ]
  },
  "plusle": {
    "types": [
      "electric"
    ]
  },
  "minun": {
    "types": [
      "electric"
    ]
  },
  "volbeat": {
    "types": [
      "bug"
    ]
  },
  "illumise": {
    "types": [
      "bug"
    ]
  },
  "roselia": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "gulpin": {
    "types": [
      "poison"
    ]
  },
  "swalot": {
    "types": [
      "poison"
    ]
  },
  "carvanha": {
    "types": [
      "water",
      "dark"
    ]
  },
  "sharpedo": {
    "types": [
      "water",
      "dark"
    ]
  },
  "wailmer": {
    "types": [
      "water"
    ]
  },
  "wailord": {
    "types": [
      "water"
    ]
  },
  "numel": {
    "types": [
      "fire",
      "ground"
    ]
  },
  "camerupt": {
    "types": [
      "fire",
      "ground"
    ]
  },
  "torkoal": {
    "types": [
      "fire"
    ]
  },
  "spoink": {
    "types": [
      "psychic"
    ]
  },
  "grumpig": {
    "types": [
      "psychic"
    ]
  },
  "spinda": {
    "types": [
      "normal"
    ]
  },
  "trapinch": {
    "types": [
      "ground"
    ]
  },
  "vibrava": {
    "types": [
      "ground",
      "dragon"
    ]
  },
  "flygon": {
    "types": [
      "ground",
      "dragon"
    ]
  },
  "cacnea": {
    "types": [
      "grass"
    ]
  },
  "cacturne": {
    "types": [
      "grass",
      "dark"
    ]
  },
  "swablu": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "altaria": {
    "types": [
      "dragon",
      "flying"
    ]
  },
  "zangoose": {
    "types": [
      "normal"
    ]
  },
  "seviper": {
    "types": [
      "poison"
    ]
  },
  "lunatone": {
    "types": [
      "rock",
      "psychic"
    ]
  },
  "solrock": {
    "types": [
      "rock",
      "psychic"
    ]
  },
  "barboach": {
    "types": [
      "water",
      "ground"
    ]
  },
  "whiscash": {
    "types": [
      "water",
      "ground"
    ]
  },
  "corphish": {
    "types": [
      "water"
    ]
  },
  "crawdaunt": {
    "types": [
      "water",
      "dark"
    ]
  },
  "baltoy": {
    "types": [
      "ground",
      "psychic"
    ]
  },
  "claydol": {
    "types": [
      "ground",
      "psychic"
    ]
  },
  "lileep": {
    "types": [
      "rock",
      "grass"
    ]
  },
  "cradily": {
    "types": [
      "rock",
      "grass"
    ]
  },
  "anorith": {
    "types": [
      "rock",
      "bug"
    ]
  },
  "armaldo": {
    "types": [
      "rock",
      "bug"
    ]
  },
  "feebas": {
    "types": [
      "water"
    ]
  },
  "milotic": {
    "types": [
      "water"
    ]
  },
  "castform": {
    "types": [
      "normal"
    ]
  },
  "kecleon": {
    "types": [
      "normal"
    ]
  },
  "shuppet": {
    "types": [
      "ghost"
    ]
  },
  "banette": {
    "types": [
      "ghost"
    ]
  },
  "duskull": {
    "types": [
      "ghost"
    ]
  },
  "dusclops": {
    "types": [
      "ghost"
    ]
  },
  "tropius": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "chimecho": {
    "types": [
      "psychic"
    ]
  },
  "absol": {
    "types": [
      "dark"
    ]
  },
  "wynaut": {
    "types": [
      "psychic"
    ]
  },
  "snorunt": {
    "types": [
      "ice"
    ]
  },
  "glalie": {
    "types": [
      "ice"
    ]
  },
  "spheal": {
    "types": [
      "ice",
      "water"
    ]
  },
  "sealeo": {
    "types": [
      "ice",
      "water"
    ]
  },
  "walrein": {
    "types": [
      "ice",
      "water"
    ]
  },
  "clamperl": {
    "types": [
      "water"
    ]
  },
  "huntail": {
    "types": [
      "water"
    ]
  },
  "gorebyss": {
    "types": [
      "water"
    ]
  },
  "relicanth": {
    "types": [
      "water",
      "rock"
    ]
  },
  "luvdisc": {
    "types": [
      "water"
    ]
  },
  "bagon": {
    "types": [
      "dragon"
    ]
  },
  "shelgon": {
    "types": [
      "dragon"
    ]
  },
  "salamence": {
    "types": [
      "dragon",
      "flying"
    ]
  },
  "beldum": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "metang": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "metagross": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "regirock": {
    "types": [
      "rock"
    ]
  },
  "regice": {
    "types": [
      "ice"
    ]
  },
  "registeel": {
    "types": [
      "steel"
    ]
  },
  "latias": {
    "types": [
      "dragon",
      "psychic"
    ]
  },
  "latios": {
    "types": [
      "dragon",
      "psychic"
    ]
  },
  "kyogre": {
    "types": [
      "water"
    ]
  },
  "groudon": {
    "types": [
      "ground"
    ]
  },
  "rayquaza": {
    "types": [
      "dragon",
      "flying"
    ]
  },
  "jirachi": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "deoxys": {
    "types": [
      "psychic"
    ]
  },
  "turtwig": {
    "types": [
      "grass"
    ]
  },
  "grotle": {
    "types": [
      "grass"
    ]
  },
  "torterra": {
    "types": [
      "grass",
      "ground"
    ]
  },
  "chimchar": {
    "types": [
      "fire"
    ]
  },
  "monferno": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "infernape": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "piplup": {
    "types": [
      "water"
    ]
  },
  "prinplup": {
    "types": [
      "water"
    ]
  },
  "empoleon": {
    "types": [
      "water",
      "steel"
    ]
  },
  "starly": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "staravia": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "staraptor": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "bidoof": {
    "types": [
      "normal"
    ]
  },
  "bibarel": {
    "types": [
      "normal",
      "water"
    ]
  },
  "kricketot": {
    "types": [
      "bug"
    ]
  },
  "kricketune": {
    "types": [
      "bug"
    ]
  },
  "shinx": {
    "types": [
      "electric"
    ]
  },
  "luxio": {
    "types": [
      "electric"
    ]
  },
  "luxray": {
    "types": [
      "electric"
    ]
  },
  "budew": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "roserade": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "cranidos": {
    "types": [
      "rock"
    ]
  },
  "rampardos": {
    "types": [
      "rock"
    ]
  },
  "shieldon": {
    "types": [
      "rock",
      "steel"
    ]
  },
  "bastiodon": {
    "types": [
      "rock",
      "steel"
    ]
  },
  "burmy": {
    "types": [
      "bug"
    ]
  },
  "wormadam": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "mothim": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "combee": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "vespiquen": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "pachirisu": {
    "types": [
      "electric"
    ]
  },
  "buizel": {
    "types": [
      "water"
    ]
  },
  "floatzel": {
    "types": [
      "water"
    ]
  },
  "cherubi": {
    "types": [
      "grass"
    ]
  },
  "cherrim": {
    "types": [
      "grass"
    ]
  },
  "shellos": {
    "types": [
      "water"
    ]
  },
  "gastrodon": {
    "types": [
      "water",
      "ground"
    ]
  },
  "ambipom": {
    "types": [
      "normal"
    ]
  },
  "drifloon": {
    "types": [
      "ghost",
      "flying"
    ]
  },
  "drifblim": {
    "types": [
      "ghost",
      "flying"
    ]
  },
  "buneary": {
    "types": [
      "normal"
    ]
  },
  "lopunny": {
    "types": [
      "normal"
    ]
  },
  "mismagius": {
    "types": [
      "ghost"
    ]
  },
  "honchkrow": {
    "types": [
      "dark",
      "flying"
    ]
  },
  "glameow": {
    "types": [
      "normal"
    ]
  },
  "purugly": {
    "types": [
      "normal"
    ]
  },
  "chingling": {
    "types": [
      "psychic"
    ]
  },
  "stunky": {
    "types": [
      "poison",
      "dark"
    ]
  },
  "skuntank": {
    "types": [
      "poison",
      "dark"
    ]
  },
  "bronzor": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "bronzong": {
    "types": [
      "steel",
      "psychic"
    ]
  },
  "bonsly": {
    "types": [
      "rock"
    ]
  },
  "mime jr.": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "happiny": {
    "types": [
      "normal"
    ]
  },
  "chatot": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "spiritomb": {
    "types": [
      "ghost",
      "dark"
    ]
  },
  "gible": {
    "types": [
      "dragon",
      "ground"
    ]
  },
  "gabite": {
    "types": [
      "dragon",
      "ground"
    ]
  },
  "garchomp": {
    "types": [
      "dragon",
      "ground"
    ]
  },
  "munchlax": {
    "types": [
      "normal"
    ]
  },
  "riolu": {
    "types": [
      "fighting"
    ]
  },
  "lucario": {
    "types": [
      "fighting",
      "steel"
    ]
  },
  "hippopotas": {
    "types": [
      "ground"
    ]
  },
  "hippowdon": {
    "types": [
      "ground"
    ]
  },
  "skorupi": {
    "types": [
      "poison",
      "bug"
    ]
  },
  "drapion": {
    "types": [
      "poison",
      "dark"
    ]
  },
  "croagunk": {
    "types": [
      "poison",
      "fighting"
    ]
  },
  "toxicroak": {
    "types": [
      "poison",
      "fighting"
    ]
  },
  "carnivine": {
    "types": [
      "grass"
    ]
  },
  "finneon": {
    "types": [
      "water"
    ]
  },
  "lumineon": {
    "types": [
      "water"
    ]
  },
  "mantyke": {
    "types": [
      "water",
      "flying"
    ]
  },
  "snover": {
    "types": [
      "grass",
      "ice"
    ]
  },
  "abomasnow": {
    "types": [
      "grass",
      "ice"
    ]
  },
  "weavile": {
    "types": [
      "dark",
      "ice"
    ]
  },
  "magnezone": {
    "types": [
      "electric",
      "steel"
    ]
  },
  "lickilicky": {
    "types": [
      "normal"
    ]
  },
  "rhyperior": {
    "types": [
      "ground",
      "rock"
    ]
  },
  "tangrowth": {
    "types": [
      "grass"
    ]
  },
  "electivire": {
    "types": [
      "electric"
    ]
  },
  "magmortar": {
    "types": [
      "fire"
    ]
  },
  "togekiss": {
    "types": [
      "fairy",
      "flying"
    ]
  },
  "yanmega": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "leafeon": {
    "types": [
      "grass"
    ]
  },
  "glaceon": {
    "types": [
      "ice"
    ]
  },
  "gliscor": {
    "types": [
      "ground",
      "flying"
    ]
  },
  "mamoswine": {
    "types": [
      "ice",
      "ground"
    ]
  },
  "porygon-z": {
    "types": [
      "normal"
    ]
  },
  "gallade": {
    "types": [
      "psychic",
      "fighting"
    ]
  },
  "probopass": {
    "types": [
      "rock",
      "steel"
    ]
  },
  "dusknoir": {
    "types": [
      "ghost"
    ]
  },
  "froslass": {
    "types": [
      "ice",
      "ghost"
    ]
  },
  "rotom": {
    "types": [
      "electric",
      "ghost"
    ]
  },
  "uxie": {
    "types": [
      "psychic"
    ]
  },
  "mesprit": {
    "types": [
      "psychic"
    ]
  },
  "azelf": {
    "types": [
      "psychic"
    ]
  },
  "dialga": {
    "types": [
      "steel",
      "dragon"
    ]
  },
  "palkia": {
    "types": [
      "water",
      "dragon"
    ]
  },
  "heatran": {
    "types": [
      "fire",
      "steel"
    ]
  },
  "regigigas": {
    "types": [
      "normal"
    ]
  },
  "giratina": {
    "types": [
      "ghost",
      "dragon"
    ]
  },
  "cresselia": {
    "types": [
      "psychic"
    ]
  },
  "phione": {
    "types": [
      "water"
    ]
  },
  "manaphy": {
    "types": [
      "water"
    ]
  },
  "darkrai": {
    "types": [
      "dark"
    ]
  },
  "shaymin": {
    "types": [
      "grass"
    ]
  },
  "arceus": {
    "types": [
      "normal"
    ]
  },
  "victini": {
    "types": [
      "psychic",
      "fire"
    ]
  },
  "snivy": {
    "types": [
      "grass"
    ]
  },
  "servine": {
    "types": [
      "grass"
    ]
  },
  "serperior": {
    "types": [
      "grass"
    ]
  },
  "tepig": {
    "types": [
      "fire"
    ]
  },
  "pignite": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "emboar": {
    "types": [
      "fire",
      "fighting"
    ]
  },
  "oshawott": {
    "types": [
      "water"
    ]
  },
  "dewott": {
    "types": [
      "water"
    ]
  },
  "samurott": {
    "types": [
      "water"
    ]
  },
  "patrat": {
    "types": [
      "normal"
    ]
  },
  "watchog": {
    "types": [
      "normal"
    ]
  },
  "lillipup": {
    "types": [
      "normal"
    ]
  },
  "herdier": {
    "types": [
      "normal"
    ]
  },
  "stoutland": {
    "types": [
      "normal"
    ]
  },
  "purrloin": {
    "types": [
      "dark"
    ]
  },
  "liepard": {
    "types": [
      "dark"
    ]
  },
  "pansage": {
    "types": [
      "grass"
    ]
  },
  "simisage": {
    "types": [
      "grass"
    ]
  },
  "pansear": {
    "types": [
      "fire"
    ]
  },
  "simisear": {
    "types": [
      "fire"
    ]
  },
  "panpour": {
    "types": [
      "water"
    ]
  },
  "simipour": {
    "types": [
      "water"
    ]
  },
  "munna": {
    "types": [
      "psychic"
    ]
  },
  "musharna": {
    "types": [
      "psychic"
    ]
  },
  "pidove": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "tranquill": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "unfezant": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "blitzle": {
    "types": [
      "electric"
    ]
  },
  "zebstrika": {
    "types": [
      "electric"
    ]
  },
  "roggenrola": {
    "types": [
      "rock"
    ]
  },
  "boldore": {
    "types": [
      "rock"
    ]
  },
  "gigalith": {
    "types": [
      "rock"
    ]
  },
  "woobat": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "swoobat": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "drilbur": {
    "types": [
      "ground"
    ]
  },
  "excadrill": {
    "types": [
      "ground",
      "steel"
    ]
  },
  "audino": {
    "types": [
      "normal"
    ]
  },
  "timburr": {
    "types": [
      "fighting"
    ]
  },
  "gurdurr": {
    "types": [
      "fighting"
    ]
  },
  "conkeldurr": {
    "types": [
      "fighting"
    ]
  },
  "tympole": {
    "types": [
      "water"
    ]
  },
  "palpitoad": {
    "types": [
      "water",
      "ground"
    ]
  },
  "seismitoad": {
    "types": [
      "water",
      "ground"
    ]
  },
  "throh": {
    "types": [
      "fighting"
    ]
  },
  "sawk": {
    "types": [
      "fighting"
    ]
  },
  "sewaddle": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "swadloon": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "leavanny": {
    "types": [
      "bug",
      "grass"
    ]
  },
  "venipede": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "whirlipede": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "scolipede": {
    "types": [
      "bug",
      "poison"
    ]
  },
  "cottonee": {
    "types": [
      "grass",
      "fairy"
    ]
  },
  "whimsicott": {
    "types": [
      "grass",
      "fairy"
    ]
  },
  "petilil": {
    "types": [
      "grass"
    ]
  },
  "lilligant": {
    "types": [
      "grass"
    ]
  },
  "basculin": {
    "types": [
      "water"
    ]
  },
  "sandile": {
    "types": [
      "ground",
      "dark"
    ]
  },
  "krokorok": {
    "types": [
      "ground",
      "dark"
    ]
  },
  "krookodile": {
    "types": [
      "ground",
      "dark"
    ]
  },
  "darumaka": {
    "types": [
      "fire"
    ]
  },
  "darmanitan": {
    "types": [
      "fire"
    ]
  },
  "maractus": {
    "types": [
      "grass"
    ]
  },
  "dwebble": {
    "types": [
      "bug",
      "rock"
    ]
  },
  "crustle": {
    "types": [
      "bug",
      "rock"
    ]
  },
  "scraggy": {
    "types": [
      "dark",
      "fighting"
    ]
  },
  "scrafty": {
    "types": [
      "dark",
      "fighting"
    ]
  },
  "sigilyph": {
    "types": [
      "psychic",
      "flying"
    ]
  },
  "yamask": {
    "types": [
      "ghost"
    ]
  },
  "cofagrigus": {
    "types": [
      "ghost"
    ]
  },
  "tirtouga": {
    "types": [
      "water",
      "rock"
    ]
  },
  "carracosta": {
    "types": [
      "water",
      "rock"
    ]
  },
  "archen": {
    "types": [
      "rock",
      "flying"
    ]
  },
  "archeops": {
    "types": [
      "rock",
      "flying"
    ]
  },
  "trubbish": {
    "types": [
      "poison"
    ]
  },
  "garbodor": {
    "types": [
      "poison"
    ]
  },
  "zorua": {
    "types": [
      "dark"
    ]
  },
  "zoroark": {
    "types": [
      "dark"
    ]
  },
  "minccino": {
    "types": [
      "normal"
    ]
  },
  "cinccino": {
    "types": [
      "normal"
    ]
  },
  "gothita": {
    "types": [
      "psychic"
    ]
  },
  "gothorita": {
    "types": [
      "psychic"
    ]
  },
  "gothitelle": {
    "types": [
      "psychic"
    ]
  },
  "solosis": {
    "types": [
      "psychic"
    ]
  },
  "duosion": {
    "types": [
      "psychic"
    ]
  },
  "reuniclus": {
    "types": [
      "psychic"
    ]
  },
  "ducklett": {
    "types": [
      "water",
      "flying"
    ]
  },
  "swanna": {
    "types": [
      "water",
      "flying"
    ]
  },
  "vanillite": {
    "types": [
      "ice"
    ]
  },
  "vanillish": {
    "types": [
      "ice"
    ]
  },
  "vanilluxe": {
    "types": [
      "ice"
    ]
  },
  "deerling": {
    "types": [
      "normal",
      "grass"
    ]
  },
  "sawsbuck": {
    "types": [
      "normal",
      "grass"
    ]
  },
  "emolga": {
    "types": [
      "electric",
      "flying"
    ]
  },
  "karrablast": {
    "types": [
      "bug"
    ]
  },
  "escavalier": {
    "types": [
      "bug",
      "steel"
    ]
  },
  "foongus": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "amoonguss": {
    "types": [
      "grass",
      "poison"
    ]
  },
  "frillish": {
    "types": [
      "water",
      "ghost"
    ]
  },
  "jellicent": {
    "types": [
      "water",
      "ghost"
    ]
  },
  "alomomola": {
    "types": [
      "water"
    ]
  },
  "joltik": {
    "types": [
      "bug",
      "electric"
    ]
  },
  "galvantula": {
    "types": [
      "bug",
      "electric"
    ]
  },
  "ferroseed": {
    "types": [
      "grass",
      "steel"
    ]
  },
  "ferrothorn": {
    "types": [
      "grass",
      "steel"
    ]
  },
  "klink": {
    "types": [
      "steel"
    ]
  },
  "klang": {
    "types": [
      "steel"
    ]
  },
  "klinklang": {
    "types": [
      "steel"
    ]
  },
  "tynamo": {
    "types": [
      "electric"
    ]
  },
  "eelektrik": {
    "types": [
      "electric"
    ]
  },
  "eelektross": {
    "types": [
      "electric"
    ]
  },
  "elgyem": {
    "types": [
      "psychic"
    ]
  },
  "beheeyem": {
    "types": [
      "psychic"
    ]
  },
  "litwick": {
    "types": [
      "ghost",
      "fire"
    ]
  },
  "lampent": {
    "types": [
      "ghost",
      "fire"
    ]
  },
  "chandelure": {
    "types": [
      "ghost",
      "fire"
    ]
  },
  "axew": {
    "types": [
      "dragon"
    ]
  },
  "fraxure": {
    "types": [
      "dragon"
    ]
  },
  "haxorus": {
    "types": [
      "dragon"
    ]
  },
  "cubchoo": {
    "types": [
      "ice"
    ]
  },
  "beartic": {
    "types": [
      "ice"
    ]
  },
  "cryogonal": {
    "types": [
      "ice"
    ]
  },
  "shelmet": {
    "types": [
      "bug"
    ]
  },
  "accelgor": {
    "types": [
      "bug"
    ]
  },
  "stunfisk": {
    "types": [
      "ground",
      "electric"
    ]
  },
  "mienfoo": {
    "types": [
      "fighting"
    ]
  },
  "mienshao": {
    "types": [
      "fighting"
    ]
  },
  "druddigon": {
    "types": [
      "dragon"
    ]
  },
  "golett": {
    "types": [
      "ground",
      "ghost"
    ]
  },
  "golurk": {
    "types": [
      "ground",
      "ghost"
    ]
  },
  "pawniard": {
    "types": [
      "dark",
      "steel"
    ]
  },
  "bisharp": {
    "types": [
      "dark",
      "steel"
    ]
  },
  "bouffalant": {
    "types": [
      "normal"
    ]
  },
  "rufflet": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "braviary": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "vullaby": {
    "types": [
      "dark",
      "flying"
    ]
  },
  "mandibuzz": {
    "types": [
      "dark",
      "flying"
    ]
  },
  "heatmor": {
    "types": [
      "fire"
    ]
  },
  "durant": {
    "types": [
      "bug",
      "steel"
    ]
  },
  "deino": {
    "types": [
      "dark",
      "dragon"
    ]
  },
  "zweilous": {
    "types": [
      "dark",
      "dragon"
    ]
  },
  "hydreigon": {
    "types": [
      "dark",
      "dragon"
    ]
  },
  "larvesta": {
    "types": [
      "bug",
      "fire"
    ]
  },
  "volcarona": {
    "types": [
      "bug",
      "fire"
    ]
  },
  "cobalion": {
    "types": [
      "steel",
      "fighting"
    ]
  },
  "terrakion": {
    "types": [
      "rock",
      "fighting"
    ]
  },
  "virizion": {
    "types": [
      "grass",
      "fighting"
    ]
  },
  "tornadus": {
    "types": [
      "flying"
    ]
  },
  "thundurus": {
    "types": [
      "electric",
      "flying"
    ]
  },
  "reshiram": {
    "types": [
      "dragon",
      "fire"
    ]
  },
  "zekrom": {
    "types": [
      "dragon",
      "electric"
    ]
  },
  "landorus": {
    "types": [
      "ground",
      "flying"
    ]
  },
  "kyurem": {
    "types": [
      "dragon",
      "ice"
    ]
  },
  "keldeo": {
    "types": [
      "water",
      "fighting"
    ]
  },
  "meloetta": {
    "types": [
      "normal",
      "psychic"
    ]
  },
  "genesect": {
    "types": [
      "bug",
      "steel"
    ]
  },
  "chespin": {
    "types": [
      "grass"
    ]
  },
  "quilladin": {
    "types": [
      "grass"
    ]
  },
  "chesnaught": {
    "types": [
      "grass",
      "fighting"
    ]
  },
  "fennekin": {
    "types": [
      "fire"
    ]
  },
  "braixen": {
    "types": [
      "fire"
    ]
  },
  "delphox": {
    "types": [
      "fire",
      "psychic"
    ]
  },
  "froakie": {
    "types": [
      "water"
    ]
  },
  "frogadier": {
    "types": [
      "water"
    ]
  },
  "greninja": {
    "types": [
      "water",
      "dark"
    ]
  },
  "bunnelby": {
    "types": [
      "normal"
    ]
  },
  "diggersby": {
    "types": [
      "normal",
      "ground"
    ]
  },
  "fletchling": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "fletchinder": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "talonflame": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "scatterbug": {
    "types": [
      "bug"
    ]
  },
  "spewpa": {
    "types": [
      "bug"
    ]
  },
  "vivillon": {
    "types": [
      "bug",
      "flying"
    ]
  },
  "litleo": {
    "types": [
      "fire",
      "normal"
    ]
  },
  "pyroar": {
    "types": [
      "fire",
      "normal"
    ]
  },
  "flabébé": {
    "types": [
      "fairy"
    ]
  },
  "floette": {
    "types": [
      "fairy"
    ]
  },
  "florges": {
    "types": [
      "fairy"
    ]
  },
  "skiddo": {
    "types": [
      "grass"
    ]
  },
  "gogoat": {
    "types": [
      "grass"
    ]
  },
  "pancham": {
    "types": [
      "fighting"
    ]
  },
  "pangoro": {
    "types": [
      "fighting",
      "dark"
    ]
  },
  "furfrou": {
    "types": [
      "normal"
    ]
  },
  "espurr": {
    "types": [
      "psychic"
    ]
  },
  "meowstic": {
    "types": [
      "psychic"
    ]
  },
  "honedge": {
    "types": [
      "steel",
      "ghost"
    ]
  },
  "doublade": {
    "types": [
      "steel",
      "ghost"
    ]
  },
  "aegislash": {
    "types": [
      "steel",
      "ghost"
    ]
  },
  "spritzee": {
    "types": [
      "fairy"
    ]
  },
  "aromatisse": {
    "types": [
      "fairy"
    ]
  },
  "swirlix": {
    "types": [
      "fairy"
    ]
  },
  "slurpuff": {
    "types": [
      "fairy"
    ]
  },
  "inkay": {
    "types": [
      "dark",
      "psychic"
    ]
  },
  "malamar": {
    "types": [
      "dark",
      "psychic"
    ]
  },
  "binacle": {
    "types": [
      "rock",
      "water"
    ]
  },
  "barbaracle": {
    "types": [
      "rock",
      "water"
    ]
  },
  "skrelp": {
    "types": [
      "poison",
      "water"
    ]
  },
  "dragalge": {
    "types": [
      "poison",
      "dragon"
    ]
  },
  "clauncher": {
    "types": [
      "water"
    ]
  },
  "clawitzer": {
    "types": [
      "water"
    ]
  },
  "helioptile": {
    "types": [
      "electric",
      "normal"
    ]
  },
  "heliolisk": {
    "types": [
      "electric",
      "normal"
    ]
  },
  "tyrunt": {
    "types": [
      "rock",
      "dragon"
    ]
  },
  "tyrantrum": {
    "types": [
      "rock",
      "dragon"
    ]
  },
  "amaura": {
    "types": [
      "rock",
      "ice"
    ]
  },
  "aurorus": {
    "types": [
      "rock",
      "ice"
    ]
  },
  "sylveon": {
    "types": [
      "fairy"
    ]
  },
  "hawlucha": {
    "types": [
      "fighting",
      "flying"
    ]
  },
  "dedenne": {
    "types": [
      "electric",
      "fairy"
    ]
  },
  "carbink": {
    "types": [
      "rock",
      "fairy"
    ]
  },
  "goomy": {
    "types": [
      "dragon"
    ]
  },
  "sliggoo": {
    "types": [
      "dragon"
    ]
  },
  "goodra": {
    "types": [
      "dragon"
    ]
  },
  "klefki": {
    "types": [
      "steel",
      "fairy"
    ]
  },
  "phantump": {
    "types": [
      "ghost",
      "grass"
    ]
  },
  "trevenant": {
    "types": [
      "ghost",
      "grass"
    ]
  },
  "pumpkaboo": {
    "types": [
      "ghost",
      "grass"
    ]
  },
  "gourgeist": {
    "types": [
      "ghost",
      "grass"
    ]
  },
  "bergmite": {
    "types": [
      "ice"
    ]
  },
  "avalugg": {
    "types": [
      "ice"
    ]
  },
  "noibat": {
    "types": [
      "flying",
      "dragon"
    ]
  },
  "noivern": {
    "types": [
      "flying",
      "dragon"
    ]
  },
  "xerneas": {
    "types": [
      "fairy"
    ]
  },
  "yveltal": {
    "types": [
      "dark",
      "flying"
    ]
  },
  "zygarde": {
    "types": [
      "dragon",
      "ground"
    ]
  },
  "diancie": {
    "types": [
      "rock",
      "fairy"
    ]
  },
  "hoopa": {
    "types": [
      "psychic",
      "ghost"
    ]
  },
  "volcanion": {
    "types": [
      "fire",
      "water"
    ]
  },
  "rowlet": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "dartrix": {
    "types": [
      "grass",
      "flying"
    ]
  },
  "decidueye": {
    "types": [
      "grass",
      "ghost"
    ]
  },
  "litten": {
    "types": [
      "fire"
    ]
  },
  "torracat": {
    "types": [
      "fire"
    ]
  },
  "incineroar": {
    "types": [
      "fire",
      "dark"
    ]
  },
  "popplio": {
    "types": [
      "water"
    ]
  },
  "brionne": {
    "types": [
      "water"
    ]
  },
  "primarina": {
    "types": [
      "water",
      "fairy"
    ]
  },
  "pikipek": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "trumbeak": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "toucannon": {
    "types": [
      "normal",
      "flying"
    ]
  },
  "yungoos": {
    "types": [
      "normal"
    ]
  },
  "gumshoos": {
    "types": [
      "normal"
    ]
  },
  "grubbin": {
    "types": [
      "bug"
    ]
  },
  "charjabug": {
    "types": [
      "bug",
      "electric"
    ]
  },
  "vikavolt": {
    "types": [
      "bug",
      "electric"
    ]
  },
  "crabrawler": {
    "types": [
      "fighting"
    ]
  },
  "crabominable": {
    "types": [
      "fighting",
      "ice"
    ]
  },
  "oricorio": {
    "types": [
      "fire",
      "flying"
    ]
  },
  "cutiefly": {
    "types": [
      "bug",
      "fairy"
    ]
  },
  "ribombee": {
    "types": [
      "bug",
      "fairy"
    ]
  },
  "rockruff": {
    "types": [
      "rock"
    ]
  },
  "lycanroc": {
    "types": [
      "rock"
    ]
  },
  "wishiwashi": {
    "types": [
      "water"
    ]
  },
  "mareanie": {
    "types": [
      "poison",
      "water"
    ]
  },
  "toxapex": {
    "types": [
      "poison",
      "water"
    ]
  },
  "mudbray": {
    "types": [
      "ground"
    ]
  },
  "mudsdale": {
    "types": [
      "ground"
    ]
  },
  "dewpider": {
    "types": [
      "water",
      "bug"
    ]
  },
  "araquanid": {
    "types": [
      "water",
      "bug"
    ]
  },
  "fomantis": {
    "types": [
      "grass"
    ]
  },
  "lurantis": {
    "types": [
      "grass"
    ]
  },
  "morelull": {
    "types": [
      "grass",
      "fairy"
    ]
  },
  "shiinotic": {
    "types": [
      "grass",
      "fairy"
    ]
  },
  "salandit": {
    "types": [
      "poison",
      "fire"
    ]
  },
  "salazzle": {
    "types": [
      "poison",
      "fire"
    ]
  },
  "stufful": {
    "types": [
      "normal",
      "fighting"
    ]
  },
  "bewear": {
    "types": [
      "normal",
      "fighting"
    ]
  },
  "bounsweet": {
    "types": [
      "grass"
    ]
  },
  "steenee": {
    "types": [
      "grass"
    ]
  },
  "tsareena": {
    "types": [
      "grass"
    ]
  },
  "comfey": {
    "types": [
      "fairy"
    ]
  },
  "oranguru": {
    "types": [
      "normal",
      "psychic"
    ]
  },
  "passimian": {
    "types": [
      "fighting"
    ]
  },
  "wimpod": {
    "types": [
      "bug",
      "water"
    ]
  },
  "golisopod": {
    "types": [
      "bug",
      "water"
    ]
  },
  "sandygast": {
    "types": [
      "ghost",
      "ground"
    ]
  },
  "palossand": {
    "types": [
      "ghost",
      "ground"
    ]
  },
  "pyukumuku": {
    "types": [
      "water"
    ]
  },
  "type: null": {
    "types": [
      "normal"
    ]
  },
  "silvally": {
    "types": [
      "normal"
    ]
  },
  "poipole": {
    "types": [
      "poison",
    ],
  },
  "naganadel": {
    "types": [
      "poison",
      "dragon",
    ],
  },
  "minior": {
    "types": [
      "rock",
      "flying"
    ]
  },
  "komala": {
    "types": [
      "normal"
    ]
  },
  "turtonator": {
    "types": [
      "fire",
      "dragon"
    ]
  },
  "togedemaru": {
    "types": [
      "electric",
      "steel"
    ]
  },
  "mimikyu": {
    "types": [
      "ghost",
      "fairy"
    ]
  },
  "bruxish": {
    "types": [
      "water",
      "psychic"
    ]
  },
  "drampa": {
    "types": [
      "normal",
      "dragon"
    ]
  },
  "dhelmise": {
    "types": [
      "ghost",
      "grass"
    ]
  },
  "jangmo-o": {
    "types": [
      "dragon"
    ]
  },
  "hakamo-o": {
    "types": [
      "dragon",
      "fighting"
    ]
  },
  "kommo-o": {
    "types": [
      "dragon",
      "fighting"
    ]
  },
  "tapu koko": {
    "types": [
      "electric",
      "fairy"
    ]
  },
  "tapu lele": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "tapu bulu": {
    "types": [
      "grass",
      "fairy"
    ]
  },
  "tapu fini": {
    "types": [
      "water",
      "fairy"
    ]
  },
  "cosmog": {
    "types": [
      "psychic"
    ]
  },
  "cosmoem": {
    "types": [
      "psychic"
    ]
  },
  "solgaleo": {
    "types": [
      "psychic",
      "steel"
    ]
  },
  "lunala": {
    "types": [
      "psychic",
      "ghost"
    ]
  },
  "nihilego": {
    "types": [
      "rock",
      "poison"
    ]
  },
  "stakataka": {
    "types": [
      "rock",
      "steel",
    ],
  },
  "blacephalon": {
    "types": [
      "fire",
      "ghost",
    ],
  },
  "buzzwole": {
    "types": [
      "bug",
      "fighting"
    ]
  },
  "pheromosa": {
    "types": [
      "bug",
      "fighting"
    ]
  },
  "xurkitree": {
    "types": [
      "electric"
    ]
  },
  "celesteela": {
    "types": [
      "steel",
      "flying"
    ]
  },
  "kartana": {
    "types": [
      "grass",
      "steel"
    ]
  },
  "guzzlord": {
    "types": [
      "dark",
      "dragon"
    ]
  },
  "necrozma": {
    "types": [
      "psychic"
    ]
  },
  "magearna": {
    "types": [
      "steel",
      "fairy"
    ]
  },
  "marshadow": {
    "types": [
      "fighting",
      "ghost"
    ]
  },
  "zeraora": {
    "types": [
      "electric",
    ],
  },
  "grookey": {
    "types": [
      "grass"
    ]
  },
  "thwackey": {
    "types": [
      "grass"
    ]
  },
  "rillaboom": {
    "types": [
      "grass"
    ]
  },
  "scorbunny": {
    "types": [
      "fire"
    ]
  },
  "raboot": {
    "types": [
      "fire"
    ]
  },
  "cinderace": {
    "types": [
      "fire"
    ]
  },
  "sobble": {
    "types": [
      "water"
    ]
  },
  "drizzile": {
    "types": [
      "water"
    ]
  },
  "inteleon": {
    "types": [
      "water"
    ]
  },
  "skwovet": {
    "types": [
      "normal"
    ]
  },
  "greedent": {
    "types": [
      "normal"
    ]
  },
  "rookidee": {
    "types": [
      "flying"
    ]
  },
  "corvisquire": {
    "types": [
      "flying"
    ]
  },
  "corviknight": {
    "types": [
      "flying",
      "steel"
    ]
  },
  "blipbug": {
    "types": [
      "bug"
    ]
  },
  "dottler": {
    "types": [
      "bug",
      "psychic"
    ]
  },
  "orbeetle": {
    "types": [
      "bug",
      "psychic"
    ]
  },
  "nickit": {
    "types": [
      "dark"
    ]
  },
  "thievul": {
    "types": [
      "dark"
    ]
  },
  "gossifleur": {
    "types": [
      "grass"
    ]
  },
  "eldegoss": {
    "types": [
      "grass"
    ]
  },
  "wooloo": {
    "types": [
      "normal"
    ]
  },
  "dubwool": {
    "types": [
      "normal"
    ]
  },
  "chewtle": {
    "types": [
      "water"
    ]
  },
  "drednaw": {
    "types": [
      "water",
      "rock"
    ]
  },
  "yamper": {
    "types": [
      "electric"
    ]
  },
  "boltund": {
    "types": [
      "electric"
    ]
  },
  "rolycoly": {
    "types": [
      "rock"
    ]
  },
  "carkol": {
    "types": [
      "rock",
      "fire"
    ]
  },
  "coalossal": {
    "types": [
      "rock",
      "fire"
    ]
  },
  "applin": {
    "types": [
      "grass",
      "dragon"
    ]
  },
  "flapple": {
    "types": [
      "grass",
      "dragon"
    ]
  },
  "appletun": {
    "types": [
      "grass",
      "dragon"
    ]
  },
  "silicobra": {
    "types": [
      "ground"
    ]
  },
  "sandaconda": {
    "types": [
      "ground"
    ]
  },
  "cramorant": {
    "types": [
      "flying",
      "water"
    ]
  },
  "arrokuda": {
    "types": [
      "water"
    ]
  },
  "barraskewda": {
    "types": [
      "water"
    ]
  },
  "toxel": {
    "types": [
      "electric",
      "poison"
    ]
  },
  "toxtricity": {
    "types": [
      "electric",
      "poison"
    ]
  },
  "sizzlipede": {
    "types": [
      "fire",
      "bug"
    ]
  },
  "centiskorch": {
    "types": [
      "fire",
      "bug"
    ]
  },
  "clobbopus": {
    "types": [
      "fighting"
    ]
  },
  "grapploct": {
    "types": [
      "fighting"
    ]
  },
  "sinistea": {
    "types": [
      "ghost"
    ]
  },
  "polteageist": {
    "types": [
      "ghost"
    ]
  },
  "hatenna": {
    "types": [
      "psychic"
    ]
  },
  "hattrem": {
    "types": [
      "psychic"
    ]
  },
  "hatterene": {
    "types": [
      "psychic",
      "fairy"
    ]
  },
  "impidimp": {
    "types": [
      "dark",
      "fairy"
    ]
  },
  "morgrem": {
    "types": [
      "dark",
      "fairy"
    ]
  },
  "grimmsnarl": {
    "types": [
      "dark",
      "fairy"
    ]
  },
  "obstagoon": {
    "types": [
      "dark",
      "normal"
    ]
  },
  "perrserker": {
    "types": [
      "steel"
    ]
  },
  "cursola": {
    "types": [
      "ghost"
    ]
  },
  "sirfetch'd": {
    "types": [
      "fighting"
    ]
  },
  "mr. rime": {
    "types": [
      "ice",
      "psychic"
    ]
  },
  "runerigus": {
    "types": [
      "ground",
      "ghost"
    ]
  },
  "milcery": {
    "types": [
      "fairy"
    ]
  },
  "alcremie": {
    "types": [
      "fairy"
    ]
  },
  "falinks": {
    "types": [
      "fighting"
    ]
  },
  "pincurchin": {
    "types": [
      "electric"
    ]
  },
  "snom": {
    "types": [
      "ice",
      "bug"
    ]
  },
  "frosmoth": {
    "types": [
      "ice",
      "bug"
    ]
  },
  "stonjourner": {
    "types": [
      "rock"
    ]
  },
  "eiscue": {
    "types": [
      "ice"
    ]
  },
  "indeedee": {
    "types": [
      "psychic",
      "normal"
    ]
  },
  "morpeko": {
    "types": [
      "electric",
      "dark"
    ]
  },
  "cufant": {
    "types": [
      "steel"
    ]
  },
  "copperajah": {
    "types": [
      "steel"
    ]
  },
  "dracozolt": {
    "types": [
      "electric",
      "dragon"
    ]
  },
  "arctozolt": {
    "types": [
      "electric",
      "ice"
    ]
  },
  "dracovish": {
    "types": [
      "water",
      "dragon"
    ]
  },
  "arctovish": {
    "types": [
      "water",
      "ice"
    ]
  },
  "duraludon": {
    "types": [
      "steel",
      "dragon"
    ]
  },
  "dreepy": {
    "types": [
      "dragon",
      "ghost"
    ]
  },
  "drakloak": {
    "types": [
      "dragon",
      "ghost"
    ]
  },
  "dragapult": {
    "types": [
      "dragon",
      "ghost"
    ]
  },
  "zacian": {
    "types": [
      "fairy"
    ]
  },
  "zamazenta": {
    "types": [
      "fighting"
    ],
  },
  "eternatus": {
    "types": [
      "poison",
      "dragon",
    ],
  },
};

export default MON_DATA;