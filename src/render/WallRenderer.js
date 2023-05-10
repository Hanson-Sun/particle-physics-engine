class WallRenderer {

    constructor(walls, context) {
        this.walls = walls;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
    }

    // call this anytime a new particle is added
    renderFrame() {
        for (let w of this.walls) {
            this.draw(w);
        }
    }

	draw(w) {
        let vertices = w.vertices();
        if (vertices.length >= 1) {
            this.context.beginPath();
            this.context.moveTo(vertices[0].x, vertices[0].y);
            vertices.pop();
            for (let p of vertices) {
                this.context.lineTo(w.p2.x, w.p2.y);
            }
            this.context.stroke();
        }

	}
}