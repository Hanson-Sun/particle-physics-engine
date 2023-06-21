const NearBehavior = require("./NearBehavior");
const Vector2D = require("../utils/Vector2D");

/**
 * `Pressure` is a `NearBehavior` that simulates pressure behavior between particles. Pressure relaxation is a fundamental step for modelling
 * particle-based fluid behavior. The implementation uses a double-density relaxation algorithm based on the common SPH paradigm from the paper
 * "Particle-based Viscoelastic Fluid Simulation" by Clavet. The pressure relaxation algorithm loses energy overtime at a rate depending on the scaling factors.
 * Note that the size of the effective radius will effect the rest density as well as the emergent interactions from this behavior; 
 * larger values have pronounced surface tension effects. Moreover, `pScale` alters the long range pressure reactions, while `pScaleNear` determines the 
 * "stiffness" of the particle system. The user is encouraged to test out different constants for specific effects.
 * @extends {NearBehavior}
 */
class Pressure extends NearBehavior {

    /**
	 * Instantiates new `Pressure` behavior object
	 * @constructor
     * @param {Number} radius effective radius, determines the area of which density is sampled from 
     * @param {Number} pScale pressure relaxation scaling constant
     * @param {Number} restDensity target resting density (there are no units, its an approximate value)
     * @param {Number} pScaleNear near pressure relaxation scaling constant
     * @param {Boolean} nearRepulsion whether near pressure repulsion is active (true by default)
     */
    constructor(radius, pScale, restDensity, pScaleNear=0, nearRepulsion=true) {
        super();
        this.hasCorrection = false;
        this.radius = radius;
        this.restDensity = restDensity;
        this.pScale = pScale;
        this.pScaleNear = pScaleNear;
        this.nearRepulsion = nearRepulsion;  
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
        let nearDensity = 0;
        for (let p of particles) {
            if (p !== particle) {
                let diff = particle.pos.sub(p.pos).mag();
                if (diff <= this.radius) {
                    let q = (1-diff/this.radius);
                    density = density + q * q;
                    nearDensity = nearDensity + q * q * q;
                }
            }
        }
        return [density, nearDensity];
    }


	/**
	 * Calculates and applies the pressure relaxation
	 * @override
	 * @param {Particle} particle
	 * @param {Particle[]} particles 
	 * @param {Number} timeStep 
     * @public
	 */
	applyBehavior(particle, timeStep, particles) {
        let mass = particle.mass;
        let [density, nearDensity] = this.findDensity(particle, particles);

        let pressure = 0;
        if (this.nearRepulsion) {
            pressure = this.pScale * (density - this.restDensity);
        } else {
            pressure = Math.max(this.pScale * (density - this.restDensity), 0);
        }

        let nearPressure = this.pScaleNear * nearDensity;

        let dx = new Vector2D(0,0);
        for (let p of particles) {
            if (p !== particle) {
                let diff = p.pos.sub(particle.pos);
                let diffMag = diff.mag();
                if (diffMag <= this.radius) {
                    let q = (1 - diffMag/this.radius);
                    let d = timeStep * timeStep * (pressure * q + nearPressure * q * q);
                    
                    diff.normalizeTo();
                    
                    p.pos.addTo(diff.mult(mass/(mass + p.mass) * d));
                    dx.subTo(diff.mult(p.mass/(mass + p.mass) * d));
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

module.exports = Pressure;