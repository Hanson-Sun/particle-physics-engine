const ConstraintRenderer = require("./ConstraintRenderer");
const ParticleRenderer = require("./ParticleRenderer");
const WallRenderer = require("./WallRenderer");

/**
 * `Renderer` is the general renderer class that renders `Particle`s, `Constraint`s and `Wall`s. Overall, this is a simplistic renderer
 * intended for quick visualization. It is encouraged to write a custom renderer for more complex/efficient scenes.
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

    /**
     * Updates the particles in the `particleRenderer`. Must be called every time the list of particles is reassigned.
     * @param {Particle[]} list 
     * @public
     */
    updateRendererParticles(list) {
        this.particleRenderer.particles = list;
    }

    /**
     * Updates the HTMLCanvas context of each sub-renderer
     * @param {context} context 
     */
    updateContext(context) {
        this.constraintRenderer.context = context;
        this.particleRenderer.context = context;
        this.WallRenderer.context = context;
    }

    /**
     * Renders a single frame of the solver
     * @public
     */
    renderFrame() {
        this.clear();
        this.particleRenderer.renderFrame();
        this.constraintRenderer.renderFrame();
        this.wallRenderer.renderFrame();
    }

    /**
     * Clears the frame
     * @public
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Renderer;