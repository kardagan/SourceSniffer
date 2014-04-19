$("*[trad]").each( function() {
   var trad = getTraduction ( $(this).attr("trad") );
   if( trad != "" ) {
       switch ( $(this)[0].nodeName ) {
           case "INPUT" :
               $(this).val(trad)
               break;
           default :
               $(this).html(trad)
       }
   }
});

function getTraduction (  ) {
    return call_user_func_array ( chrome.i18n.getMessage , arguments );
}

function call_user_func_array(cb, parameters) {

    var func;

    if (typeof cb === 'string') {
        func = (typeof this[cb] === 'function') ? this[cb] : func = (new Function(null, 'return ' + cb))();
    } else if (Object.prototype.toString.call(cb) === '[object Array]') {
        func = (typeof cb[0] === 'string') ? eval(cb[0] + "['" + cb[1] + "']") : func = cb[0][cb[1]];
    } else if (typeof cb === 'function') {
        func = cb;
    }

    if (typeof func !== 'function') {
        throw new Error(func + ' is not a valid function');
    }

    return (typeof cb[0] === 'string') ? func.apply(eval(cb[0]), parameters) : (typeof cb[0] !== 'object') ? func.apply(
        null, parameters) : func.apply(cb[0], parameters);
}