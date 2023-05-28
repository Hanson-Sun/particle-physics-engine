/**
 * Abstract class that represents nearby interactions. This type behavior will influence, or is dependent on a set of particles in its near proximity
 */
class NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
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
     */
    applyBehavior(particle, timeStep, particles) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * Returns the effective range / defines the size of the nearby range
     * @returns {[Number, Number]} pair of rectangular dimensions that represent the effective range
     * @abstract
     */
    range() {
        throw new Error("Method 'range()' must be implemented.");
    }

    /**
     * Apply a positional correction to `particle` and/or `particles`
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     * @abstract
     */
    applyCorrection(particle, particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

}