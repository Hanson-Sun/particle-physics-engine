/**
 * 
 */
class Wall extends HashGridItem {
    /**
     * 
     */
    constructor() {
        super();
        if (this.constructor == Wall) {
            throw new Error("Wall interface class cannot be instantiated.");
        }
    }

    /**
     * 
     * @param {Particle[]} particles 
     * @param {Number} timeStep 
     */
    resolveCollisions(particles, timeStep) {
        throw new Error("Method 'resolveCollisions()' must be implemented.");
    }

    applyCorrection(particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

    /**
     * 
     * @returns {Vector2D[]}
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented.");
    }
}