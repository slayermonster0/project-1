$(document).ready(function() {
var proxyurl = "https://cors-anywhere.herokuapp.com/";
var search = "";
var savedSearches = JSON.parse(localStorage.getItem("SavedSearches"))
if (!Array.isArray(savedSearches)){
    savedSearches = ['Morgan Freeman', 'Leonardo DiCaprio', 'Brad Pitt', 'Will Smith', 'Denzel Washington',
    'Samuel L. Jackson', 'Tom Cruise', 'Hugh Jackman', 'Michael Caine', 'Dwayne Johnson', 'Kevin Durant', 'Anthony Davis', 'Trevor Ariza', 'Stephen Curry'
  ];
}
console.log(savedSearches)
start()
getHeadlines()
$(".side").hide();
$(".news").hide();
$("#submit").on("click", function(){
    search = $("#search").val().trim();
    if (search === "") {
        document.getElementById("search").setAttribute("placeholder", "Can't be blank!")
        setTimeout(function(){
            document.getElementById("search").setAttribute("placeholder", "Type a keyword or name here...")}, 1000)
        return;
    }
    titleCenter()
    wallpaper()
    $(".frontpage").hide()
    $(".videos").show()
    $(".articles").show()
    $("#close").hide()
    $(".news").show()
    
    getNews()
    localStorage.getItem("SavedSearches", JSON.stringify(savedSearches))
    if (savedSearches.includes(search) === true) {
    }   else {
        savedSearches.push(search)
    }
    localStorage.setItem("SavedSearches", JSON.stringify(savedSearches))
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

    var queryURL = "https://www.googleapis.com/youtube/v3/search?maxResults=10&videoEmbeddable=true&part=snippet&order=relevance&q=" + search + "&type=video&videoDefinition=any&key=AIzaSyCZ7G2n1C1pRK-4u4OOwsGN5xwqsxXaeTg"; //Re-enable
    console.log(queryURL)
$.ajax({
url: queryURL,
method: "GET"
}).then(function(response) {
    $(".videos").empty()
    console.log("Search: " + search)
    console.log("RESPONSE:")
    console.log(response)
    var div = $("<div>")
    div.attr("class", "videoGallery")
    for (var i = 0; i < response.items.length; i++) {
    var alink = $("<a>")
    var img = $("<img>")
    img.attr("class", "vidThumbnail")
    var vidId = response.items[i].id.videoId;
    alink.attr("data-fancybox", "YTvideos")
    alink.attr("data-width", "640")
    alink.attr("data-height", "360")
    alink.attr("href", "https://www.youtube.com/watch?v="+vidId)
    var vidThumb = response.items[i].snippet.thumbnails.high.url
    img.attr("src", vidThumb)
    console.log("vidId: " + vidId)
    console.log("vidThumb :" + vidThumb)
    alink.append(img)
    div.append(alink)
}
    $(".videos").append(div)
})

$("#next").on("click", function() {
    $(".videos").animate( { scrollLeft: '+=100' }, 1000);
})
$("#prev").on("click", function() {
    $(".videos").animate( { scrollLeft: '-=100' }, 1000);
})

})

function getNews () {
    var newsURL = "https://newsapi.org/v2/everything?q="+ search + "&from=2019-06-20&sortBy=publishedAt&apiKey=S4bf59bd743a540a78774e25ee1328ab9"
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
            var newsSources = response.articles[i].source.name
            console.log(newsSource)
            checkNull(newsSource)
            var newsSource = "<h5>" + newsSources + "</h5>"
            var pubDateRaw = moment(response.articles[i].publishedAt).startOf("hour").fromNow()
            var pubDate = "<p class='pubDate'>" + pubDateRaw + "</p>"
            console.log(pubDate)
            checkNull(pubDate)
            var artDescs = response.articles[i].content
            console.log(artDesc)
            checkNull(artDescs)
            var artDesc = "<p class='artDesc'>" + artDescs + "</p>"
            var authors = response.articles[i].author
            console.log(authors)
            checkNull(authors)
            var author = "<p class='author'>" + authors + "</p>"
            imgT.attr("src", img)
            imgT.attr("class", "newsImg")
            alink.attr("href", url)
            alink.attr("target", "_blank")
            div.append(imgT,title,newsSource,author,pubDate,artDesc)
            alink.append(div)
            $(".news").append(alink);
            // $(".artDesc").text(function(index, currentText){
            //     return currentText.substr(0, 1000);
            // })
        }
})
}

function getHeadlines () {
    var headlineURL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=4bf59bd743a540a78774e25ee1328ab9";
    var title = [];
    $.ajax({
        url: headlineURL,
        method: "GET"
    }).then(function(response) {
        $(".slidetext").empty()
        console.log("Headlines: ")
        console.log(response.articles[0])
    for (var i = 0; i < 9; i++) {
        var headlineTitle = response.articles[i].title
        checkNull(headlineTitle)
        var headline = ' "' + headlineTitle + '" '
        title.push(headline)
        console.log(title)
    }
    var slidingTxt = title.toString();
        var slider = $("<div>")
        slider.attr("id", "slidetxt")
        slider.append(slidingTxt)
        $(".topslider").append(slider)
    })
}

//TYPEAHEAD.JS

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
  
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };
  
  $('#searchbar .search').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'savedSearches',
    source: substringMatcher(savedSearches)
  });

//TYPEAHEAD.JS

function checkNull (value) {
    if (value === null) {
        value = ""
    }
}

function titleCenter () {
    $(".searchContainer").removeClass("searchContainer1")
    $(".searchContainer").addClass("searchContainer2")
    $(".wallpaper").css("margin-top", "0")
    $("h1").animate({fontSize: "5vw"},200);
}

function start () {
    $("#close").hide()
    $(".videos").hide()
    $(".articles").hide()
}

function reset () {
    $(".articles").empty()
    $(".fullwiki").empty()
    $("#close").hide()
    $(".articles").hide()
    $(".news").empty()
    $(".news").hide()
    $(".videos").empty()
    $(".videos").hide()
    $("#search").val("")
    $("h1").animate({fontSize: "8vw"},200);
    $(".wallpaper").css("margin-top", "2%")
    $(".searchContainer").removeClass("searchContainer2")
    $(".searchContainer").addClass("searchContainer1")
    $("#bgroundVideo").fadeIn();
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
    reset();
    console.log("Reset!")
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