const SelfBehavior = require("./SelfBehavior");

/**
 * 
 */
class PositionLock extends SelfBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor(position) {
        super();
        this.position = position;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */    
    applyBehavior(particle, timeStep) {
        return;
    }

     /**
     * @override
     * @param {Particle} particle 
     */
    applyCorrection(particle) {
        particle.vel = new Vector2D(0,0);
        particle.pos = this.position;
    }
}

module.exports = PositionLock;