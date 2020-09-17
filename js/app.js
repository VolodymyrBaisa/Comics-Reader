//API
const api1Query = "https://project1api1.herokuapp.com";
const api2Query = "https://project1api2.herokuapp.com";
//API1

//Variable
//Selector
const subMenuContainerEL = $(".subMenuContainer");
const bookTitlesEl = $(".book-titles");
const searchEl = $("#search");
const searchIconEl = $("#searchIcon");
const searchSuggestionsEl = $("#searchSuggestions");
//Events
searchEl.keyup(onSearchSuggestions);
searchIconEl.click(onSearchSuggestions);
$(document).mouseup(onHideSearchSuggestList);
//Class
class Categories {
    async getSubCategoriesList() {
        return await $.ajax({
            method: "GET",
            url: `${api2Query}/getCategoriesList`,
        });
    }

    async getSubCategoryComicList(subCatId, page) {
        return await $.ajax({
            method: "GET",
            url: `${api2Query}/getCategories/${subCatId}/${page}`,
        });
    }
}

class Comic {
    async getComicList(page) {
        return await $.ajax({
            method: "GET",
            url: `${api1Query}/comic-list/${page}`,
        });
    }
}

class Search {
    async getSearchSuggestions(val) {
        return await $.ajax({
            method: "GET",
            url: `${api1Query}/search/${val}`,
        });
    }

    async getSearchResults(val) {
        return await $.ajax({
            method: "GET",
            url: `${api1Query}/comic/${val}`,
        });
    }
}
//Function
//Init
const cat = new Categories();
(() => {
    //Populate Left Menu
    const catList = cat.getSubCategoriesList();
    catList
        .then((res) => {
            subCategory(res);
        })
        .catch((err) => {
            console.log(err);
        });
    //Show Default Content
    const com = new Comic();
    const comList = com.getComicList(1);
    comList
        .then((res) => {
            loadComicsOnPage(res);
        })
        .catch((err) => {
            console.log(err);
        });
})();

//Populate SubCategories Left Menu
function subCategory(subCat) {
    for (let item in subCat) {
        const subMenu = $(`
        <div id="subMenuCategory" class="subMenu">
            <span data-index=${item} class="menu-title">${subCat[item]}</span>
        </div>
        `);
        subMenu.click(onClickSubCategory);
        subMenuContainerEL.append(subMenu);
    }
}

//OnCLicFunction SubCategory
function onClickSubCategory(e) {
    const catIndex = $(e.target).find(".menu-title").data("index");
    const getTitlesFromCategory = cat.getSubCategoryComicList(catIndex, 1);
    getTitlesFromCategory
        .then((data) => {
            loadComicsOnPage(data);
        })
        .catch((err) => {
            console.log(err);
        });
}

//Load Comics
function loadComicsOnPage(data) {
    bookTitlesEl.empty();
    for (let item in data) {
        const val = data[item];
        const titleCard = $(`
    <div id="titleCard" class="title-card">
        <div id="titleImage" class="image"></div>
        <div id="title" class="title">${val.title}</div>
        <div class="category">${val.type}</div>
    </div>
        `);
        //Check if image is valid else show no image png
        $.ajax({
            url: val.img,
            type: "HEAD",
            error: () => {
                titleCard
                    .find(".image")
                    .css("background-image", `url(../../img/No_Image.png)`);
            },
            success: () => {
                titleCard
                    .find(".image")
                    .css("background-image", `url(${val.img})`);
            },
        });
        titleCard.click({ url: val.url }, onClickTitleCard);
        bookTitlesEl.append(titleCard);
    }
}
//Click On title Card
function onClickTitleCard(e) {
    let url = e.data.url;
    location.href = `reader.html?comic=${url.substring(
        url.lastIndexOf("/") + 1
    )}`;
}

//Search For Comics
const search = new Search();
function onSearchSuggestions(e) {
    search
        .getSearchSuggestions(searchEl.val())
        .then((data) => {
            showSearchSuggestions(data);
        })
        .catch((err) => {
            console.log(err);
        });

    searchSuggestionsEl.addClass("active");
}

function showSearchSuggestions(data) {
    searchSuggestionsEl.empty();
    if (data !== "Not found") {
        if (data.length > 0) {
            for (let items in data) {
                const item = data[items];
                const element = $(
                    `<div data-index=${item.data} class="search-suggestion-item">${item.title}</div>`
                );
                element.click(onSearchResult);
                searchSuggestionsEl.append(element);
            }
            searchSuggestionsEl.addClass("active");
        }
    } else {
        removeSuggestionPanel();
    }
}

function onHideSearchSuggestList(e) {
    if (
        !searchSuggestionsEl.is(e.target) &&
        searchSuggestionsEl.has(e.target).length === 0
    ) {
        removeSuggestionPanel();
    }
}

function onSearchResult(e) {
    removeSuggestionPanel();

    const val = $(e.target).data("index");
    const res = search.getSearchResults(val);
    res.then((data) => {
        loadComicsOnPage(data);
    }).catch((err) => {
        console.log(err);
    });
}

function removeSuggestionPanel() {
    searchSuggestionsEl.empty();
    searchSuggestionsEl.removeClass("active");
}
