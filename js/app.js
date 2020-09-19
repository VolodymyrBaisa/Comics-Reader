//API
const api1Query = "https://project1api1.herokuapp.com";
const api2Query = "https://project1api2.herokuapp.com";
//Variable
const state = {
    startPage: 1,
    size: 14,
    endPage: 1,
};
const source = {
    list: 0,
    category: 0,
    categoryId: 17,
    comicList: function () {
        this.list = 1;
        this.category = 0;
    },
    comicCategory: function (id) {
        this.list = 0;
        this.category = 1;
        this.categoryId = id;
    },
};
//Selector
const comicListEl = $("#menuComicList");
const subMenuContainerEL = $(".subMenuContainer");
const bookTitlesEl = $(".book-titles");
const searchEl = $("#search");
const searchIconEl = $("#searchIcon");
const searchSuggestionsEl = $("#searchSuggestions");
const paginationContainerEl = $(".pagination-container");
//Events
comicListEl.click(onClickComicList);
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
const com = new Comic();
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
    const comList = com.getComicList(1);
    comList
        .then((res) => {
            loadComicsOnPage(res);
            clearPaginationButtons();
            showPaginationOnPage(res);
            showPaginationActiveButton(1);
            source.comicList();
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
            clearPaginationButtons();
            showPaginationOnPage(data);
            showPaginationActiveButton(1);
            source.comicCategory(catIndex);
        })
        .catch((err) => {
            console.log(err);
        });
}
//Click On Comic List
function onClickComicList() {
    const comList = com.getComicList(1);
    comList
        .then((res) => {
            loadComicsOnPage(res);
            clearPaginationButtons();
            showPaginationOnPage(res);
            showPaginationActiveButton(1);
            source.comicList();
        })
        .catch((err) => {
            console.log(err);
        });
}
//Load Comics
function loadComicsOnPage(data) {
    bookTitlesEl.empty();
    data = data.length > 1 ? data[0] : data;
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
        setImageIfValid(titleCard, val.img);
        titleCard.click({ url: val.url }, onClickTitleCard);
        bookTitlesEl.append(titleCard);
    }
}
//Check If Image Is Valid
function setImageIfValid(card, url) {
    $.ajax({
        url: url,
        type: "HEAD",
        error: () => {
            card.find(".image").css(
                "background-image",
                `url(../../img/No_Image.png)`
            );
        },
        success: () => {
            card.find(".image").css("background-image", `url(${url})`);
        },
    });
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
    const val = searchEl.val();
    if (val) {
        search
            .getSearchSuggestions(val)
            .then((data) => {
                showSearchSuggestions(data);
            })
            .catch((err) => {
                console.log(err);
            });
        searchSuggestionsEl.addClass("active");
    }
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
//Page Buttons
function showPaginationOnPage(data) {
    data = data.length > 1 ? data[1] : data;
    if (data) {
        state.endPage = data.totalPages;
        let maxLeft = state.startPage - Math.floor(state.size / 2);
        let maxRight = state.startPage + Math.floor(state.size / 2);
        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = state.size;
        }
        if (maxRight > state.endPage) {
            maxLeft = state.endPage - (state.size - 1);
            if (maxLeft < 1) {
                maxLeft = 1;
            }
            maxRight = state.endPage;
        }
        for (let page = maxLeft; page <= maxRight; page++) {
            paginationContainerEl.append(showButton(page, page, data));
        }
        if (state.startPage != 1) {
            paginationContainerEl.prepend(showButton(1, "&#171;", data));
        }
        if (state.startPage != state.endPage) {
            paginationContainerEl.append(
                showButton(state.endPage, "&#187;", data)
            );
        }
    }
}
function showButton(index, page, data) {
    const button = $(
        `<div data-index="${index}" class="page-button">${page}</div>`
    );
    button.click((e) => {
        const id = $(e.target).data("index");
        state.startPage = id;
        clearPaginationButtons();
        showPaginationOnPage(data);
        if (source.list) {
            const comList = com.getComicList(id);
            comList
                .then((res) => {
                    loadComicsOnPage(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (source.category) {
            const catIndex = source.categoryId;
            const getTitlesFromCategory = cat.getSubCategoryComicList(
                catIndex,
                id
            );
            getTitlesFromCategory
                .then((data) => {
                    loadComicsOnPage(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        showPaginationActiveButton(id);
    });
    return button;
}
function showPaginationActiveButton(id) {
    paginationContainerEl.find(`[data-index=${id}]`).addClass("active");
}
function clearPaginationButtons() {
    paginationContainerEl.empty();
}