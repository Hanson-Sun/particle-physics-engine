class circle {
	constructor(list, pos, vel, mass, charge, radius, bouncyness, color, ispivot = false) {
		this.list = list;
		this.list.push(this);
		this.charge = charge;
		this.pos = pos;
		this.vel = vel;
		this.mass = mass;
		this.radius = radius;
		this.bouncyness = bouncyness;
		this.color = color;
		this.prevpos = this.pos;
		this.futurepos = new Vector2D(0, 0)
		this.force = new Vector2D(0, 0);
		this.ispivot = ispivot;
		if (this.ispivot == true) {
			this.mass = 0;
		}

		if (this.charge < 0) {
			this.color = "red";
		} else if (this.charge > 0) {
			this.color = "blue";
		} else {
			this.color = color;
		}
		this.c = canvas.getContext("2d");
	}

	velocity(v) {
		this.pos = this.pos.add(v.mult(timestep));
		//this.pos.x = this.pos.x + v.x * timestep
		//this.pos.y = this.pos.y + v.y * timestep
	}

	accelerate(a) {
		this.vel = this.vel.add(a.mult(timestep));
		// this.vel.x = this.vel.x + a.x * timestep;
		// this.vel.y = this.vel.y + a.y * timestep;
	}


	edgeDetect() {
		if (this.pos.x >= canvas.width - this.radius) {

			this.vel.x *= -1 * this.bouncyness;
			//this.pos.x = this.pos.x + this.vel.x * timestep;

		} if (this.pos.x <= this.radius) {

			this.vel.x *= -1 * this.bouncyness;
			//this.pos.x = this.pos.x + this.vel.x * timestep;


		} if (this.pos.y >= canvas.height - this.radius) {

			this.vel.y *= -1 * this.bouncyness;
			//this.pos.y = this.pos.y + this.vel.y * timestep;

		} if (this.pos.y <= this.radius) {

			this.vel.y *= -1 * this.bouncyness;
			//this.pos.y = this.pos.y + this.vel.y * timestep;
		}
	}


	edgeDetectPosition() {
		if (this.pos.x >= canvas.width - this.radius) {
			this.pos.x = canvas.width - this.radius;



		} if (this.pos.x <= this.radius) {
			this.pos.x = this.radius;


		} if (this.pos.y >= canvas.height - this.radius) {
			this.pos.y = canvas.height - this.radius;


		} if (this.pos.y <= this.radius) {
			this.pos.y = this.radius;

		}

	}

	drag() {
		if (this.vel.x && this.vel.y && visc != 0) {
			this.dragc = 0.0001 * (Math.PI * visc * this.radius) / this.mass;
			this.vnormal = this.vel.normalize();
			this.vmagsqr = this.vel.magsqr();
			this.fdrag = this.vnormal.mult((this.vmagsqr) * -this.dragc);
			this.force = this.force.add(this.fdrag);
			this.vel = this.vel.add(this.force.mult(timestep));
		}
	}


	collide() {
		for (var circ of this.list) {
			if (circ != this) {
				this.posdiff1 = this.pos.sub(circ.pos);
				if (this.posdiff1.magsqr() < (this.radius + circ.radius) * (this.radius + circ.radius)) {
					this.direction1 = (circ.pos.sub(this.pos)).normalize();
					this.direction2 = (this.pos.sub(circ.pos)).normalize();
					this.overlap = this.radius + circ.radius - this.posdiff1.mag();

					this.posdiff1 = this.pos.sub(circ.pos);

					this.posdiffmagsqr = this.posdiff1.magsqr();

					this.massconst1 = 2 * circ.mass / (this.mass + circ.mass);
					this.vdiff1 = this.vel.sub(circ.vel);
					this.dot1 = (this.vdiff1.dot(this.posdiff1)) / (this.posdiffmagsqr);

					this.massconst2 = 2 * this.mass / (this.mass + circ.mass);
					this.vdiff2 = circ.vel.sub(this.vel);
					this.posdiff2 = circ.pos.sub(this.pos);
					this.dot2 = (this.vdiff2.dot(this.posdiff2)) / (this.posdiffmagsqr);

					//this.pos = this.pos.sub(this.direction1.mult(this.overlap * circ.mass / (this.mass + circ.mass)));
					//circ.pos = circ.pos.sub(this.direction2.mult(this.overlap * this.mass / (this.mass + circ.mass)));


					if (circ.ispivot) {
						this.vel = (this.vel.sub(this.posdiff1.mult(this.dot1 * 2))).mult(this.bouncyness);
					} else {
						this.vel = (this.vel.sub(this.posdiff1.mult(this.dot1 * this.massconst1))).mult(this.bouncyness);
					}

					if (this.ispivot) {
						circ.vel = (circ.vel.sub(this.posdiff2.mult(this.dot2 * 2))).mult(this.bouncyness);
					} else {
						circ.vel = (circ.vel.sub(this.posdiff2.mult(this.dot2 * this.massconst2))).mult(this.bouncyness);
					}


					//this.velocity(this.vel);
					//circ.velocity(circ.vel);

				}
			}
		}
	}

	collidecorrect() {
		for (var circ of this.list) {
			if (circ != this) {
				this.posdiff1 = this.pos.sub(circ.pos);
				if (this.posdiff1.magsqr() < (this.radius + circ.radius) * (this.radius + circ.radius)) {
					this.direction1 = (circ.pos.sub(this.pos)).normalize();
					this.direction2 = (this.pos.sub(circ.pos)).normalize();
					this.overlap = this.radius + circ.radius - this.posdiff1.mag();

					if (this.ispivot) {

						circ.pos = circ.pos.sub(this.direction2.mult(this.overlap));
					} else {
						circ.pos = circ.pos.sub(this.direction2.mult(this.overlap * this.mass / (this.mass + circ.mass)));
					}

					if (circ.ispivot) {
						this.pos = this.pos.sub(this.direction1.mult(this.overlap));
					} else {
						this.pos = this.pos.sub(this.direction1.mult(this.overlap * circ.mass / (this.mass + circ.mass)));
					}

				}
			}
		}
	}

	draw() {
		this.c.beginPath();
		this.c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
		this.c.strokeStyle = this.color;
		this.c.fillStyle = this.color;
		//this.c.fill();
		this.c.stroke();
	}


}
