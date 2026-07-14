const familyVals = [
    () => `Samurai from ${randomNobleClan()}. You were thrown out of the family for dishonor.`,
    () => `Samurai from an extinct clan (${uniqueClan()}) after losing a war to ${randomNobleClan()}.`,
    () => `Plebeian family murdered by ${randomNobleClan()} for not paying tribute to the Daimio.`,
    () => `Plebeian family that revolted against the dominant ${randomNobleClan()} and now is persecuted by it.`,
    () => `Family of renowned artisans. Your ${motherFather()} revealed a terrible secret to you before they passed away.`,
    () => `Orphan. You were raised by a family of samurai from ${randomNobleClan()} as a servant until you were expelled.`
];

function randomNobleClan() {
    const randomIndex = Math.floor(Math.random() * nobleClans.length);
    return nobleClans[randomIndex].name;
}

function motherFather() {
    return Math.random() < 0.5 ? "father":"mother";
}

function generateFamilyBG() {
    return familyVals[Math.floor(Math.random() * familyVals.length)]();
}