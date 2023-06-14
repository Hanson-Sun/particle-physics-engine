const NearBehavior = require("./NearBehavior");

/**
 * `Collision` is a `NearBehavior` that calculates collision interactions between a particle and its nearby particles using softer penalty forces.
 * Collisions are basically spring constraints between particles when they collide. High stiffness values can lead to energy inconsistency, whereas 
 * lower stiffness can cause poor colliding behavior between particles. Overall, this method is more stable in high density stacking simulations, 
 * but performs worse in more dynamic scenarios.
 * @extends {NearBehavior}
 */
class PenaltyCollision extends NearBehavior {

	/**
	 * Instantiates new PenaltyCollision behavior object
	 * @constructor
	 */
    constructor(stiffness) {
        super();
        this.stiffness = stiffness;
    }

	/**
	 * Perform the collision update of a `Particle` by calculating impulse based velocity and position changes. 
     * @override
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 * @param {Number} timeStep 
	 */
	applyBehavior(particle, timeStep, particles) {
		let impulse = new Vector2D(0,0);
		let position = particle.pos;
		let mass = particle.mass;
		let velocity = particle.vel;
		let bounciness = particle.bounciness;
		let radius = particle.radius;

		for (let circ of particles) {
			if (circ != particle) {
                let c_position = circ.pos;
                let c_mass = circ.mass;
                let c_velocity = circ.vel;
                let c_radius = circ.radius;

				let dp = position.sub(c_position);
				let posDiffMagSqr = dp.magSqr();
				if (posDiffMagSqr < (radius + c_radius) * (radius + c_radius)) {
                    let dpMag = dp.mag();
                    dp.multTo(1 / dpMag);
                    let dxMag = radius + c_radius - dpMag;
                    let force = dp.mult(-this.stiffness * dxMag);
            
                    const a1 = force.mult(1 / c_mass);
                    const a2 = force.mult(1 / mass);
            
                    a1.multTo(timeStep * timeStep);
                    a2.multTo(timeStep * timeStep);

					impulse.addTo(a2);
					circ.pos.addTo(a1);
				}
			}
		}
		//velocity.subTo(impulse.mult(bounciness));
		position.subTo(impulse.mult(bounciness));
	}

	/**
	 * Does not do anything
     * @override
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 */
	applyCorrection(particle, particles) {
        return;
	}

   	/**
     * @override
     * @returns {null}
     */
    range() {
        return null;
    }

	/**
	 * A static method that checks whether two particles are colliding
	 * @param {Particle} p1 
	 * @param {Particle} p2 
	 * @returns boolean
	 * @static
	 */
	static isCollide(p1, p2) {
		let position = p1.pos;
		let radius = p1.radius;
		let c_position = p2.pos;
		let c_radius = p2.radius;
		let posDiff1 = position.sub(c_position);
		return posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius);
	}
}

module.exports = PenaltyCollision;