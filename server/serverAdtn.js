//Require
const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
//API
const serverQuery = "https://readcomicsonline.ru/";
const comicListQuery = "comic-list?";
const categoryQuery = "cat=";
const comicQuery = "comic/";
//Variables
let port = 81;
let apiServer1Host = "127.0.0.1:80";
//Set Server
const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/indexAdtn.html"));
});

//Get Categories List
app.get("/getCategoriesList", async (req, res) => {
    const categories = {
        17: "One Shots TPBs",
        33: "DC Comics",
        34: "Marvel Comics",
        35: "Boom Studios",
        36: "Dynamite",
        37: "Rebellion",
        38: "Dark Horse",
        39: "IDW",
        40: "Archie",
        41: "Graphic India",
        42: "Darby Pop",
        43: "Oni Press",
        44: "Icon Comics",
        45: "United Plankton",
        46: "Udon",
        47: "Image Comics",
        48: "Valiant",
        49: "Vertigo",
        0: "Devils Due",
        51: "Aftershock Comics",
        52: "Antartic Press",
        53: "Action Lab",
        54: "American Mythology",
        55: "Zenescope",
        56: "Top Cow",
        57: "Hermes Press",
        58: "451",
        59: "Black Mask",
        60: "Chapterhouse Comics",
        61: "Red 5",
        62: "Heavy Metal",
        63: "Bongo",
        64: "Top Shelf",
        65: "Bubble",
        66: "Boundless",
        67: "Avatar Press",
        68: "Space Goat Productions",
        69: "BroadSword Comics",
        70: "AAM-Markosia",
        71: "Fantagraphics",
        72: "Aspen",
        73: "American Gothic Press",
        74: "Vault",
        75: "215 Ink",
        76: "Abstract Studio",
        77: "Albatross",
        78: "ARH Comix",
        79: "Legendary Comics",
        80: "Monkeybrain",
        81: "Joe Books",
        82: "MAD",
        83: "Comics Experience",
        84: "Alterna Comics",
        85: "Lion Forge",
        86: "Benitez",
        87: "Storm King",
        88: "Sucker",
        89: "Amryl Entertainment",
        90: "Ahoy Comics",
        91: "Mad Cave",
        92: "Coffin Comics",
        93: "Magnetic Press",
        94: "Ablaze",
        95: "Europe Comics",
        96: "Humanoids",
        97: "TKO",
        98: "Soleil",
        99: "SAF Comics",
        100: " Scholastic",
        101: " Upshot",
        102: " Stranger Comics",
        103: " Inverse",
        104: " Virus",
    };

    res.send(categories);
});

//Get Status List
app.get("/getStatusList", async (req, res) => {
    const status = {
        1: "Ongoing",
        2: "Complete",
    };

    res.send(status);
});

//Get Year List
app.get("/getYearsList", async (req, res) => {
    const years = [];
    const current = new Date().getFullYear();

    for (let year = 1991; year <= current; year++) {
        years.push(year);
    }

    res.send(years);
});

//Get Categories
app.get("/getCategories/:category", async (req, res) => {
    const url =
        serverQuery + comicListQuery + categoryQuery + req.params.category;
    const response = await fetch(url);
    const body = await response.text();

    const $ = cheerio.load(body);
    const comics = [];
    $(".content .media").each((i, element) => {
        const item = $(element);
        const title = item.find(".media-heading strong").text().trim();
        const img = "https:" + item.find(".media-left img").attr("src");
        const type = item.find(".media-body > div:nth-child(6)").text().trim();
        const urlRaw = item.find(".media-heading a").attr("href");
        const protocol = req.protocol;
        const url = `${protocol}://${apiServer1Host}/${comicQuery}`;
        const comic = {
            title,
            img,
            type,
            urlRaw,
            url: url + urlRaw.substr(urlRaw.lastIndexOf("/") + 1),
        };
        comics.push(comic);
    });

    res.send(comics);
});

//Set Server to port
app.listen(port, () => {
    console.log("Server is running ...");
});
