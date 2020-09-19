//API
const api1Query = "https://project1api1.herokuapp.com";
const api2Query = "https://project1api2.herokuapp.com";
//api key:
//sample query:

//Variable

var lastIndexOf = window.location.href.lastIndexOf("/");
var rightPart = window.location.href.substr(lastIndexOf);
var title = rightPart.split("=")[1];

// read url 
(()=> {
    if(title){
var fullQueryURL = api1Query + "/comic/" + title;
console.log(fullQueryURL);
    $.ajax({
        url: fullQueryURL,
        method: "GET",
        success: function(result){
            console.log(result);
        }
    });
    
};
})();
// get comic id from url
// call comic API to get the relevant comic
// create HTML elements to show it on the page (0)