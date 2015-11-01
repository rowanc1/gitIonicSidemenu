
/* JS File */

// Start Ready
        
    if(typeof(String.prototype.trim) === "undefined") {
        String.prototype.trim = function() {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }
    
    
    function instantiateTemplate(templateType, templateTarget, obj, index, delimiter) {
        delimiter = delimiter || "\n";
        if (templateTarget == 'index') {
            return index+1;
        }
        if (templateTarget == 'text') {
            if (obj instanceof Array) {
                return obj.join(delimiter);
            }
            return obj;
        }
        if (!(templateTarget in templates[templateType])) {
            return instantiateTemplate(templateType, 'text', obj, index, ", ");
        }
        if (obj instanceof Array) {
            return obj.map(function(item, i) {
                return instantiateTemplate(templateType, templateTarget, item, i);
            }).join(delimiter);
        }
        var template = templates[templateType][templateTarget];
        var matches = template.match(/\$\{[^}]+\}/g);
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var key = match.substr(2, match.length - 3);
            if (key == 'index' || key == 'text') {
                var replacement = instantiateTemplate(templateType, key, obj, index);
            } else {
                var replacement = instantiateTemplate(templateType, key, obj[key], index);
            }
            template = template.replace(match, replacement);
        }
        return template;
    }
    
    function makeLinkSafe(entryID) {
        return entryID.replace(" ","+");
    }
    
    
    
    var allEntries = [];
    
    function getAllEntries() {
        if (allEntries.length > 0) {
            return allEntries;
        }
        
        $.each(gitDict, function(resourceID, manifest) {
            $.each(manifest["data"], function(i, entry) {
                entry["source_id"] = resourceID;
                allEntries.push(entry);
            });
        });
        return allEntries;
    }
    
    
    
    
    function dataTyped(origin, searchCallback) {
        clearTimeout($.data(origin, 'timer')); // Set Timeout
        var search_string = $(origin).val(); // Set Search String
        if (search_string != '') {
            $(this).data('timer', setTimeout(searchCallback, 300));
        } else {
            $("div#results").fadeOut({duration:100});
        }
    }
    
    var mostRecentGitSearch = '';
    var mostRecentEngSearch = '';
    
    function gitSearch() {
        query_value = $('#gitSearch').val().trim().toLowerCase();
        if (query_value !== mostRecentGitSearch) {
            //$(".loadingDiv").fadeIn();
            mostRecentGitSearch = query_value;
            mostRecentEngSearch = '';
            search('git', 'l', '#gitSearch');
        }
    }
    
    
    function engSearch() {
        query_value = $('#engSearch').val().trim();
        if (query_value !== mostRecentEngSearch) {
            //$(".loadingDiv").fadeIn();
            mostRecentEngSearch = query_value;
            mostRecentGitSearch = '';
            search('eng', 'r', '#engSearch');
        }
    }
    
    
    function searchGit(query_value) {
    
        var results = [];
        var queryUnderlying = orthographyConverter.convertQuery(query_value, "L1", "underlying");
        var queryCompare = orthographyConverter.convertQuery(query_value, "L1", "compare");
        
        // get the distances
        var entries = getAllEntries();
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var distance = distanceCalculator.getLeastEditDistance(queryCompare, entry["compare_form"]);
            distance += distanceCalculator.getLeastEditDistance(queryUnderlying, entry["underlying_form"]) / 10.0;
            entry["distance"] = distance;
            results.push([distance, entries[i]]);
        }
        
        // sort the results
        results.sort(function(a,b) {
            return a[0] - b[0];
        });
        
        return results;
    
    }
    
    function searchEng(query_value) {
        var results = [];
        query_value = query_value.toLowerCase();
        // get the distances
        var entries = getAllEntries();
        for (var i = 0; i < entries.length; i++) {
            var target_value = entries[i]["definition"];
            //var normalized_target = target_value.toLowerCase();
            var distance = distanceCalculator.getLeastEditDistance(query_value, target_value);
            results.push([distance, entries[i]]);
        }
        
        // sort the results
        results.sort(function(a,b) {
            return a[0] - b[0];
        });
        
        return results;

    }
    
    function search(lang_value, side, input_area) {

        var query_value = $(input_area).val().trim();
        if (query_value !== '') {
                
            $("div#results").fadeOut({duration:0});
            $(".searchInstructions").fadeOut({duration:0});
            
            if (lang_value == 'git') {
                results = searchGit(query_value);
            } else {
                results = searchEng(query_value);
            }
            
                
            var matches = [];
            var closeMatches = []
            var otherMatches = []
            
            for (var i = 0; i < Math.min(10, results.length); i++) {
                var distance = results[i][0];
                var result = results[i][1];
                var resultText = instantiateTemplate("short", "root", result);
                    
                if (distance == 0) {
                    matches.push(resultText);
                } else if (distance <= 1) {
                    closeMatches.push(resultText);
                } else {
                    otherMatches.push(resultText);
                }
            }
            
                
            // create the response
            var response = ''
            if (matches.length > 0) {
                if (matches.length > 1) {
                    response += "<p>Matches found:</p>\n";
                } else {
                    response += "<p>Match found:</p>\n";
                }
                response += matches.join("\n");
            }
            
            if (closeMatches.length > 0) {
                if (closeMatches.length > 1) {
                    response += "<p>Partial matches found:</p>\n";
                } else {
                    response += "<p>Partial match found:</p>\n";
                }
                response += closeMatches.join("\n");
            }
        
            if (otherMatches.length == 0) {
                if (matches.length == 0 && closeMatches.length == 0) {
                    response += "<p>No matches found.</p>\n";
                } 
            } else if (matches.length == 0 && closeMatches.length == 0) {
                response += "<p>No matches found.  Here are some other possibilities:</p>\n";
            } else {
                response += "<p>Other possibilities:</p>\n";
            }
            response += otherMatches.join("\n");
        
            if (query_value == $(input_area).val().trim()) {
                //$(".loadingDiv").hide();
                if (side == 'r') {
                    $("div#results").removeClass('left-triangle');
                    $("div#results").addClass('right-triangle');
                } else {		
                    $("div#results").removeClass('right-triangle');
                    $("div#results").addClass('left-triangle');
                }		
                
                $("div#results").html(response);
                $("div#results").show();
            }				
        }
        return false;    
    }
    
    function shuffle(array) {
        var tmp, current, top = array.length;

        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }

        return array;
    }
    
    function getRandom10() {
        var entries = shuffle(getAllEntries());                     // shuffle entries
        return entries.slice(0,10).map(function(item) {         // take 10 of them 
            return instantiateTemplate("short", "root", item);  // templatize them
        }).join('');                                            // and join them
    }

    function get10(entries, startIndex) {
        return entries.slice(startIndex,startIndex+10).map(function(item) {    // take 10 of them 
            return instantiateTemplate("short", "root", item);      // templatize them
        });                                          
    }

// Attempt at Letter-based Browse
//var letter;
//var wordForLetter;           
//// function(array, letter)
//function getByLetter(entries, letter) {
//// get index of first word where charAt(0) = letter
//for (var i in entries) {
//    if (i.charAt(0) === letter) {
//// set index to letter
//        startIndex = $(this).index();
//// run get10 with
//        get10(entries, startIndex);
//    };
//};
//}
