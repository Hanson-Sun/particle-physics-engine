/**
 * Vector2D is a light-weight 2D vector class that implements several vector operations.
 * 
 * **Note**: modifying "to" methods that do not return a new Vector2D are more efficient.
 */
class Vector2D {
	/**
	 * Instantiate a new `Vector2D`.
	 * @param {Number} x 
	 * @param {Number} y 
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * returns a new added vector denoted by `this + v`.
	 * @param {Vector2D} v vector to be added
	 * @returns {Vector2D} 
	 */
	add(v) {
		return new Vector2D(this.x + v.x, this.y + v.y);
	}

	/**
	 * adds a vector to the current vector (`this = this + v`).
	 * @param {Vector2D} v 
	 */
	addTo(v) {
		this.x = this.x + v.x;
		this.y = this.y + v.y;
	}

	/**
	 * returns a new subtracted vector denoted by `this - v`.
	 * @param {Vector2D} v vector to be added
	 * @returns {Vector2D} 
	 */
	sub(v) {
		return new Vector2D(this.x - v.x, this.y - v.y);
	}

	/**
	 * subtracts a vector to the current vector (`this = this - v`).
	 * @param {Vector2D} v 
	 */
	subTo(v) {
		this.x = this.x - v.x;
		this.y = this.y - v.y;
	}

	/**
	 * returns a new scalar-multiplied vector denoted by `this * a`.
	 * @param {Number} a scalar multiple
	 * @returns {Vector2D} 
	 */	
	mult(a) {
		return new Vector2D(this.x * a, this.y * a);
	}

	/**
	 * multiplies a scalar to the current vector (`this = this * a`).
	 * @param {Number} a 
	 */	
	multTo(a) {
		this.x = this.x * a;
		this.y = this.y * a;
	}

	/**
	 * returns the dot product of two vectors (`this` and `v`).
	 * @param {Vector2D} v  
	 * @returns {Number}
	 */
	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	/**
	 * returns the "cross-product" of two vectors (`this` and `v`). Since these are 2D vectors, this is the 
	 * z-coordinate of the 3D counter parts of these 2D vectors. It returns a scalar.
	 * @param {Vector2D} v 
	 * @returns {Number}
	 */
	cross(v) {
		return this.x * v.y - v.x * this.y;
	}

	/**
	 * returns the magnitude of the vector.
	 * @returns {Number}
	 */
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);

	}

	/**
	 * returns the magnitude squared of the vector.
	 * @returns {Number}
	 */
	magSqr() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * returns a new normalized Vector2D.
	 * @returns {Vector2D}
	 */
	normalize() {
		const mag = Math.sqrt(this.x * this.x + this.y * this.y);
		return new Vector2D(this.x / mag, this.y / mag);
	}

	/**
	 * normalizes the `this` Vector2D.
	 */
	normalizeTo() {
		const mag = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x = this.x / mag;
		this.y = this.y / mag;
	}

	/**
	 * return the angle between `this` and v.  
	 * @param {Vector2D} v 
	 * @param {boolean} type  default set to `true` to return radians. Setting to false will return `degrees`.
	 * @returns {number}
	 */
	angleBetween(v, type = true) {
		const dot = this.x * v.x + this.y * v.y;
		const mag1 = ((this.x ** 2) + (this.y ** 2)) ** 0.5;
		const mag2 = ((v.x ** 2) + (v.y ** 2)) ** 0.5;
		if (type) {
			return Math.acos(dot / mag1 / mag2);
		}
		return Math.acos(dot / mag1 / mag2) * 180 / Math.PI;
	}

	/**
	 * Performs the mirror reflection for `this` about a normal vector.
	 * @param {Vector2D} normal 
	 * @returns Vector2D
	 */
	reflect(normal) {
		let dot2 = 2 * (this.x * normal.x + this.y * normal.y);
		let x = this.x - normal.x * dot2;
		let y = this.y - normal.y * dot2;
		return new Vector2D(x, y);
	}

	/**
	 * Performs the mirror reflection for `this` about a normal vector. (modifies self)
	 * @param {Vector2D} normal 
	 */
	reflectTo(normal) {
		let dot2 = 2 * (this.x * normal.x + this.y * normal.y);
		this.x = this.x - normal.x * dot2;
		this.y = this.y - normal.y * dot2;
	}
}

module.exports = Vector2D;