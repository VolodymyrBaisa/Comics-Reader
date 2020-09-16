//Require
const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
//API
const serverQuery = "https://readcomicsonline.ru/";
const searchQuery = "search?query=";
const comicQuery = "comic/";
const comicListQuery = "comic-list/";
const comicPageQuery = "?page=";
//Variables
let port = 80;
//Set Server
const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/indexRCO.html"));
});

//Search Title Page
app.get("/search/:title", async (req, res) => {
    const title = req.params.title;
    const response = await fetch(serverQuery + searchQuery + title);
    const body = await response.json();

    if (body.suggestions.length === 0) {
        return res.send("Not found");
    }

    const results = [];

    for (const suggestion of body.suggestions) {
        const title = suggestion["value"];
        const host = req.get("host");
        const protocol = req.protocol;
        const url = `${protocol}://${host}/${comicQuery}${suggestion["data"]}`;
        const data = suggestion["data"];
        result = {
            title,
            url,
            data,
        };
        results.push(result);
    }

    res.send(results);
});

//Get Comic
app.get("/comic/:title", async (req, res) => {
    const url = serverQuery + comicQuery + req.params.title;
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);

    const title = $(
        ".container > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)"
    )
        .text()
        .trim();
    const image = `https:${$(".img-responsive").attr("src").trim()}`;
    const type = $(".dl-horizontal > dd:nth-child(2)").text().trim();
    const status = $(".dl-horizontal > dd:nth-child(4)").text().trim();

    const authors = [];

    $(".dl-horizontal > dd:nth-child(8)").each((i, element) => {
        const item = $(element);
        const name = item.find("a").text();
        const author = {
            name,
        };
        authors.push(author);
    });

    const dateRelease = $(".dl-horizontal > dd:nth-child(6)").text().trim();

    const description = $(".manga > p:nth-child(2)").text().trim();

    const chapters = [];

    $(".chapters li").each((i, element) => {
        const item = $(element);
        const title = item
            .find("h5:nth-child(1) > a:nth-child(1)")
            .text()
            .trim();
        const urlRaw = item
            .find("h5:nth-child(1) > a:nth-child(1)")
            .attr("href");
        const date = item
            .find("div:nth-child(2) > div:nth-child(1)")
            .text()
            .trim();
        const host = req.get("host");
        const protocol = req.protocol;
        const url = `${protocol}://${host}/${comicQuery}${
            req.params.title
        }/${urlRaw.substr(urlRaw.lastIndexOf("/") + 1)}`;
        const chapter = {
            title,
            urlRaw,
            url,
            date,
        };
        chapters.push(chapter);
    });

    const results = {
        title,
        image,
        type,
        status,
        authors,
        dateRelease,
        description,
        chapters,
    };

    res.send(results);
});

//Get Comic by Chapter
app.get("/comic/:title/:chapter", async (req, res) => {
    const url =
        serverQuery + comicQuery + req.params.title + "/" + req.params.chapter;
    const result = await fetch(url);
    const body = await result.text();
    const $ = cheerio.load(body);
    const pages = [];
    $("#all img").each((i, element) => {
        const item = $(element);

        const image = item.attr("data-src").trim();

        const page = {
            image,
        };

        pages.push(page);
    });

    res.send(pages);
});

//Get Comic List by Page ID
app.get("/comic-list/:page", async (req, res) => {
    const url = serverQuery + comicListQuery + comicPageQuery + req.params.page;
    const result = await fetch(url);
    if (result.status === 500) {
        return res.status(404).send("Chapter Not Found");
    }

    const body = await result.text();
    const $ = cheerio.load(body);
    const comics = [];
    $(".content .media").each((i, element) => {
        const item = $(element);
        const title = item.find(".media-heading strong").text().trim();
        const img = "https:" + item.find(".media-left img").attr("src");
        const type = item.find(".media-body > div:nth-child(6)").text().trim();
        const urlRaw = item.find(".media-heading a").attr("href");
        const host = req.get("host");
        const protocol = req.protocol;
        const url = `${protocol}://${host}/${comicQuery}`;
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
