//API
const api1Query = "https://project1api1.herokuapp.com";
const api2Query = "https://project1api2.herokuapp.com";
//API1

//Variable
//Selector
const subMenuContainerEL = $(".subMenuContainer");
const bookTitlesEl = $(".book-titles");
//Events
//Class
class Categories {
    async getSubCategoriesList() {
        return await $.ajax({
            method: "GET",
            url: `${api2Query}/getCategoriesList`,
        });
    }

    async getSubCategoryComicList(subCatId) {
        return await $.ajax({
            method: "GET",
            url: `${api2Query}/getCategories/${subCatId}`,
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
    const getTitlesFromCategory = cat.getSubCategoryComicList(catIndex);
    console.log(catIndex, getTitlesFromCategory);
    loadComicsOnPage(getTitlesFromCategory);
}

//Load Comics
function loadComicsOnPage(data) {
    for (let item in data) {
        const val = data[item];
        const titleCard = $(`
    <div id="titleCard" class="title-card">
        <div id="titleImage" class="image"></div>
        <div id="title" class="title">${val.title}</div>
        <div class="category">${val.type}</div>
    </div>
        `);
        titleCard.find(".image").css("background-image", `url(${val.img})`);
        bookTitlesEl.append(titleCard);
    }
}
