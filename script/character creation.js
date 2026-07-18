function roninChange(attribute) {
    switch (attribute) {
        case "gender":
            ronin.gender = ronin.gender == "Male" ? "Female" : "Male";
            break;
        case "name":
            ronin.name = nameFunc(ronin.gender);
            break;
        case "appearance":
            ronin.appearance = normalizeText(randoAppearance());
            break;
        case "family":
            ronin.family = generateFamilyBG();
            break;
        case "nightmare":
            ronin.nightmare = nightmare();
            break;
        case "scar":
            ronin.scar = generateScar();
            break;
        case "meaning":
            ronin.meaning = generateScarMeaning();
            break;
        case "technique":
            const firstTechnique = randomTechnique();
            ronin.technique = [firstTechnique];
            ronin.weapons = [firstTechnique.weapon];
            break;
    }
}