const NearBehavior = require("./NearBehavior");
const Vector2D = require("../utils/Vector2D");

/**
 * `PowderForce` is a `NearBehavior` that models the interaction between particles that are rigidly constrained (like a fine powder). It is a stiff deviation of 
 * `Pressure` behavior that directly applies a corrective impulse to maintain a target rest density. The idea for this behavior is inspired from the liquidFun engine.
 * To simulate collision-like behavior, make the radius twice the size of the particle radius, and tune scaling and density values to fit to the collision stiffness.
 * For more information on how this behavior works, go to the documentation for `Pressure`. This behavior can be used in conjunction with viscosity (0 quadratic drag) to 
 * simulate sliding friction.
 * @extends {NearBehavior}
 */
class PowderForce extends NearBehavior {

    /**
	 * Instantiates new `PowderForce` behavior object
	 * @constructor
     * @param {Number} radius effective radius, determines the area of which density is sampled from 
     * @param {Number} pScale density relaxation scaling constant
     * @param {Number} restDensity target resting density (there are no units, its an approximate value)
     */
    constructor(radius, pScale, restDensity) {
        super();
        this.hasCorrection = false;
        this.radius = radius;
        this.restDensity = restDensity;
        this.pScale = pScale;
    }

    /**
     * Calculates the approximate density within the effective radius of the particle
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     * @returns {Number[]} an array of 2 numbers, `[density, nearDensity]`
     * @public
     */
    findDensity(particle, particles) {
        let density = 0;
        for (let p of particles) {
            if (p !== particle) {
                let diff = particle.pos.sub(p.pos).mag();
                if (diff <= this.radius) {
                    let q = (1-diff/this.radius);
                    density = density + q * q;
                }
            }
        }
        return density;
    }


	/**
	 * Calculates and applies the powder force relaxation
	 * @override
	 * @param {Particle} particle
	 * @param {Particle[]} particles 
	 * @param {Number} timeStep 
     * @public
	 */
	applyBehavior(particle, timeStep, particles) {
        let mass = particle.mass;
        let density = this.findDensity(particle, particles);
        let pressure = Math.max(0, this.pScale * (density - this.restDensity));

        let dx = new Vector2D(0,0);
        for (let p of particles) {
            if (p !== particle) {
                let diff = p.pos.sub(particle.pos);
                let diffMag = diff.mag();
                if (diffMag <= this.radius) {
                    diff.normalizeTo();
                    p.pos.addTo(diff.mult(mass/(mass + p.mass) * pressure * timeStep * timeStep));
                    dx.subTo(diff.mult(p.mass/(mass + p.mass) * pressure * timeStep * timeStep));
                }      
            }
        }
        particle.pos.addTo(dx);
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

module.exports = PowderForce;