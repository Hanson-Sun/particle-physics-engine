
/**
 * `WallRenderer` is a simple renderer that renders `Wall`s. Walls are represented by a thin line segment. 
 * This is a basic renderer intended for quick visualization of walls.
 */
class WallRenderer {
    /**
     * @param {Solver} solver 
     * @param {context} context 
     * @constructor
     */
    constructor(solver, context) {
        this.solver = solver;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
    }

    /**
     * Renders the walls per frame
     * @public
     */
    renderFrame() {
        for (let w of this.solver.walls) {
            this.draw(w);
        }
    }

    /**
     * Renders a single wall
     * @param {Wall} w 
     * @public
     */
	draw(w) {
        this.context.strokeStyle = this.color;
        let vertices = w.vertices();
        if (vertices.length >= 1) {
            this.context.beginPath();
            this.context.moveTo(vertices[0].x, vertices[0].y);
            vertices.pop();
            for (let _ of vertices) {
                this.context.lineTo(w.p2.x, w.p2.y);
            }
            this.context.stroke();
        }

	}
}

module.exports = WallRenderer;