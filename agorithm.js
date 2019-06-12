
/**
 * @typedef TokenPair
 * @property {Token} lToken
 * @property {Token} rToken
 * 
 * @typedef LCSTResult
 * @property {Number} score
 * @property {Array<TokenPair>} subExtraMatched
 * @property {Boolean} isExtraMatched
 * 
 * @param {Array<Token>} lTokens 
 * @param {Array<Token>} rTokens
 * @returns {LCSTResult} 
 */
export function longestCommonSubTokens(lTokens, rTokens) {
    var Q = Array(lTokens.length + 1).fill(null).map(function (u, i) {
        return Array(rTokens.length + 1).fill(0);

    });
    //QHD
    for (var i = 0; i < lTokens.length; ++i) {
        for (var j = 0; j < rTokens.length; ++j) {
            Q[i + 1][j + 1] = Math.max(Q[i][j + 1], Q[i + 1][j]);
            if (lTokens[i].value == rTokens[j].value) {
                Q[i + 1][j + 1] = Math.max(Q[i + 1][j + 1], Q[i][j] + rTokens[j].score);
            }
        }
    }

    //trace
    var subExtraMatched = [];
    var i = lTokens.length;
    var j = rTokens.length;
    var score = 0;

    while (i > 0 && j > 0) {
        if (Q[i][j] == 0) break;
        while (Q[i][j] == Q[i][j - 1])--j;
        while (Q[i][j] == Q[i - 1][j])--i;
        score += lTokens[i - 1].score;
        subExtraMatched.push({
            lToken: lTokens[i - 1],
            rToken: rTokens[j - 1]
        })
        --j;
        --i;
    }

    subExtraMatched = subExtraMatched.reverse();
    return {
        subExtraMatched: subExtraMatched,
        isExtraMatched: subExtraMatched.length == lTokens.length && subExtraMatched.length == rTokens.length,
        score: score
    }
};


