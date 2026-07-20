const appearanceList = [
    "is athletic",
    "is athletic *",
    "is fat",
    "is fat *",
    "is thin",
    "is thin *",
    "is tall",
    "is tall *",
    "is small",
    "is small *",
    "has a tattoo",
    "is covered in tattoo",
    "has long hair",
    "has big eyebrows",
    "has red hair",
    "has weird hair",
    "has grey hair",
    "is bald",
    "has an alluring presence",
    "has colored eyes",
    "uses a mask",
    "has a dead face",
    "has white hair",
    "has skin spots",
    "is androgynous",
    "is an albino",
    "has gigantism",
    "is blind",
    "has a deep voice",
    "has a deformed face",
    "has blueish hair",
    "has red eyes",
    "is pale",
    "Choose Two",
    "Choose Two",
    "Choose Two"
];

function randoAppearance() {
    const appearance = appearanceList[Math.floor(Math.random() * appearanceList.length)];

    if (appearance == "Choose Two") {
        const app1 = appearanceList[Math.floor(Math.random() * (appearanceList.length - 3))];
        let app2;

        do {
            app2 = appearanceList[Math.floor(Math.random() * (appearanceList.length - 3))];
        } while (app1 == app2)
        
        return `${app1}, and ${app2}`;
    }
    else if (appearance.includes("*")) {
        const filteredList = appearanceList.filter(word => !word.includes(normalizeText(appearance)) || !word.includes("Choose Two"));
        const app2 = filteredList[Math.floor(Math.random() * filteredList.length)];

        if (app2.includes("*")) {
            const filterApp2 = filteredList.filter(word => !word.includes(normalizeText(app2)));
            const app3 = filterApp2[Math.floor(Math.random() * filterApp2.length)];
            return `${appearance}, ${app2}, and ${app3}`;
        }

        return `${appearance}, and ${app2}`;
    }
    
    return appearance;
}

function normalizeText(text) {
    return text.replaceAll(" *", "");
}
