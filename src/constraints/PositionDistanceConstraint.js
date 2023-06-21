const Constraint = require("./Constraint");
const Particle = require("../core/Particle");
const Vector2D = require("../utils/Vector2D");

/**
 * `PositionDistanceConstraint` is a `Constraint` that constrains the distance between two particles using a purely position-based method.
 * This implementation is more energetically stable; however, it is also less energy conservative and cannot be affected by damping. 
 * The stiffness parameters are closer to a relaxation factor in [0,1]. Similar to other constraints, the stiffer this constraint, 
 * the less energy conservative it becomes. There is no "force" attached to this type of constraint, so a pseudo-force value is arbitrary
 * calculated for any force based analysis.
 * @extends {Constraint}
 */
class PositionDistanceConstraint extends Constraint {
	/**
	 * Instantiates new `PositionDistanceConstraint`
     * @param {Particle} c1 - particle 1
     * @param {Particle} c2 - particle 2
	 * @param {Number} len - constrained length
	 * @param {Number} stiffness - a relaxation parameter that is stable between [0,1] (higher is more stiff)
	 * @param {Number} breakForce - force at which the constraint breaks
     * @constructor
	 */
    constructor(c1, c2, len, stiffness, breakForce = Infinity) {
        super();
        if (c1 === null || c2 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.c2 = c2;
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
        let pos2 = this.c2.pos;
        let m1 = this.c1.mass;
        let m2 = this.c2.mass;

		let dp = pos2.sub(pos1);
		let dpMag = dp.mag();
		let dpDiff = (dpMag - this.len) * this.stiffness;
		dp.normalizeTo();
		dp.multTo(dpDiff);
		dp.multTo(1 / (m1 + m2));

        // force values are made up
		this.force = dp.mult((m1 + m2) * (m1 + m2) * 100 * this.stiffness);

		pos1.addTo(dp.mult(m1));
		//this.c1.vel = this.c1.vel.add(disP.mult(m1 / timeStep));
		pos2.subTo(dp.mult(m2));
		//this.c2.vel = this.c2.vel.add(disP.mult(m2 / timeStep));
	}

    /**
     * @override
     * @returns {Vector2D[]}
     */	
	vertices() {
        return [this.c1.pos, this.c2.pos];
    }

    /**
     * @override
     * @returns {Particle[]}
     */
    particles() {
        return [this.c1, this.c2];
    }

    /**
     * @override
     * @param {Number} timeStep 
     */
    applyCorrection(timeStep) {
        return;
    }    
}

module.exports = PositionDistanceConstraint;