const RectangularWorldBoundary = require("../walls/RectangularWorldBoundary");
const Collision = require("../behaviors/Collision");
const SpatialHashGrid = require("../core/SpatialHashGrid");
const Solver = require("../core/Solver");
const Renderer = require("../renderers/Renderer");
const Gravity = require("../behaviors/Gravity");

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

        this.isRender = true;
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
        if (this.gravity) {
            this.disableGravity();
        }
        this.gravity = new Gravity(new Vector2D(0, num));
        this.addGlobalBehavior(this.gravity);
    }

    disableGravity() {
        if (this.gravity) {
            this.removeGlobalBehavior(this.gravity);
            return true;
        }
        return false;
    }

    nextFrame() {
        this.solver.nextFrame();
        if (this.isRender) {
            this.renderer.renderFrame();
        }
    }

    enableCollisions() {
        if (this.collision) {
            this.disableCollisions();
        }
        this.collision = new Collision();
        this.addGlobalNearBehavior(this.collision);
    }

    disableCollisions() {
        if (this.collision) {
            this.removeGlobalNearBehavior(this.collision);
            return true;
        }
        return false;
    }

    // TODO: implement rayCasting for line obstacle support
    constrainBoundary(x1= -Infinity, x2= Infinity, y1= -Infinity, y2= Infinity) {
        this.worldConstraint = new RectangularWorldBoundary(x1, x2, y1, y2);
        this.walls.push(this.worldConstraint);
    }

    enableDrag(viscosity) {
        if (this.dragBehavior) {
            this.disableDrag();
        }
        this.dragBehavior = new Drag(viscosity);
        this.addGlobalBehavior(this.dragBehavior);
    }

    disableDrag() {
        if (this.dragBehavior) {
            this.removeGlobalBehavior(this.dragBehavior);
            return true;
        }
        return false;
    }

    enableChargeInteractions() {
        if(this.chargeBehavior) {
           this.disableChargeInteractions();
        }
        this.chargeBehavior = new ChargeInteraction();
        this.addGlobalNearBehavior(this.chargeBehavior);
    }

    disableChargeInteractions() {
        if (this.chargeBehavior) {
            this.removeGlobalBehavior(this.chargeBehavior);
            return true;
        }
        return false;
    }

    makePivot(p, pos=null) {
        // this is incredibly scuffed, but this is what i could think of without introducing high cohesion
        for (let b of p.selfBehavior) {
            console.log(b);
            if(b instanceof PositionLock) {
                return false;
            }
        }
        p.mass = p.mass + Number.MAX_SAFE_INTEGER / 10;
        if(pos === null) {
            p.addSelfBehavior(new PositionLock(p.pos));
        } else {
            p.addSelfBehavior(new PositionLock(pos));
        }
        return true;
    }

    freePivot(p) {
        for (let b of p.selfBehavior) {
            if(b instanceof PositionLock) {
                p.mass = p.mass - Number.MAX_SAFE_INTEGER / 10;
                p.removeSelfBehavior(b);
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {Function} update 
     */
    setSolverUpdate(update) {
        this.solver.update = update;
    }

}

module.exports = World;
