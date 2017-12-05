var global = this;
var stop_words = [];

function import_stopwords(file) {
    
    var xhr = new XMLHttpRequest();
    // false = synchronous
    xhr.open('GET', file, false);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            global.stop_words = [];

            for (line of xhr.responseText.split('\n'))
                global.stop_words.push(line);

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
    sentence_array = sentence.toLowerCase();

    sentence_array = sentence_array.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    console.log('after replace: ' + sentence_array);

    var separators = [' ', '\\\''];
    sentence_array = sentence_array.split(new RegExp(separators.join('|'), 'g'));
    console.log('after split: ' + sentence_array);

    for (word of global.stop_words) {
        console.log('type of word: ' + typeof(word) + ' (' + word + ')');
        console.log('type of sentence array: ' + typeof(sentence_array[1]) + ' (' + sentence_array[1] + ')');
        console.log(word.toString() === sentence_array[1].toString());
        console.log(sentence_array.indexOf(word));
        if (sentence_array.indexOf(word) !== -1) {
            sentence_array.splice(sentence_array.indexOf(word), 1);
        }
    }

    console.log('after custom filter: ' + sentence_array);
    //console.log(global.stop_words);
    //sentence_array = sentence_array.filter(word => !global.stop_words.includes(word));
    //console.log('after filter: ' + sentence_array);
}

extract_keywords('Bonjour, je suis Quentin. J\'aime manger... Et dormir.')