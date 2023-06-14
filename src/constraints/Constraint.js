const Vector2D = require("../utils/Vector2D");

/**
 * Interface for all Constraints
 * @interface
 */
class Constraint {
    /**
     * `Constraint` interface cannot be instantiated
     */
    constructor() {
        this.color = "black";
		this.force = new Vector2D(0,0);	
        this.breakForce = Infinity;
        if (this.constructor == Constraint) {
            throw new Error("Constraint interface class cannot be instantiated.");
        }
    }

    /**
     * Updates the constraint.
     * @param {Number} timeStep 
     * @abstract
     * @public
     */
    update(timeStep) {
        throw new Error("Method 'update()' must be implemented.");
    }

    /**
     * Calculates the list of vertices that will be used in the rendering process
     * @returns {Vector2D[]}
     * @abstract
     * @public
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented");
    }

     /**
     * Calculates the list of particles that is involved with the constraint
     * @returns {Particle[]}
     * @abstract
     * @public
     */
    particles() {
        throw new Error("Method 'vertices()' must be implemented");
    }
}

module.exports = Constraint;