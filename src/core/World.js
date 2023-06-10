const RectangularWorldBoundary = require("../walls/RectangularWorldBoundary");
const Collision = require("../behaviors/Collision");
const SpatialHashGrid = require("../core/SpatialHashGrid");
const Solver = require("../core/Solver");
const Renderer = require("../renderers/Renderer");
const Gravity = require("../behaviors/Gravity");
const Particle = require("./Particle");

/**
 * `World` the global-state instance of the physics engine that keeps track of all the objects. This provides
 * a higher level of abstraction from the user but may be limiting in some ways. It is a good idea to extend and 
 * override this class for any specific properties. With the current SpatialHashing algorithm, the world should have
 * finite bounds.
 */
class World {
    /**
     * Instantiates new `World` instance
     * @param {HTMLCanvasElement} canvas HTML canvas where the elements are displayed
     * @param {Number} width width of world
     * @param {Number} height height of world
     * @param {Number} xGrids integer number of grid separations in the x direction
     * @param {Number} yGrids integer number of grid separations in the y direction
     * @param {Number} timeStep change in time per solve iteration
     * @param {Number} iterationPerFrame number of solve iterations per frame
     * @param {Number} constraintIteration number of times constraints are solved per iteration
     */
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

    /**
     * Adds a particle to the world
     * @param {Particle} p 
     */
    addParticle(p) {
        this.particles.add(p);
        this.updateParticleList();
    }

    /**
     * Removes a particle from the world
     * @param {Particle} p
     */
    removeParticle(p) {
        this.particles.deleteItem(p);
        let removeCons = [];
        for (let c of this.constraints) {
            if (c.particles().includes(p)) {
                removeCons.push(c) 
            }
        }

        for (let c of removeCons) {
            this.removeConstraint(c);
        }
        
        this.updateParticleList();
    }

    /**
     * Adds a constraint to the world
     * @param {Constraint} c 
     */
    addConstraint(c) {
        this.constraints.push(c);
    }

    /**
     * Removes a constraint from the world
     * @param {Constraint} c 
     * @returns {Boolean} true if the constraint is removed
     */
    removeConstraint(c) {
        const index = this.constraints.indexOf(c);
		if (index > -1) {
			this.constraints.splice(index, 1);
			return true;
		}
		return false;
    }

    /**
     * Adds a wall to the world
     * @param {Wall} w 
     */
    addWall(w) {
        this.walls.push(w);
    }

    removeWall(w) {
        const index = this.walls.indexOf(w);
		if (index > -1) {
			this.walls.splice(index, 1);
			return true;
		}
		return false;
    }

    /**
     * Clears all of the particles and constraints
     */
    clearParticles() {
        this.particles = new SpatialHashGrid(this.width, this.height, this.xGrids, this.yGrids);
        this.solver.particles = this.particles;
        this.clearConstraints();
        this.updateParticleList();
    }

    /**
     * Clears all of the constraints
     */
    clearConstraints() {
        this.constraints = [];
        this.solver.constraints = this.constraints;
        this.updateParticleList();
    }

    clearWalls() {
        this.walls = [];
        this.solver.walls = [];
    }

    /**
     * Update the list of particles. Must be called every time the number of particles change.
     */
    updateParticleList() {
        this.particlesList = this.particles.values();
        this.solver.updateSolverParticles();
    }

    /**
     * Adds a SelfBehavior to all the particles
     * @param {SelfBehavior} b 
     */
    addGlobalSelfBehavior(b) {
        for (let p of this.particlesList) {
            p.addSelfBehavior(b);
        }
    }

    /**
     * Removes a SelfBehavior from all the particles
     * @param {SelfBehavior} b 
     */
    removeGlobalSelfBehavior(b) {
        for (let p of this.particlesList) {
            p.removeSelfBehavior(b);
        }
    }

    /**
     * Adds a NearBehavior to all the particles
     * @param {NearBehavior} b 
     */
    addGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.addNearBehavior(b);
        }
    }

    /**
     * Removes a NearBehavior to all the particles
     * @param {NearBehavior} b 
     */
    removeGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.removeNearBehavior(b);
        }
    }

    /**
     * Disables gravity and adds a new global gravity behavior to all the particles, while updating 
     * the gravity pointer
     * @param {Number} num 
     */
    enableGravity(num) {
        if (this.gravity) {
            this.disableGravity();
        }
        this.gravity = new Gravity(new Vector2D(0, num));
        this.addGlobalSelfBehavior(this.gravity);
    }

    /**
     * Removes the global gravity behavior
     * @returns {Boolean} true if gravity is successfully disabled
     */
    disableGravity() {
        if (this.gravity) {
            this.removeGlobalSelfBehavior(this.gravity);
            return true;
        }
        return false;
    }

    /**
     * Progresses world to next area
     */
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
        this.addGlobalSelfBehavior(this.dragBehavior);
    }

    disableDrag() {
        if (this.dragBehavior) {
            this.removeGlobalSelfBehavior(this.dragBehavior);
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
            this.removeGlobalSelfBehavior(this.chargeBehavior);
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
