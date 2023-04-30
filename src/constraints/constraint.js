
class StiffConstraint {
	constructor(list, c1, c2, len, breakforce, dampening, stiffness = 1) {
		this.c1 = c1;
		this.c2 = c2;
		this.breakforce = breakforce;
		this.dampening = dampening;
		this.len = len;
		this.force;
		this.dv;
		this.list = list;
		this.list.push(this);
		this.dd;
		this.color;
		this.stiffness = stiffness
	}


	update() {

		this.dp = this.c2.pos.sub(this.c1.pos);
		this.dpmag = this.dp.mag();
		this.dpdiff = (this.dpmag - this.len) * this.stiffness;
		this.dpunit = this.dp.normalize();


		this.dv = this.dpunit.mult(this.dpdiff / dt);
		this.dd = this.dpunit.mult(this.dpdiff);

		this.force = this.dpdiff;


		if (this.force >= this.breakforce) {
			this.index = this.list.indexOf(this);

			if (this.index > -1) {
				this.list.splice(this.index, 1);
			}
		}

		this.r = this.force * 510 / maxforce;
		if (this.r <= 255) {
			this.color = "rgb(" + Math.floor(this.r) + ", 255,0)";
		} else if (this.r <= 510) {
			this.color = "rgb(255," + (510 - Math.floor(this.r)) + ",0)";

		} else {
			this.color = "rgb(255,0,0)";
		}


		let disp = this.dd.mult(1 / (this.c1.mass + this.c2.mass));

		if (!this.c1.ispivot) {

			//this.c1.vel = this.c1.vel.add(disp.mult(this.c1.mass / timestep))
			this.c1.pos = this.c1.pos.add((disp.mult(this.c1.mass)))

		} if (!this.c2.ispivot) {

			//this.c2.vel = this.c2.vel.sub(disp.mult(this.c2.mass / timestep))
			this.c2.pos = this.c2.pos.sub((disp.mult(this.c2.mass)))
		}

	}

}