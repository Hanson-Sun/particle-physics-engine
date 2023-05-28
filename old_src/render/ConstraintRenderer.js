class ConstraintRenderer {

    constructor(constraints, context) {
        this.constraints = constraints;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
        this.showStress = false;
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

    static calculateStressColor(c, maxForce, min=0, sensitivity = 2) {

        let r = sensitivity * (c.force.mag() - min) / (maxForce - min) * 510;
        if (r <= 255) {
            return "rgb(" + Math.floor(r) + ", 255,0)";
        } else if (r <= 510) {
            return "rgb(255," + (510 - Math.floor(r)) + ",0)";
        } else {
            return "rgb(255,0,0)";
        }
    }
}