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
        this.gravity = null;

        this.particles = new SpatialHashGrid(width, height, xGrids, yGrids);
        this.particlesList = [];
        this.constraints = [];
        this.walls = [];
        
        this.solver = new Solver(this.timeStep, this.iterationPerFrame, this.constraintIteration, this.particles, this.constraints, this.walls);
        this.renderer = new Renderer(this.solver, this.canvas);
    }

    addParticle(p) {
        this.particles.add(p);
        this.updateParticleList();
    }

    addConstraint(c) {
        this.constraints.push(c);
    }

    addWall(w) {
        this.walls.push(w);
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
        this.solver.updateSolverParticles();
    }

    addGlobalBehavior(b) {
        for (let p of this.particlesList) {
            p.addSelfBehavior(b);
        }
    }

    removeGlobalBehavior(b) {
        for (let p of this.particlesList) {
            p.removeSelfBehavior(b);
        }
    }

    addGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.addNearBehavior(b);
        }
    }

    removeGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.removeNearBehavior(b);
        }
    }

    enableGravity(num) {
        this.gravity = new Gravity(new Vector2D(0, num));
        this.addGlobalBehavior(this.gravity);
    }

    disableGravity() {
        this.removeGlobalBehavior(this.gravity);
    }

    nextFrame() {
        this.solver.nextFrame();
        this.renderer.renderFrame();
    }

    enableCollisions() {
        this.collision = new Collision();
        this.addGlobalNearBehavior(this.collision);
    }

    disableCollisions() {
        this.removeGlobalNearBehavior(this.collision);
    }

    // TODO: implement rayCasting for line obstacle support
    constrainBoundary(x1= -Infinity, x2= Infinity, y1= -Infinity, y2= Infinity) {
        this.worldConstraint = new RectangularWorldBoundary(x1, x2, y1, y2);
        this.walls.push(this.worldConstraint);
    }

    enableDrag(viscosity) {
        this.dragBehavior = new Drag(viscosity);
        this.addGlobalBehavior(this.dragBehavior);
    }

    disableDrag() {
        this.removeGlobalBehavior(this.dragBehavior);
    }

}
