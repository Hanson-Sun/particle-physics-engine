const HashGridItem = require("./HashGridItem");
const Vector2D = require("../utils/Vector2D");
const SelfBehavior = require("../behaviors/SelfBehavior");
const NearBehavior = require("../behaviors/NearBehavior");

/**
 * `Particle` is the main object of this physics engine. It is a 2D circle that is treated like a point mass at the center
 * and does **not** rotate. `Particle` is also a `HashGridItem` so it can be added to a `SpatialHashGrid`.
 * @extends {HashGridItem}
 */

class Particle extends HashGridItem {
	/**
	 * Instantiates new `Particle`
	 * @param {Vector2D} pos cartesian coordinates of the particle
	 * @param {Vector2D} vel velocity of the particle
	 * @param {Number} mass 
	 * @param {Number} radius 
	 * @param {Number} bounciness a value in [0,1] that represents the amount of energy retained after collision
	 * @param {Number} charge similar to real physical charge
	 * @param {String} color currently only supports HTML canvas colors format
	 * @constructor
	 */
	constructor(pos, vel, mass, radius, bounciness = 1, charge = 0, color="black") {
        super();
		this.charge = charge || 0;
		this.pos = pos;
		this.vel = vel || new Vector2D(0,0);
        this.force = new Vector2D(0, 0);
        this.mass = mass || 1;
        this.originalMass = mass || 1;
		this.radius = radius || 10;
		this.bounciness = bounciness;
		this.prevPos = this.pos;
        this.color = color;
		this.nearBehavior = [];
		this.selfBehavior = [];
	}

	/**
	 * Increments the position by velocity `v`
	 * @param {Vector2D} v 
	 * @param {Number} timeStep 
	 * @public
	 */
	applyVelocity(v, timeStep) {
		this.pos.addTo(v.mult(timeStep));
	}

	/**
	 * Applies force `f` to the velocity
	 * @param {Vector2D} f 
	 * @param {Number} timeStep 
	 * @public
	 */
    applyForce(f, timeStep) {
		this.vel.addTo(f.mult(timeStep / this.mass));
	}

	/**
	 * Increments the velocity by an acceleration `a`
	 * @param {Vector2D} a 
	 * @param {Number} timeStep 
	 * @public
	 */
	applyAcceleration(a, timeStep) {
		this.vel.addTo(a.mult(timeStep));
	}

	/**
	 * Adds a `SelfBehavior` to the particle
	 * @param {SelfBehavior} b 
	 * @public
	 */
	addSelfBehavior(b) {
		this.selfBehavior.push(b);
	}

	/**
	 * Adds a `NearBehavior` to the particle
	 * @param {NearBehavior} b 
	 * @public
	 */
	addNearBehavior(b) {
		this.nearBehavior.push(b);
	}

	/**
	 * Removes `NearBehavior` `b` if the particle has `b`  
	 * @param {NearBehavior} b 
	 * @returns {Boolean} true if the action is successful
	 * @public
	 */
	removeNearBehavior(b) {
		const index = this.nearBehavior.indexOf(b);
		if (index > -1) {
			this.nearBehavior.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Removes `SelfBehavior` `b` if the particle has `b`  
	 * @param {SelfBehavior} b 
	 * @returns {Boolean} true if the action is successful
	 * @public
	 */
	removeSelfBehavior(b) {
		const index = this.selfBehavior.indexOf(b);
		if (index > -1) {
			this.selfBehavior.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Clears all behaviors of the particle
	 * @public
	 */
	clearBehaviors() {
		this.nearBehavior = [];
		this.selfBehavior = [];
	}

    /**
     * @override
     * @returns {Number[]} 
     */
	getHashPos() {
		return [this.pos.x, this.pos.y];
	}

    /**
     * @override
     * @returns {Number[]} 
     */
	getHashDimensions() {
		return [this.radius * 2, this.radius * 2];
	}
}

module.exports = Particle;