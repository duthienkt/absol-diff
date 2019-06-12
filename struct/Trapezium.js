import Segment from "./Segment";

/**
 * 
 * @param {Segment} top 
 * @param {Segment} bot 
 */
function Trapezium(top, bot) {
    if (!(this instanceof Trapezium)) return new Trapezium(top, bot);
    this.top = top;
    this.bot = bot;
}

/**
 *  @param {Trapezium} other
 * @returns {Trapezium} 
 */
Trapezium.prototype.merge = function (other) {
    return new Trapezium(this.top.merge(other.top), this.bot.merge(other.bot))
};

/**
 *  @param {Trapezium} other
 * @returns {Boolean} 
 */
Trapezium.prototype.isOverlap = function (other) {
    return this.bot.isOverlap(other.bot) && this.top.isOverlap(other.top);
};

/**
 * @returns {Number}
 */
Trapezium.prototype.square = function () {
    return (this.bot.length() + this.top.length()) / 2;
};

export default Trapezium;