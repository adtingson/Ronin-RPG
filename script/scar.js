const scarsList = [
    "A Cut on the Face",
    "A Cut on the Nose",
    "Cuts in the Chest",
    "Cuts on the Legs",
    "A Long Cut on the Arm",
    "A Long Cut on the Back",
    "A Cut on the Mouth",
    "A Cut on a Blind Eye",
    "A Long Cut on the Chest",
    "A Long Cut on One Leg",
    "A Cut on the Hand",
    "Cuts All Over Your Body",
    "A Burn on the Face",
    "A Burn in a Side of Your Head",
    "A Burn on the Chest",
    "A Burn on a Leg",
    "A Burn All Over an Arm",
    "A Burn All Over Your Body",
    "A Missing Ear",
    "A Missing Nose",
    "A Missing Eye",
    "A Missing Feet",
    () => fingers(),
    "Two Rolls"
];

const scarMeaning = [
    {
        feeling: "Frustration",
        text: "Someone very close has betrayed you."
    },
    {
        feeling: "Honesty",
        text: "You will give your life to fulfill what you promised."
    },
    {
        feeling: "Regret",
        text: "In the past, you have been extremely cruel and inhuman."
    },
    {
        feeling: "Sorrow",
        text: "Someone you love has died."
    },
    {
        feeling: "Duty",
        text: "You have a very clear life mission and you know what to do."
    },
    {
        feeling: "Revenge",
        text: "Whoever did this will pay."
    }
];


function fingers() {
    const roll = Math.floor(Math.random() * 6) + 1;
    return `${roll} missing ${roll == 1 ? `finger` : `fingers`}`;
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