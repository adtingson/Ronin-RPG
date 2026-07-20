function rolld6() {
    return Math.floor(Math.random() * 6);
}

const clanNames = [
    "Ukiryuu",
    "Kitsune",
    "Nezumi",
    "Kasaitori",
    "Tsukiinu",
    "Mushi",
    "Akaitora",
    "Yamabuta",
    "Osuushi",
    "Shiroiuma",
    "Kinsaru",
    "Fuyukumo",
    "Kazekani",
    "Tetsukoi",
    "Harihebi",
    "Kuroineko",
    "Usagi",
    "Karasu",
    "Ondori",
    "Shinkame",
    "Ushi",
    "Kuma",
    "Ookami",
    "Tokage",
    "Akirisu",
    "Shimayagi",
    "Ahiru",
    "Natsusai",
    "Umisame",
    "Yukiga",
    "Sasori",
    "Suzume",
    "Washi",
    "Tsuru",
    "Yorutako",
    "Kaeru"
];

const nobleClanNames = [];
const nobleClans = [];

let contextClan;

function randomNobleClan() {
    const randomIndex = Math.floor(Math.random() * 4);
    contextClan = `${nobleClans[randomIndex].name} Clan`;
    return contextClan;
}

function generateClanName() {
    const nameIndex = Math.floor(Math.random() * clanNames.length);
    return clanNames[nameIndex];
}

function uniqueClan() {
    let name;
    do {
        name = generateClanName();
    } while (nobleClanNames.some(clan => clan.name == name))
    
    return `${name}`;
}

function generateNobleClans() {
    for (let i = 0; i < 4; i++) {
        nobleClanNames.push(uniqueClan());
    }

    nobleClanNames.forEach(nobleClan => {
        let notThisClan = nobleClanNames.filter(clan => clan !== nobleClan)[Math.floor(Math.random() * 3)];

        const clanFeatures = [
            `This clan is one of the most powerful in the region. They are arrogant and like to create wars.`,
            `This clan has a rival clan and is always prepared for war against them. (Rival: ${notThisClan})`,
            `This clan is known for the military use of Ninjas. They have a network of contacts and always know everything.`,
            `This clan is one of the oldest. Today they are small, but one day they plan to go back to their glory days.`,
            `This clan is new. It just formed after another clan was exterminated in the region.`,
            `This is a smaller clan, vassal of a larger clan. (Vassal of ${notThisClan})`
        ];

        let newClan = {
            name: nobleClan,
            feature: clanFeatures[rolld6()]
        }

        nobleClans.push(newClan);
    });
}

generateNobleClans();