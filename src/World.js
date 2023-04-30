class World {
    constructor(canvas, width, height, xGrids, yGrids = null, timeStep = 1, iterationPerFrame = 1, constraintIteration = 1) {
        this.timeStep = timeStep;
        this.iterationPerFrame = iterationPerFrame;
        this.constraintIteration = constraintIteration;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.xGrids = xGrids;
        this.yGrids = yGrids;
        this.particles = new SpatialHashGrid(width, height, xGrids, yGrids);
        this.particlesList = [];
        this.constraints = [];
        this.gravity = null;

        this.solver = new Solver(this.timeStep, this.iterationPerFrame, this.constraintIteration, this.particlesList, this.constraints);
        this.renderer = new Renderer(this.solver, this.canvas);
        
    }

    addParticle(p) {
        this.particles.add(p);
        this.updateParticleList();
    }

    addConstraint(c) {
        this.constraints.push(p);
    }

    clearParticles() {
        this.particles = new SpatialHashGrid(this.width, this.height, this.xGrids, this.yGrids);
        this.updateParticleList();
    }

    clearConstraints() {
        this.constraints = [];
        this.updateParticleList();
    }

    // add everyTime the number of particles change.
    updateParticleList() {
        this.particlesList = this.particles.values();
        this.renderer.updateRendererParticles(this.particlesList);
        this.solver.updateSolverParticles(this.particlesList);
    }

    addGlobalBehavior(b) {
        for (let p of this.particlesList) {
            p.addSelfBehavior(b, this.timeStep);
        }
    }

    enableGravity(num) {
        this.gravity = new Vector2D(0, num);
        this.addGlobalBehavior(new Gravity(this.gravity));
    }

    nextFrame() {
        this.solver.nextFrame();
        this.renderer.renderFrame();
    }
}