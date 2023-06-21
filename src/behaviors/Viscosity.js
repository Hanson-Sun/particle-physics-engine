const NearBehavior = require("./NearBehavior");
const Vector2D = require("../utils/Vector2D");

/**
 * `Viscosity` is a `NearBehavior` that adds a a viscous drag effect on a particle. Viscosity applies an impulse opposing movement 
 * determined by the relative speed between particles and a set of drag coefficients. Tis is intended to be used in conjunction with the 
 * `Pressure` behavior and both are position-based paradigms of SPH simulations. 
 * 
 * Note: this behavior can become unstable at high coefficient values. It is important to keep the relative velocity between particles low
 * and avoid rapid impulses.
 * @extends {NearBehavior}
 */
class Viscosity extends NearBehavior {

    /**
     * Instantiates new `Viscosity` object
     * @param {Number} radius 
     * @param {Number} linearCoeff the coefficient of linear drag, dominant at lower speeds (recommend [0, 1])
     * @param {Number} QuadraticCoeff the coefficient of quadratic drag, dominant at higher speeds (recommend [0, 1])
     * @param {Number} maxU maximum impulse correction value, constraining it can increase stability
     */
    constructor(radius, linearCoeff, QuadraticCoeff, maxU = Infinity) {
        super();
        this.hasCorrection = false;
        this.radius = radius;
        this.linearCoeff = linearCoeff;
        this.QuadraticCoeff = QuadraticCoeff;
        this.maxU = maxU;

    }

	/**
	 * @override
	 * @param {Particle} particle
	 * @param {Particle[]} particles 
	 * @param {Number} timeStep 
     * @public
	 */
	applyBehavior(particle, timeStep, particles) {
        let mass = particle.mass;
        let impulse = new Vector2D(0,0);
        for (let p of particles) {
            if (p !== particle) {
                let diff = p.pos.sub(particle.pos)
                let mag = diff.mag();
                let q = mag/this.radius;
                if (q < 1) {
                    diff.normalizeTo();
                    let u = (p.vel.sub(particle.vel)).dot(diff);
                    if (u > 0 && u < this.maxU) {
                        diff.multTo(timeStep * (1 - q) * (this.linearCoeff * u + this.QuadraticCoeff * u * u));
                        p.vel.subTo(diff.mult(mass/(mass + p.mass)));
                        p.pos.subTo(diff.mult(mass/(mass + p.mass) * timeStep));

                        impulse.addTo(diff.mult(p.mass/(mass + p.mass)));
                    }
                }
            }
        }

        particle.vel.addTo(impulse);
        particle.pos.addTo(impulse.mult(timeStep));
	}

	/**
     * This class does not require final position corrections
	 * @override
	 * @param {Particle} particle 
	 * @param {Particle[]} particles 
     * @public
	 */
	applyCorrection(particle, particles) {
        return;
	}


   	/**
     * @override
     * @returns {null}
     * @public
     */
    range() {
        return [this.radius * 2, this.radius * 2];
    }
}

module.exports = Viscosity;