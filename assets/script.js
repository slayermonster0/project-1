$(document).ready(function() {
var proxyurl = "https://cors-anywhere.herokuapp.com/";
var search = "";
$("#close").hide()
$(".videos").hide()
$("#submit").on("click", function(){
    $(".videos").show()
    search = $("#search").val().trim();
    var wikiURL = proxyurl+ "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + search + "&utf8=&format=json"
    var wikiFrame = '<iframe class="wframe" src="https://en.wikipedia.org/wiki/' + search + '?printable=yes"></iframe>'
    $.ajax({
url: wikiURL,
method: "GET"
}).then(function(response) {
    console.log("test: ")
    console.log(response)
    $(".wikiDesc").remove();
    $(".fullwiki").empty();
    var wikiSnip = response.query.search[0].snippet;
    var newDiv = $("<div>")
    newDiv.attr("class", "wikiDesc")
    console.log(wikiSnip)
    newDiv.prepend(wikiSnip)
    $(".articles").append(newDiv);
    $(".fullwiki").append(wikiFrame)
    $(".fullwiki").attr("style", "display: none")
})
    var queryURL = proxyurl+ "https://www.googleapis.com/youtube/v3/search?maxResults=10&videoEmbeddable=true&part=snippet&order=relevance&q=" + search + "&type=video&videoDefinition=any&key=AIzaSyA_kaHaStvMNysgbkURFT6wQ6-2kTqXv_c";
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