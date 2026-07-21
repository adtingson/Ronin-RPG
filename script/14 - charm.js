function charm() {
    const target = getTarget();

    const result = charmAttempt();

    if (result == "Charmed") {
        allies.push(target);
        const index = possibleAllies.indexOf(target);
        possibleAllies.splice(index,1);
        interactText.innerHTML = `${target.name} is now your ally! Since ${heshe(target)} is ${target.occupation == "Innocent" ? `an Innocent` : `a ${target.occupation}`}, ${heshe(target)} gives you the following benefits:<br><br>${allyRoleDesc(target, target.occupation)}<br><br>`;
        applyAllyBuff(target);
        interactButtons.innerHTML = `<button onclick="cleanUp()">Thanks!</button>`;
    }
    else {
        interactText.innerHTML = `You failed to convince ${target.name} to become an ally. Maybe you can try again someday.<br>`;
        interactButtons.innerHTML = `<button onclick="cleanUp()">See you!</button>`;
    }
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
        Mentor: () => `You can be trained by ${himher(target)} and add ${hisher(target)} technique to your card (so you can choose which technique to use when you fight enemies or villains).`,
        Blacksmith: () => `${HeShe(target)} can manufacture a Special Weapon (same as yours, but with a +1 Fight bonus) that will be delivered to you in the next “city” you encounter.`,
        Healer: () => `You cannot die when you are defeated in combat.`,
        Fighter: () => `When you encounter a Villain, this ally will appear and fight before you. If ${heshe(target)} defeats the Villain, ${heshe(target)} will abandon you and follow ${hisher(target)} own path, but if ${heshe(target)} is defeated, ${heshe(target)} will be dead.`,
        Innocent: () => `You will always get +1 in Fight. However, when you encounter a Villain, roll a die. If the result is 1 or 2, the villain killed this ally and you lose 2 of Determination.`
    }

    return allyRoleTable[occupation]();
}

function applyAllyBuff(target) {
    if (target.occupation == "Mentor") {
        if (ronin.technique.some(technique => technique.id == target.technique.id)) {
            interactText.innerHTML += `However, ${ronin.name} already knows ${target.technique.id}. So, ${target.name} has nothing more to teach you.<br>`;
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

            interactText.innerHTML += `${ronin.name} spent some time under the guidance of ${target.name}. ${ronin.name} learns ${target.technique.id}!(${target.technique.desc})<br>`;
        }
    }
    else if (target.occupation == "Blacksmith") {
        let weaponMade = ronin.technique[Math.floor(Math.random() * ronin.technique.length)].weapon;

        weaponsDelivery.push(weaponMade);

        interactText.innerHTML += `You will receive ${target.name}'s Special ${weaponMade} once you reach your next city.<br>`;
    }
}

function weaponsDeliveryCheck() {
    if (weaponsDelivery.length) {
        ronin.weapons ??= [];

        ronin.weapons.push(...weaponsDelivery);

        combatHeader.innerHTML += `As ${ronin.name} arrives at the city, ${heshe(ronin)} gets approached by a courier. The courier delivers the special weapons from ${ronin.name}'s blacksmith allies. Each type of weapon is crafted better than the last: ${weaponsDelivery.join(", ")}<br>`;

        weaponsDelivery = [];
    }
}