/**
 * Interface for all Constraints
 * @interface
 */
class Constraint {
    /**
     * @constructor `Constraint` interface cannot be instantiated
     */
    constructor() {
        this.color = "black";
		this.force = new Vector2D(0,0);	
        if (this.constructor == Constraint) {
            throw new Error("Constraint interface class cannot be instantiated.");
        }
    }

    /**
     * Updates the constraint.
     * @param {Number} timeStep 
     */
    update(timeStep) {
        throw new Error("Method 'update()' must be implemented.");
    }

    /**
     * Calculates the list of vertices that will be used in the rendering process
     * @returns {Vector2D[]}
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented");
    }
}