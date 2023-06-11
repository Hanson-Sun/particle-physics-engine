const Constraint = require("./Constraint");
const Particle = require("../core/Particle");
const Vector2D = require("../utils/Vector2D");

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
     * @param {Number} breakForce - force at which the constraint breaks
     * @param {Number} dampening - damping force on constraint, must be greater than 0
     */
    constructor(pos, c1, len, stiffness, breakForce = Infinity, dampening = 0) {
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
        if(dpMag != 0) {
            dp.multTo(1 / dpMag);
            let dxMag = dpMag - this.len;
            let dv = this.c1.vel;
            let damp = this.dampening * dv.dot(dp);

            this.force = dp.mult(-this.stiffness * dxMag - damp);

            const a1 = this.force.mult(1 / this.c1.mass);
            a1.multTo(timeStep * timeStep);

            this.c1.pos.addTo(a1);

        }
    }

    /**
     * @override
     * @returns {Vector2D[]}
     */    
	vertices() {
        return [this.pos, this.c1.pos];
    }

    /**
     * @override
     * @returns {Particle[]}
     */
    particles() {
        return [this.c1];
    }

}

module.exports = ForcePivotConstraint;