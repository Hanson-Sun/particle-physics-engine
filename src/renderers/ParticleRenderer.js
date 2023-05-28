class ParticleRenderer {

    constructor(particles, context) {
        this.particles = particles;
        this.context = context;
    }

    // call this anytime a new particle is added
    renderFrame() {
        for (let p of this.particles) {
            this.draw(p);
        }
    }

	draw(p) {
		this.context.beginPath();
		this.context.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
		this.context.strokeStyle = p.color;
		this.context.fillStyle = p.color;
		this.context.stroke();
        
	}

}

module.exports = ParticleRenderer;