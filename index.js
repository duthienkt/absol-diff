import { tokenize, leftMatchString, rightMatchString } from "./string";
import { longestCommonSubTokens } from "./agorithm";
import Segment from "./struct/Segment";
import Trapezium from "./struct/Trapezium";

// AbsolDiff

// tokenize

var FLAG_MATCHED = 1;
var FLAG_NOT_MATCHED = -1;

/**
 * 
 * @typedef CLTResult
 * @property {Boolean} isExtraMatched
 * 
 * @param {String} lText 
 * @param {String} rText 
 */
export function diffSingleText(lText, rText) {
    if (lText == rText) {
        return [Trapezium(Segment(0, lText.length), Segment(0, rText.length))]
    }
    var lToken = tokenize(lText);
    var rTokens = tokenize(rText);
    var lcst = longestCommonSubTokens(lToken, rTokens);
    var cmpPairsRd = lcst.subExtraMatched.reduce(function (ac, pair) {
        var last = ac.last;
        var lBw = last.top.betweenSegment(pair.lToken.range);
        var rBw = last.bot.betweenSegment(pair.rToken.range);
        var newTpzm = new Trapezium(lBw, rBw);
        if (newTpzm.square() > 0) {
            newTpzm.flag = FLAG_NOT_MATCHED;
            ac.result.push(newTpzm);
        }
        newTpzm = new Trapezium(pair.lToken.range, pair.rToken.range);
        newTpzm.flag = FLAG_MATCHED;
        ac.result.push(newTpzm);
        ac.last = newTpzm;
        return ac;
    },
        { result: [], last: Trapezium(Segment(0, 0), Segment(0, 0)) });

    var lBw = Segment(cmpPairsRd.last.top.end, lText.length);
    var rBw = Segment(cmpPairsRd.last.bot.end, rText.length);
    var newTpzm = new Trapezium(lBw, rBw);
    newTpzm.flag = FLAG_NOT_MATCHED;
    cmpPairsRd.result.push(newTpzm);
    var cmpPairs = cmpPairsRd.result.filter(function (trp) {
        return trp.square() > 0;
    })
        .reduce(function (ac, trp) {
            if (trp.flag == FLAG_MATCHED) {
                ac.push(trp);
            }
            else {
                var lSubText = lText.substring(trp.top.start, trp.top.end);
                var rSubText = rText.substring(trp.bot.start, trp.bot.end);
                var leftMatchedLength = leftMatchString(lSubText, rSubText);
                var rightMatchedLength = rightMatchString(lSubText, rSubText);
                var mTextLength = Math.min(lSubText.length, rSubText.length);
                var newTpzm;
                if (leftMatchedLength + rightMatchedLength < mTextLength) {
                    if (leftMatchedLength > 0) {
                        newTpzm = Trapezium(Segment(trp.top.start, trp.top.start + leftMatchedLength), Segment(trp.bot.start, trp.bot.start + leftMatchedLength));
                        newTpzm.flag = FLAG_MATCHED;
                        ac.push(newTpzm);
                    }

                    newTpzm = Trapezium(Segment(trp.top.start + leftMatchedLength, trp.top.end - rightMatchedLength), Segment(trp.bot.start + leftMatchedLength, trp.bot.end - rightMatchedLength));
                    newTpzm.flag = FLAG_NOT_MATCHED;
                    ac.push(newTpzm);

                    if (rightMatchedLength > 0) {
                        newTpzm = Trapezium(Segment(trp.top.end - rightMatchedLength, trp.top.end), Segment(trp.bot.end - rightMatchedLength, trp.bot.end));
                        newTpzm.flag = FLAG_MATCHED;
                        ac.push(newTpzm);

                    }
                }
                else {
                    if (rightMatchedLength > leftMatchedLength) {//rightMatchedLength always > 0 
                        newTpzm = Trapezium(Segment(trp.top.start, trp.top.end - rightMatchedLength), Segment(trp.bot.start, trp.bot.end - rightMatchedLength));
                        newTpzm.flag = FLAG_NOT_MATCHED;
                        ac.push(newTpzm);

                        newTpzm = Trapezium(Segment(trp.top.end - rightMatchedLength, trp.top.end), Segment(trp.bot.end - rightMatchedLength, trp.bot.end));
                        newTpzm.flag = FLAG_MATCHED;
                        ac.push(newTpzm);
                    }
                    else {
                        if (leftMatchedLength > 0) {
                            newTpzm = Trapezium(Segment(trp.top.start, trp.top.start + leftMatchedLength), Segment(trp.bot.start, trp.bot.start + leftMatchedLength));
                            newTpzm.flag = FLAG_MATCHED;
                            ac.push(newTpzm);
                        }
                        newTpzm = Trapezium(Segment(trp.top.start + leftMatchedLength, trp.top.end), Segment(trp.bot.start + leftMatchedLength, trp.bot.end));
                        newTpzm.flag = FLAG_NOT_MATCHED;
                        ac.push(newTpzm);
                    }
                }
            }
            return ac;
        }, [])
        .reduce(function (ac, trp) {
            if (ac.length == 0) {
                ac.push(trp);
                return ac;
            }
            else {
                var last = ac[ac.length - 1];
                if (last.flag == trp.flag) {
                    var newTrp = last.merge(trp);
                    newTrp.flag = last.flag;
                    ac[ac.length - 1] = newTrp;
                }
                else {
                    ac.push(trp);
                }
                return ac;
            }

        }, []);

    return cmpPairs;
}

