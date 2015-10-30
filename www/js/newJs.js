/* This establishes a function errorAccumulator.add(err) that we can use to
    add error messages that are visible to the user.  I don't really use it 
    enough; oughta add more error message possibilities. */
    
var errorAccumulator = {
    add : function(err) {
        $("#errors").append("<p>ERROR: " + err + "</p>"); 
        $("#errors").show();
    }
}

/* So what we're doing from hereon in is constructing Javascript source using PHP. */
var config = {"L1":{"name":"Gitksan","underlying":["norm","UBC_FM_2014"],"compare":["norm","UBC_FM_2014","approx"]},"L2":{"name":"English","underlying":[],"compare":[]},"department":"University of British Columbia Department of Linguistics","PI":["Henry Davis"],"developers":["Patrick Littell"],"lexicographers":["Aidan Pine","Avery Ozburn","Elise McClay","Katie Bicevskis","Kevin Dickie","Kyra BW","Michael David Schwan","Samuel Akinbo","T. J. Heins","Zoe Wang"]};

var templates = {"long":{"root":"<div class=\"entryWord\">${display_form}<\/div>\n<div class=\"entryCategory\">${categories}<\/div>\n<div class=\"entryDefinition\">${definition}<\/div>\n<div class=\"entryNotes\">${public_notes}<\/div>\n\n\n\n","definition":"<div class=\"entrySubDefinition\">${index}. ${text}<\/div>\n\n","public_notes":"Notes: ${text}\n\n"},"short":{"root":"<a href=\"?e=${word}&s=${source_id}\" class=\"matchDiv\">\n    <span class=\"matchLeftDiv\">${display_form}<\/span>  \n    <span class=\"matchRightDiv\">${definition}<\/span>  \n    <span style=\"display:block;clear:both;\"> <\/span>\n<\/a>\n\n"}};


// What follows is the stuff that executes when the page is loaded
$(document).ready(function() {  

orthographyConverter.addTextTransform("UBC_FM_2014",[["",""],["'","'"],["'l","'l"],["'m","'m"],["'n","'n"],["'w","'w"],["'y","'y"],["a","a"],["aa","aa"],["b","b"],["d","d"],["e","e"],["ee","ee"],["g","g"],["g","g"],["g_","g\u0331"],["gw","gw"],["gy","gy"],["h","h"],["hl","hl"],["i","i"],["ii","ii"],["k","k"],["k_","k\u0331"],["k'","k'"],["k_'","k\u0331'"],["kw","kw"],["kw'","kw'"],["ky","ky"],["ky'","ky'"],["l","l"],["m","m"],["n","n"],["n","n"],["o","o"],["oo","oo"],["p","p"],["p'","p'"],["t","t"],["t'","t'"],["ts","ts"],["ts'","ts'"],["u","u"],["uu","uu"],["w","w"],["x","x"],["x_","x\u0331"],["xw","xw"],["y","y"],[".",""]]);
orthographyConverter.addTextTransform("approx",[["",""],["'",""],["_",""],["aa","a"],["b","p"],["d","t"],["e","y"],["ee","y"],["g","k"],["g_","k"],["g\u0331","k"],["gy","k"],["hl","h"],["i","y"],["ii","y"],["k","k"],["k_","k"],["k\u0331'","k"],["ky","k"],["o","w"],["oo","w"],["p","p"],["t","t"],["u","w"],["uu","w"],["w","w"],["x","h"],["x_","h"],["x\u0331","h"],["ch","ts"],["q","k"]]);
orthographyConverter.addTextTransform("git_2013",[["",""],["'","'"],["l'","'l"],["m'","'m"],["n'","'n"],["w'","'w"],["y'","'y"],["a","a"],["aa","aa"],["b","b"],["d","d"],["e","e"],["ee","ee"],["g","g"],["g","g"],["g_","g\u0331"],["gw","gw"],["gy","gy"],["h","h"],["hl","hl"],["i","i"],["ii","ii"],["k","k"],["k_","k\u0331"],["k'","k'"],["k_'","k\u0331'"],["kw","kw"],["kw'","kw'"],["ky","ky"],["ky'","ky'"],["l","l"],["m","m"],["n","n"],["n","n"],["o","o"],["oo","oo"],["p","p"],["p'","p'"],["t","t"],["t'","t'"],["ts","ts"],["ts'","ts'"],["u","u"],["uu","uu"],["w","w"],["x","x"],["x_","x\u0331"],["xw","xw"],["y","y"]]);
orthographyConverter.addTextTransform("norm",[["",""],["\u2019","'"],["\u2018","'"],["\u02ca","'"],["`","'"],["\u0312","'"],["\u0313","'"],["\u0314","'"],["\u0315","'"],["\u031b","'"],["\u02bb","'"],["\u02bc","'"],["\u02bd","'"],["\u02b9","'"],["\u0331","_"],["\u0332","_"],["\u0320","_"],["\u02cd","_"]]);
    /* Then we go through the dictionary and compute the other orthographic forms, both the ones the user will
    see and the ones we use internally */
    orthographyConverter.orthographizeEntries(gitDict);

    /* We add to the two search boxes on the page a function that does a search when the user types */
    $("#gitSearch").on("keyup", null, function(e) {
        dataTyped(this, gitSearch);
    });
    
    $("#engSearch").on("keyup", null, function(e) {
        dataTyped(this, engSearch);
    });
    
    /* When we're constructing URLs that point to each entry's page, there's a minor complication that some of the
        characters we use cause problems when used in URLs, and are therefore replaced by character codes like %27.  This
        undoes that.  (At some point we should replace this with an appropriate function that solves this problem generally, 
        rather than looking for specific ones, but I was in a hurry.) */
    function aposReplace(str) {
        return str.replace(/%27/g, "'").replace(/%20/g, " ");
    }
    
    /* Look in the URL and find the GET parameters.  We'll be using those to decide what
       parts of this page to show the user.  Each of the apparent pages of this site is a
       <div> within one big page (so that the site can be served from a single file), and 
       we turn those on and off in order to simulate different pages, based on the GET
       parameters we receive. */
    var startIndex = 0;
    var urlVars = window.location.search.substring(1).split('&');
    var getVars = {};
    $.each(urlVars, function(i, keyValuePair) {
        var elements = keyValuePair.split('=');
        if (elements.length > 2) { return; }
        getVars[elements[0]] = elements[1];
    });
    
//    if ("p" in getVars && getVars["p"] == 'random') {
//        // ?p=random gives you the random entries page
//        $("#randomEntries").html(getRandom10());
//        $("#smallTitle").show();
//        $("#randomDiv").show();
//    } else if ("p" in getVars && getVars["p"] == 'browse') {
//        // ?p=browse&i=X gives you the browse entries page starting from entry number X
//        if ("i" in getVars) {
//            startIndex = parseInt(getVars["i"]);
//        }
//        var entries = getAllEntries();
//        entries.sort(function(a,b) {
//            var aForm = a["display_form"][0];
//            var bForm = b["display_form"][0];
//            return aForm.localeCompare(bForm);
//        });
//        var tenEntries = get10(entries, startIndex);
//        if (startIndex != 0) {
//            var prevIndex = Math.max(startIndex - 10, 0);
//            $(".browsePrev").attr("href", "?p=browse&i=" + prevIndex).show();
//        }
//        if (startIndex + 10 <= entries.length) {
//            var nextIndex = startIndex+10;
//            $(".browseNext").attr("href", "?p=browse&i=" + nextIndex).show();
//        }
//        $("#browseEntries").html(tenEntries.join(""));
//        $("#browseDiv h3").html("Entries " + (startIndex+1)+ "-" + (startIndex+1+tenEntries.length) + ":");
//        $("#smallTitle").show();
//        $("#browseDiv").show();  
//    } else if ("p" in getVars && getVars["p"] != 'home') {
//        // ?p=<anything else> gives you that page, and we don't do anything else special
//        $("#smallTitle").show();
//        $(".page"+getVars["p"]).show();
//    } else if ("e" in getVars && "s" in getVars) {
//        // if there's an "e" and an "s", then it's an entry page.  e is the word, s is the source resource
//        var word = aposReplace(getVars["e"]);
//        var sourceID = aposReplace(getVars["s"]);
//        findEntry(word, sourceID);
//        $("#smallTitle").show();
//        $("#entryDiv").show();
//    } else {
//        $(".pagehome").show();
//    }
    
    /* A utility function used by the above when finding a word.  It finds the entry,
        injects it into a template, and inserts that template into the page. */
    function findEntry(word, dataResourceID) {
        if (!(dataResourceID in gitDict)) {
            $("#entryDivInner").html("ERROR: Cannot find data resource " + dataResourceID);
            return;
        }
        var entries = gitDict[dataResourceID]["data"];
        for (var i = 0; i < entries.length; i++) {
            if (entries[i]["word"] == word) {
                var result = instantiateTemplate("long", "root", entries[i]);
                $("#entryDivInner").html(result);
                return;
            }
        }
        $("#entryDivInner").html("Cannot find word " + word);
    }
    


});