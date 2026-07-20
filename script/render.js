const roninStats = document.getElementById("roninStats");
const displayNobleClans = document.getElementById("displayNobleClans");
const roninSheet =  document.getElementById("roninSheet");
const closeRoninSheet =  document.getElementById("closeRoninSheet");
const combatHeaderWrapper = document.getElementById("combatHeaderWrapper");
const roninPersons = document.getElementById("roninPersons");
const closePersons = document.getElementById("closePersons")

function renderDisplay() {
    checkDisplayArrays();
    roninStats.innerHTML = renderCard("roninStats");
    displayNobleClans.innerHTML = renderCard("nobleClans");
    document.getElementById("displayVillains").innerHTML = renderCard("villains");
    document.getElementById("displayEncounterPersons").innerHTML = renderCard("encounterPersons");
    document.getElementById("displayAllies").innerHTML = renderCard("allies");
    document.getElementById("displayPossibleAllies").innerHTML = renderCard("possibleAllies");
    document.getElementById("displayEnemies").innerHTML = renderCard("enemies");
    renderCard("ronin");
}

function checkInteractions() {
    renderEncounter(windowContext);
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
    document.getElementById("encounterTextWrapper").scrollTop = 0;
    encounterText.scrollTop = 0;
    interactText.scrollTop = 0;
}

function personPreview() {
    const target = getTarget();

    displayPersonsLeft();
    
    if (target == undefined) {
        return;
    }

    enemyBlock = target.firstStrike == "available" ? target.block:enemyBlock;

    if (enemies.includes(target) || villainsList.includes(target)) {
        combatHeader.innerHTML = `${target.status == "lost" ? `<s>` : ``}<b>${target.name}</b> (${target.weapon} • Fight: ${target.fight(target,ronin)}${target.morale == "emboldened" ? " + 1 for failed Intimidation" : ""} • Block: ${enemyBlock})</div>${target.status == "lost" ? `</s>` : ``}`;
    }
    else if (possibleAllies.includes(target) || allies.includes(target)) {
        combatHeader.innerHTML = `<b>${target.name}</b> (${target.occupation})`;
    }
}

function displayPersonsLeft() {
    const personsLeft = encounterPersons.length ? encounterPersons.length - 1 : "";
    const renderer = document.getElementById("personsLeft");

    renderer.innerHTML = personsLeft;

    if (personsLeft > 0) {
        renderer.classList.add("persons");
        renderer.classList.remove("hidden");
    }
    else {
        renderer.classList.remove("persons");
        renderer.classList.add("hidden");
    }
}

