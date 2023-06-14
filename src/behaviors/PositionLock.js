const Vector2D = require("../utils/Vector2D");
const SelfBehavior = require("./SelfBehavior");

/**
 * `PositionLock` is a `SelfBehavior` that constraints the position of a particle to a given point in space. 
 * It ignores any any energy loss and is a direct positional correction.
 * @extends {SelfBehavior}
 */
class PositionLock extends SelfBehavior {
    /**
     * Instantiates new `PositionLock`
     * @param {Vector2D} position locked position
     * @constructor
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