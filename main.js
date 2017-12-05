var global = this;
// This array contains the stop-words, i.e. words that are
// useless to understand the request (see stopwords.txt)
var stop_words = [];

// This array contains the verbs that help us understanding
// what the user wants (see verbs.txt)
var verbs = [];

// This array contains the nouns that help us understanding
// what the user wants (see verbs.txt)
var nouns = [];

// Use to have verbose output on the JS console
var DEBUG = false;

function import_stopwords(file) {
    
    var xhr = new XMLHttpRequest();
    // false = synchronous (ugly)
    // TODO: better
    xhr.open('GET', file, false);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            global.stop_words = [];
            console.log(xhr.responseText);

            for (line of xhr.responseText.split('\n')) {
                global.stop_words.push(line);
            }

        }
    }

    xhr.send();
    
    /*var r_data = [];

    $.get(file, function(data) {
        r_data = data;
        console.log('r_data inside jquery: ' + r_data);
    }, 'text');

    console.log("r_data outside jquery: " + r_data);
    return r_data;*/
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

    // We sort them in descending order, because we can then
    // safely delete the entries from the end to the beginning
    // (it won't mess with the indexes values)
    idx_to_splice.sort().reverse();

    if (DEBUG)
        console.log(idx_to_splice);

    // We delete the stop words
    for (idx of idx_to_splice) {
        sentence_array.splice(idx, 1);
    }

    if (DEBUG)
        console.log('after custom filter: ' + sentence_array);
}

$(document).ready(function() {
    $('#sentence_button').click(function() {
        extract_keywords($('#form_sentence_value').val());
    });
});

//extract_keywords('Bonjour, je suis Quentin. J\'aime manger... Et dormir.')