/**
 * 
 */
class WallBoundary extends Wall {

    constructor(x1, y1, x2, y2, width=1) {
        super();
        this.p1 = new Vector2D(x1, y1);
        this.p2 = new Vector2D(x2, y2);
        this.width = width;
        this.normal = (new Vector2D((y2-y1), -(x2-x1))).normalize();
    }

    resolveCollisions(particles, timeStep) {
        this.collide(particles, timeStep);
    }

    applyCorrection(particles) {
        this.collideCorrect(particles);
    }

    collide(particles, timeStep) {
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

            if (distance < particle.radius && lambda < 0) {
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance < particle.radius && lambda > 1) {
                let diff = pos.sub(this.p2);
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance < particle.radius) {
                //particle.vel = particle.vel.reflect(this.normal).mult(bounciness);
                let mag = particle.vel.reflect(this.normal).dot(this.normal);
                particle.pos = particle.pos.add(this.normal.mult(2 * timeStep * mag * bounciness));
            }
        }
    }

    collideCorrect(particles) {
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
                particle.pos = particle.pos.sub(this.normal.mult(overlap));
            }
        }
    }

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


    getHashPos() {
        return [(this.p2.x + this.p1.x) / 2, (this.p2.y + this.p1.y) / 2];
    }

    getHashDimensions() {
        return [Math.abs(this.p2.x - this.p1.x), Math.abs(this.p2.y - this.p1.y)];
    }

    vertices() {
        return [this.p1, this.p2];
    }
}