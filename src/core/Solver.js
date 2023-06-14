const Constraint = require("../constraints/Constraint");
const Wall = require("../walls/Wall");
const Particle = require("./Particle");
const SpatialHashGrid = require("./SpatialHashGrid");

/**
 * `Solver` is the discrete solver algorithm that calculates the movement of the physics world. It uses a modified 
 * predictive-corrective semi-implicit Euler implementation. Because this is a local iterative solver, there may be 
 * divergence issues at higher timeSteps and convergence can be tuned with the iterationPerFrame.
 */
class Solver {
    /**
     * Instantiates new `Solver`
     * @param {Number} timeStep the change in time per frame (smaller is more accurate)
     * @param {Number} iterationPerFrame the amount of time the solver is called per frame (**not** substepping, timeStep remains constant)
     * @param {Number} constraintIteration the amount of times the constraints are solved per frame
     * @param {SpatialHashGrid} particles SpatialHashGrid of particles
     * @param {Constraint[]} constraints list of constraints
     * @param {Wall[]} walls list of walls
     * @constructor
     */
    constructor(timeStep, iterationPerFrame, constraintIteration, particles, constraints, walls) {
        this.timeStep = timeStep;
        this.iterationPerFrame = iterationPerFrame;
        this.particles = particles;
        this.constraints = constraints;
        this.constraintIteration = constraintIteration;
        this.run = true;
        this.particles = particles;
        this.particleList = this.particles.values();
        this.walls = walls;
    }

    /**
     * Solves one iteration of the current physics world
     * @public
     */
    solve() {
        // calculate future pos and store current pos as previous pos
        // apply behaviors, any forces, and corrections
        // calculate constraint correction based on current position
        // apply correction, set forces to 0, apply velocity to get final pos.
        // there might be duplicate processes... i think i need to fix that
        this.preMove();
        this.handleWallCollisions();
        this.update();
        this.handleBehaviors();
        this.handleConstraints();
        this.updateVelocity();
        this.positionCorrection();
    }

    /**
     * Optional function that can be defined to exhibit certain behavior in the solve loop.
     * @public
     */
    update(){
        return;
    }

    /**
     * Move particle positions forward to the "future-position"
     * @private
     */
    preMove() {
        for (let circ of this.particleList) {
            circ.prevPos = circ.pos;
            circ.pos = circ.pos.add(circ.vel.mult(this.timeStep));
        }
    }

    /**
     * Solve physics interactions from Behaviors
     * @private
     */
    handleBehaviors() {
        for (let circ of this.particleList) {

            for (let sb of circ.selfBehavior) {
                sb.applyBehavior(circ, this.timeStep);
            }

            for (let nb of circ.nearBehavior) {
                nb.applyBehavior(circ, this.timeStep, this.particles.findNear(circ, nb.range()));
            }       
        }
    }

    /**
     * Solve physics interactions from Constraints
     * @private
     */
    handleConstraints() {
        let dt = this.timeStep / this.constraintIteration;
        for (let i = 0; i < this.constraintIteration; i++) {
            for (let c of this.constraints) {
                c.update(dt);
                if (c.breakForce !== (null || Infinity) && c.force.mag() > c.breakForce) {
                    const index = this.constraints.indexOf(c);
                    if (index > -1) {
                        this.constraints.splice(index, 1);
                    }
                }
            }
        }
    }

    /**
     * Solve collision interactions with Walls
     * @private
     */
    handleWallCollisions() {
        for (let wall of this.walls) {
            wall.resolveCollisions(this.particles.findNear(wall), this.timeStep);
        }
    }

    /**
     * Update final particle velocities
     * @private
     */
    updateVelocity() {
        for (let circ of this.particleList) {
            circ.vel = circ.pos.sub(circ.prevPos).mult(1 / this.timeStep);
            this.particles.updateItem(circ);
        }
    }

    /**
     * Correct particle positions 
     * @private
     */
    positionCorrection() {

        for (let circ of this.particleList) {

            for (let sb of circ.selfBehavior) {
                sb.applyCorrection(circ);
            }

            for (let nb of circ.nearBehavior) {
                nb.applyCorrection(circ, this.particles.findNear(circ, nb.range()));
            }       
        }
   

        for (let wall of this.walls) {
            wall.applyCorrection(this.particles.findNear(wall));
        }
    }

    /**
     * Computes next frame or "world-state"
     * @public
     */
    nextFrame() {
        for (let i = 0; i < this.iterationPerFrame; i++) {
            this.solve();
        }
    }

    /**
     * Update the particle positions in the SpatialHashGrid
     * @public
     */
    updateSolverParticles() {
        this.particleList = this.particles.values();
    }
}

module.exports = Solver;