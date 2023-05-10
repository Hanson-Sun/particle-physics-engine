class Solver {
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

    solve() {
        // calculate future pos and store current pos as previous pos
        // apply behaviors, any forces, and corrections
        // calculate constraint correction based on current position
        // apply correction, set forces to 0, apply velocity to get final pos.
        // there might be duplicate processes... i think i need to fix that
        this.preMove();
        this.handleBehaviors();
        this.handleConstraints();
        this.handleWallCollisions();
        this.updateVelocity();
        this.positionCorrection();
    }

    preMove() {
        for (let circ of this.particleList) {
            if (!circ.isPivot) {
                circ.prevPos = circ.pos;
                circ.applyVelocity(circ.vel, this.timeStep);
            } else if (circ.isPivot) {
                circ.vel = new Vector2D(0, 0);
            }
        }
    }

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

    handleConstraints() {
        let dt = this.timeStep / this.constraintIteration;
        for (let i = 0; i < this.constraintIteration; i++) {
            for (let c of this.constraints) {
                c.update(dt);
            }
        }
    }

    handleWallCollisions() {
        for (let wall of this.walls) {
            wall.resolveCollisions(this.particles.findNear(wall), this.timeStep);
        }
    }

    updateVelocity() {
        for (let circ of this.particleList) {
            if (!circ.isPivot) {
                circ.vel = circ.pos.sub(circ.prevPos).mult(1 / this.timeStep);
            }

            this.particles.updateItem(circ);
        }
    }

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

    nextFrame() {
        for (let i = 0; i < this.iterationPerFrame; i++) {
            this.solve();
        }
    }

    updateSolverParticles() {
        this.particleList = this.particles.values();
    }
}