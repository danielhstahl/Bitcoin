var ajax=function(url, options, callback){
    var xhr = new XMLHttpRequest();
    xhr.open(options.type, encodeURI(url));
    xhr.onload = function() {
        if (xhr.status === 200) {
            if(callback){
                callback(xhr.responseText);
            }
            //alert('User\'s name is ' + xhr.responseText);
        }
        else {
            //alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}