class Solver {

    constructor(timeStep, iterationPerFrame, constraintIteration, particles, constraints) {
        this.timeStep = timeStep;
        this.iterationPerFrame = iterationPerFrame;
        this.particles = particles;
        this.constraints = constraints;
        this.constraintIteration = constraintIteration;
        this.run = true;
    }

    solve() {
        // calculate future pos and store current pos as previous pos
        // apply behaviors, any forces, and corrections
        // calculate constraint correction based on current position
        // apply correction, set forces to 0, apply velocity to get final pos.
        // there might be duplicate processes... i think i need to fix that
        for (let circ of this.particles) {
    
            if (circ.isPivot) {
                circ.vel = new Vector2D(0, 0);
            }

            for (let nb of circ.nearBehavior) {
                np.applyBehavior(circ, this.timeStep, this.particles.findNear(circ, nb.range()));
            }

            for (let sb of circ.selfBehavior) {
                sb.applyBehavior(circ, this.timeStep);
            }

            if (!circ.isPivot) {
                circ.applyForce(circ.force, this.timeStep);
                circ.applyAcceleration(circ.force, this.timeStep);
                circ.pos = circ.prevPos.add(circ.vel.mult(this.timeStep));
            }  
        }
    
        for (let i = 0; i < this.constraintIteration; i++) {
            for (let c of this.constraints) {
                c.update(this.timeStep);
            }
        }    

        for (let circ of this.particles) {
            // unsure if this is correct. May need to add corrections after moving actual position.
            if (!circ.isPivot) {
                circ.applyAcceleration(circ.force, this.timeStep);
                circ.applyForce(circ.force, this.timeStep);
                circ.acceleration = new Vector2D(0, 0);
                circ.force = new Vector2D(0, 0);
                circ.prevPos = circ.pos;
                circ.applyVelocity(circ.vel, this.timeStep);
            }
        }
    }


    nextFrame() {
        for (let i = 0; i < this.iterationPerFrame; i++) {
            this.solve();
        }
    }

    updateSolverParticles(list) {
        this.particles = list;
    }
}