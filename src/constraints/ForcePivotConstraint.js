/**
 * `ForcePivotConstraint` is a `Constraint` that limits the motion of a particle to a certain length away from a 
 * point in space. The implementation of this constraint is force-based like that of `ForceDistanceConstraint`.
 */
class ForcePivotConstraint extends Constraint {
    /**
     * Instantiates new `ForcePivotConstraint`
     * @param {Vector2D} pos - position of pivot
     * @param {Particle} c1 - constrained particle
     * @param {Number} len - constrained length
     * @param {Number} stiffness - the "spring constant", higher values are more stiff
     * @param {Number} dampening - damping force on constraint, must be greater than 0
     * @param {Number} breakForce - force at which the constraint breaks
     */
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

    /**
     * @override
     * @param {Number} timeStep 
     */
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

    /**
     * @override
     * @returns {Vector2D[]}
     */    
	vertices() {
        return [this.pos, this.c1.pos];
    }

}