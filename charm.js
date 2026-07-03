function charm(person) {
    let charmMessage;

    if (!possibleAllies.includes(person)) {
        interactText.innerHTML = `You cannot charm ${person.name}.<br>Try other interactions with them first, and make them a possible ally.`;
        return;
    }

    const result = charmAttempt();

    if (result == "Charmed") {
        allies.push(person);
        const index = possibleAllies.indexOf(person);
        possibleAllies.splice(index,1);
        charmMessage = `${person.name} is now your ally! Since they are a ${person.occupation}, they give you the following benefits:<p>${allyRoleDesc(person.occupation)}</p>`;
    }
    else {
        charmMessage = `You failed to convince ${person.name} to become an ally. Maybe you can try again someday.`;
    }

    interactText.innerHTML = charmMessage;
}

function charmAttempt() {
    const empathy = rolld6() + roninStats.compassion;
    const resistance = rolld6();

    if (empathy > resistance) {
        return "Charmed";
    }
    else {
        return "Failed";
    }
}

function allyRoleDesc(occupation) {
    const allyRoleTable = {
        Mentor: "If he becomes an ally, you can be trained by him and add his technique to your card (so you can choose which technique to use when you fight enemies or villains).",
        Blacksmith: "If he becomes an ally, he can manufacture a Special Weapon (same as yours, but with a +1 Fight bonus) that will be delivered to you in the next “city” you encounter.",
        Healer: "If he becomes an ally, you cannot die when you are defeated in combat.",
        Fighter: "If he becomes an ally, when you encounter a Villain, this ally will appear and fight before you. If he defeats the Villain, he will abandon you and follow his own path, but if he is defeated, he will be dead.",
        Innocent: "If he becomes your ally, you will always get +1 in Fight. However, when you encounter a Villain, roll a die. If the result is 1 or 2, the villain killed this ally and you lose 2 of Determination."
    }

    return allyRoleTable[occupation];
}