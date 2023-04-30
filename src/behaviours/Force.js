class Force extends SelfBehavior {

    constructor(force) {
        super();
        this.force = force;
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep) {
        particle.applyForce(this.force, timeStep);
    }

}