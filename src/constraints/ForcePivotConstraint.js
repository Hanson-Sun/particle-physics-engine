class ForcePivotConstraint extends Constraint {
    constructor(pos, c1, len, stiffness, dampening = 0, breakForce = Infinity) {
        super();
        if (c1 === null) {
            throw new Error("One of the particles is null!");
        }
		this.pos = pos;
		this.c1 = c1;
		this.breakForce = breakForce;
		this.dampening = dampening;
        this.stiffness = stiffness;
		this.len = len;
        this.color = "black";
		this.force = new Vector2D(0,0);	
	}

    update(timeStep) {
        let dp = this.c1.pos.sub(this.pos);
        let dpMag = dp.mag();
        if(dp.mag() != 0) {
            let dpUnit = dp.mult(1 / dpMag);
            let dxMag = dpMag - this.len;
            let dv = this.c1.vel;
            let damp = this.dampening * dv.dot(dp) / dpMag;

            this.force = dpUnit.mult(-this.stiffness * dxMag - damp);

            const a1 = this.force.mult(1 / this.c1.mass);
            let x1 = a1.mult(timeStep * timeStep);

            this.c1.pos = this.c1.pos.add(x1);

        }
    }

	vertices() {
        return [this.pos, this.c1.pos];
    }

}