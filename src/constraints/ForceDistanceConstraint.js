class ForceDistanceConstraint extends Constraint {
    constructor(c1, c2, len, stiffness, dampening = 0, breakForce = Infinity) {
        super();
        if (c1 === null || c2 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.c2 = c2;
		this.breakForce = breakForce;
		this.dampening = dampening;
        this.stiffness = stiffness;
		this.len = len;
        this.color = "black";
		this.force = new Vector2D(0,0);	
	}

    update(timeStep) {
        let dp = this.c1.pos.sub(this.c2.pos);
        let dpMag = dp.mag();

        let dpUnit = dp.mult(1 / dpMag);
        let dxMag = dpMag - this.len;
        let dv = this.c1.vel.sub(this.c2.vel);
        let damp = this.dampening * dv.dot(dp) / dpMag;

        this.force = dpUnit.mult(-this.stiffness * dxMag - damp);

        const a1 = this.force.mult(1 / this.c1.mass);
        const a2 = this.force.mult(-1 / this.c2.mass);


        let x1 = a1.mult(timeStep * timeStep);
        let x2 = a2.mult(timeStep * timeStep);

        if (!this.c1.isPivot) {
            this.c1.pos = this.c1.pos.add(x1);
        }
        if (!this.c2.isPivot) {
            this.c2.pos = this.c2.pos.add(x2);
        }
    }
}