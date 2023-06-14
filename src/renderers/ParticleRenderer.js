/**
 * 
 */
class ParticleRenderer {
    /**
     * 
     * @param {*} solver 
     * @param {*} context 
     */
    constructor(solver, context) {
        this.solver = solver;
        this.context = context;
    }

    /**
     * 
     */
    renderFrame() {
        for (let p of this.solver.particleList) {
            this.draw(p);
        }
    }

    /**
     * 
     * @param {*} p 
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