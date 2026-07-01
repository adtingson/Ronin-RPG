const scarsList = ["Cut on the Face", "Cut on the Nose", "Cuts in the Chest", "Cuts on the legs", "Long cut on the arm", "Long cut on the back", "Cut on the mouth", "Cut on a blind eye", "Long cut on the Chest", "Long cut on one leg", "Cut on the hand", "Cuts all over your body", "Burn on the face", "Burn in a side of your head", "Burn on the chest", "Burn on a leg", "Burn all over an arm", "Burn all over your body", "Missing ear", "Missing nose", "Missing eye", "Missing feet", `${fingers()} missing fingers`, "Two Rolls"];
const scarMeaning = [
    "<label>Frustration:</label> Someone very close has betrayed you.",
    "<label>Honesty:</label> You will give your life to fulfill what you promised.",
    "<label>Regret:</label> In the past, you have been extremely cruel and inhuman.",
    "<label>Sorrow:</label> Someone you love has died.",
    "<label>Duty:</label> You have a very clear life mission and you know what to do.",
    "<label>Revenge:</label> Whoever did this will pay."];


function fingers() {
    const roll = Math.floor(Math.random() * 6) + 1;
    return roll;
}

function generateScar() {
    const scar = scarsList[Math.floor(Math.random() * scarsList.length)];
    
    if (scar == "Two Rolls") {
        let scar1 = scarsList[Math.floor(Math.random() * (scarsList.length-1))];
        let scar2;
        do {
            scar2 = scarsList[Math.floor(Math.random() * (scarsList.length-1))];
        } while(scar1 == scar2)
        
        return `${scar1} and ${scar2}`;
    } else {
        return scar;
    }
}

document.getElementById("scars").innerHTML = generateScar();

document.getElementById("scarMeaning").innerHTML = scarMeaning[Math.floor(Math.random() * scarMeaning.length)];