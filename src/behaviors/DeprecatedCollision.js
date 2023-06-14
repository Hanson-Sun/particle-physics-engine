/**
 * A deprecated collision class that does not work.
 * @deprecated
 */
class Collision extends NearBehavior {

    constructor() {
        super();
    }

    applyBehavior(particle, timeStep, particles) {
        this.collide(particle, particles, timeStep);
        this.collideCorrection(particle, particles);
    }

	collide(particle, particles, timeStep) {
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

					// a constant 2 is required for some reason, but it wont work if added anywhere else
					if (circ.isPivot) {
						particle.vel = (velocity.sub(posDiff1.mult(dot1 * 2))).mult(bounciness);
						particle.pos = particle.pos.add(posDiff1.mult(dot1 * 2).mult(bounciness * timeStep * 2));
					} else {
						particle.vel = (velocity.sub(posDiff1.mult(dot1 * massConst1))).mult(bounciness);
						particle.pos = particle.pos.add(posDiff1.mult(dot1 * massConst1).mult(bounciness * timeStep * 2));
					}

					if (particle.isPivot) {
						circ.vel = (c_velocity.sub(posDiff2.mult(dot2 * 2))).mult(bounciness);
						circ.pos = circ.pos.add(posDiff2.mult(dot2 * 2).mult(bounciness * timeStep));
					} else {
						circ.vel = (c_velocity.sub(posDiff2.mult(dot2 * massConst2))).mult(bounciness);
						circ.pos = circ.pos.add(posDiff2.mult(dot2 * massConst2).mult(bounciness * timeStep));
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

    RANGE() {
        return null;
    }


}