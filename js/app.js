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
(() => {
    //Populate Left Menu
    const cat = new Categories();
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
        //console.log(item, subCat[item]);
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
    console.log(catIndex);
    //TODO: Add Code
}

//Load Comics
function loadComicsOnPage(data) {
    //console.log(data);
    for (let item in data) {
        const val = data[item];
        const titleCard = $(`
    <div id="titleCard" class="title-card">
        <div id="titleImage" class="image"></div>
        <div id="title" class="title">${val.title}</div>
        <div class="category">${val.type}</div>
    </div>
        `);
        console.log(data[item]);
        titleCard.find(".image").css("background-image", `url(${val.img})`);
        bookTitlesEl.append(titleCard);
    }
}
