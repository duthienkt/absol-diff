/**
 * 
 * @param {Number} start 
 * @param {Number} end 
 */
function Segment(start, end) {
    if (!(this instanceof Segment)) return new Segment(start, end);
    if (!(start <= end)) throw new Error("Invalid range [" + start + ', ' + end + ']');
    this.start = start;
    this.end = end;
}

/**
 * @param {Segment} other
 * @returns {Boolean}
 */
Segment.prototype.isOverlap = function (other) {
    if (this.start > other.end) return false;
    if (this.end < other.start) return false;
    return true;
};

/**
 * @returns {Number}
 */
Segment.prototype.length = function () {
    return this.end - this.start;
};



/**
 * @param {Segment} other
 * @returns {Segment}
 */
Segment.prototype.merge = function (other) {
    return new Segment(Math.min(this.start, other.start), Math.max(this.end, other.end));
};

/**
 * @param {Segment} other
 * @returns {Segment}
 */

Segment.prototype.betweenSegment = function (other) {
    if (this.start >= other.end) return new Segment(other.end, this.start);
    if (this.end <= other.start) return new Segment(this.end, other.start);
    return null;
};



/**
 * @returns {Segment}
 */
Segment.prototype.clone = function () {
    return new Segment(this.start, this.end);
};

export default Segment;