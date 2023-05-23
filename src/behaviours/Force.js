/**
 * `Force` is a `SelfBehavior` that applies a constant force on the particle.   
 */
class Force extends SelfBehavior {
	/**
	 * Instantiates new Force behavior object
	 * @constructor
	 */    
    constructor(force) {
        super();
        this.force = force;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
    applyBehavior(particle, timeStep) {
        //particle.applyForce(this.force, timeStep);
        particle.pos = particle.pos.add(this.force.mult(timeStep * timeStep / particle.mass));
    }
    
    /**
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }

}