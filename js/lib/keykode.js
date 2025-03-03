define(['backbone','gyro'], function (Backbone, Gyro) {
    function Keykode(Config) {
        this.keymap = {
            8:'backspace',9:'tab',13:'enter',16:'shift',17:'ctrl',18:'alt',
            19:'pause', 20:'caps',27:'escape',33:'pageUp',34:'pageDown',
            35:'end',36:'home', 45:'insert',46:'delete',

            37:'left',38:'up',39:'right',40:'down',

            48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',
            65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',
            75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',
            85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',

            91:'leftWinkey',92:'rightWinkey',93:'select',

            96:'numpad0',97:'numpad1',98:'numpad2',99:'numpad3',100:'numpad4',
            101:'numpad5',102:'numpad6',103:'numpad7',104:'numpad8',105:'numpad9',

            106:'multiply',107:'add',109:'subtract',110:'decimal',111:'divide',

            112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',
            118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',

            144:'numlock',145:'scrollLock',186:'semicolon',187:'equals',
            188:'comma',189:'dash',190:'period',191:'slash',192:'grave',
            219:'leftBracket',221:'rightBracket',220:'backslash', 222:'apostrophe'
        };
        if( Config && Config.keymap ) {
            this.setMap( Config.keymap );
        }
        this.index = { };
        this.empty = { };
        this.scope = this.empty;
        Backbone.Keykode = this;
        Backbone.View.prototype.keykode = this.keydown.bind(this);
    }

    Keykode.prototype = {
        setMap: function( keymap ) {
            _.extend(this.keymap, keymap);
        },
        keydown: function( event ) {
            // console.debug(this);
            if( !event ) {
                return true;
            }
            var target = event.target,
                key = Backbone.Keykode.keymap[ event.keyCode ];

            console.debug('event:', {
                key: key,
                view: this,
                event: event
            });

            return false;
        }
    };
    return new Keykode();
});
