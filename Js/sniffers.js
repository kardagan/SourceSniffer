var sniffId = 0;
function sniffer ( parent , datas ) {
    this.id = sniffId++;
    this.parent = parent;
    this.name = null;
    this.active = "yes";
    this.protocol = 'all';
    this.domains = null;
    this.paths = null;
    this.mode = "find";
    this.sniff = null;
    this.status = "new";
    if ( typeof datas != "undefined" ) {
        this.name = datas.name;
        this.active = datas.active;
        this.domains = datas.domains;
        this.protocol = datas.protocol;
        this.paths = datas.paths;
        this.mode = datas.mode;
        this.sniff = datas.sniff;
        this.status = "ok";
    }
    this.valid = function ( p ) {
        var regfnmatch = new RegExp("^[\n\.\*a-zA-Z0-9]+$","g");
        var errors = [];

        if (typeof p.active != "undefined" ) {
            if (p.active != "yes" && p.active != "no") errors.push({ error: "obligatoire" , field:"active" });
        }
        if (typeof p.name != "undefined" ) {
            if (p.name == "") errors.push({ error: "obligatoire", field:"name"});
        }

        if (typeof p.domains != "undefined" ) {
            if ( ! p.domains.match( regfnmatch ) ) errors.push({ error : "Les domains doivent &ecirc;tre compos&eacute;s de caract&egrave;re alphanum&eacute;rique ou . ou * uniquement", field :"domains"});
        }

        if (typeof p.protocol != "undefined" ) {
            if (p.protocol != "http" && p.protocol != "https" && p.protocol != "all") errors.push({ error : "obligatoire", field : "protocol" });
        }
        if (typeof p.paths != "undefined" ) {
            if ( ! p.paths.match( regfnmatch ) ) errors.push({ error : "Les chemins doivent &ecirc;tre compos&eacute;s de caract&egrave;re alphanum&eacute;rique ou . ou * uniquement", field:"paths" });
        }
        if (typeof p.mode != "undefined" ) {
            if (p.mode != "find" && p.mode != "notfind") errors.push({ error : "obligatoire", field:"mode" });
        }
        if (typeof p.sniff != "undefined" ) {
            if (p.sniff == "") errors.push({ error: "obligatoire", field:"sniff"});
        }
        if ( errors.length == 0 ) return true;
        return errors;
    }
    this.update = function(p) {
        var isValid = this.valid ( p )
        if ( isValid !== true  ) {
            return isValid;
        }
        if (typeof p.active != "undefined" ) this.active = p.active;
        if (typeof p.name != "undefined" ) this.name = p.name;
        if (typeof p.domains != "undefined" ) this.domains = p.domains;
        if (typeof p.protocol != "undefined" ) this.protocol = p.protocol;
        if (typeof p.paths != "undefined" ) this.paths = p.paths;
        if (typeof p.mode != "undefined" ) this.mode = p.mode;
        if (typeof p.sniff != "undefined" ) this.sniff = p.sniff;
        this.status = "ok";
        this.parent.save();
        return true;
    }
    this.delete = function () {
        this.status = "toDelete";
        this.parent.save();
        return true;
    }
    this.toJSON = function () {
        return {
            name : this.name,
            active : this.active,
            domains : this.domains,
            protocol : this.protocol,
            paths : this.paths,
            mode : this.mode,
            sniff : this.sniff
        };
    }
    this.parse = function (html,location) {
        if ( ( location.protocol == this.protocol ) || ( this.protocol == "all") ) {
            var domains = this.domains.split("\n");
            for ( var i = 0 ; i < domains.length ; i++ ) {
                if ( fnmatch( location.domain , domains[i] ) ) {
                    var paths = this.paths.split("\n");
                    for ( var j = 0 ; j < paths.length ; j++ ) {
                        if ( fnmatch( location.path , paths[j] ) ) {
                            var sniffs = this.sniff.split("\n");
                            var res = [];
                            for ( var k = 0 ; k < sniffs.length ; k++ ) {
                                var reg = new RegExp( sniffs[k] );
                                var html_trt = html;
                                if ( this.mode == "find" ) {
                                    do {
                                        var resRegexp = reg.exec( html_trt );
                                        if ( resRegexp != null ) {
                                            html_trt = html_trt.substring( resRegexp.index + resRegexp[0].length );
                                            res.push({
                                                sniff : {
                                                    name : this.name,
                                                    domain : domains[i],
                                                    path : paths[j],
                                                    sniff : sniffs[k],
                                                    mode : this.mode,
                                                    id : this.id
                                                },
                                                result : {
                                                    chaine : resRegexp[0],
                                                    ligne : 0 // TODO : a calculer
                                                }
                                            })

                                        }
                                    } while (resRegexp != null)
                                } else if (this.mode == "notfind") {
                                    var resRegexp = reg.exec( html_trt );
                                    if ( resRegexp == null ) {
                                        res.push({
                                            sniff : {
                                                name : this.name,
                                                domain : domains[i],
                                                path : paths[j],
                                                sniff : sniffs[k],
                                                id : this.id,
                                                mode : this.mode
                                            },
                                            result : {
                                                chaine : "notfind",
                                                ligne : -1
                                            }
                                        })
                                    }
                                }
                            }

                            if ( res.length >= 0 ) return res;
                        }
                    }
                }
            }
        }
        return false;
    }
}

function fnmatch ( s , p ) {
    p = p.replace( /\./gi , "." );
    p = p.replace( /\*/gi , "(.*)" );
    return s.match( p );
}

var sniffers = {
    getListe : function (reload) {
        if ( typeof reload == "undefined" ) { reload = false; }
        if ( ( typeof this.liste == "undefined" ) || (reload) ) {
            this.liste = [];
            if ( localStorage["sniffers"] != "" ) {
                var datas = JSON.parse( localStorage["sniffers"] );
                for ( var i in datas ) {
                    this.liste.push( new sniffer( this , datas[i]) );
                }
            }
        }
        return this.liste;
    },
    getSniff : function ( id ) {
        if ( (typeof id == 'undefined') || (id == null) ) {
            var tmp = new sniffer( this )
            this.liste.push( tmp );
            return tmp;
        }
        if ( typeof this.liste[id] == "undefined" ) return null;
        return this.liste[id];
    },
    save : function ( ) {
        var res = [];
        for ( var i in this.liste ) {
            if ( this.liste[i].status == "ok" ) {
                res.push( this.liste[i].toJSON() );
            }
        }
        localStorage["sniffers"] = JSON.stringify ( res ) ;
        this.getListe(true);
        chrome.extension.getBackgroundPage().reset();
    },
    parse : function ( html , location ) {
        var l = this.getListe();
        var res = [];
        for ( var i = 0 ; i < l.length ; i++ ) {
            var r = l[i].parse(html , location );
            if ( r !== false ) {
                res = res.concat(r);
            }
        }
        if ( res.length == 0 ) return false;
        return res;
    }
}


