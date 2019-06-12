import Segment from "./Segment";

/**
 * 
 * @param {Segment} left 
 * @param {Segment} right 
 */
function Trapezium(left, right, color) {
    if (!(this instanceof Trapezium)) return new Trapezium(left, right, color);
    this.left = left;
    this.right = right;
    this.color = color;
}

/**
 *  @param {Trapezium} other
 * @returns {Trapezium} 
 */
Trapezium.prototype.merge = function (other) {
    return new Trapezium(this.left.merge(other.left), this.right.merge(other.right))
};

/**
 *  @param {Trapezium} other
 * @returns {Boolean} 
 */
Trapezium.prototype.isOverlap = function (other) {
    return this.right.isOverlap(other.right) && this.left.isOverlap(other.left);
};

/**
 * @returns {Number}
 */
Trapezium.prototype.square = function () {
    return (this.right.length() + this.left.length()) / 2;
};

Trapezium.prototype.clone - function(){
    return new Trapezium(this.left.clone(), this.right.clone(), this.color);
};

export default Trapezium;