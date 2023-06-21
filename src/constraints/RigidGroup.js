const Vector2D = require("../utils/Vector2D");
const Constraint = require("./Constraint");

/**
 * Rigid body constraint
 * @deprecated
 */
class RigidGroup extends Constraint {
    /**
     * `Constraint` interface cannot be instantiated
     */
    constructor(particles, stiffness = 1) {
        super();
        this.particles = particles;
        this.stiffness = stiffness;
        this.centroid = null;
        this.angularVelocity = 0;
        this.linearVelocity = null;

    }

    findCentroid() {
        this.centroid = new Vector2D(0,0);
        for (let p of this.particles) {
            this.centroid.addTo(p.pos);
        }
        this.centroid.multTo(1/this.particles.length);
    }

    findAngularVelocity() {
        this.angularVelocity = 0;
        for (let p of this.particles) {
            let diff = p.pos.sub(this.centroid);
            let dist = diff.magSqr();
            diff.multTo(1/dist);
            this.angularVelocity += p.vel.cross(diff);
        }
        this.angularVelocity = this.angularVelocity / this.particles.length;
    }

    findLinearVelocity() {
        this.linearVelocity = new Vector2D(0,0);
        for (let p of this.particles) {
            this.linearVelocity.addTo(p.vel);
        }
        this.linearVelocity.multTo(1/this.particles.length);
    }

    /**
     * @override
     * @param {Number} timeStep 
     * @public
     */
    update(timeStep) {
        
    }

    /**
     * @override
     * @param {Number} timeStep 
     */
    applyCorrection(timeStep) {

        this.findCentroid();
        this.findAngularVelocity();
        this.findLinearVelocity();
        for (let p of this.particles) {
            let diff = p.pos.sub(this.centroid);
            let mag = diff.mag();
            diff.normalizeTo();
            let tVel = new Vector2D(diff.y * this.angularVelocity * mag, -diff.x * this.angularVelocity * mag);
            
            let vel = this.linearVelocity.add(tVel);

            vel.multTo(this.stiffness);
            //p.pos.sub(p.vel.mult(timeStep))
            p.vel = vel;

            p.pos = p.prevPos.add(vel.mult(timeStep));
        }
    }

    /**
     * @override
     * @returns {Vector2D[]}
     * @public
     */
    vertices() {
        let vert = [];
        for (let p of this.particles) {
            vert.push(p.pos);
        }
        return vert;
    }

     /**
     * @override
     * @returns {Particle[]}
     * @public
     */
    particles() {
        return this.particles;
    }
}


module.exports = RigidGroup;