function renderCard(person) {
    if (person == "ronin") {
        document.getElementById("displayName").innerHTML = ronin.name;
        document.getElementById("displayGender").innerHTML = ronin.gender;
        document.getElementById("displayAppearance").innerHTML = `${ronin.name} ${ronin.appearance}`;
        document.getElementById("displayFamily").innerHTML = ronin.family;
        document.getElementById("displayNightmare").innerHTML = ronin.nightmare;
        document.getElementById("displayScar").innerHTML = ronin.scar;
        document.getElementById("displayMeaning").innerHTML = `${ronin.meaning.feeling} — ${ronin.meaning.text}`;
        document.getElementById("displayWeapons").innerHTML = renderRoninWeapons();
        document.getElementById("displayItems").innerHTML = ronin.items.length ? ronin.items.join(", ") : `None`;
        document.getElementById("displayStatus").innerHTML = ronin.status == "wounded" ? "Wounded" : ronin.status == "dead" ? "Dead" : "Alive";
        document.getElementById("displayReputation").innerHTML = statBalls(ronin.reputation, 6);
        document.getElementById("displayDetermination").innerHTML = statBalls(ronin.determination, 6);
        document.getElementById("displayCompassion").innerHTML = statBalls(ronin.compassion, 6);
        document.getElementById("displayHonor").innerHTML = honor();
        document.getElementById("displayTechnique").innerHTML = renderCard("technique");
    }
    else if (villainsList.includes(person)) {
        return `<table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <td>${person.name}</td>
                </tr>
                <tr>
                    <th>Appearance</th>
                    <td>${person.gender == "Male" ? "He" : "She"} ${person.appearance}</td>
                </tr>
                <tr>
                    <th>Technique</th>
                    <td>${person.technique.id}<br>${person.technique.desc}</td>
                </tr>
                ${person.power ? `<tr>
                    <th>Power</th>
                    <td>${person.power.text()}</td>
                </tr>` : ``}
                <tr>
                    <th>Trait</th>
                    <td>${person.trait}</td>
                </tr>
                ${person.scar ? `<tr>
                    <th>Scar</th>
                    <td>${person.scar}</td>
                </tr>` : ``}
                ${person.meaning ? `<tr>
                    <th>Meaning</th>
                    <td>${person.meaning}</td>
                </tr>` : ``}
                <tr>
                    <th>Status</th>
                    <td>${person.status == "dead" ? "Slain" : person.status == "lost" ? "Defeated" : "Active"}</td>
                </tr>
            </tbody>
        </table>`;
    }
    else if (person == "nobleClans") {
        let result = "";

        nobleClans.forEach(clan => {
            result += `<p>
                <b>${clan.name}</b>
                ${clan.feature}
            </p>`
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
            <div><b>Determination</b> ${statBalls(ronin.determination, 6)}</div>
            <div><b>Compassion</b> ${statBalls(ronin.compassion, 6)}</div>
        </div>
        <div id="roninStatusBalls">
            <div>${ronin.status == "wounded" ? "●" : "○"}<b>Wounded</b></div>
            <div>${ronin.status == "dead" ? "●" : "○"}<b>Dead</b></div>
        </div>`;
    }
    else if (person == "technique") {
        let result = "";
        
        ronin.technique.forEach(technique => {
            result += `<div class="techniqueCard">
                <b>${technique.id}</b><br>
                ${technique.desc}<br>
                <i>“${technique.scroll}”</i>
            </div>`
        });

        return result;
    }
    else if (person == "encounterPersons") {
        let result = "";

        if (encounterPersons.length == 0) {
            return `No one else is here right now.`
        }
        
        encounterPersons.forEach(target => {
            result += miniCard(target);
        });

        let final = `<table class="miniCards">
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Fight</th>
                    <th>Block</th>
                    <th>Type</th>
                </tr>
                ${result}
            </tbody>
        </table>`;

        return final;
    }
    else if (allies.includes(person) || possibleAllies.includes(person)) {
        return `<table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <td>${person.name}</td>
                </tr>
                <tr>
                    <th>Appearance</th>
                    <td>${person.gender == "Male" ? "He" : "She"} ${person.appearance}</td>
                </tr>
                <tr>
                    <th>Technique</th>
                    <td>${person.technique.id}<br>${person.technique.desc}</td>
                </tr>
                <tr>
                    <th>Occupation</th>
                    <td>${person.occupation}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>${person.status == "dead" ? "Dead" : "Active"}</td>
                </tr>
            </tbody>
        </table>`;
    }
    else if (person == "allies") {
        let result = "";

        allies.forEach(ally => {
            result += renderCard(ally);
        });
        
        return result;
    }
    else if (person == "possibleAllies") {
        let result = "";

        possibleAllies.forEach(ally => {
            result += renderCard(ally);
        });
        
        return result;
    }
    else if (enemies.includes(person)) {
        return `<tr>
            <th>${person.status == "dead" ? `<s>` : ``}${person.name}${person.status == "dead" ? `</s>` : ``}</th>
            <td>${person.status == "dead" ? `<s>` : ``}${person.fight()}${person.status == "dead" ? `</s>` : ``}</td>
            <td>${person.status == "dead" ? `<s>` : ``}${person.block}${person.status == "dead" ? `</s>` : ``}</td>
        </tr>`;
    }
    else if (person == "enemies") {
        let result = ""

        enemies.forEach(enemy => {
            result += renderCard(enemy);
        });

        let final = `<table class="miniCards">
            <tbody>
                <tr>
                    <th>Enemy</th>
                    <th>Fight</th>
                    <th>Block</th>
                </tr>
                ${result}
            </tbody>
        </table>`;

        return final;
    }
}

function statBalls(stat, max) {
    let result = "●".repeat(stat) + "○".repeat(max - stat);

    return `${result}`;
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

function hideStats() {
    roninStats.classList.add("ghost");
}

function hideCombatHeader() {
    document.getElementById("combatHeaderWrapper").classList.add("ghost");
}

function showCombatHeader() {
    document.getElementById("combatHeaderWrapper").classList.remove("ghost");
}

function showStats() {
    roninStats.classList.remove("ghost");
}

roninStats.addEventListener("click", () => {
    if (roninSheet.classList == "hidden") {
        displayRoninSheet();
    }
    else {
        hideRoninSheet();
    }
});

function displayRoninSheet() {
    roninSheet.classList.add("overlayCard");
    roninSheet.classList.remove("hidden");
}

closeRoninSheet.addEventListener("click", hideRoninSheet);

function hideRoninSheet() {
    roninSheet.classList.add("hidden");
    roninSheet.classList.remove("overlayCard");
}

combatHeaderWrapper.addEventListener("click", () => {
    if (roninPersons.classList == "hidden") {
        displayRoninEnemies();
    }
    else {
        hideRoninPersons();
    }
});

function displayRoninEnemies() {
    roninPersons.classList.add("overlayCard");
    roninPersons.classList.remove("hidden");
}

closePersons.addEventListener("click", hideRoninPersons);

function hideRoninPersons() {
    roninPersons.classList.add("hidden");
    roninPersons.classList.remove("overlayCard");
}

function miniCard(person) {
    let type;
    let result;

    if (villainsList.includes(person)) {
        type = "Villain";
    }
    else if (allies.includes(person)) {
        type = "Ally";
    }
    else if (possibleAllies.includes(person)) {
        type = "Possible Ally";
    }
    else {
        type = "Enemy";
    }

    if (type == "Enemy") {
        result = `<tr>
            <th>${person.name}</th>
            <td>${person.fight()}</td>
            <td>${person.block}</td>
            <td>Enemy</td>
        </tr>`;
    }
    else if (type == "Ally") {
        result = `<tr>
            <th>${person.name}</th>
            <td>—</td>
            <td>—</td>
            <td>Ally</td>
        </tr>`;
    }
    else if (type == "Possible Ally") {
        result = `<tr>
            <th>${person.name}</th>
            <td>—</td>
            <td>—</td>
            <td>Possible Ally</td>
        </tr>`;
    }
    else if (type == "Villain") {
        result = `<tr>
            <th>${person.name}</th>
            <td>—</td>
            <td>—</td>
            <td>Villain</td>
        </tr>`;
    }

    return result;
}

function checkDisplayArrays() {
    if (villainsToDisplay.length == 0) {
        document.getElementById("displayVillainsWrapper").classList.add("hidden");
    }
    else {
        document.getElementById("displayVillainsWrapper").classList.remove("hidden");
    }
    
    if (allies.length == 0) {
        document.getElementById("displayAlliesWrapper").classList.add("hidden");
    }
    else {
        document.getElementById("displayAlliesWrapper").classList.remove("hidden");
    }

    if (possibleAllies.length == 0) {
        document.getElementById("displayPossibleAlliesWrapper").classList.add("hidden");
    }
    else {
        document.getElementById("displayPossibleAlliesWrapper").classList.remove("hidden");
    }

    if (enemies.length == 0) {
        document.getElementById("displayEnemiesWrapper").classList.add("hidden");
    }
    else {
        document.getElementById("displayEnemiesWrapper").classList.remove("hidden");
    }
}