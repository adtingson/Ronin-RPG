const appearanceList = ["Athletic", "Athletic *", "Fat", "Fat *", "Thin", "Thin *", "Tall", "Tall *", "Small", "Small *", "Tattoo", "Covered in Tattoo", "Long Hair", "Big Eyebrow", "Red Hair", "Weird Hair", "Grey Hair", "Bald", "Sex Appeal", "Colored Eyes", "Uses a Mask", "Dead Face", "White Hair", "Skin Spots", "Androgen", "Albino", "Gigantism", "Blind", "Deep Voice", "Deformed Face", "Blueish Hair", "Red Eyes", "Pale", "Choose Two", "Choose Two", "Choose Two"];

function randoAppearance() {
    const appearance = appearanceList[Math.floor(Math.random() * appearanceList.length)];

    if (appearance == "Choose Two") {
        const app1 = appearanceList[Math.floor(Math.random() * (appearanceList.length - 3))];
        let app2;

        do {
            app2 = appearanceList[Math.floor(Math.random() * (appearanceList.length - 3))];
        } while (app1 == app2)
        
        return `${app1}, ${app2}`;
    }
    else if (appearance.includes("*")) {
        const filteredList1 = appearanceList.filter(word => !word.includes(appearance));
        const filteredList = filteredList1.filter(word => !word.includes("Choose Two"));
        const app2 = filteredList[Math.floor(Math.random() * filteredList.length)];

        if (app2.includes("*")) {
            const filterApp2 = filteredList.filter(word => !word.includes(app2));
            const app3 = filterApp2[Math.floor(Math.random() * filterApp2.length)];
            return `${appearance}, ${app2}, ${app3}`;
        }

        return `${appearance}, ${app2}`;
    }
    
    return appearance;
}

function normalizeText(text) {
    return text.replaceAll(" *", "");
}
