class Springjoint {
    constructor(list, c1, c2, len, k, dampening, breakforce = Infinity) {
        this.c1 = c1;
        this.c2 = c2;
        this.k = k;
        this.dampening = dampening;
        this.len = len;
        this.force;
        this.breakforce = breakforce
        this.list = list;
        this.list.push(this);
        this.color = "black";
    }

    update() {

        this.a1 = new Vector2D(0, 0);
        this.a2 = new Vector2D(0, 0);
        this.dp = this.c1.pos.sub(this.c2.pos);
        this.dpmag = this.dp.mag();
        this.dpunit = this.dp.mult(1 / this.dpmag);
        this.dxmag = this.dpmag - this.len;
        this.dv = this.c1.vel.sub(this.c2.vel);
        this.damp = this.dampening * this.dv.dot(this.dp) / this.dpmag;
        this.force = this.dpunit.mult(-this.k * this.dxmag - this.damp);


        // if (this.force.magsqr() > this.breakforce * this.breakforce) {
        // 	this.index = this.list.indexOf(this);

        // 	if (this.index > -1) {
        // 		this.list.splice(this.index, 1);
        // 	}
        // }

        this.r = this.force.mag() * 510 / maxforce;
        if (this.r <= 255) {
            this.color = "rgb(" + Math.floor(this.r) + ", 255,0)";
        } else if (this.r <= 510) {
            this.color = "rgb(255," + (510 - Math.floor(this.r)) + ",0)";

        } else {
            this.color = "rgb(255,0,0)";
        }


        this.a1 = this.force.mult(1 / this.c1.mass);
        this.a2 = this.force.mult(-1 / this.c2.mass);


        this.x1 = this.a1.mult(dt * dt);
        this.x2 = this.a2.mult(dt * dt);

        if (!this.c1.ispivot && this.c1 != currentcirc) {
            this.c1.accelerate(this.a1);
            this.c1.pos = this.c1.pos.add(this.x1);
        }
        if (!this.c2.ispivot && this.c2 != currentcirc) {
            this.c2.accelerate(this.a2);
            this.c2.pos = this.c2.pos.add(this.x2);
        }

    }
    draw() {

        c.strokeStyle = this.color;
        c.beginPath();
        c.moveTo(this.c1.pos.x, this.c1.pos.y);
        c.lineTo(this.c2.pos.x, this.c2.pos.y);
        c.stroke();

    }

}