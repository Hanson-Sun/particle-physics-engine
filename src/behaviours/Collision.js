
class Collision extends NearBehavior {

    constructor() {
        super();
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep, particles) {
        this.collide(particle, particles);
        this.collideCorrection(particle, particles);
    }

    collide(particle, particles) {
		for (let circ of particles) {
			if (circ != particle) {
                let position = particle.pos;
                let mass = particle.mass;
                let velocity = particle.vel;
                let bounciness = particle.bounciness;
                let radius = particle.radius;
    
                let c_position = circ.pos;
                let c_mass = circ.mass;
                let c_velocity = circ.vel;
                let c_radius = circ.radius;

				let posDiff1 = position.sub(c_position);
				if (posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius)) {

					posDiff1 = position.sub(c_position);
					let posDiffMagSqr = posDiff1.magSqr();
					let massConst1 = 2 * c_mass / (mass + c_mass);
					let vDiff1 = velocity.sub(c_velocity);
					let dot1 = (vDiff1.dot(posDiff1)) / (posDiffMagSqr);

					let massConst2 = 2 * mass / (mass + c_mass);
					let vDiff2 = c_velocity.sub(velocity);
					let posDiff2 = c_position.sub(position);
					let dot2 = (vDiff2.dot(posDiff2)) / (posDiffMagSqr);

					if (circ.isPivot) {
						particle.vel = (velocity.sub(posDiff1.mult(dot1 * 2))).mult(bounciness);
					} else {
						particle.vel = (velocity.sub(posDiff1.mult(dot1 * massConst1))).mult(bounciness);
					}

					if (particle.isPivot) {
						circ.vel = (c_velocity.vel.sub(posDiff2.mult(dot2 * 2))).mult(bounciness);
					} else {
						circ.vel = (c_velocity.vel.sub(posDiff2.mult(dot2 * massConst2))).mult(bounciness);
					}
				}
			}
		}
	}

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
					let direction2 = (position.sub(c_position)).normalize();
					let overlap = radius + c_radius - posDiff1.mag();

					if (particle.isPivot) {
						circ.pos = c_position.sub(direction2.mult(overlap));
					} else {
						circ.pos = c_position.sub(direction2.mult(overlap * mass / (mass + c_mass)));
					}

					if (circ.isPivot) {
						particle.pos = position.sub(direction1.mult(overlap));
					} else {
						particle.pos = position.sub(direction1.mult(overlap * c_mass / (mass + c_mass)));
					}
				}
			}
		}
	}

    range() {
        return null;
    }
}