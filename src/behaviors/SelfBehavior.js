/**
 * Abstract class that represents self interactions. These behaviors are only dependent on the singular particle it is attached to.
 * @interface
 */
class SelfBehavior {
    /**
     * Interface cannot be instantiated
     */
    constructor() {
        if (this.constructor == SelfBehavior) {
            throw new Error("SelfBehavior interface class cannot be instantiated.");
        }
    }

    /**
     * Apply behavior on `particle`
     * @param {Particle} particle 
     * @param {Number} timeStep 
     * @abstract
     */
    applyBehavior(particle, timeStep) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * Apply a positional correction to `particle`
     * @param {Particle} particle 
     * @abstract
     */
    applyCorrection(particle) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

}

module.exports = SelfBehavior;