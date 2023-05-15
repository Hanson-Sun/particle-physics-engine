class Gravity extends SelfBehavior {

    constructor(acceleration) {
        super();
        this.acceleration = acceleration;
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep) {
        particle.applyAcceleration(this.acceleration, timeStep);
        particle.pos = particle.pos.add(this.acceleration.mult(timeStep * timeStep));
    }

    /**
	 * Applies position correction on behavior.
	 * @param {Particle} particle 
	 * @param {Particle[]} particles 
	 */
	applyCorrection(particle) {
        return;
    }

}