function initialBrowse() {
       var entries = getAllEntries();
//                        entries.sort(function(a,b) {
//                        var aForm = a["display_form"][0];
//                        var bForm = b["display_form"][0];
//                        return aForm.localeCompare(bForm);
//                });
//    
        var startIndex = 0;
        
        var tenEntries = get10(entries, startIndex);

// Initial Browse

  $("#browseEntries").html(tenEntries.join(""));
};

$(initialBrowse());