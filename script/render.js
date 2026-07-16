function renderRoninSheet() {
   document.getElementById("stats").innerHTML = renderCard(ronin);
    /*
    Object.entries(ronin).forEach(
        ([key,data]) => {
            document.getElementById("stats").innerHTML += `<li>${key}: ${data}</li>`;
        }
    );
    */
}

function renderAllies() {
    document.getElementById("allies").innerHTML = JSON.stringify(allies, null, 4);
}

function renderPossibleAllies() {
    document.getElementById("possibleallies").innerHTML = JSON.stringify(possibleAllies, null, 4);
}

function renderEncounterPersons() {
    document.getElementById("encounterpersons").innerHTML = JSON.stringify(encounterPersons, null, 4);
}

function renderLivingEnemies() {
    document.getElementById("enemies").innerHTML = JSON.stringify(enemies, null, 4);
}

function renderEndRouteEnemies() {
    document.getElementById("endrouteenemies").innerHTML = JSON.stringify(endRouteEnemies, null, 4);
}

function renderVillains() {
    document.getElementById("villains").innerHTML = renderCard("villains");
}

function renderNobleClans() {
    document.getElementById("nobleClans").innerHTML = renderCard("nobleClans");
}

function renderDisplay() {
    renderRoninSheet();
    renderAllies();
    renderPossibleAllies();
    renderEncounterPersons();
    renderLivingEnemies();
    renderEndRouteEnemies();
    renderVillains();
    renderNobleClans();
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

    if ((villainsList.includes(target) || enemies.includes(target))) {
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
                <td colspan="3">${ronin.technique.map(technique => technique.desc).join("\n")}</td>
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
                <td>Reputation</td>
                <td colspan="3">${statBalls(ronin.reputation, 6)}</td>
            </tr>
            <tr>
                <td>Compassion</td>
                <td colspan="3">${statBalls(ronin.compassion, 6)}</td>
            </tr>
            <tr>
                <td>Determination</td>
                <td colspan="3">${statBalls(ronin.determination, 6)}</td>
            </tr>
            <tr>
                <td>Wounded</td>
                <td colspan="3">${ronin.status == "wounded" ? "●" : "○"}</td>
            </tr>
            <tr>
                <td>Dead</td>
                <td colspan="3">${ronin.status == "dead" ? "●" : "○"}</td>
            </tr>
        </table>`;
    }
    else if (villainsList.includes(person)) {

    }
    else if (enemies.includes(person)) {

    }
    else if (possibleAllies.includes(person) || allies.includes(person)) {

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
            result += `<table>
            <tr>
                <td>Name</td>
                <td colspan="3">${villain.name}</td>
            </tr>
            <tr>
                <td>Appearance</td>
                <td colspan="3">${villain.gender == "Male" ? "He" : "She"} ${villain.appearance}</td>
            </tr>
            <tr>
                <td>Technique</td>
                <td colspan="3">${villain.technique.desc}</td>
            </tr>
            ${villain.power ? `<tr>
                <td>Power</td>
                <td colspan="3">${villain.power.text()}</td>
            </tr>` : ``}
            <tr>
                <td>Trait</td>
                <td colspan="3">${villain.trait}</td>
            </tr>
            ${villain.scar ? `<tr>
                <td>Scar</td>
                <td colspan="3">${villain.scar}</td>
            </tr>` : ``}
            ${villain.meaning ? `<tr>
                <td>Meaning</td>
                <td colspan="3">${villain.meaning}</td>
            </tr>` : ``}
        </table>`;
        });

        return result;
    }
}

function statBalls(stat, max) {
    let result = "●".repeat(stat) + "○".repeat(max - stat);

    return result;
}