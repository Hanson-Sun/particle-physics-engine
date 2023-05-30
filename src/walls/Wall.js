const HashGridItem = require("../core/HashGridItem");

/**
 * `Wall` is an Interface for any wall objects. Walls are `HashGridItems`; however, it only uses the SpatialHashGrid methods
 * that calculate the particles in its close proximity and **cannot** be added to the grid itself. Wall objects
 * are also stationary and are not influenced by any external factors.
 * @interface
 */
class Wall extends HashGridItem {
    /**
     * Instantiates new `Wall`
     */
    constructor() {
        super();
        if (this.constructor == Wall) {
            throw new Error("Wall interface class cannot be instantiated.");
        }
    }

    /**
     * Resolve the collisions between the surrounding particles and the Wall itself.
     * @param {Particle[]} particles surrounding particles that interact with the wall 
     * @param {Number} timeStep 
     */
    resolveCollisions(particles, timeStep) {
        throw new Error("Method 'resolveCollisions()' must be implemented.");
    }

    /**
     * Applies positional corrections on particles (walls do not move)
     * @param {Particle[]} particles 
     */
    applyCorrection(particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

    /**
     * Calculates the vertices of the wall
     * @returns {Vector2D[]}
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented.");
    }
}

module.exports = Wall;