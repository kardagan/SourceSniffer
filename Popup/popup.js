var FindedAlert = chrome.extension.getBackgroundPage().getFindedAlert();
if ( (FindedAlert !== null) && (FindedAlert.res.length)) {
    $("#resultat").html( FindedAlert.res.length + " " + getTraduction ( "alerte" + (FindedAlert.res.length>1?"s":"") ) );
    if ( chrome.extension.getBackgroundPage().limit == FindedAlert.res.length ) {
        $("#resultat").html( $("#resultat").html() + '<br>' + getTraduction("limitatteinte" , [chrome.extension.getBackgroundPage().limit]) );
    }
    $("#sniffResult").remove();
    var totalbyid = [];
    for ( var i = 0 ; i < FindedAlert.res.length ; i++ ) {
        var id = FindedAlert.res[i].res.sniff.id;
        if( $("#res_" + id ).length == 0 ) {
            $("#resultat").append( $("<div id='res_" + id + "' class='sniffResult'>") );
            totalbyid[id] = 0;
        }
        totalbyid[id]++;
        $("#res_" + id).html ( "-> " + FindedAlert.res[i].res.sniff.name + " : " + totalbyid[id] + " " + getTraduction ( "alerte" + (FindedAlert.res.length>1?"s":"") ) );
    }
}