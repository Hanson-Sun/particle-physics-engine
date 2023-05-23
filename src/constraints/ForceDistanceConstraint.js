/**
 * `ForceDistanceConstraint` is a `Constraint` that constrains the distance between two particles.
 * It uses a force-based implementation and can be thought of as a spring between two particles.
 * In general, energy conservation is better at lower stiffness, and it can behave unstable or 
 * energetically inconsistent at higher stiffness.
 */
class ForceDistanceConstraint extends Constraint {
    /**
     * Instantiates new `ForceDistanceConstraint`
     * @param {Particle} c1 - particle 1
     * @param {Particle} c2 - particle 2
     * @param {Number} len - constrained length
     * @param {Number} stiffness - the "spring constant", higher values are more stiff
     * @param {Number} dampening - damping force on constraint, must be greater than 0
     * @param {Number} breakForce - force at which the constraint breaks
     */
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

    /**
     * @override
     * @param {Number} timeStep 
     */
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

        this.c1.pos = this.c1.pos.add(x1);
        //this.c1.vel = this.c1.vel.add(a1.mult(timeStep));
        this.c2.pos = this.c2.pos.add(x2);
        //this.c2.vel = this.c2.vel.add(a2.mult(timeStep));
    }

    /**
     * @override
     * @returns {Vector2D[]}
     */
	vertices() {
        return [this.c1.pos, this.c2.pos];
    }

}