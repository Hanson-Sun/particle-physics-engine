/**
 * `PositionDistanceConstraint` is a `Constraint` that 
 */
class PositionDistanceConstraint extends Constraint {
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
        let pos1 = this.c1.pos;
        let pos2 = this.c2.pos;
        let m1 = this.c1.mass;
        let m2 = this.c2.mass;

		let dp = pos2.sub(pos1);
		let dpMag = dp.mag();
		let dpDiff = (dpMag - this.len) * this.stiffness;
		let dpUnit = dp.normalize();

		//let dv = dpUnit.mult(dpDiff / timeStep);
		let dd = dpUnit.mult(dpDiff);
		let disP = dd.mult(1 / (m1 + m2));
		this.force = disP;

		this.c1.pos = pos1.add((disP.mult(m1)));
		//this.c1.vel = this.c1.vel.add(disP.mult(m1 / timeStep));
		this.c2.pos = pos2.sub((disP.mult(m2)));
		//this.c2.vel = this.c2.vel.add(disP.mult(m2 / timeStep));
	}

	vertices() {
        return [this.c1.pos, this.c2.pos];
    }
}