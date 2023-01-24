function goMainChart(onResult, onError) {
    try {
        $(document.getElementsByClassName('nav_wrap')[0].getElementsByTagName('li')[2]).trigger("click");

        onResult();
    } catch(e) {
        onError();
    }
}

function expandChartList(onResult, onError) {
    if (typeof hasMore2 !== 'undefined') {
        try {
            hasMore2();

            onResult();
        } catch(e) {
            onError();
        }
    } else {
        setTimeout(function() {
            expandChartList(onResult, onError);
        }, 200);
    }
}

function getTopMusics(onResult, onError) {
    var chartList = document.getElementById('_chartList');

    if (chartList) {
        var listItems = chartList.getElementsByTagName('li');
 
        if (listItems) {
            if (listItems.length > 50) {
                var musics = [];
    
                for (var i = 0; i < listItems.length; i++) {
                    musics.push({
                        "title": listItems[i].getElementsByClassName('title')[0].firstChild.nodeValue.trim(),
                        "singer": listItems[i].getElementsByClassName('name')[0].firstChild.nodeValue.trim()
                    });
                }
    
                onResult({ "musics": musics });    
            } else {
                setTimeout(function() {
                    getTopMusics(onResult, onError);
                }, 200);
            }
        } else {
            onError({ "code": 404, "message": "Not Found" });
        } 
    } else {
        setTimeout(function() {
            getTopMusics(onResult, onError);
        }, 200);
    }
}

function fireInnerButton(onResult, onError) {
    try {
        var button = document.getElementsByClassName('inner-btn')[0];

        button.click();

        onResult();
    } catch(e) {
        setTimeout(function() {
            fireInnerButton(onResult, onError);
        }, 200);
    }
}