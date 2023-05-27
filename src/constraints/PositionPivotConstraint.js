/**
 * `PositionPivotConstraint` is a `Constraint` that limits the motion of a particle to a certain length away from a 
 * point in space. The implementation of this constraint is position-based like that of `PositionDistanceConstraint`.
 */
class PositionPivotConstraint extends Constraint {
	/**
	 * Instantiates new `PositionPivotConstraint`
     * @param {Vector2D} pos - position of pivot
     * @param {Particle} c1 - constrained particle
	 * @param {Number} len - constrained length
	 * @param {Number} stiffness - a relaxation parameter that is stable between [0,1] (higher is more stiff)
	 * @param {Number} breakForce - force at which the constraint breaks
	 */
    constructor(pos, c1, len, stiffness, breakForce = Infinity) {
        super();
        if (c1 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.pos = pos;
		this.breakForce = breakForce;
        this.stiffness = stiffness;
		this.len = len;
	}

	/**
     * @override
     * @param {Number} timeStep 
     */
    update(timeStep) {
        let pos1 = this.c1.pos;
        let pos2 = this.pos;

		let dp = pos2.sub(pos1);
		let dpMag = dp.mag();
        if (dpMag != 0) {
            let dpDiff = (dpMag - this.len) * this.stiffness;
            let dpUnit = dp.normalize();
            let dd = dpUnit.mult(dpDiff);
            this.force = dd;

            this.c1.pos = pos1.add(dd);
            //this.c1.vel = this.c1.vel.add(disP.mult(m1 / timeStep));
        }
	}

    /**
     * @override
     * @returns {Vector2D[]}
     */	
	vertices() {
        return [this.c1.pos, this.pos];
    }
}