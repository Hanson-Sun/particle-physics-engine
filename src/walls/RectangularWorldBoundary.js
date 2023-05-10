// stand-in until i figure out how to implement the other walls.
class RectangularWorldBoundary extends Wall {

    constructor(minW, maxW, minH, maxH) {
        super();
        this.minW = minW;
        this.maxW = maxW;
        this.minH = minH;
        this.maxH = maxH;        
    }

    resolveCollisions(particles, timeStep) {
        for (let particle of particles) {
            const posX = particle.pos.x;
            const posY = particle.pos.y;
            const radius = particle.radius;
            const bounce = particle.bounciness;
            const velX = particle.vel.x;
            const velY = particle.vel.y;
            
            if (posX > this.maxW - radius) {
                particle.vel.x = velX * -1 * bounce;
                particle.pos.x = posX +  2 * particle.vel.x * timeStep;
            } 

            if (posX < this.minW + radius) {
                particle.vel.x = velX * -1 * bounce;
                particle.pos.x = posX +  2 * particle.vel.x * timeStep;
            } 

            if (posY > this.maxH - radius) {
                particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * particle.vel.y * timeStep;
            } 

            if (posY < this.minH + radius) {
                particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * particle.vel.y * timeStep;
            }

            if (particle.pos.x > this.maxW - radius) {
                particle.pos.x = this.maxW - radius;
            }

            if (particle.pos.x < this.minW + radius) {
                particle.pos.x = this.minW + radius;
            }

            if (particle.pos.y > this.maxH - radius) {
                particle.pos.y = this.maxH - radius;
            }

            if (particle.pos.y < this.minH + radius) {
                particle.pos.y = this.minH + radius;
            }
        }
    }

    applyCorrection(particles) {
        for (let particle of particles) {
            const radius = particle.radius;
            if (particle.pos.x >= this.maxW - radius) {
                particle.pos.x = this.maxW - radius;
            }

            if (particle.pos.x <= this.minW + radius) {
                particle.pos.x = this.minW + radius;
            }

            if (particle.pos.y >= this.maxH - radius) {
                particle.pos.y = this.maxH - radius;
            }

            if (particle.pos.y <= this.minH + radius) {
                particle.pos.y = this.minH + radius;
            }
        }
    }

    isCollide(particle) {
        const posX = particle.pos.x;
        const posY = particle.pos.y;
        const radius = particle.radius;
        
        if ((posX >= this.maxW - radius) || (posX <= this.minW + radius) || 
            (posY >= this.maxH - radius) || (posY <= this.minH + radius) || 
            (particle.pos.x >= this.maxW - radius) || (particle.pos.x <= this.minW + radius) || 
            (particle.pos.y >= this.maxH - radius) || (particle.pos.y <= this.minH + radius)) {
            return true;
        } 
        return false;
    }

    getHashPos() {
        return [(this.maxW + this.minW) / 2, (this.maxH + this.minH) / 2];
    }

    getHashDimensions() {
        return [this.maxW - this.minW, this.maxH - this.minH];
    }

    vertices() {
        return [];
    }
}