import { tokenize, leftMatchString, rightMatchString, hashCode } from "./string";
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
 * @returns {Array<Trapezium>}
 */
export function diffSingleText(lText, rText) {
    if (lText == rText) {
        return [Trapezium(Segment(0, lText.length), Segment(0, rText.length), FLAG_MATCHED)]
    }
    var lToken = tokenize(lText);
    var rTokens = tokenize(rText);
    var lcst = longestCommonSubTokens(lToken, rTokens);
    var cmpPairsRd = lcst.subExtraMatched.reduce(function (ac, pair) {
        var last = ac.last;
        var lBw = last.left.betweenSegment(pair.lToken.range);
        var rBw = last.right.betweenSegment(pair.rToken.range);
        var newTpzm = new Trapezium(lBw, rBw);
        if (newTpzm.square() > 0) {
            newTpzm.color = FLAG_NOT_MATCHED;
            ac.result.push(newTpzm);
        }
        newTpzm = new Trapezium(pair.lToken.range, pair.rToken.range);
        newTpzm.color = FLAG_MATCHED;
        ac.result.push(newTpzm);
        ac.last = newTpzm;
        return ac;
    },
        { result: [], last: Trapezium(Segment(0, 0), Segment(0, 0)) });

    var lBw = Segment(cmpPairsRd.last.left.end, lText.length);
    var rBw = Segment(cmpPairsRd.last.right.end, rText.length);
    var newTpzm = new Trapezium(lBw, rBw);
    newTpzm.color = FLAG_NOT_MATCHED;
    cmpPairsRd.result.push(newTpzm);
    var cmpPairs = cmpPairsRd.result.filter(function (trp) {
        return trp.square() > 0;
    })
        .reduce(function (ac, trp) {
            if (trp.color == FLAG_MATCHED) {
                ac.push(trp);
            }
            else {
                var lSubText = lText.substring(trp.left.start, trp.left.end);
                var rSubText = rText.substring(trp.right.start, trp.right.end);
                var leftMatchedLength = leftMatchString(lSubText, rSubText);
                var rightMatchedLength = rightMatchString(lSubText, rSubText);
                var mTextLength = Math.min(lSubText.length, rSubText.length);
                var newTpzm;
                if (leftMatchedLength + rightMatchedLength < mTextLength) {
                    if (leftMatchedLength > 0) {
                        newTpzm = Trapezium(Segment(trp.left.start, trp.left.start + leftMatchedLength), Segment(trp.right.start, trp.right.start + leftMatchedLength));
                        newTpzm.color = FLAG_MATCHED;
                        ac.push(newTpzm);
                    }

                    newTpzm = Trapezium(Segment(trp.left.start + leftMatchedLength, trp.left.end - rightMatchedLength), Segment(trp.right.start + leftMatchedLength, trp.right.end - rightMatchedLength));
                    newTpzm.color = FLAG_NOT_MATCHED;
                    ac.push(newTpzm);

                    if (rightMatchedLength > 0) {
                        newTpzm = Trapezium(Segment(trp.left.end - rightMatchedLength, trp.left.end), Segment(trp.right.end - rightMatchedLength, trp.right.end));
                        newTpzm.color = FLAG_MATCHED;
                        ac.push(newTpzm);

                    }
                }
                else {
                    if (rightMatchedLength > leftMatchedLength) {//rightMatchedLength always > 0 
                        newTpzm = Trapezium(Segment(trp.left.start, trp.left.end - rightMatchedLength), Segment(trp.right.start, trp.right.end - rightMatchedLength));
                        newTpzm.color = FLAG_NOT_MATCHED;
                        ac.push(newTpzm);

                        newTpzm = Trapezium(Segment(trp.left.end - rightMatchedLength, trp.left.end), Segment(trp.right.end - rightMatchedLength, trp.right.end));
                        newTpzm.color = FLAG_MATCHED;
                        ac.push(newTpzm);
                    }
                    else {
                        if (leftMatchedLength > 0) {
                            newTpzm = Trapezium(Segment(trp.left.start, trp.left.start + leftMatchedLength), Segment(trp.right.start, trp.right.start + leftMatchedLength));
                            newTpzm.color = FLAG_MATCHED;
                            ac.push(newTpzm);
                        }
                        newTpzm = Trapezium(Segment(trp.left.start + leftMatchedLength, trp.left.end), Segment(trp.right.start + leftMatchedLength, trp.right.end));
                        newTpzm.color = FLAG_NOT_MATCHED;
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
                if (last.color == trp.color) {
                    var newTrp = last.merge(trp);
                    newTrp.color = last.color;
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


/**
 * 
 * 
 * @param {*} lText 
 * @param {*} rText 
 */
export function diffByLineText(lText, rText) {
    var lLines = lText.split(/\r?\n/);
    var rLines = rText.split(/\r?\n/);

    var result = { lLines: lLines, rLines: rLines };
    function lineAsToken(line, index) {
        var nonSpace = 0;
        for (var i = 0; i < line.length; ++i) {
            if (line[i].trim().length > 0)++nonSpace;
        }
        return {
            index: index,
            text: line,
            value: hashCode(line),
            score: nonSpace == 0 ? 0.01 : 1 + nonSpace / 1000000
        }
    }
    var lTokens = lLines.map(lineAsToken);
    var rTokens = rLines.map(lineAsToken);
    var lcst = longestCommonSubTokens(lTokens, rTokens);
    var trapeziumes = lcst.subExtraMatched.reduce(function (ac, cr) {
        var last = ac[ac.length - 1];
        var rowSegment = Trapezium(Segment(cr.lToken.index, cr.lToken.index + 1), Segment(cr.rToken.index, cr.rToken.index + 1), FLAG_MATCHED);
        if (last.isOverlap(rowSegment)) {
            last = last.merge(rowSegment);
            ac[ac.length - 1] = last;
        }
        else {
            var lBw = rowSegment.left.betweenSegment(last.left);
            var rBw = rowSegment.right.betweenSegment(last.right);
            last = Trapezium(lBw, rBw, FLAG_NOT_MATCHED);
            if (last.square() > 0) {
                ac.push(last);
            }
            ac.push(rowSegment);
        }
        return ac;
    }, [Trapezium(Segment(0, 0), Segment(0, 0), FLAG_MATCHED)])
    if (trapeziumes[0].square() == 0) trapeziumes.shift();
    result.trapeziumes = trapeziumes;
    return result;
}
