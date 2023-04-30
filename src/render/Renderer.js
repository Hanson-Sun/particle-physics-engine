class Renderer {

    constructor(solver, canvas) {
        this.solver = solver;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.constraintRenderer = new ConstraintRenderer(solver.constraints, this.context);
        this.particleRenderer = new ParticleRenderer(solver.particles.values(), this.context);
    }

    // call this anytime a new particle is added
    updateRendererParticles(list) {
        this.particleRenderer.particles = list;
    }

    updateContext(context) {
        this.constraintRenderer.context = context;
        this.particleRenderer.context = context;
    }

    renderFrame() {
        this.clear();
        this.particleRenderer.renderFrame();
        this.constraintRenderer.renderFrame();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}