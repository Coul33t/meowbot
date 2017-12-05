// Random ideas:
// IF there's a day indicator (soir, matin, midi, etc.)
// check the word before. e.g.:
// " ce " -> " ce soir " -> today
// " hier " -> " hier soir " -> tomorrow



var global = this;
// This array contains the stop-words, i.e. words that are
// useless to understand the request (see stopwords.txt)
var stop_words = [];

// This associative array contains keywords, associated
// with actions to do
// e.g.: DATE  -> "quand", "heure(s)", etc.
//       PLACE -> " où ", " quelque-part ", etc.
var keywords_matching = new Object();

// This array contains the keywords extracted from the initial
// sentence
var keywords = []

// Use to have verbose output on the JS console
var DEBUG = false;


function import_stopwords(file) {
    
    var r_data = [];

    jQuery.ajax({  
        url: file,
        async: false,
        cache: false,
        dataType: 'text',
        success:  function(data) {
            global.stop_words = data.split("\n");
        },
    });
}

function import_keywords_matching(file) {
    
    var r_data = [];

    jQuery.ajax({  
        url: file,
        async: false,
        cache: false,
        dataType: 'text',
        success:  function(data) {
            file_contents = data.split("\n");

            keywords_to_match = []
            new_key = 'BEGIN';
            
            for (line of file_contents) {
                // If there's a #, it's a new entry
                if (line.indexOf('#') === 0) {

                    // EXCEPT IF it was the beginning of the file
                    if (new_key !== 'BEGIN') {
                        global.keywords_matching[new_key] = keywords_to_match;
                    }

                    // We reset the array of words and save the name
                    // of the global matching (unclear?)
                    keywords_to_match = []
                    new_key = line.substr(1);
                    
                } 

                // Else, it's a word to add to the entry
                else {
                    keywords_to_match.push(line.trim());
                }

            }

            // Don't forget to add the last entry
            // (the last word is an empty one, so, meh, it'll work)
            global.keywords_matching[new_key] = keywords_to_match.slice(0, keywords_to_match.length - 1);
        },
    });
}

function extract_keywords(sentence) {
    import_stopwords('stopwords.txt');

    // We send it to lower case
    sentence_array = sentence.toLowerCase();

    // We strip off every punctuation
    sentence_array = sentence_array.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    
    if (DEBUG)
        console.log('after replace: ' + sentence_array);

    // We also separate words with a ', such as in " J'aime "
    var separators = [' ', '\\\''];
    sentence_array = sentence_array.split(new RegExp(separators.join('|'), 'g'));

    if (DEBUG)
        console.log('after split: ' + sentence_array);

    // We get the indexes of stop-words
    idx_to_splice = [];



    for (word of global.stop_words) {
        // Yo this .trim() fucker is what I needed
        if (sentence_array.indexOf(word.trim()) !== -1) {
            idx_to_splice.push(sentence_array.indexOf(word.trim()));        
        }
    }

    if (DEBUG)
        console.log("idx to splice: " + idx_to_splice);

    // NOTE: Because JS is fucking bullshit, it orders by 
    // default alphabetically, so we have to define a 
    // " true " number sorting function. *sighs*

    // We sort them in descending order, because we can then
    // safely delete the entries from the end to the beginning
    // (it won't mess with the indexes values)
    idx_to_splice.sort((a, b) => (a - b)).reverse();

    if (DEBUG)
        console.log("idx to splice after sorting: " + idx_to_splice);

    // We delete the stop words
    for (idx of idx_to_splice) {
        sentence_array.splice(idx, 1);
    }

    if (DEBUG)
        console.log('after custom filter: ' + sentence_array);

    global.keywords = sentence_array;
}

// WIP
function get_principal_interest(keywords) {
    import_keywords_matching('keywords_matching.txt');
    
    matching_res = new Object();

    // For each KEYWORD
    for (key of Object.keys(global.keywords_matching)) {

        matching_res[key] = 0;

        // For each word associated to a KEYWORD
        for (i of Object.keys(global.keywords_matching[key])) {
            // ???? It works...
            //console.log(global.keywords_matching[key][match_word]);
            if (global.keywords.indexOf(global.keywords_matching[key][i]) !== -1) {
                matching_res[key] += 1;
            }
        }
    }

    var output = '';

    console.log(matching_res);

    for (var key of Object.keys(matching_res)){
        if (matching_res[key] > 0) {
            output += key.toLowerCase() + '(' + matching_res[key] + ')<br />';  
        }
    }

    if (output === '')
        document.getElementById("pre_res").innerHTML = 'Rien de connu de nos chatrvices. (=｀ω´=)';
    else
        document.getElementById("pre_res").innerHTML = 'J\'ai la réponse ! (=^-ω-^=)<br /><br />Votre demande concerne :';

    document.getElementById("res").innerHTML = output;
    
    //console.log(matching_res);
}

function processing(sentence) {
    extract_keywords(sentence);
    get_principal_interest();
}

$(document).ready(function() {
    $('#sentence_button').click(function() {
        processing($('#form_sentence_value').val());
    });
});


// test sentence
// Bonjour, je suis Quentin. J'aime manger... Et dormir.
// J'aimerai savoir si il y a quelque-chose de prévu ce soir ?