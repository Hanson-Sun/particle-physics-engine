
class Collision extends NearBehavior {

	/**
	 * Instantiates new Collision behavior object
	 * @constructor
	 */
    constructor() {
        super();
    }

	/**
	 * Applies collision behavior on a given particle.
	 * @param {*} particle - particle with collision check
	 * @param {*} timeStep - time-step of simulation
	 * @param {*} particles - nearby particles that interact with `particle`
	 */
    applyBehavior(particle, timeStep, particles) {
        this.collide(particle, particles, timeStep);
    }

	/**
	 * Applies position correction on behavior.
	 * @param {Particle} particle 
	 * @param {Particle[]} particles 
	 */
	applyCorrection(particle, particles) {
        this.collideCorrection(particle, particles);
    }

	/**
	 * Perform the collision update of a `Particle` by calculating impulse based velocity and position changes. 
	 * 
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 * @param {Number} timeStep 
	 */
	collide(particle, particles, timeStep) {
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

				let posDiff1 = position.sub(c_position);
				if (posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius)) {
					let posDiffMagSqr = posDiff1.magSqr();
					let massConst1 = 2 * c_mass / (mass + c_mass);
					let vDiff1 = velocity.sub(c_velocity);
					let dot1 = (vDiff1.dot(posDiff1)) / (posDiffMagSqr);

					let massConst2 = 2 * mass / (mass + c_mass);
					let vDiff2 = c_velocity.sub(velocity);
					let posDiff2 = c_position.sub(position);
					let dot2 = (vDiff2.dot(posDiff2)) / (posDiffMagSqr);
					impulse = impulse.add(posDiff1.mult(dot1 * massConst1));
					// idk why this works tbh but it just does
					circ.vel = (c_velocity.sub(posDiff2.mult(dot2 * massConst2)));
					circ.pos = circ.pos.sub(posDiff2.mult(dot2 * massConst2 * bounciness * timeStep));
				}
			}
		}

		particle.vel = velocity.sub(impulse);
		particle.pos = position.sub(impulse.mult(timeStep));
	}

	/**
	 * Performs the position-based correction after impulse collision. This ensures that particles are not stuck within each other.
	 * 
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 */
	collideCorrection(particle, particles) {
		for (let circ of particles) {
			if (circ != particle) {
                let position = particle.pos;
                let mass = particle.mass;
                let radius = particle.radius;

                let c_position = circ.pos;
                let c_mass = circ.mass;
                let c_radius = circ.radius;

				let posDiff1 = position.sub(c_position);
				if (posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius)) {
					let direction1 = (c_position.sub(position)).normalize();
					let overlap = radius + c_radius - posDiff1.mag();

					if (circ.isPivot) {
						particle.pos = position.sub(direction1.mult(overlap));
					} else {
						particle.pos = position.sub(direction1.mult(overlap * c_mass / (mass + c_mass)));
					}
				}
			}
		}
	}

	/**
	 * Implementation of range function such that `findNear()` method from `SpatialHashGrid` uses default hash dimensions
	 * @returns null
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
	isCollide(p1, p2) {
		let position = p1.pos;
		let radius = p1.radius;
		let c_position = p2.pos;
		let c_radius = p2.radius;
		let posDiff1 = position.sub(c_position);
		return posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius);
	}


}