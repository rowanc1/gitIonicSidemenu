var data = ["g_an", "ap", "hlag_ats'uu", "haguxwsg_alt'amdinsxw", "guxwsg_alt'amdinsxw", "anksuulaag_altxw", "yats", "x_bukwsxw", "lalt'", "yahlxw", "maadim", "maaxws", "yahlx_", "basig_an", "sak_", ".'wits'", "ha'wits'aasxw", "luda'mixsxw", "da'mixsxw", "hluut'ax_", ".'mook_", ".'moog_a bak_", "gitxw", "g_al wii t'ixw", "x_ts'a'y", "g_esxw", "hanix", "ha'niig_oot", "ha'moog_a", "t'is", "hugwax_", "sim on", "xsi", "lok_", "hagwiluxw", "mo'on", ".'man", "hlaks", "hlaks", "lax_ mo'on", "lip'ast", "sak_", "dulpxw", "limx", "haneek_", "yim", "hliba'l", "hlgim", "k_'aax", "gimk", "gilelix", "laldim wis", "gulx_yee'enst", "deex_sxw", "yehlte", "hatk_'", "pdok_", "lanemgyet", "ksaxw", "hasba", "txwa", "t'g_a'atxw", "wilaks", "anwilak'xw", "silg_alwil", "ax_heetxw", ".'mes'm", "p'i'niks", "wijix", "walix", "duus", ".'mukw", "noosik_", "ts'iipxw", "gun", "hat'al", "ma'ukw", "am hat'al", "t'ayksxw", "x_sit", "gyamks", "lak_s", "saksin", "aksin", "dax_ gwi", "hinda", ".'wii dax_", "naks", "bahasxw", "anyuust", "ha’niit’aa", "t’uuts", "keeg̱an", "do’o", "k_'ehlx_", "g̱_e’n", "sk’iik", "mis’moot’ixs", "sim’oo'git", "nax_naax_t  ", "mukw", "k'alidakhl", "g_aak", "x_sgyaak", "ts'iihl", "hasiyayks", "hak_", "gyada ts'uuts", "g_ol", "sigidimnak_", "t'iihlxw", "g_an mi'in", "k_ets", "jayn", "aats", "x_jit'ok", "mii ts'ok'", "daax", "ts'ak'", "sa'winsxwum hlox_s", "etxw", "haguxsg_alt'amdinsxw", "anjok_", "gwisgwoos", "laaxwsin hix", "k_aat'", ".'mal", "ts'ilaasxw", "hiishaawak_xwit", "is", "sk_'an dilawsa", "txw", "sginist", "tsidipx_s", "maaxws", "ii", "m'iig_an", "sipxw", "sk_'an miigwint", "seek_s", "log_aa g_an", "hli'osihl 'waasan", "giist", "dilawsa", "sk_'an t'siks", "ja", "xw", "luux", "g_asx_", "sxw", "g_an", "maadim", "bibax_", "ham'ook_", "hiis k_'awt'sxwit", "hitxw", "sk_'an m'ii'oot", "habasxw", "sdatxs", "hlo7o", "hiismaawn", "nisk_o'o", "bok_", "bakw", "hit", "gasx_", "k'ii", "k_'oox_st", "maay'aa luulak_'", "yee", "loots", "dibax_", "guxws", "sk_'an hax_dakw", "hetxw", "g_ang_an", "m'ii'isxwit", "hu'ums", "sk_'an t'sex_", "umhlxw", "w'itxw", "sk_'an hlingit", "miyahl", "g_an", "asxw", "g_aahldaats", "hiisg_antxwit", "x_atxw", "g_ang_an", "t'sak'", "maaxwsxw", "sk_an snaw", "sim maay'", "hedin", "hukw", "g_an", "guxwsg_alt'amdinsxw", "wa'umst", "g_apk_'ooyp", "in", "hiishabaasxw", "hu'umst", "sk_'an sg_asiisax_", "g_antxw", "g_aydimt'suut's", "sk_'an milkst", "ji", "snax_", "miigwint", "tk_'al", "bax_", "kipg_an", "ihlee'em tsak_", "gam", "hiis k_'ank_'ots", "hinak_'", "m'iyahl", "din", "t'am", "ha", "t'sanksa g_aak_", "sk_'an tsidipx_s", "naasik'", "guult", "maay'aa smax", "haguxwsg_alt'amdinsxw", "haast", "sk_'an tya'aytxw", "k_'alee'e", "sip", "m'iik_'oox_st", "t'imi'it"];


var scroll = ['a','hl', 'x_', 'b'];
var sorted = [];
for (var i = 0; i < scroll.length; i++) {
    var keyList = [];
    for (var j = 0; j < data.length; j++) {
        if(data[j].slice(0,scroll[i].length) === scroll[i]){
            keyList.push(data[j]);
        }
    };
    var sortedKeyList = keyList.sort(function(a,b){
        a = a.slice(scroll[i].length);
        b = b.slice(scroll[i].length);
        if (a < b){
            return -1;
        }else if (a > b){
            return  1;
        }else{
            return 0;
        }
    })
    sorted.push(sortedKeyList)
};
console.log(sorted)


