const Vector2D = require("../utils/Vector2D");
const Wall = require("./Wall");

/**
 * `WallBoundary` is a simple `Wall` that is comprised of a straight-line between two spatial coordinates. Wall positions
 * are generally meant to be immutable since the normal vector is calculated upon instantiation. However, wall position
 * can be modified with some care.
 */
class WallBoundary extends Wall {

    /**
     * Instantiates new `WallBoundary`
     * @param {*} x1 x-position of first vertex
     * @param {*} y1 y-position of first vertex
     * @param {*} x2 x-position of second vertex
     * @param {*} y2 y-position of second vertex
     * @param {*} width rendered line width of wall (does not effect physics)
     */
    constructor(x1, y1, x2, y2, width=1) {
        super();
        this.p1 = new Vector2D(x1, y1);
        this.p2 = new Vector2D(x2, y2);
        this.direction = this.p1.sub(this.p2);
        this.width = width;
        this.normal = (new Vector2D((y2-y1), -(x2-x1))).normalize();
    }


    /**
     * @override
     * @param {Particle[]} particles 
     * @param {Number} timeStep 
     */
    resolveCollisions(particles, timeStep) {
        for (let particle of particles) {
            let pos = particle.pos;
            let bounciness = particle.bounciness;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }
        
            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();

            if (distance <= particle.radius && lambda < 0) {
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance <= particle.radius && lambda > 1) {
                let diff = pos.sub(this.p2);
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance <= particle.radius) {
                //particle.vel = particle.vel.reflect(this.normal).mult(bounciness);
                //let mag = particle.vel.reflect(this.normal).dot(this.normal);
                //particle.pos = particle.pos.add(this.normal.mult(2 * timeStep * mag * bounciness));
                let mag = particle.vel.reflect(this.normal).sub(particle.vel).mult(timeStep * bounciness);
                particle.pos = particle.pos.add(mag);
            }
        }
    }

    /**
     * @override
     * @param {Particle[]} particles 
     */
    applyCorrection(particles) {
        for (let particle of particles) {
            let pos = particle.pos;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }
        
            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();
            let overlap = distance - particle.radius;

            if (distance < particle.radius && lambda < 0) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            } else if (distance < particle.radius && lambda > 1) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            } else if (distance < particle.radius) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            }
        }
    }

    /**
     * Checks if a Particle is colliding with the Wall
     * @param {Particle} particle 
     * @returns {Boolean} true if particle is colliding with wall
     */
    isCollide(particle) {
        let pos = particle.pos;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }

            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();

            return distance < particle.radius;
    }

    /**
     * @override
     * @returns {[Number, Number]} 
     */
    getHashPos() {
        return [(this.p2.x + this.p1.x) / 2, (this.p2.y + this.p1.y) / 2];
    }

    /**
     * @override
     * @returns {[Number, Number]} 
     */
    getHashDimensions() {
        return [Math.abs(this.p2.x - this.p1.x), Math.abs(this.p2.y - this.p1.y)];
    }

    /**
     * @override
     * @returns {[Vector2D, Vector2D]} 
     */
    vertices() {
        return [this.p1, this.p2];
    }
}

module.exports = WallBoundary;