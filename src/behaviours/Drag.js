class Drag extends SelfBehavior {
    constructor(viscosity) {
        super();
        this.viscosity = viscosity;
        this.LOWER_LIMIT = 0.01;
    }

    applyBehavior(particle, timeStep) {
        let vel = particle.vel;
        let vMagSqr = vel.magSqr();
		if (vMagSqr > this.LOWER_LIMIT && this.viscosity != 0) {
			let dragC = 0.0001 * (Math.PI * this.viscosity * particle.radius) / particle.mass;
			let vNormal = vel.normalize();
			let fDrag = vNormal.mult(vMagSqr * dragC);
			//particle.vel = vel.sub(fDrag.mult(timeStep));
            particle.pos = particle.pos.sub(fDrag.mult(timeStep * timeStep));
		}
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