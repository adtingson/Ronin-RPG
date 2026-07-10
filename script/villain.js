let firstPossibleAlly;

const exoticlocations = {
    place: [
        "canebrake",
        "cherry forest",
        "stone staircase of an old temple",
        "deserted beach",
        "large wooden bridge",
        "deserted road"],
    weather: ["at night, under the moonlight", "in the late afternoon", "at sunrise", "during a windstorm", "in the rain", "while it snows lightly"]
};

const finalVillainTraits = [
    () => {
        finalVillain.trait = `${finalVillain.gender == "Male" ? "He" : "She"} is to blame for your scar. Now you discover that ${finalVillain.gender == "Male" ? "he" : "she"} always knew and may even have planned your misfortune. ${finalVillain.gender == "Male" ? "He" : "She"} laughs at your existence and the fight will be fun for ${finalVillain.gender == "Male" ? "him" : "her"}.`;
    },
    () => {
        finalVillain.trait = `${finalVillain.gender == "Male" ? "He" : "She"} was your former master. Now ${finalVillain.gender == "Male" ? "he" : "she"} reveals ${finalVillain.gender == "Male" ? "him" : "her"}self as a megalomaniac who wants power, who, theoretically, you were supposed to be by. But if you don’t collaborate, you should be eliminated.`;
    },
    () => {
        finalVillain.trait = `Several tragedies and conflicts that you witnessed on your journey were caused by ${finalVillain.gender == "Male" ? "him" : "her"}. ${finalVillain.gender == "Male" ? "He" : "She"} was behind the curtains pulling the strings. And now, you are an obstacle to ${finalVillain.gender == "Male" ? "his" : "her"} plans.`;
    },
    () => {
        finalVillain.trait = `${finalVillain.gender == "Male" ? "He" : "She"} is a powerful and tyrannical Daimio of ${randomNobleClan()}, who dominates a neighboring region and wants to provoke a war. For some reason, you are in ${finalVillain.gender == "Male" ? "his" : "her"} way and need to be eliminated.`;
    },
    () => {
        finalVillain.trait = `You meet the Final Villain and discover that they are, in fact, ${firstVillain.name}, the first Villain who had appeared. However, now it has changed, changed its shape or revealed itself, having a new trick.`;
        finalVillain.name = `${finalVillain.name} aka ${firstVillain.name}`;
        finalVillain.technique = firstVillain.technique;
    },
    () => {
        if (firstPossibleAlly == undefined) {
            finalVillainTraits[Math.floor(Math.random() * 5)]()
            return;
        }
        finalVillain.trait = `The Final Villain reveals ${finalVillain.gender == "Male" ? "himself" : "herself"} as ${firstPossibleAlly.name}, the first Possible Ally you met. If ${finalVillain.gender == "Male" ? "he" : "she"} became your ally, it would only have been to deceive you. You find out now that they have a scar too. Roll a Scar Meaning and you are one of the possible causes of it.`
        finalVillain.name = `${finalVillain.name} aka ${firstPossibleAlly.name}`;
        finalVillain.gender = firstPossibleAlly.gender;
        finalVillain.appearance = firstPossibleAlly.appearance;
        finalVillain.technique = firstPossibleAlly.technique;
        finalVillain.technique.block = firstPossibleAlly.technique.block + 1;
        possibleAllies.includes(firstPossibleAlly) ? possibleAllies.splice(possibleAllies.indexOf(firstPossibleAlly), 1) : allies.splice(allies.indexOf(firstPossibleAlly), 1);
    }
];

