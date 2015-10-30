


var orthographyConverter = {
    
    textTransforms : {},
    missingTransforms : [],
    
    getTextTransform : function(id) {
        if (id in this.textTransforms) {
            return this.textTransforms[id];
        } else {
            if (this.missingTransforms.indexOf(id) == -1) {
                this.missingTransforms.push(id);
                errorAccumulator.add("Orthography " + id + " not defined.");
            }
            return function(str) { return str; };
        }
    },
        
    addTextTransform : function(id, data) {
        var keys = [];
        var correspondences = {};
        $.each(data, function(i, pair) {
            escapedKey = pair[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            keys.push(escapedKey);
            correspondences[pair[0]] = pair[1];
        });
        keys.sort(function(a,b) {
            return b.length - a.length;
        });
        var regex = new RegExp("(" + keys.join('|') + ")", 'g');
        var func = function(str) {
            return str.replace(regex, function(a,b) {
                return correspondences[a];
            });	
        };
        this.textTransforms[id] = func;
    },
    
    convertQuery : function(str, lang, orthType) {
        var orths = config[lang][orthType];
        return this.convertWord(str, orths);
    },
    
    convertWord : function(word, orths) {   
        var that = this;
        $.each(orths, function(i, orthName) {
            transformer = that.getTextTransform(orthName);
            word = transformer(word);
        });
        return word;
    },
    
    convertWords : function(words, orths) {
        var that = this;
        return words.map(function(word) {
            return that.convertWord(word, orths);
        });
    },
    
    orthographizeEntries : function(dictionary) {
        var that = this;
        $.each(dictionary, function(resourceID, manifest) {
            $.each(manifest["data"], function(index, entry) {
                entry["word"] = that.convertWords(entry["word"], manifest["norm"]);
                entry["forms"] = entry["word"].slice();
                if ("variants" in entry) {
                    entry["forms"].concat(entry["variants"]);
                }
                entry["display_form"] = that.convertWords(entry["forms"], manifest["display"]);
                entry["underlying_form"] = that.convertWords(entry["forms"], manifest["underlying"]);
                entry["compare_form"] = that.convertWords(entry["forms"], manifest["compare"]);
            });
        });
    }
};    
    