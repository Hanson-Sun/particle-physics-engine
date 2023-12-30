const RectangularWorldBoundary = require("../walls/RectangularWorldBoundary");
const Collision = require("../behaviors/Collision");
const SpatialHashGrid = require("../core/SpatialHashGrid");
const Solver = require("../core/Solver");
const Renderer = require("../renderers/Renderer");
const Gravity = require("../behaviors/Gravity");
const PositionLock = require("../behaviors/PositionLock");
const Particle = require("./Particle");
const Vector2D = require("../utils/Vector2D");

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
     * @constructor
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
        this.collision = null;
        this.dragBehavior = null;
        this.chargeBehavior = null;
        
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
     * @public
     */
    addParticle(p) {
        if (this.gravity)
            p.addSelfBehavior(this.gravity);
        if (this.collision)
            p.addNearBehavior(this.collision);
        if (this.dragBehavior)
            p.addSelfBehavior(this.dragBehavior);
        if (this.chargeBehavior)
            p.addSelfBehavior(this.chargeBehavior);
        this.particles.add(p);
        this.updateParticleList();
    }

    /**
     * Removes a particle from the world
     * @param {Particle} p
     * @public
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
     * @public
     */
    addConstraint(c) {
        this.constraints.push(c);
    }

    /**
     * Removes a constraint from the world
     * @param {Constraint} c 
     * @returns {Boolean} true if the constraint is removed
     * @public
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
     * @public
     */
    addWall(w) {
        this.walls.push(w);
    }

    /**
     * Removes a wall from the world
     * @param {Wall} w 
     * @returns {boolean} true if the wall is removed 
     * @public
     */
    removeWall(w) {
        const index = this.walls.indexOf(w);
		if (index > -1) {
			this.walls.splice(index, 1);
			return true;
		}
		return false;
    }

    /**
     * Clears all of the particles and any associated constraints
     * @public
     */
    clearParticles() {
        this.particles = new SpatialHashGrid(this.width, this.height, this.xGrids, this.yGrids);
        this.solver.particles = this.particles;
        this.clearConstraints();
        this.updateParticleList();
    }

    /**
     * Clears all of the constraints
     * @public
     */
    clearConstraints() {
        this.constraints = [];
        this.solver.constraints = this.constraints;
        this.updateParticleList();
    }

    /**
     * Clears all of the walls
     * @public 
     */
    clearWalls() {
        this.walls = [];
        this.solver.walls = [];
    }

    /**
     * Update the list of particles. Must be called every time the number of particles change.
     * @public
     */
    updateParticleList() {
        this.particlesList = this.particles.values();
        this.solver.updateSolverParticles();
    }

    /**
     * Adds a SelfBehavior to **all** the particles in the world
     * @param {SelfBehavior} b 
     * @public
     */
    addGlobalSelfBehavior(b) {
        for (let p of this.particlesList) {
            p.addSelfBehavior(b);
        }
    }

    /**
     * Removes a SelfBehavior from **all** the particles in the world
     * @param {SelfBehavior} b 
     * @public
     */
    removeGlobalSelfBehavior(b) {
        for (let p of this.particlesList) {
            p.removeSelfBehavior(b);
        }
    }

    /**
     * Adds a NearBehavior to **all** the particles in the world
     * @param {NearBehavior} b 
     * @public
     */
    addGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.addNearBehavior(b);
        }
    }

    /**
     * Removes a NearBehavior to **all** the particles in the world
     * @param {NearBehavior} b 
     * @public
     */
    removeGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.removeNearBehavior(b);
        }
    }

    /**
     * Removes existing gravity and adds a new global gravity behavior to all the particles, while updating 
     * `this.gravity`
     * @param {Number} num 
     * @public
     */
    enableGravity(num) {
        if (this.gravity) {
            this.disableGravity();
        }
        this.gravity = new Gravity(new Vector2D(0, num));
        this.addGlobalSelfBehavior(this.gravity);
    }

    /**
     * Removes the global gravity behavior and sets `this.gravity` to `null`
     * @returns {Boolean} true if gravity is successfully disabled
     * @public
     */
    disableGravity() {
        if (this.gravity) {
            this.removeGlobalSelfBehavior(this.gravity);
            this.gravity = null
            return true;
        }
        return false;
    }

    /**
     * Progresses world to next state
     * @public
     */
    nextFrame() {
        this.solver.nextFrame();
        if (this.isRender) {
            this.renderer.renderFrame();
        }
    }

    /**
     * Removes existing collision behavior and adds a new global collision behavior to all the particles, while updating 
     * `this.collision`
     * @public
     */
    enableCollisions() {
        if (this.collision) {
            this.disableCollisions();
        }
        this.collision = new Collision();
        this.addGlobalNearBehavior(this.collision);
    }

    /**
     * Removes the global gravity behavior and sets `this.collision` to `null`
     * @returns {Boolean} true if collision is successfully disabled
     * @public
     */
    disableCollisions() {
        if (this.collision) {
            this.removeGlobalNearBehavior(this.collision);
            this.collision = null;
            return true;
        }
        return false;
    }

    /**
     * Creates a `RectangularWorldBoundary` that confines the boundary of the world with rigid collisions. Also sets `this.worldConstraint`.
     * @param {Number} x1 x value of top-left coordinate (smaller)
     * @param {Number} x2 larger x value of bottom-right coordinate (larger)
     * @param {Number} y1 y value of top-left coordinate (smaller)
     * @param {Number} y2 y value of bottom-right coordinate (larger)
     * @public
     */
    constrainBoundary(x1= -Infinity, x2= Infinity, y1= -Infinity, y2= Infinity) {
        this.worldConstraint = new RectangularWorldBoundary(x1, x2, y1, y2);
        this.walls.push(this.worldConstraint);
    }

    /**
     * Removes existing drag behavior and adds a new global drag behavior  with a given viscosity to all the particles, while updating 
     * `this.drag`
     * @param {Number} viscosity 
     * @public
     */
    enableDrag(viscosity) {
        if (this.dragBehavior) {
            this.disableDrag();
        }
        this.dragBehavior = new Drag(viscosity);
        this.addGlobalSelfBehavior(this.dragBehavior);
    }

    /**
     * Removes existing drag behavior and sets `this.drag` to `null`
     * @returns {Boolean} true if drag is successfully disabled 
     * @public
     */
    disableDrag() {
        if (this.dragBehavior) {
            this.removeGlobalSelfBehavior(this.dragBehavior);
            return true;
        }
        return false;
    }

    /**
     * Removes existing ChargeInteraction behavior and adds a new global ChargeInteraction behavior to all the particles, while updating 
     * `this.chargeBehavior`
     * @public
     */
    enableChargeInteractions() {
        if(this.chargeBehavior) {
           this.disableChargeInteractions();
        }
        this.chargeBehavior = new ChargeInteraction();
        this.addGlobalNearBehavior(this.chargeBehavior);
    }

    /**
     * Removes the global ChargeInteraction behavior and sets `this.chargeBehavior` to `null`
     * @returns {Boolean} true if charge behavior is successfully disabled
     * @public
     */
    disableChargeInteractions() {
        if (this.chargeBehavior) {
            this.removeGlobalSelfBehavior(this.chargeBehavior);
            return true;
        }
        return false;
    }

    /**
     * Make a particle a "mass-pivot" by adding a `PositionLock` behavior and setting the adds `Number.MAX_SAFE_INTEGER / 10` to the particle mass. This is a **work around**
     * and may cause some other physics to break. This particle pivot will not work with position constraints.
     * @param {Particle} p 
     * @param {Vector2D} pos 
     * @returns {Boolean} true if particle is successfully converted to a "mass-pivot".
     * @public
     */
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

    /**
     * Frees a particle from being a "mass-pivot". This attempts to correct the mass increase from the `makePivot()` method. 
     * Once again, it may not work properly :skull:.
     * @param {Particle} p 
     * @returns true if particle is successfully freed from a "mass-pivot".
     * @public
     */
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
     * Sets the optional `update()` function for the solver. 
     * @param {Function} update 
     * @public
     */
    setSolverUpdate(update) {
        this.solver.update = update;
    }

}

module.exports = World;
