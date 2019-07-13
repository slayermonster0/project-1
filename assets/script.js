$(document).ready(function() {
var proxyurl = "https://cors-anywhere.herokuapp.com/";
var search = "";
start()
$("#submit").on("click", function(){
    titleCenter()
    hStyle()
    $(".frontpage").hide()
    $(".videos").show()
    $(".articles").show()
    $("#close").hide()
    search = $("#search").val().trim();
    var wikiURL = proxyurl+ "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&exchars=1000&titles=" + search;
    var wikiFrame = '<iframe class="wframe" src="https://en.wikipedia.org/wiki/' + search + '?printable=yes"></iframe>'
    $.ajax({
url: wikiURL,
method: "GET"
}).then(function(response) {
    console.log("test: ")
    console.log(response)
    $(".wikiDesc").remove();
    $(".fullwiki").empty();
    var wikiProperties = response.query.pages;
    var wikiPageId = Object.keys(wikiProperties)[0];
    console.log(wikiPageId)
    console.log(wikiProperties)
    var wikiTitle = wikiProperties[wikiPageId].title
    console.log(wikiTitle)
    var wikiSnip = wikiProperties[wikiPageId].extract
    var newDiv = $("<div>")
    var newTitle = $("<h3>")
    newTitle.attr("class", "wikiTitle")
    newDiv.attr("class", "wikiDesc")
    console.log(wikiSnip)
    newTitle.prepend(wikiTitle)
    newDiv.prepend(newTitle)
    newDiv.append(wikiSnip)
    $(".articles").append(newDiv);
    $(".fullwiki").append(wikiFrame)
    $(".fullwiki").attr("style", "display: none")
})
    var queryURL = "https://www.googleapis.com/youtube/v3/search?maxResults=10&videoEmbeddable=true&part=snippet&order=relevance&q=" + search + "&type=video&videoDefinition=any&key=AIzaSyA_kaHaStvMNysgbkURFT6wQ6-2kTqXv_c";
    console.log(queryURL)
$.ajax({
url: queryURL,
method: "GET"
}).then(function(response) {
    $(".videos").empty()
    console.log("Search: " + search)
    console.log("RESPONSE:")
    console.log(response)
    for (var i = 0; i < response.items.length; i++) {
    var vidId = response.items[i].id.videoId;
    console.log("vidId: " + vidId)
    
    $(".videos").append(
        '<iframe class="searchVid" width="360" height="215" src="https://www.youtube.com/embed/' + vidId + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    )
}
})

})

function titleCenter () {
    $(".searchContainer").css("margin-top", "-15%");
}

function start () {
    $("#close").hide()
    $(".videos").hide()
    $(".articles").hide()
}

function hStyle () {
    $("h1").css("font-size", "5vw");
}

$(".articles").on("click", function(e){
e.preventDefault();
$(".fullwiki").toggle()
$(".articles").toggle()
$("#close").toggle()
})

$("#close").on("click", function(e){
e.preventDefault();
$(".fullwiki").toggle()
$(".articles").toggle()
$("#close").toggle()
})
})

$('body').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
       $("#submit").click();
       return false;  
     }
   });   