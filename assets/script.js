$(document).ready(function() {
var proxyurl = "https://cors-anywhere.herokuapp.com/";
var search = "";
start()
$(".side").hide();
$(".news").hide();
$("#submit").on("click", function(){
    titleCenter()
    hStyle()
    wallpaper()
    $(".frontpage").hide()
    $(".videos").show()
    $(".articles").show()
    $("#close").hide()
    $(".news").show()
    search = $("#search").val().trim();
    getNews()
    
    var wikiURL = proxyurl+ "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&exchars=1000&titles=" + search;
    var wikiPicFile = proxyurl+ "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages&redirects=1&titles=" + search + "&pithumbsize=300"
    var wikiFrame = '<iframe class="wframe" src="https://en.wikipedia.org/wiki/' + search + '?printable=yes"></iframe>'
    var wikiPageId
    $.ajax({
url: wikiURL,
method: "GET"
}).then(function(response) {
    console.log("test: ")
    console.log(response)
    $(".wikiDesc").remove();
    $(".fullwiki").empty();
    var wikiProperties = response.query.pages;
    wikiPageId = Object.keys(wikiProperties)[0];
    console.log(wikiPageId)
    console.log(wikiProperties)
    var wikiTitle = wikiProperties[wikiPageId].title
    console.log(wikiTitle)
    var wikiSnip = wikiProperties[wikiPageId].extract 
    var newDiv = $("<div>")
    var newTitle = $("<h3>")
    var newp = $("<p>")
    newTitle.attr("class", "wikiTitle")
    newDiv.attr("class", "wikiDesc clearfix")
    console.log(wikiSnip)
    newTitle.prepend(wikiTitle)
    newDiv.prepend(newTitle)
    newp.attr("class", "description")
    newp.prepend(wikiSnip)
    newDiv.append(newp)
    $(".articles").append(newDiv);
    $(".fullwiki").append(wikiFrame)
    $(".fullwiki").attr("style", "display: none")
    $.ajax({
        url: wikiPicFile,
        method: "GET"
        }).then(function(response){
            console.log(response)
            console.log(response.query.pages)
            var thumb = response.query.pages
            console.log(thumb)
            console.log(wikiPageId)
            console.log(thumb[wikiPageId])
            var thumbSource = thumb[wikiPageId]
            console.log(thumbSource)
            console.log(thumbSource.thumbnail)
            console.log(thumbSource.thumbnail.source)
            var thumbUrl = thumbSource.thumbnail.source
            console.log(thumbUrl)
            var newImg = $("<img>")
            newImg.attr("class", "wikiThumb")
            newImg.attr("src", thumbUrl)
            $(".wikiDesc").prepend(newImg)
        })
})

    var queryURL = "https://www.googleapis.com/youtube/v3/search?maxResults=10&videoEmbeddable=true&part=snippet&order=relevance&q=" + search + "&type=video&videoDefinition=any&key=" //AIzaSyCZ7G2n1C1pRK-4u4OOwsGN5xwqsxXaeTg"; //Re-enable
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

function getNews () {
    var newsURL = "https://newsapi.org/v2/everything?q="+ search + "&from=2019-06-20&sortBy=publishedAt&apiKey=4bf59bd743a540a78774e25ee1328ab9"
    $.ajax({
        url: newsURL,
        method: "GET"
        }).then(function(response) {
            $(".news").empty()
            console.log(response.articles[0])
        for (var i = 0; i < 10; i++) {
            var alink = $("<a>")
            var div = $("<div>")
            var imgT = $("<img>")
            div.attr("class", "newsArt clearfix")
            var title = "<h4>" + response.articles[i].title + "</h4>"
            console.log(title)
            var url = response.articles[i].url
            console.log(url)
            checkNull(url)
            var img = response.articles[i].urlToImage
            console.log(img)
            checkNull(img)
            var newsSource = "<h5>" + response.articles[i].source.name + "</h5>"
            console.log(newsSource)
            checkNull(newsSource)
            var pubDateRaw = moment(response.articles[i].publishedAt).startOf("hour").fromNow()
            var pubDate = "<p class='pubDate'>" + pubDateRaw + "</p>"
            console.log(pubDate)
            checkNull(pubDate)
            var artDesc = "<p class='artDesc'>" + response.articles[i].content + "</p>"
            console.log(artDesc)
            checkNull(artDesc)
            var author = "<p class='author'>" + response.articles[i].author + "</p>"
            console.log(author)
            checkNull(response.articles[i].author)
            imgT.attr("src", img)
            imgT.attr("class", "newsImg")
            alink.attr("href", url)
            div.append(imgT,title,newsSource,author,pubDate,artDesc)
            alink.append(div)
            $(".news").append(alink);
            // $(".artDesc").text(function(index, currentText){
            //     return currentText.substr(0, 1000);
            // })
        }
})
}

function checkNull (value) {
    if (value === "null") {
        value = "";
    }
}

function titleCenter () {
    $(".searchContainer").removeClass("searchContainer1")
    $(".searchContainer").addClass("searchContainer2")
    $(".wallpaper").css("margin-top", "0")
}

function start () {
    $("#close").hide()
    $(".videos").hide()
    $(".articles").hide()
}

function hStyle () {
    $("h1").css("font-size", "5vw");
}

function wallpaper () {
    $("#bgroundVideo").fadeOut();
    $("body").css({"background": "url('./assets/images/wallpaper2.jpg')", "background-attachment": "fixed"});
}

$(".articles").on("click", function(e){
e.preventDefault();
$(".fullwiki").toggle()
$(".articles").toggle()
$("#close").toggle()
})

$('#title').click(function() {
    location.reload();
});

$("#close").on("click", function(e){
e.preventDefault();
$(".fullwiki").toggle()
$(".articles").toggle()
$("#close").toggle()
})
})

$("#obutton").on("click", function() {
    
    $(".side").fadeIn();
})

$(".closebtn").on("click", function(){
    
    $(".side").fadeOut();
})

$('body').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
       $("#submit").click();
       return false;  
     }
   });   