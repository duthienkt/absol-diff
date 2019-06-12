import Segment from "./struct/Segment";

var letterRegex = /[\_a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴèéẹẻẽêềếệểễÈÉẸẺẼÊỀẾỆỂỄìíịỉĩÌÍỊỈĨòóọỏõôồốộổỗơờớợởỡÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠùúụủũưừứựửữÙÚỤỦŨƯỪỨỰỬỮỳýỵỷỹỲÝỴỶỸđĐ\u0300\u0301\u0303\u0309\u0323\u02C6\u0306\u031B]/;
var spaceRegex = /\s+/;

var wordScore = 1;
var opScore = 0.99;
var spaceScore = 0.01;


/**
 * 
 * @typedef Token
 * @property {String} value
 * @property {Segment} range
 * @property {Number} score
 * 
 * @param {String} text
 * @returns {Array<Token>} 
 */
export function tokenize(text) {
    var simpleToken = new RegExp(['(', letterRegex.source, '+)|(', spaceRegex.source, ')|(', '.', ')'].join(''), 'g');

    var result = [];
    var matched;
    do {
        matched = simpleToken.exec(text);
        if (matched) {
            var score = 0;
            if (matched[1]) score = wordScore;
            if (matched[2]) score = spaceScore;
            if (matched[3]) score = opScore;
            result.push({
                range: Segment(matched.index, simpleToken.lastIndex),
                value: matched[0],
                score: score + score * matched[0].length / 1000000
            });
        }
    }
    while (matched)
    return result;
}



/**
 * 
 * @param {String} a 
 * @param {String} b 
 * @returns {Number} length of common string
 */
export function leftMatchString(a, b) {
    var res = 0;
    var i = 0;
    var j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] == b[j]) {
            ++res;
        }
        else {
            break;
        }
        ++i;
        ++j;
    }
    return res;
}



/**
 * 
 * @param {String} a 
 * @param {String} b 
 * @returns {Number} length of common string
 */
export function rightMatchString(a, b) {
    var res = 0;
    var i = a.length;
    var j = b.length;
    while (i > 0 && j > 0) {
        --i;
        --j;
        if (a[i] == b[j]) {
            ++res;
        }
        else {
            break;
        }
    }
    return res;
}

/**
 * 
 * @param {String} text 
 */
export function hashCode(text) {
    var hash = 0, i, chr;
    if (text.length === 0) return hash;
    for (i = 0; i < text.length; i++) {
      chr   = text.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };