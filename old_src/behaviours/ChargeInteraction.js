/**
 * `ChargeInteraction` is a NearBehavior that calculates the charge repulsion/attraction forces between "nearby" particles.
 * It follows Coulomb's law with `k=2`, which is arbitrarily chosen. Although charge interactions have infinite range, the default
 * effective radius for this behavior is set to 100000 pixels. Many charge interactions can lead to instability.
 */
class ChargeInteraction extends NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor(radius=100000) {
        super();
        this.radius = radius;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     * @param {Particle[]} particles 
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
                        
                        //circ.vel = circ.vel.sub(f)
                        circ.pos = circ.pos.sub(f.mult(timeStep / circ.mass));
                        //particle.vel = particle.vel.add(f)
                        particle.pos = particle.pos.add(f.mult(timeStep * timeStep / particle.mass));
                        
                    }
                } 	
		    }
		}
    }

    /**
     * @override
     * @returns {[Number, Number]}
     */
    range() {
        return [this.radius, this.radius];
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     */
    applyCorrection(particle, particles) {
        return;
    }
}