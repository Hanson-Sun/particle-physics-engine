/**
 * The `SpatialHashGrid` is is a data structure that stores and sorts items into distinct "2D grids".
 * It allows for the quick access of nearby items without brute force iteration.
 * This data structure can increase performance by ~100x for sufficiently large collision interactions in close proximity. 
 * Note that this data structure is not directly iterable.
 *  
 * **Important:** Only items that implement the `HashGridItem` interface are compatible with the `SpatialHashGrid`.
 */
class SpatialHashGrid {
    #queryIds;
    #cells;

    /**
     * @param {Number} width width of HashGrid
     * @param {Number} height height of HashGrid
     * @param {int} xGrids number of grid separations on the x-axis
     * @param {int} [yGrids=null] optional param number of grid separations on the y-axis, defaults to same as xGrids
     * @public
     */
    constructor(width, height, xGrids, yGrids=null) {
        this.width = width;
        this.height = height;
        this.xGrids = Math.floor(xGrids);
        this.yGrids = Math.floor(yGrids) || Math.floor(xGrids);
        this.#cells = [];
        this.#initialize();
        this.#queryIds = 0;
    }

    /**
     * Adds an item to the HashGrid.
     * @param {HashGridItem} item 
     * @public
     */
    add(item) {
        this.#insert(item);
    }

    /**
     * Private method that initializes 2D grid.
     * @private
     */
    #initialize() {
        for (let x = 0; x < this.xGrids; x++) {
            let row = [];
            for(let y = 0; y < this.yGrids; y++) {
                row.push(new Set());
            }
            this.#cells.push(row);
        }
    }

    /**
     * Private method that inserts the item into its corresponding grid cell
     * @param {HashGridItem} item 
     * @private
     */
    #insert(item) {
        const [x, y] = item.getHashPos();
        const [w, h] = item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        item._gridIndex = [i1, i2];

        for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
                this.#cells[x][y].add(item);
            }
        }
    }

    /**
     * Finds the nearest grid coordinate that the encapsulates (x, y). Cycles the grid coordinates if input is out of range.
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Number[]} integer grid coordinates in [x, y]
     * @private
     */
    #getCellIndex(x, y) {
        const xScaled = Math.min(Math.max((x / this.width), 0.0), 1);
        const yScaled = Math.min(Math.max((y / this.height), 0.0), 1);

        const xIndex = Math.round((this.xGrids - 1) * xScaled);
        const yIndex = Math.round((this.yGrids - 1) * yScaled);

        return [xIndex, yIndex];
    }

    /**
     * Finds the nearby items for a given item, and updates the queryId.
     * @param {HashGridItem} item 
     * @param {Number[]} range - optional param that overrides the `getHashDimensions` default surrounding dimensions of the hash item.
     * @returns {HashGridItem[]}
     * @public
     */
    findNear(item, range = null) {
        const [x, y] = item.getHashPos();
        const [w, h] = range || item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        const queryId = this.#queryIds++;
        if (queryId >= Number.MAX_SAFE_INTEGER) {
            this.#queryIds = 0;
        }
        
        const items = [];
        for (let x = i1[0], xn = i2[0]; x <= xn; x++) {
            for (let y = i1[1], yn = i2[1]; y <= yn; y++) {
                for (let v of this.#cells[x][y]) {
                    if (v.queryId !== queryId) {
                        v.queryId = queryId;
                        items.push(v);
                    }
                }
            }
        }
        return items;
    }

    /**
     * Updates the grid positions of the item within the HashGrid. This function **MUST** be called after any position change.
     * @param {HashGridItem} item 
     * @public
     */
    updateItem(item) {
        const [x, y] = item.getHashPos();
        const [w, h] = item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        const gridIndex1 = item._gridIndex[0];
        const gridIndex2 = item._gridIndex[1];
        if (gridIndex1[0] === i1[0] &&
            gridIndex1[1] === i1[1] &&
            gridIndex2[0] === i2[0] &&
            gridIndex2[1] === i2[1]) {
                return;
        }
        
        this.deleteItem(item);
        this.#insert(item);
    }
    
    /**
     * Delete item from HashGrid.
     * @param {HashGridItem} item
     * @public
     */
    deleteItem(item) {
        const [i1, i2] = item._gridIndex;

        for (let x = i1[0], xn = i2[0]; x <= xn; x++) {
            for (let y = i1[1], yn = i2[1]; y <= yn; y++) {
                this.#cells[x][y].delete(item);
            }
        }
    }

    /**
     * Returns a unique list of all HashGridItems the HashGrid. 
     * @returns {HashGridItem[]}
     * @public
     */
    values() {
        const iterable = [];

        const queryId = this.#queryIds++;
        if (queryId >= Number.MAX_SAFE_INTEGER) {
            this.#queryIds = 0;
        }

        for (let row of this.#cells) {
            for (let set of row) {
                for (let i of set) {
                    if (i.queryId !== queryId) {
                        i.queryId = queryId;
                        iterable.push(i);
                    }
                }
            }
        }
        return iterable;
    }
}

module.exports = SpatialHashGrid;