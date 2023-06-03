class WallRenderer {

    constructor(solver, context) {
        this.solver = solver;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
    }

    // call this anytime a new particle is added
    renderFrame() {
        for (let w of this.solver.walls) {
            this.draw(w);
        }
    }

	draw(w) {
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