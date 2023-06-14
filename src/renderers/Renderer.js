const ConstraintRenderer = require("./ConstraintRenderer");
const ParticleRenderer = require("./ParticleRenderer");
const WallRenderer = require("./WallRenderer");

/**
 * 
 */
class Renderer {
    constructor(solver, canvas) {
        this.solver = solver;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.constraintRenderer = new ConstraintRenderer(solver, this.context);
        this.particleRenderer = new ParticleRenderer(solver, this.context);
        this.wallRenderer = new WallRenderer(solver, this.context);
    }

    // call this anytime a new particle is added
    /**
     * 
     * @param {*} list 
     */
    updateRendererParticles(list) {
        this.particleRenderer.particles = list;
    }

    /**
     * 
     * @param {*} context 
     */
    updateContext(context) {
        this.constraintRenderer.context = context;
        this.particleRenderer.context = context;
    }

    /**
     * 
     */
    renderFrame() {
        this.clear();
        this.particleRenderer.renderFrame();
        this.constraintRenderer.renderFrame();
        this.wallRenderer.renderFrame();
    }

    /**
     * 
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Renderer;