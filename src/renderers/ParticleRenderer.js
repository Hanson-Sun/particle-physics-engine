/**
 * `ParticleRenderer` is a simple renderer that renders `Particle`s of a `Solver`. Each particle is represented by a circle with a thin outline. 
 * This is a basic renderer intended for quick visualization.
 */
class ParticleRenderer {
    /**
     * @param {Solver} solver 
     * @param {context} context 
     * @constructor
     */
    constructor(solver, context) {
        this.solver = solver;
        this.context = context;
    }

    /**
     * Renders the particles per frame
     * @public 
     */
    renderFrame() {
        for (let p of this.solver.particleList) {
            this.draw(p);
        }
    }

    /**
     * Renders a single particle
     * @param {Particle} p 
     * @public
     */
	draw(p) {
        if (p.radius > 0.5) {
            this.context.beginPath();
            this.context.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
            this.context.strokeStyle = p.color;
            this.context.fillStyle = p.color;
            this.context.stroke();
        }
        
	}

}

module.exports = ParticleRenderer;