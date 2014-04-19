$("#btn_creer").click(creer);
$("#btn_editer").click(editer);
$("#btn_supprimer").click(supprimer);
$("#btn_enregistrer").click(enregistrer);
$("#sniflist").dblclick(editer);

function load() {
    var s = sniffers.getListe();
    if (s.length > 0) {
        $("#sniflist option").remove();
        for ( var i = 0 ; i < s.length ; i++ ) {
            $("#sniflist").append( $("<option value='" + i + "'>" + s[i]["name"] + "</option>") );
        }
        $("div.sniffList").show();
        $("sniflist").attr("size" , Math.min( Math.max(s.length,5) , 20 ) );
    } else {
        $("div.sniffList").hide();
    }
}
load();

function creer() {
    afficheSniff(null);
}
function supprimer() {
    var id = $("#sniflist").val();
    if ( id == null ) {
        alert( getTraduction("option_nosniffsel") );
    } else {
        var s = sniffers.getSniff(id);
        if ( confirm( getTraduction("option_confirm_delete") + " " + s.name ) ) {
            s.delete();
            load();
        }
    }
}
function editer() {
    var id = $("#sniflist").val();
    if ( id == null ) {
        alert( getTraduction("option_nosniffsel") );
    } else {
        afficheSniff(id);
    }
}

var currentEditing = null;
function afficheSniff( id ) {

    $("th div.error").hide();
    $("th.error").removeClass("error");

    $("form[name=theform]")[0].reset();
    currentEditing = sniffers.getSniff(id);
    $("div.formulaire").css("display","block");
    document.forms["theform"].name.value = currentEditing.name.replace("&lt;","<").replace("&gt;",">");
    $("form[name=theform] input[name=active][value=" + currentEditing.active + "]").prop("checked",true);
    $("form[name=theform] input[name=protocol][value=" + currentEditing.protocol + "]").prop("checked",true);
    document.forms["theform"].active.value = currentEditing.active;
    document.forms["theform"].domains.value = currentEditing.domains;
    document.forms["theform"].paths.value = currentEditing.paths;
    $("form[name=theform] input[name=mode][value=" + currentEditing.mode + "]").prop("checked",true);
    document.forms["theform"].sniff.value = currentEditing.sniff;

}

function enregistrer ( ) {
    $("th div.error").hide();
    $("th.error").removeClass("error");

    var updateReturn = currentEditing.update ({
        name : $("form[name=theform] input[name=name]").val().replace("<","&lt;").replace(">","&gt;"),
        active : $("form[name=theform] input[name=active]:checked").val(),
        protocol : $("form[name=theform] input[name=protocol]:checked").val(),
        domains : $("form[name=theform] textarea[name=domains]").val(),
        paths : $("form[name=theform] textarea[name=paths]").val(),
        mode : $("form[name=theform] input[name=mode]:checked").val(),
        sniff : $("form[name=theform] textarea[name=sniff]").val()
    });

    if ( updateReturn === true ) {
        $("div.formulaire").css("display","none");
        load();
    } else {
        for ( var i = 0 ; i < updateReturn.length ; i++ ) {
            $("th#" + updateReturn[i].field).addClass("error");
            $("th#" + updateReturn[i].field).find("div").html( updateReturn[i].error).show();
        }
    }
}