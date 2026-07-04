let ronin = {
    name: "",
    appearance: [],
    styles: [],
    determination: "",
    compassion: "",
    reputation: "",
    wound: ""
}

function saveStats() {
    ronin.name = nameSelect.value;
    ronin.appearance.push(appearanceSelect.value);
    ronin.appearance.push(extraAppearance1.value);
    ronin.appearance.push(extraAppearance2.value);
    if (techniqueSelect.value == "Uncommon") {
        ronin.styles.push(techniquePlaceholderforUncommon);
    }
    else {
        ronin.styles.push(techniqueSelect.value);
    }
    ronin.determination = determinationStat.innerHTML;
    ronin.compassion = compassionStat.innerHTML;
    ronin.reputation = reputationStat.innerHTML;
    localStorage.setItem("ronin", JSON.stringify(ronin));
}

function loadStat() {
    ronin = JSON.parse(localStorage.getItem("ronin"));
    document.getElementById("namePlace").innerHTML = ronin.name;
    document.getElementById("appearancePlace").innerHTML = ronin.appearance;
    document.getElementById("techniquePlace").innerHTML = ronin.styles;
    document.getElementById("detPlace").innerHTML = ronin.determination;
    document.getElementById("compPlace").innerHTML = ronin.compassion;
    document.getElementById("repPlace").innerHTML = ronin.reputation;
}