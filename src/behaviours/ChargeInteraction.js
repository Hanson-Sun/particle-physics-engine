class ChargeInteraction extends NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor(radius=100000) {
        super();
        this.radius = radius;
    }

    /**
     * 
     * @param {Number} timeStep 
     * @param {Array<Particle>} particles 
     */
    applyBehavior(particle, timeStep, particles) {
        if(particle.charge !== 0){
			for (let circ of particles) {
                if (particle !== circ && circ.charge !== 0) {
                    let q1 = particle.charge;
                    let q2 = circ.charge;
                    let x1 = particle.pos;
                    let x2 = circ.pos;
                    let dx = x1.sub(x2);
                    let dxmSqr = dx.magSqr();
                    if (dxmSqr > (particle.radius + circ.radius) * (particle.radius + circ.radius) && dxmSqr < this.radius * this.radius) {
                        let dxNorm = dx.normalize();
                        let f = dxNorm.mult(2 * q1 * q2 / dxmSqr * timeStep);

                        if (!circ.isPivot) {
                            circ.vel = circ.vel.sub(f)
                            circ.pos = circ.pos.sub(f.mult(timeStep / circ.mass));
                        } 
                        if (!particle.isPivot) {
                            particle.vel = particle.vel.add(f)
                            particle.pos = particle.pos.add(f.mult(timeStep * timeStep / particle.mass));
                        }
                    }
                } 	
		    }
		}
    }

	/**
	 * Implementation of range function such that `findNear()` method from `SpatialHashGrid` uses the charge dimensions
	 * @returns null
	 */
    range() {
        return [this.radius, this.radius];
    }

    applyCorrection(particle, particles) {
        return;
    }
}