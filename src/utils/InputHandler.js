const Particle = require("../core/Particle");
const Vector2D = require("./Vector2D");

/**
 * A utility class that provides a quick user-input handling functionality. 
 * This will only work with an HTML canvas element in the browser.
 */
class InputHandler {
    constructor(world, enableMouseInteractions=true) {
        this.world = world;
        this.canvas = world.canvas;

        this.mouseFocusElement = this.canvas;
        this.keyFocusElement = window;

        this.mouseDownPosition = new Vector2D(0,0);
        this.mousePosition = new Vector2D(0,0);
        this.mouseIsDown = false;

        this.keyPress = null;

        this.selectedParticle = null;
        this.currentlySelectedParticle = null;
        this.particleConstraint = null;

        this.keyEvents = [];

        this.minSelectRadius = 20;

        this.enableMouseInteractions = enableMouseInteractions;

        this.mouseDownFunction = () => {};
        this.mouseUpFunction = () => {};
    }

    getMousePos(event, handler) {
        const rect = handler.canvas.getBoundingClientRect();
        return new Vector2D(event.clientX - rect.left, event.clientY - rect.top);
    }

    startMouseHandling() {
        this.mouseFocusElement.addEventListener("mousedown", (event) => {this.mousedown(event, this)});
        this.mouseFocusElement.addEventListener("mousemove", (event) => {this.mousemove(event, this)});
        window.addEventListener("mouseup", (event) => {this.mouseup(event, this)});
    }

    startKeyHandling() {
        // this is cursed as hell...
        this.keyFocusElement.addEventListener("keydown", (event)  => {this.keyDown(event, this)});   
        this.keyFocusElement.addEventListener("keyup", (event) => {this.keyUp(event, this)});
    }

    mousedown(event, handler) {
        handler.mousePosition = handler.getMousePos(event, handler);
        handler.mouseDownPosition = handler.getMousePos(event, handler);
        handler.mouseIsDown = true;
        handler.findSelectedParticle(handler);

        if (handler.currentlySelectedParticle !== null && handler.enableMouseInteractions) {
            handler.createConstraint(handler);
        }

        handler.mouseDownFunction();
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
        handler.mouseUpFunction();
    }

    findSelectedParticle(handler) {
        const zero = new Vector2D(0,0);
        const testParticle = new Particle(handler.mouseDownPosition, zero, 1, 10);
        let min = Infinity;
        let minParticle = null;

        for (let particle of handler.world.particles.findNear(testParticle)) {
            const dist = particle.pos.sub(handler.mouseDownPosition).mag()
            if (dist<= particle.radius) {
                handler.selectedParticle = particle;
                handler.currentlySelectedParticle = particle;
                return;
            }else if (dist <= handler.minSelectRadius && dist < min) {
                min = dist;
                minParticle = particle;
            }   
        }

        if (minParticle !== null) {
            handler.selectedParticle = minParticle;
            handler.currentlySelectedParticle = minParticle;
        }
    }

    createConstraint(handler) {
        //let stiffness = handler.currentlySelectedParticle.mass * 50;
        //handler.particleConstraint = new ForcePivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, stiffness, stiffness/5);
        handler.particleConstraint = new PositionPivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, 
            0.3 / handler.world.iterationPerFrame / handler.world.iterationPerFrame);
        handler.world.addConstraint(handler.particleConstraint);
    }

    removeConstraint(handler) {
        if (handler.particleConstraint !== null) {
            handler.world.removeConstraint(handler.particleConstraint);
            handler.particleConstraint = null;
        }
    }

    keyDown(event, handler) {
        const key = event.key;
        for (let keyInput of handler.keyEvents) {
            if (keyInput.isMouseDown) {
                if (key === keyInput.keyCode && handler.mouseIsDown) {
                    handler.keyPress = key;
                    keyInput.func();
                }
            } else {
                if (key === keyInput.keyCode) {
                    handler.keyPress = key;
                    keyInput.func();
                }
            }
        }
    }

    keyUp(event, handler) {
        handler.keyPress = null
    }

    addKeyEvent(keyInput) {
        this.keyEvents.push(keyInput);
    }
}

/**
 * Static inner class for tracking key inputs.
 * @static
 */
InputHandler.KeyInput = class KeyInput {
    constructor(keyCode, func, isMouseDown=false) {
        this.keyCode = keyCode || "";
        this.func = func || (() => {});
        this.isMouseDown = isMouseDown;
    }
}

module.exports = InputHandler;