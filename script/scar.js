const scarsList = [
    "Cut on the Face",
    "Cut on the Nose",
    "Cuts in the Chest",
    "Cuts on the legs",
    "Long cut on the arm",
    "Long cut on the back",
    "Cut on the mouth",
    "Cut on a blind eye",
    "Long cut on the Chest",
    "Long cut on one leg",
    "Cut on the hand",
    "Cuts all over your body",
    "Burn on the face",
    "Burn in a side of your head",
    "Burn on the chest",
    "Burn on a leg",
    "Burn all over an arm",
    "Burn all over your body",
    "Missing ear",
    "Missing nose",
    "Missing eye",
    "Missing feet",
    () => `${fingers()} missing fingers`,
    "Two Rolls"
];

const scarMeaning = [
    "Frustration — Someone very close has betrayed you.",
    "Honesty — You will give your life to fulfill what you promised.",
    "Regret — In the past, you have been extremely cruel and inhuman.",
    "Sorrow — Someone you love has died.",
    "Duty — You have a very clear life mission and you know what to do.",
    "Revenge — Whoever did this will pay."
];


function fingers() {
    const roll = Math.floor(Math.random() * 6) + 1;
    return roll;
}

function generateScar() {
    let scar = scarsList[Math.floor(Math.random() * scarsList.length)];

    scar = typeof scar === "function" ? scar() : scar;
    
    if (scar == "Two Rolls") {
        let roll1 = Math.floor(Math.random() * (scarsList.length-1));
        let roll2;

        do {
            roll2 = Math.floor(Math.random() * (scarsList.length-1));
        } while(roll1 == roll2)

        let scar1 = scarsList[roll1];
        let scar2 = scarsList[roll2];

        scar1 = typeof scar1 === "function" ? scar1() : scar1;
        scar2 = typeof scar2 === "function" ? scar2() : scar2;
        
        return `${scar1} and ${scar2}`;
    } else {
        return scar;
    }
}

function generateScarMeaning() {
    return scarMeaning[Math.floor(Math.random() * scarMeaning.length)];
}