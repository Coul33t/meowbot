let stop_words: Array<string>;

function import_stopwords(file: string) {
    /*let client = new XMLHttpRequest();
    client.open('GET', file);
    client.onreadystatechange = function() {
        for (let line in client.responseText.split('\n'))
            stop_words.push(line);
    }
    client.send();*/
    jQuery.get('schedule.txt',function(data){
        alert(data);
    });
}

function extract_keywords(sentence: string) {
    import_stopwords('stopwords.txt'); 
}