const exoticlocations = {
    place: ["Canebrake", "Cherry forest", "Stone staircase of an old temple", "Deserted beach", "Large wooden bridge", "Deserted road"],
    weather: ["at night, under the moonlight", "in the late afternoon", "at sunrise", "during a windstorm", "in the rain", "while it snows lightly"]
};

const finalVillainTypes = [
    "He’s to blame for your scar. Now you discover that he always knew and may even have planned your misfortune. He laughs at your existence and the fight will be fun for him.",
    "This villain was your former master. Now he reveals himself as a megalomaniac who wants power, who, theoretically, you were supposed to be by. But if you don’t collaborate, you should be eliminated.",
    "Several tragedies and conflicts that you witnessed on your journey were caused by this Final Villain. He was behind the curtains pulling the strings. And now, you are an obstacle to his plans.",
    "This Final Villain is a powerful and tyrannical Daimio of a Noble Clan who dominates a neighboring region and wants to provoke a war. For some reason, you are in his way and need to be eliminated.",
    "You meet the Final Villain and discover that he is, in fact, the first Villain who had appeared. However, now it has changed, changed its shape or revealed itself, having a new trick.",
    "The Final Villain reveals himself as the first Possible Ally you met. If he became your ally, it would only have been to deceive you. You find out now that he has a scar too. Roll a Scar Meaning and you are one of the possible causes of it."
];

const uniquePowers = [
    "This Villain is very observant and gains +1 in Fight each time he spends a Block point.",
    "This Villain is very fast and has 2 extra Block points.",
    "This Villain can manipulate fire and gains +1 in Fight. But if your scar is a burn, this number becomes +2 instead.",
    "Before facing this Villain, you will have to face one of his servants. The last Possible Ally you fail to become ally appears to protect the Final Villain.",
    "This Final Villain has one of your Allies (random) as prisoner. He blocks the first attack received using your Ally as a shield(killing him). If you surrender, the villain will keep the ally prisoner.",
    "One of your Allies (random) reveals himself as a servant of this Final Villain and you will have to face him first. If he did not have a technique, determine now."
];

// WIP ang Villains

let firstPossibleAlly;
const finalVillainName = finalName();
const finalVillainScar = generateScar();
const finalVillainScarMeaning = generateScarMeaning()
const finalVillainPowerIndex = Math.floor(Math.random() * uniquePowers.length);
const finalVillainBackgroundIndex = Math.floor(Math.random() * finalVillainTypes.length);

function generateFinalVillain(finalVillainPowerIndex, finalVillainBackgroundIndex) {
    const fightTechnique = randomTechnique();
    
    const finalVillain = {
        name: finalVillainName,
        appearance: normalizeText(randoAppearance()),
        technique: fightTechnique.desc,
        fight: fightTechnique.fight,
        block:fightTechnique.block,
        weapon: fightTechnique.weapon,
        power: uniquePowers[finalVillainPowerIndex],
        history: finalVillainTypes[finalVillainBackgroundIndex],
        scar: finalVillainScar,
        meaning: finalVillainScarMeaning
    };
}

function generateExoticLocation() {
    const thePlace = exoticlocations.place[Math.floor(Math.random() * exoticlocations.place.length)];
    const theWeather = exoticlocations.weather[Math.floor(Math.random() * exoticlocations.weather.length)];
    return `${thePlace} ${theWeather}`;
}

const villainTypes = [
    "This villain was a character involved in your past. It was probably one of the causes of his tragedy, but not the main cause.",
    `This villain is a Minion of ${finalVillain.name}. He talks about his master and his motivations.`,
    `This villain is a mercenary hired by ${finalVillain.name}. You still don’t know who this final villain is, but you already know his name and that he wants you dead.`,
    "This villain is actually someone who loves you. But something happened in his past that has now made your destruction more important than his ties. You lose 2 Compassion if you kill this villain.",
    "This villain is your brother. You didn’t expect this. But now you find out that he was there, along with you, when you got your scar. However, he blames you for everything and now he wants your death.",
    () => `This villain is an honorable samurai who wants to end the ronins and samurai without honor. It has no purpose other than doing what your code of honor says. It belongs to ${generateClanName()}.`
];

function villainBG() {
    return villainTypes[Math.floor(Math.random() * villainTypes.length)]; // villainTypes all function so you can do wonderful things with them
}

const firstVillain = {
    name: finalName(),
    appearance: normalizeText(randoAppearance()),
    technique: randomTechnique(),
    background: villainBG(),
    status: "Active"
}

const secondVillain = {
    name: finalName(),
    appearance: normalizeText(randoAppearance()),
    technique: randomTechnique(),
    background: villainBG(),
    status: "Active"
}


const villainsList = [firstVillain, secondVillain, finalVillain];