const uniquePowers = [
    {
        condition: () => {},
        text: () => `This Villain is very observant and gains +1 in Fight each time he spends a Block point.`,
        fightBonus: (user,enemy) => user.block - enemyBlock
    },
    {
        condition: () => {},
        text: () => `This Villain is very fast and has 2 extra Block points.`,
        blockBonus: () => 2
    },
    {
        condition: () => {},
        text: () => `This Villain can manipulate fire and gains +1 in Fight. But if your scar is a burn, this number becomes +2 instead.`,
        fightBonus: (user,enemy) => (enemy.scar.includes("burn") || enemy.scar.includes("Burn")) ? 2 : 1
    },
    {
        condition: () => {
            if (possibleAllies.filter(possibleAlly => possibleAlly.status !== "dead").length === 0) {
                finalVillain.power = uniquePowers[rolld6()];
                finalVillain.power.condition();
            }
        },
        text: () => `Before facing this Villain, you will have to face one of his servants. The last Possible Ally you fail to become ally appears to protect the Final Villain.`,
        buffer: () => possibleAllies.at(-1)
    },
    {   condition: () => {
            if (allies.filter(ally => ally.status !== "dead").length === 0) {
                finalVillain.power = uniquePowers[rolld6()];
                finalVillain.power.condition();
            }
        },
        text: () => `This Final Villain has one of your Allies as prisoner. He blocks the first attack received using your Ally as a shield(killing him). If you surrender, the villain will keep the ally prisoner.`,
        prisoner: () => {
            let livingAllies = allies.filter(ally => ally.status !== "dead");

            return livingAllies[Math.floor(Math.random() * livingAllies.length)];
        }
    },
    {
        condition: () => {
            if (allies.filter(ally => ally.status !== "dead").length === 0) {
                finalVillain.power = uniquePowers[rolld6()];
                finalVillain.power.condition();
            }
        },
        text: () => `One of your Allies reveals himself as a servant of this Final Villain and you will have to face him first. If he did not have a technique, determine now.`,
        buffer: () => {
            let livingAllies = allies.filter(ally => ally.status !== "dead");

            return livingAllies[Math.floor(Math.random() * livingAllies.length)];
        }
    }
];


function generateExoticLocation() {
    const thePlace = exoticlocations.place[Math.floor(Math.random() * exoticlocations.place.length)];
    const theWeather = exoticlocations.weather[Math.floor(Math.random() * exoticlocations.weather.length)];
    return `${thePlace} ${theWeather}`;
}

const villainTraits = [
    (villain) => villain.trait = `This villain was a character involved in your past. It was probably one of the causes of his tragedy, but not the main cause.`,
    (villain) => villain.trait = `This villain is a Minion of ${finalVillain.name}. He talks about his master and his motivations.`,
    (villain) => villain.trait = `This villain is a mercenary hired by the final villain, ${finalVillain.name}. You still don’t know who this final villain is, but you already know his name and that he wants you dead.`,
    (villain) => {
        villain.trait = `This villain is actually someone who loves you. But something happened in his past that has now made your destruction more important than his ties. You lose 2 Compassion if you kill this villain.`;
        villain.compassionBonus = 2;
    },
    (villain) => villain.trait = `This villain is your ${villain.gender == "Male" ? "brother" : "sister"}. You didn’t expect this. But now you find out that ${villain.gender == "Male" ? "he" : "she"} was there, along with you, when you got your scar. However, ${villain.gender == "Male" ? "he" : "she"} blames you for everything and now ${villain.gender == "Male" ? "he" : "she"} wants your death.`,
    (villain) => villain.trait = `This villain is an honorable samurai who wants to end the ronins and samurai without honor. It has no purpose other than doing what your code of honor says. It belongs to ${randomNobleClan()}.`
];

const villainNames = [];
const villainGenders = [];

generateVillainNames();

function generateVillainNames() {
    const gender1 = genderFunc();
    const gender2 = genderFunc();
    const gender3 = genderFunc();

    let name1 = nameFunc(gender1);
    let name2;
    let name3;

    do {
        name2 = nameFunc(gender2);
    } while (name1 == name2);

    do {
        name3 = nameFunc(gender3);
    } while ([name1, name2].includes(name3));

    villainNames.push(name1);
    villainNames.push(name2);
    villainNames.push(name3);

    villainGenders.push(gender1);
    villainGenders.push(gender2);
    villainGenders.push(gender3);
}

const finalVillain = {
    name: villainNames[2],
    gender: villainGenders[2],
    appearance: normalizeText(randoAppearance()),
    technique: randomTechnique(),
    trait: finalVillainTraits[rolld6()],
    status: "active",
    scar: generateScar(),
    meaning: generateScarMeaning(),
    power: uniquePowers[rolld6()],
    firstStrike: "available"
}

const firstVillain = {
    name: villainNames[0],
    gender: villainGenders[0],
    appearance: normalizeText(randoAppearance()),
    technique: randomTechnique(),
    trait: villainTraits[rolld6()],
    status: "active",
    firstStrike: "available"
};

const secondVillain = {
    name: villainNames[1],
    gender: villainGenders[1],
    appearance: normalizeText(randoAppearance()),
    technique: randomTechnique(),
    trait: villainTraits[rolld6()],
    status: "active",
    firstStrike: "available"
};

const villainsList = [firstVillain, secondVillain, finalVillain];