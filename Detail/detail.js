var display_grouped_field = [
    { value : "res.sniff.id", lib : "res.sniff.name" },
    { value : "location.domain", lib : "location.domain" },
    { value : "location.path", lib : "location.path" }
];

function getTabs ( FindedAlertRes , level , id ) {
    if (level>=display_grouped_field.length) {
        return getCtc(FindedAlertRes , id)
    } else {
        var t = $("<div id='" + id + "' class='tabs tab-lvl-" + level + "'>")
        var u = $("<ul>");
        t.append(u);
        var groupedres = getGroupedResult(FindedAlertRes,display_grouped_field[level]);
        for ( var i = 0 ; i < groupedres.length ; i++ ) {
            var id = "tab-lvl-" + level + "-ong-" + i
            u.append("<li><a href='#" + id + "'>" + eval( "groupedres[i][0]." + display_grouped_field[level].lib ) + " (" + groupedres[i].length +")</a></li>")
            t.append( getTabs(groupedres[i],level+1,id) )
        }
        return t;
    }
}

function getGroupedResult( FindedAlertRes , field ) {
    var res = [];
    for ( var i = 0 ; i < FindedAlertRes.length ; i++ ) {
        var isAdded = false;
        for ( var j = 0 ; j < res.length ; j++ ) {
            if ( eval( "FindedAlertRes[i]." + field.value) == eval( "res[j][0]." + field.value) ) {
                res[j].push(FindedAlertRes[i]);
                isAdded = true;
                break;
            }
        }
        if ( !isAdded ) {
            res.push( [FindedAlertRes[i]] )
        }
    }
    return res;
}

function getCtc ( FindedAlertRes , id ) {
    var ctc = $("<div class='ctc' id='" + id + "'>");
    for ( var i = 0 ; i < FindedAlertRes.length ; i++ ) {
        ctc.append("<p class='res'>" +
            "Date : " + new Date(FindedAlertRes[i].date).toLocaleString() + "<br>" +
            "Recherche : " + FindedAlertRes[i].res.sniff.sniff.replace(/</g,"&lt;").replace(/>/g,"&gt;") + "<br>" +
            "R&eacute;sultat : <span>" + (FindedAlertRes[i].res.sniff.mode=='find'?FindedAlertRes[i].res.result.chaine.replace(/</g,"&lt;").replace(/>/g,"&gt;"):"Aucun r&eacute;sultat") + "</span>" +
        "</p>")
    }
    return ctc;
}

function display_results ( FindedAlert ) {
    $("#resultat").hide();
    $("#tabs").show()
    $("#purge").show();
    $("#purge input").click(function() {
        chrome.extension.getBackgroundPage().reset();
        $("#resultat").show();
        $("#purge").hide();
        $("#tabs").hide()
        $("#tabs *").remove();
    });
    $("#tabs").append( getTabs(FindedAlert.res,0,"root") )
}

var FindedAlert = chrome.extension.getBackgroundPage().getFindedAlert();

if ( (FindedAlert !== null) && (FindedAlert.res.length > 0) ) {
    display_results(FindedAlert)
}

$(function() {
    $( ".tabs" ).tabs();
});
