/**
 * Interface for all items that can be used with a `HashGrid`.
 * 
 * @interface
 */
class HashGridItem {
    _gridIndex = []
    _queryId = -1
    wallCollide = true;

    /**
     * Interface cannot be instantiated
     */
    constructor() {
        if (this.constructor == HashGridItem) {
            throw new Error("HashGridItem interface class cannot be instantiated.");
        }
    }

    /**
     * Computes the coordinate position for the item within the `HashGrid`, expects center position.
     * @returns {Number[]} 
     * @abstract
     * @public
     */
    getHashPos() {
        throw new Error("Method 'getHashPos()' must be implemented.");
    }

    /**
     * Computes the dimensions of the item for the `HashGrid`.
     * @returns {Number[]} rectangular dimensions in [width, height]
     * @abstract
     * @public
     */
    getHashDimensions() {
        throw new Error("Method 'getHashDimensions()' must be implemented.");
    }

}

module.exports = HashGridItem;