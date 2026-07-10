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

    let charmMessage;

    if (enemies.includes(target)) {
        interactText.innerHTML = `You cannot charm ${target.name}.<br>Try other interactions with them first, and make them a possible ally.`;
        return;
    }

    const result = charmAttempt();

    if (result == "Charmed") {
        allies.push(target);
        const index = possibleAllies.indexOf(target);
        possibleAllies.splice(index,1);
        charmMessage = `${target.name} is now your ally! Since they are a ${target.occupation}, they give you the following benefits:<p>${allyRoleDesc(target.occupation)}</p>`;
    }
    else {
        charmMessage = `You failed to convince ${target.name} to become an ally. Maybe you can try again someday.`;
    }

    encounterPersons.splice(0,1);

    interactText.innerHTML = charmMessage;

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

const allyRoleTable = {
        Mentor: "If he becomes an ally, you can be trained by him and add his technique to your card (so you can choose which technique to use when you fight enemies or villains).",
        Blacksmith: "If he becomes an ally, he can manufacture a Special Weapon (same as yours, but with a +1 Fight bonus) that will be delivered to you in the next “city” you encounter.",
        Healer: "If he becomes an ally, you cannot die when you are defeated in combat.",
        Fighter: "If he becomes an ally, when you encounter a Villain, this ally will appear and fight before you. If he defeats the Villain, he will abandon you and follow his own path, but if he is defeated, he will be dead.",
        Innocent: "If he becomes your ally, you will always get +1 in Fight. However, when you encounter a Villain, roll a die. If the result is 1 or 2, the villain killed this ally and you lose 2 of Determination."
    }

function allyRoleDesc(occupation) {
    return allyRoleTable[occupation];
}