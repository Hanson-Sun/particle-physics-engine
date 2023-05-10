

class NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
        if (this.constructor == NearBehavior) {
            throw new Error("HashGridItem interface class cannot be instantiated.");
        }
    }

    /**
     * 
     * @param {Number} timeStep 
     * @param {Array<Particle>} particles 
     */
    applyBehavior(particle, timeStep, particles) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * 
     */
    range() {
        throw new Error("Method 'range()' must be implemented.");
    }

    applyCorrection(particle, particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

}