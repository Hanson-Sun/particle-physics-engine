


class SelfBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
        if (this.constructor == SelfBehavior) {
            throw new Error("SelfBehavior interface class cannot be instantiated.");
        }
    }

    applyBehavior(particle, timeStep) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    applyCorrection(particle) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

}