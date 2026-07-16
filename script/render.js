function renderRoninStats() {
    document.getElementById("roninStats").innerHTML = renderCard("roninStats");
}

function renderDisplay() {
    renderRoninStats();
}

function renderInteractions() {
    const target = getTarget();

    interactButtons.innerHTML = "";

    if (target == undefined && encounterButtons.innerHTML == "") {
        interactButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
    }

    if (target == undefined) {
        return;
    }

    const cannotTalk = ["talkFailed", "darkSecretFailed", "darkSecret", "hater"].includes(target.background);
    const neutralStatus = !["lost", "dead", "winning"].includes(target.status);

    if (cannotTalk && allies.includes(target)) {
        interactButtons.innerHTML += `<button onclick="checkInteractions()">Continue</button>`;
    }

    if (!cannotTalk && !["fighting", "winning"].includes(target.status) && target.morale !== "emboldened") {
        interactButtons.innerHTML += `<button onclick="talk()">Talk</button>`;
    }

    if (possibleAllies.includes(target)) {
        interactButtons.innerHTML += `<button onclick="charm()">Charm</button>`;
    }

    if (enemies.includes(target) && target.morale !== "emboldened" && neutralStatus) {
        interactButtons.innerHTML += `<button onclick="intimidate()">Intimidate</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && target.status == "fighting") {
        interactButtons.innerHTML += `<button onclick="fight()">Fight</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && neutralStatus && target.status !== "fighting") {
        interactButtons.innerHTML += `<button onclick="renderTechniqueSelection()">Fight</button>`;
    }

    if ((villainsList.includes(target) || enemies.includes(target)) && target.status !== "lost") {
        interactButtons.innerHTML += `<button onclick="surrenderFight()">Surrender</button>`;
    }
}

function renderUI() {
    renderInteractions();
    renderDisplay();
    interactText.scrollTop = interactText.scrollHeight;
}

function personPreview() {
    const target = getTarget();

    if (target == undefined) {
        return;
    }

    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    if (enemies.includes(target) || villainsList.includes(target)) {
        combatHeader.innerHTML = `<b>${target.name}</b> ${target.techniqueID !== undefined ? `uses <i>${target.techniqueID}</i> ` : ``}[${target.weapon}](Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""}; Block: ${enemyBlock})`;
    }
    else if (possibleAllies.includes(target) || allies.includes(target)) {
        combatHeader.innerHTML = `<b>${target.name}</b> (${target.occupation}${target.occupation == "Mentor" ? ` of ${target.technique.desc}` : target.occupation == "Fighter" ? ` who uses ${target.technique.desc}` : ``})`;
    }
}

function renderCard(person) {
    if (person == ronin) {
        return `<table>
            <tr>
                <td>Name</td>
                <td colspan="3">${ronin.name}</td>
            </tr>
            <tr>
                <td>Appearance</td>
                <td colspan="3">${ronin.gender == "Male" ? "He" : "She"} ${ronin.appearance}</td>
            </tr>
            <tr>
                <td>Technique</td>
                <td colspan="3">${renderRoninTechniques()}</td>
            </tr>
            <tr>
                <td>Family</td>
                <td colspan="3">${ronin.family}</td>
            </tr>
            <tr>
                <td>Nightmare</td>
                <td colspan="3">${ronin.nightmare}</td>
            </tr>
            <tr>
                <td>Scar</td>
                <td colspan="3">${ronin.scar}</td>
            </tr>
            <tr>
                <td>Meaning</td>
                <td colspan="3">${ronin.meaning}</td>
            </tr>
            <tr>
                <td>Weapons</td>
                <td colspan="3">${renderRoninWeapons()}</td>
            </tr>
            <tr>
                <td>Items</td>
                <td colspan="3">${ronin.items.length ? ronin.items.join(", ") : `Empty`}</td>
            </tr>
        </table>`;
    }
    else if (villainsList.includes(person)) {
        return `<table>
            <tr>
                <td>Name</td>
                <td colspan="3">${person.name}</td>
            </tr>
            <tr>
                <td>Appearance</td>
                <td colspan="3">${person.gender == "Male" ? "He" : "She"} ${person.appearance}</td>
            </tr>
            <tr>
                <td>Technique</td>
                <td colspan="3">${person.technique.desc}</td>
            </tr>
            ${person.power ? `<tr>
                <td>Power</td>
                <td colspan="3">${person.power.text()}</td>
            </tr>` : ``}
            <tr>
                <td>Trait</td>
                <td colspan="3">${person.trait}</td>
            </tr>
            ${person.scar ? `<tr>
                <td>Scar</td>
                <td colspan="3">${person.scar}</td>
            </tr>` : ``}
            ${person.meaning ? `<tr>
                <td>Meaning</td>
                <td colspan="3">${person.meaning}</td>
            </tr>` : ``}
        </table>
        <table>
            <tr>
                <th>Slain</th>
                <td colspan="3">${person.status == "dead" ? "●" : "○"}</td>
                <th>Spared</th>
                <td colspan="3">${person.status == "spared" ? "●" : "○"}</td>
            </tr>
        </table>`;
    }
    else if (person == "nobleClans") {
        let result = "";
        nobleClans.forEach(clan => {
            result += `<table>
            <tr>
                <td>Name</td>
                <td colspan="3">${clan.name}</td>
            </tr>
            <tr>
                <td>Feature</td>
                <td colspan="3">${clan.feature}</td>
            </tr>
        </table>`;
        });

        return result;
    }
    else if (person == "villains") {
        let result = "";
        villainsToDisplay.forEach(villain => {
            result += renderCard(villain);
        });

        return result;
    }
    else if (person == "roninStats") {
        return `<div id="roninStatBalls">
            <div><b>Reputation</b> ${statBalls(ronin.reputation, 6)}</div>
            <div><b>Compassion</b> ${statBalls(ronin.compassion, 6)}</div>
            <div><b>Determination</b> ${statBalls(ronin.determination, 6)}</div>
        </div>
        <div id="roninStatusBalls">
            <div>${ronin.status == "wounded" ? "●" : "○"}<b>Wounded</b></div>
            <div>${ronin.status == "dead" ? "●" : "○"}<b>Dead</b></div>
        </div>`;
    }
}

function statBalls(stat, max) {
    let result = "●".repeat(stat) + "○".repeat(max - stat);

    return result;
}

function renderRoninWeapons() {
    if (!ronin.weapons.length) {
        return `Unarmed`;
    }

    const weapons = ronin.weapons;
    const brokenWeapons = ronin.brokenWeapons;
    const uniqueWeapons = new Set(weapons);
    
    if (uniqueWeapons.has("Katana and Wakizashi") && uniqueWeapons.has("Katana")) {
        uniqueWeapons.delete("Katana");
    }

    const shortUnique = [...uniqueWeapons];

    const weaponMods = [];

    shortUnique.forEach(uniqueWeapon => {
        let positive = weapons.filter(weapon => weapon.includes(uniqueWeapon) || uniqueWeapon.includes(weapon)).length - 1;
        let negative = brokenWeapons.filter(weapon => weapon.includes(uniqueWeapon) || uniqueWeapon.includes(weapon)).length;
        let netMod = positive - negative;
        let modifier = netMod > 0 ? `+${netMod} ` : netMod == 0 ? `` : `Broken `;

        weaponMods.push(`${modifier}${uniqueWeapon}`);
    });

    return weaponMods.join(", ");
}