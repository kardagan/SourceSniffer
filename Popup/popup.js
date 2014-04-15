var FindedAlert = chrome.extension.getBackgroundPage().getFindedAlert();
if ( (FindedAlert !== null) && (FindedAlert.res.length)) {
    $("#resultat").html( FindedAlert.res.length + " alerte" + (FindedAlert.res.length>1?"s":"") );
    $("#sniffResult").remove();
    var totalbyid = [];
    for ( var i = 0 ; i < FindedAlert.res.length ; i++ ) {
        var id = FindedAlert.res[i].res.sniff.id;
        if( $("#res_" + id ).length == 0 ) {
            $("#resultat").append( $("<div id='res_" + id + "' class='sniffResult'>") );
            totalbyid[id] = 0;
        }
        totalbyid[id]++;
        $("#res_" + id).html ( "-> " + FindedAlert.res[i].res.sniff.name + " : " + totalbyid[id] + " alerte" + (totalbyid[id]>1?"s":"") );
    }
}