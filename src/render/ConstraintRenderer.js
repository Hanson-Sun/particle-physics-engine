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
        this.context.beginPath();
        this.context.moveTo(c.c1.pos.x, c.c1.pos.y);
        this.context.lineTo(c.c2.pos.x, c.c2.pos.y);
        this.context.stroke();
	}
}