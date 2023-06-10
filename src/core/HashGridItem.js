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
     * @constructor interface cannot be instantiated
     */
    constructor() {
        if (this.constructor == HashGridItem) {
            throw new Error("HashGridItem interface class cannot be instantiated.");
        }
    }

    /**
     * Computes the coordinate position for the item within the `HashGrid`, expects center position.
     * @abstract
     * @returns {Number[]} 
     */
    getHashPos() {
        throw new Error("Method 'getHashPos()' must be implemented.");
    }

    /**
     * Computes the dimensions of the item for the `HashGrid`.
     * @abstract
     * @returns {Number[]} rectangular dimensions in [width, height]
     */
    getHashDimensions() {
        throw new Error("Method 'getHashDimensions()' must be implemented.");
    }

}

module.exports = HashGridItem;