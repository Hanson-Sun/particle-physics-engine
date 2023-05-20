/**
 * `Drag` is a `SelfBehavior` that applies a viscous drag force on the particle itself.
 * It generally follows the circular quadratic drag formula in turbulent fluids. Units are arbitrary and should be tuned experimentally.
 */
class Drag extends SelfBehavior {
	/**
	 * Instantiates new Drag behavior object
	 * @constructor
	 */    
    constructor(viscosity) {
        super();
        this.viscosity = viscosity;
        this.LOWER_LIMIT = 0.01;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
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
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }
}