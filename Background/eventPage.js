if ( typeof localStorage["sniffers"] == "undefined" ) {
    localStorage["sniffers"] = new Array();
}

chrome.browserAction.setBadgeText( { text: "" } );
var limit = 500;
var findedAlert = null;

function addFindedAlert( location , res ) {
    var localFindedAlert = getFindedAlert();

    var now = new Date();
    for ( var i = 0 ; i < res.length ; i++ ) {
        if ( localFindedAlert.res.length >= limit  ) {
            localFindedAlert.res.shift();
        }

        localFindedAlert.res.push ({
            location : location,
            res : res[i],
            date : now
        });
    }

    findedAlert = localFindedAlert;
    chrome.browserAction.setBadgeText( { text: localFindedAlert.res.length.toString() } );
}

function getFindedAlert() {
    if ( findedAlert === null ) {
        findedAlert = {
            res : []
        };
    }
    return findedAlert;
}

function tabUpdated (tabId, changeInfo, tab) {
    if ( changeInfo.status !=  "complete"  ) return;

    var reg = new RegExp("^(http|https)://([^/]*)(.*)$","gi");
    var tmp = reg.exec( tab.url );
    if ( tmp == null ) return;

    var location = {
        protocol : tmp[1],
        domain : tmp[2],
        path : tmp[3]
    };

    try {
        chrome.tabs.sendMessage(tabId, {action: "getHtml"}, function(response) {
            if ( response ) {
                var res = sniffers.parse(response.html , location );
                if ( res !== false ) {
                    addFindedAlert( location , res );
                }
            }
        });
    } catch ( e ) {

    }

}

function reset () {
    sniffers.getListe(true);
    chrome.browserAction.setBadgeText( { text: "" } );
    findedAlert=null;
}

var script = document.createElement("script");
script.src='/Js/sniffers.js';
script.onload = function () {
    chrome.tabs.onUpdated.addListener( tabUpdated );
}
document.head.appendChild(script);


var message = chrome.i18n.getMessage("toto");
console.log(message);