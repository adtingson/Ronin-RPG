function rolld6() {
    return Math.floor(Math.random() * 6);
}

const clanNames = ["Ukiryuu (Dragon)", "Kitsune (Fox)", "Nezumi (Rat)", "Kasaitori (Bird)", "Tsukiinu (Dog)", "Mushi (Insect)", "Akaitora (Tiger)", "Yamabuta (Boar)", "Osuushi (Ox)", "Shiroiuma (Horse)", "Kinsaru (Monkey)", "Fuyukumo (Spider)", "Kazekani (Crab)", "Tetsukoi (Carp)", "Harihebi (Serpent)", "Kuroineko (Cat)", "Usagi (Rabbit)", "Karasu (Crow)", "Ondori (Roster)", "Shinkame (Turtle)", "Ushi (Cow)", "Kuma (Bear)", "Ookami (Wolf)", "Tokage (Lizard)", "Akirisu (Squirrel)", "Shimayagi (Goat)", "Ahiru (Duck)", "Natsusai (Rhino)", "Umisame (Shark)", "Yukiga (Moth)", "Sasori (Scorpion)", "Suzume (Sparrow)", "Washi (Eagle)", "Tsuru (Crane)", "Yorutako (Octopus)", "Kaeru (Frog)"];
const clanFeatures = [
    "This clan is one of the most powerful in the region. They are arrogant and like to create wars.",
    "This clan has a rival clan and is always prepared for war against them.",
    "This clan is known for the military use of Ninjas. They have a network of contacts and always know everything.",
    "This clan is one of the oldest. Today they are small, but one day they plan to go back to their glory days.",
    "This clan is new. It just formed after another clan was exterminated in the region.",
    "This is a smaller clan, vassal of a larger clan."
];

const nobleClans = [];

generateClan();
generateClan();
generateClan();
generateClan();


function generateClan() {
    const featIndex = Math.floor(Math.random() * clanFeatures.length);

    const nobleClan = {
        name: uniqueClan(),
        feature: clanFeatures[featIndex]
    }

    nobleClans.push(nobleClan);
}

function generateClanName() {
    const nameIndex = Math.floor(Math.random() * clanNames.length);
    return clanNames[nameIndex];
}

function uniqueClan() {
    let name;
    do {
        name = generateClanName();
    } while (nobleClans.some(clan => clan.name == name))
    
    return name;
}