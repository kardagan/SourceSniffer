chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "getHtml") {
        var htmlCode = document.documentElement.outerHTML;
        sendResponse({html: htmlCode});
    } else {
        sendResponse({});
    }
});