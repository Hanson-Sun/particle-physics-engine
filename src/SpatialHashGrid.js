/**
 * The SpatialHashGrid is is a data structure that stores and sorts items into distinct "2D grids".
 * It allows for the quick access of nearby items without brute force iteration.
 * This data structure can increase performance by ~100x for sufficiently large collision interactions in close proximity.
 *  
 * **Important:** Only items that implement the `HashGridItem` interface are compatible with the SpatialHashGrid.
 * 
 * Notes: implementation is work in progress, further optimizations expected. 
 */
class SpatialHashGrid {
    #queryIds;
    #cells;

    /**
     * @constructor instantiate new SpatialHashGrid
     * @param {number} width width of HashGrid
     * @param {number} height height of HashGrid
     * @param {int} xGrids number of grid separations on the x-axis
     * @param {int} yGrids number of grid separations on the y-axis
     * @access public
     */
    constructor(width, height, xGrids, yGrids=null) {
        this.width = width;
        this.height = height;
        this.xGrids = xGrids;
        this.yGrids = yGrids;
        this.yGrids = yGrids || xGrids;
        this.#cells = [];
        this.#initialize();
        this.#queryIds = 0;
    }

    /**
     * adds an item to the HashGrid
     * @modifies this
     * @param {HashGridItem} item 
     * @access public
     */
    add(item) {
        this.#insert(item);
    }

    /**
     * initializes 2D grid
     * @modifies this
     * @access private
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
     * private method that inserts the item into its corresponding grid cell
     * @modifies this
     * @param {HashGridItem} item 
     * @access private
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
     * private method that returns a string coordinate key
     * @param {float} x 
     * @param {float} y 
     * @returns string coordinate key
     * @access private
     */
    #key(x, y) {
        return x + ", " + y;
    }
    
    /**
     * returns A pair of min and max coordinates representing the range of grids that the object occupies
     * @param {float} x 
     * @param {float} y 
     * @returns {[[int, int],[int, int]]} 
     * @access private
     */
    #getCellIndex(x, y) {
        const xScaled = Math.min(Math.max(Math.abs(x / this.width), 0.0), 1.0);
        const yScaled = Math.min(Math.max(Math.abs(y / this.height), 0.0), 1.0);

        const xIndex = Math.floor((this.xGrids - 1) * xScaled);
        const yIndex = Math.floor((this.yGrids - 1) * yScaled);

        return [xIndex, yIndex];
    }

    /**
     * returns a list of the nearby items, and changes queryId
     * @modifies this
     * @param {HashGridItem} item 
     * @param {[Number, Number]} range
     * @returns {HashGridItem[]}
     * @access public
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
     * updates the grid positions of the item
     * @modifies this
     * @param {HashGridItem} item 
     * @access public
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
     * delete item from HashGrid
     * @modifies this
     * @param {HashGridItem} item
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
     * return a unique list of all HashGridItems within HashGrid
     * @modifies this
     * @returns {HashGridItem[]}
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
                    if (i.queryId != queryId) {
                        i.queryId = queryId;
                        iterable.push(i);
                    }
                }
            }
        }
        return iterable;
    }
}