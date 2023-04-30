


class SelfBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
        if (this.constructor == SelfBehavior) {
            throw new Error("HashGridItem interface class cannot be instantiated.");
        }
    }

    /**
     * 
     * @param {*} timeStep 
     */
    applyBehavior(particle, timeStep) {
        throw new Error("Method 'getHashPos()' must be implemented.");
    }

}