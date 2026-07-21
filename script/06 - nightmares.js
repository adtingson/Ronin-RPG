const nightmares = [
    "A child on his back playing in a garden until he turns around and you realize that he has no face.",
    "You carrying someone on your arms while you are struggling in the thick snow.",
    "You lying on a street floor during the rain while a person is walking away.",
    "A person crying desperately inside a dark well.",
    "You in a coffin while buried while a person is laughing outside.",
    "A person leaving in the distance while a Japamala appears in your hand.",
    "You digging up a human skull and when you look, it starts coming apart.",
    "A table covered with parchments and a person lying on them, then a candle going out.",
    "A horrible creature coming out from behind a bush and you trying to run but you can’t.",
    "You surrounded by silhouettes laughing.",
    "A person underwater who is still, but she looks very sad.",
    "A giant octopus devouring an animal while it struggles.",
    "A piece of clothing or handkerchief being blown away.",
    "You on your knees watching the sun setting over the horizon.",
    "A person laughing wildly as blood runs down his face.",
    "Wheat fields dancing in the wind in the moonlight.",
    "A big shadow behind a bed with someone sleeping on it.",
    "The sound of chains coming from a small house on top of a mountain."
];

function nightmare() {
    const index = Math.floor(Math.random() * nightmares.length);
    return nightmares[index];
}