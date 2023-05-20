class ConstraintRenderer {

    constructor(constraints, context) {
        this.constraints = constraints;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
    }

    // call this anytime a new particle is added
    renderFrame() {
        for (let c of this.constraints) {
            this.draw(c);
        }
    }

	draw(c) {
        let vertices = c.vertices();
        if (vertices.length > 1) {
            this.context.beginPath();
            this.context.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                let vertex = vertices[i];
                this.context.lineTo(vertex.x, vertex.y);
            }
            this.context.stroke();
        }
	}
}