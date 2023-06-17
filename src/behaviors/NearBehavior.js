/**
 * Abstract class that represents nearby interactions. This type behavior will influence, or is dependent on a set of particles in its near proximity
 * @interface
 */
class NearBehavior {
    
    /**
     * Interface cannot be instantiated
     */
    constructor() {
        this.hasCorrection = true;
        if (this.constructor == NearBehavior) {
            throw new Error("NearBehavior interface class cannot be instantiated.");
        }
    }

    /**
     * Apply behavior on `particle` and/or `particles`
     * @param {Particle} particle main particle
     * @param {Number} timeStep time step of simulation
     * @param {Particle[]} particles surrounding particles
     * @abstract
     * @public
     */
    applyBehavior(particle, timeStep, particles) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * Returns the effective range / defines the size of the nearby range
     * @returns {Number[]} pair of rectangular dimensions `[number, number]` that represent the effective range
     * @abstract
     * @public
     */
    range() {
        throw new Error("Method 'range()' must be implemented.");
    }

    /**
     * Apply a positional correction to `particle` and/or `particles`
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     * @abstract
     * @public
     */
    applyCorrection(particle, particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }
}

module.exports = NearBehavior;