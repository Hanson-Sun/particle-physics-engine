/**
 * `ConstraintRenderer` is a class responsible for rendering constraints in a `Solver`. Constraints are represented with simple lines.
 * This renderer only provides a simple and quick way to visualize constraints in a HTMLCanvas element. 
 */
class ConstraintRenderer {

    /**
     * @param {Solver} solver 
     * @param {context} context the HTMLCanvas context
     * @constructor 
     */
    constructor(solver, context) {
        this.solver = solver;
        this.context = context;
        this.color = "black"
        this.context.strokeStyle = this.color;
        this.showStress = false;
    }

    /**
     * Renders the constraints per frame
     * @public 
     */
    renderFrame() {
        for (let c of this.solver.constraints) {
            this.draw(c);
        }
    }

    /**
     * Draws a single constraint
     * @param {Constraint} c
     * @public 
     */
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

    /**
     * 
     * @param {Constraint} c 
     * @param {Number} maxForce maximum force magnitude
     * @param {Number} min minimum force magnitude
     * @param {Number} sensitivity colour change sensitivity 
     * @returns {string} a string in the HTML RGB color format
     * @static
     */
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

module.exports = ConstraintRenderer;