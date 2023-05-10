class Force extends SelfBehavior {

    constructor(force) {
        super();
        this.force = force;
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep) {
        //particle.applyForce(this.force, timeStep);
        particle.pos = particle.pos.add(this.force.mult(timeStep * timeStep / particle.mass));
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