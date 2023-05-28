/**
 * `Gravity` is a `SelfBehavior` that applies a constant acceleration downwards.
 */
class Gravity extends SelfBehavior {
	/**
	 * Instantiates new Gravity behavior object
	 * @constructor
	 */     
    constructor(acceleration) {
        super();
        this.acceleration = acceleration;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
    applyBehavior(particle, timeStep) {
        //particle.applyAcceleration(this.acceleration, timeStep);
        particle.pos = particle.pos.add(this.acceleration.mult(timeStep * timeStep));
    }

    /**
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }

}