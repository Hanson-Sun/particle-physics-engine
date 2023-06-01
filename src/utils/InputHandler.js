const Particle = require("../core/Particle");
const Vector2D = require("./Vector2D");
const ForcePivotConstraint = require("../constraints/ForcePivotConstraint");

/**
 * Will only work inside a website --> Node version wont work.
 */
class InputHandler {
    constructor(world, enableMouseInteractions=true) {
        this.world = world;
        this.canvas = world.canvas;

        this.mouseDownPosition = new Vector2D(0,0);
        this.mousePosition = new Vector2D(0,0);
        this.mouseIsDown = false;

        this.keyPress = "";

        this.selectedParticle = null;
        this.currentlySelectedParticle = null;
        this.particleConstraint = null;

        this.keyEvents = new Map();

        this.minSelectRadius = 3;

        this.enableMouseInteractions = enableMouseInteractions;
    }

    getMousePos(event, handler) {
        const rect = handler.canvas.getBoundingClientRect();
        return new Vector2D(event.clientX - rect.left, event.clientY - rect.top);
    }

    startMouseHandling() {
        this.canvas.addEventListener("mousedown", (event) => {this.mousedown(event, this)});
        this.canvas.addEventListener("mousemove", (event) => {this.mousemove(event, this)});
        window.addEventListener("mouseup", (event) => {this.mouseup(event, this)});
    }

    mousedown(event, handler) {
        handler.mousePosition, handler.mouseDownPosition = handler.getMousePos(event, handler);
        handler.mouseIsDown = true;
        handler.findSelectedParticle(handler);

        if (handler.currentlySelectedParticle !== null && handler.enableMouseInteractions) {
            handler.createConstraint(handler);
        }
    }

    mousemove(event, handler) {
        handler.mousePosition = handler.getMousePos(event, handler);
        if (handler.particleConstraint) {
            handler.particleConstraint.pos = handler.mousePosition;
        }
    }

    mouseup(event, handler) {
        handler.mouseIsDown = false;
        handler.currentlySelectedParticle = null;
        handler.removeConstraint(handler);
    }

    findSelectedParticle(handler) {
        const zero = new Vector2D(0,0);
        const testParticle = new Particle(handler.mouseDownPosition, zero, 1, 10);
        for (let particle of handler.world.particles.findNear(testParticle)) {
            if (particle.radius <= handler.minSelectRadius) {
                // idk what this is
                if (particle.pos.sub(handler.mouseDownPosition).mag() <= particle.radius * 10 * (handler.minSelectRadius + 1 - particle.radius)) {
                    handler.selectedParticle = particle;
                    handler.currentlySelectedParticle = particle;
                }
            } else if (particle.radius >= handler.minSelectRadius) {
                if (particle.pos.sub(handler.mouseDownPosition).mag() <= particle.radius) {
                    handler.selectedParticle = particle;
                    handler.currentlySelectedParticle = particle;
                }
            }
        }
    }

    createConstraint(handler) {
        let stiffness = handler.currentlySelectedParticle.mass * 50;
        //handler.particleConstraint = new ForcePivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, stiffness, stiffness/5);
        handler.particleConstraint = new PositionPivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, 0.90);
        handler.world.addConstraint(handler.particleConstraint);
    }

    removeConstraint(handler) {
        if (handler.particleConstraint !== null) {
            handler.world.removeConstraint(handler.particleConstraint);
            handler.particleConstraint = null;
        }
    }

    startKeyHandling() {
        // this is cursed as hell...
        this.canvas.addEventListener("keydown", function(event) {
            const key = e.keyCode;
            for (let [keyEvent, eventFunction] of this.keyEvents) {
                if(key === keyEvent) {
                    eventFunction();
                }
            }
        })
        
        this.canvas.addEventListener("keyup", function(event) {
            this.keyPress = null;
        })
    }

    addKeyEvent(keyCode, fn) {
        this.keyEvents.set(keyCode, fn);
    }


}

module.exports = InputHandler;