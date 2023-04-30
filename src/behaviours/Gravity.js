class Gravity extends SelfBehavior {

    constructor(acceleration) {
        super();
        this.acceleration = acceleration;
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep) {
        particle.applyAcceleration(this.acceleration, timeStep);
    }

}