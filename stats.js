let roninStats = {
    name: "",
    appearance: [],
    styles: [],
    determination: "",
    compassion: "",
    reputation: "",
    wound: ""
}

function saveStats() {
    roninStats.name = nameSelect.value;
    roninStats.appearance.push(appearanceSelect.value);
    roninStats.appearance.push(extraAppearance1.value);
    roninStats.appearance.push(extraAppearance2.value);
    if (techniqueSelect.value == "Uncommon") {
        roninStats.styles.push(techniquePlaceholderforUncommon);
    }
    else {
        roninStats.styles.push(techniqueSelect.value);
    }
    roninStats.determination = determinationStat.innerHTML;
    roninStats.compassion = compassionStat.innerHTML;
    roninStats.reputation = reputationStat.innerHTML;
    localStorage.setItem("roninStats", JSON.stringify(roninStats));
}

function loadStat() {
    roninStats = JSON.parse(localStorage.getItem("roninStats"));
    document.getElementById("namePlace").innerHTML = roninStats.name;
    document.getElementById("appearancePlace").innerHTML = roninStats.appearance;
    document.getElementById("techniquePlace").innerHTML = roninStats.styles;
    document.getElementById("detPlace").innerHTML = roninStats.determination;
    document.getElementById("compPlace").innerHTML = roninStats.compassion;
    document.getElementById("repPlace").innerHTML = roninStats.reputation;
}