class Constraint {

    /**
     * @constructor interface cannot be instantiated
     */
    constructor() {
        if (this.constructor == Constraint) {
            throw new Error("Constraint interface class cannot be instantiated.");
        }
    }

    update(timeStep) {
        throw new Error("Method 'update()' must be implemented.");
    }
}