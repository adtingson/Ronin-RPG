function charm() {
    const target = getTarget();

    if (target == undefined) {
        interactText.innerHTML = `There is no one to charm. Maybe they left?`;
        return;
    }

    if (allies.includes(target)) {
        interactText.innerHTML = `There is no point in charming ${target.name}. ${target.name} is already devoted to your cause.`;
        return;
    }
    else if (villainsList.includes(target)) {
        interactText.innerHTML = `You can be charming all you want. ${target.name} doesn't care. ${target.name} is devoted to your downfall.`;
        return;
    }

    if (enemies.includes(target)) {
        interactText.innerHTML = `You cannot charm ${target.name}.<br>Try other interactions with them first, and make them a possible ally.`;
        return;
    }

    const result = charmAttempt();

    if (result == "Charmed") {
        allies.push(target);
        const index = possibleAllies.indexOf(target);
        possibleAllies.splice(index,1);
        interactText.innerHTML = `${target.name} is now your ally! Since ${target.gender == "Male" ? "he" : "she"} is a ${target.occupation}, ${target.gender == "Male" ? "he" : "she"} gives you the following benefits:<p>${allyRoleDesc(target, target.occupation)}</p>`;
        applyAllyBuff(target);
    }
    else {
        interactText.innerHTML = `You failed to convince ${target.name} to become an ally. Maybe you can try again someday.`;
    }

    encounterPersons.splice(0,1);

    personPreview();
    renderUI();
}

function charmAttempt() {
    const empathy = rolld6() + ronin.compassion;
    const resistance = rolld6();

    if (empathy > resistance) {
        return "Charmed";
    }
    else {
        return "Failed";
    }
}

function allyRoleDesc(target, occupation) {
    const allyRoleTable = {
        Mentor: () => `If ${target.gender == "Male" ? "he" : "she"} becomes an ally, you can be trained by ${target.gender == "Male" ? "him" : "her"} and add ${target.gender == "Male" ? "his" : "her"} technique to your card (so you can choose which technique to use when you fight enemies or villains).`,
        Blacksmith: () => `If ${target.gender == "Male" ? "he" : "she"} becomes an ally, ${target.gender == "Male" ? "he" : "she"} can manufacture a Special Weapon (same as yours, but with a +1 Fight bonus) that will be delivered to you in the next “city” you encounter.`,
        Healer: () => `If ${target.gender == "Male" ? "he" : "she"} becomes an ally, you cannot die when you are defeated in combat.`,
        Fighter: () => `If ${target.gender == "Male" ? "he" : "she"} becomes an ally, when you encounter a Villain, this ally will appear and fight before you. If ${target.gender == "Male" ? "he" : "she"} defeats the Villain, ${target.gender == "Male" ? "he" : "she"} will abandon you and follow ${target.gender == "Male" ? "his" : "her"} own path, but if ${target.gender == "Male" ? "he" : "she"} is defeated, ${target.gender == "Male" ? "he" : "she"} will be dead.`,
        Innocent: () => `If ${target.gender == "Male" ? "he" : "she"} becomes your ally, you will always get +1 in Fight. However, when you encounter a Villain, roll a die. If the result is 1 or 2, the villain killed this ally and you lose 2 of Determination.`
    }

    return allyRoleTable[occupation]();
}

function applyAllyBuff(target) {
    if (target.occupation == "Mentor") {
        if (ronin.technique.some(technique => technique.id == target.technique.id)) {
            interactText.innerHTML += `However, ${ronin.name} already knows ${target.technique.id}. So, ${target.name} has nothing more to teach you.`;
        }
        else {
            let taughtTechnique = techniques.find(technique => technique.id == target.technique.id) ?? uncommonTechniques.find(technique => technique.id == target.technique.id);
            
            ronin.technique.push({...taughtTechnique});

            if (taughtTechnique.weapon == "Katana" && ronin.weapons.includes("Katana and Wakizashi") || taughtTechnique.weapon == "Katana and Wakizashi" && ronin.weapons.includes("Katana") || taughtTechnique.weapon == "Katana" && ronin.weapons.includes("Katana")) {
                if (taughtTechnique.weapon == "Katana" && ronin.weapons.includes("Katana and Wakizashi") || taughtTechnique.weapon == "Katana" && ronin.weapons.includes("Katana")) {
                    // do nothing
                }
                else if (taughtTechnique.weapon == "Katana and Wakizashi" && ronin.weapons.includes("Katana")) {
                    let oldKatana = ronin.weapons.find(weapon => weapon === "Katana");
                    ronin.weapons.splice(ronin.weapons.indexOf(oldKatana), 1);
                    ronin.weapons.push(taughtTechnique.weapon);
                }
            }
            else {
                ronin.weapons.push(taughtTechnique.weapon);
            }

            interactText.innerHTML += `${ronin.name} spent some time under the guidance of ${target.name}. ${ronin.name} learns ${target.technique.desc}!`;
        }
    }
    else if (target.occupation == "Blacksmith") {
        let weaponMade = ronin.technique[Math.floor(Math.random() * ronin.technique.length)].weapon;

        weaponsDelivery.push(weaponMade);

        interactText.innerHTML += `You will receive ${target.name}'s Special ${weaponMade} once you reach your next city.`;
    }
}

function weaponsDeliveryCheck() {
    if (weaponsDelivery.length) {
        ronin.weapons ??= [];

        ronin.weapons.push(...weaponsDelivery);

        interactText.innerHTML = `As ${ronin.name} arrives at the city, ${ronin.gender == "Male" ? "he" : "she"} gets approached by a courier. The courier delivers the special weapons from ${ronin.name}'s blacksmith allies. Each type of weapon is crafted better than the last: ${weaponsDelivery.join(", ")}`;

        weaponsDelivery = [];
    }
}