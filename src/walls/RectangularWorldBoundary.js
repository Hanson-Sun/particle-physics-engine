const Wall = require("./Wall");

/**
 * `RectangularWorldBoundary` is a rectangular bounding box that constrains all particles *within* the boundaries.
 * The implementation uses a strict uni-directional constraint, and particles cannot escape the world boundaries. 
 * Since the boundary is strict, the current implementation checks **all** particles contained in the boundaries, not
 * just particles surrounding the edge.
 */
class RectangularWorldBoundary extends Wall {

    /**
     * 
     * @param {Number} minW left x position (smaller value)
     * @param {Number} maxW right x position (larger value)
     * @param {Number} minH top y position (smaller value)
     * @param {Number} maxH bottom y position (larger value)
     */
    constructor(minW, maxW, minH, maxH) {
        super();
        this.minW = minW;
        this.maxW = maxW;
        this.minH = minH;
        this.maxH = maxH;        
    }

    /**
     * @override
     * @param {Particle[]} particles 
     * @param {Number} timeStep 
     */    
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
                particle.pos.x = posX +  2 * velX * -1 * bounce * timeStep;
            } 

            if (posX < this.minW + radius) {
                particle.vel.x = velX * -1 * bounce;
                particle.pos.x = posX +  2 * velX * -1 * bounce * timeStep;
            } 

            if (posY > this.maxH - radius) {
                particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * velY * -1 * bounce * timeStep;
            } 

            if (posY < this.minH + radius) {
                particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * velY * -1 * bounce * timeStep;
            }
        }
    }

    /**
     * @override
     * @param {Particle[]} particles 
     */
    applyCorrection(particles) {
        for (let particle of particles) {
            const radius = particle.radius;
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

    /**
     * Checks if a Particle is colliding with the Wall
     * @param {Particle} particle 
     * @returns {Boolean} true if particle is colliding with wall
     */
    isCollide(particle) {
        const posX = particle.pos.x;
        const posY = particle.pos.y;
        const radius = particle.radius;
        
        return  (posX >= this.maxW - radius) || (posX <= this.minW + radius) || 
                (posY >= this.maxH - radius) || (posY <= this.minH + radius) || 
                (particle.pos.x >= this.maxW - radius) || (particle.pos.x <= this.minW + radius) || 
                (particle.pos.y >= this.maxH - radius) || (particle.pos.y <= this.minH + radius)
    }

    /**
     * @override
     * @returns {Number[]} 
     */    
    getHashPos() {
        return [(this.maxW + this.minW) / 2, (this.maxH + this.minH) / 2];
    }

    /**
     * @override
     * @returns {Number[]} 
     */
    getHashDimensions() {
        return [this.maxW - this.minW + 1, this.maxH - this.minH + 1];
    }

    /**
     * @override
     * @returns {Vector2D[]} 
     */    
    vertices() {
        return [];
    }
}

module.exports = RectangularWorldBoundary;