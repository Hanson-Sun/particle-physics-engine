const Particle = require("../core/Particle");
const Vector2D = require("./Vector2D");
const PositionPivotConstraint = require("../constraints/PositionPivotConstraint");

/**
 * A utility class that provides a quick user-input handling functionality. 
 * It supports mouse interactions with world items, with default mouse-particle interactions baked in.
 * Moreover, it also has key-event listening (can be on a focusable element, or the whole window).
 * Lastly, it can handle simultaneous mouse-key press combinations.
 * 
 * Note: This will only work with an HTML canvas element in the browser.
 */
class InputHandler {
    /**
     * @param {World} world world that the handler effects
     * @param {Boolean} enableMouseInteractions whether particle will interact with mouse (true by default)
     * @constructor
     */
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

        this.mouseSelectRadius = 15;

        this.mouseDownFunction = () => {};
        this.mouseUpFunction = () => {};
    }

    /**
     * Gets the mouse position relative to the world canvas element.
     * @param {Event} event 
     * @param {InputHandler} handler 
     * @returns {Vector2D} the mouse position
     * @private
     */
    getMousePos(event, handler) {
        const rect = handler.canvas.getBoundingClientRect();
        return new Vector2D(event.clientX - rect.left, event.clientY - rect.top);
    }

    /**
     * Begins mouse tracking (must be called for mouse interactions)
     * @public
     */
    startMouseHandling() {
        this.mouseFocusElement.addEventListener("mousedown", (event) => {this.mousedown(event, this)});
        this.mouseFocusElement.addEventListener("mousemove", (event) => {this.mousemove(event, this)});
        window.addEventListener("mouseup", (event) => {this.mouseup(event, this)});
    }

    /**
     * Begins key tracking (must be called for key interactions)
     * @public
     */
    startKeyHandling() {
        // this is cursed as hell...
        this.keyFocusElement.addEventListener("keydown", (event)  => {this.keyDown(event, this)});   
        this.keyFocusElement.addEventListener("keyup", (event) => {this.keyUp(event, this)});
    }

    /**
     * Function for actions performed during a mousedown event
     * @param {Event} event 
     * @param {InputHandler} handler 
     * @private
     */
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

    /**
     * Function for actions performed during a mousemove event
     * @param {Event} event 
     * @param {InputHandler} handler
     * @private 
     */
    mousemove(event, handler) {
        handler.mousePosition = handler.getMousePos(event, handler);
        if (handler.particleConstraint) {
            handler.particleConstraint.pos = handler.mousePosition;
        }
    }

    /**
     * Function for actions performed during a mouseup event
     * @param {Event} event 
     * @param {InputHandler} handler
     * @private 
     */
    mouseup(event, handler) {
        handler.mouseIsDown = false;
        handler.currentlySelectedParticle = null;
        handler.removeConstraint(handler);
        handler.mouseUpFunction();
    }

    /**
     * Finds the particle selected by mouse (either the particle clicked by mouse, or the closest one to it in a certain radius). 
     * Sets `this.selectedParticle` and `this.currentlySelectedParticle` as well.
     * @param {InputHandler} handler 
     * @private
     */
    findSelectedParticle(handler) {
        const zero = new Vector2D(0,0);
        const testParticle = new Particle(handler.mouseDownPosition, zero, 1, this.mouseSelectRadius);
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

    /**
     * Creates a constraint between the `mousePosition` and the `currentlySelectedParticle`
     * @param {InputHandler} handler 
     * @private
     */
    createConstraint(handler) {
        //let stiffness = handler.currentlySelectedParticle.mass * 50;
        //handler.particleConstraint = new ForcePivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, stiffness, stiffness/5);
        handler.particleConstraint = new PositionPivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, 
            0.3 / handler.world.iterationPerFrame / handler.world.iterationPerFrame);
        handler.world.addConstraint(handler.particleConstraint);
    }

    /**
     * Removes constraint between the `mousePosition` and the `currentlySelectedParticle`
     * @param {InputHandler} handler
     * @private 
     */
    removeConstraint(handler) {
        if (handler.particleConstraint !== null) {
            handler.world.removeConstraint(handler.particleConstraint);
            handler.particleConstraint = null;
        }
    }

    /**
     * Function for keydown events
     * @param {Event} event 
     * @param {InputHandler} handler 
     * @private
     */
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

    /**
     * Function for keyUp events
     * @param {Event} event 
     * @param {InputHandler} handler 
     * @private
     */
    keyUp(event, handler) {
        handler.keyPress = null
    }

    /**
     * Adds a `KeyInput` to the list of events that the `InputHandler` tracks
     * @param {KeyInput} keyInput 
     * @public
     */
    addKeyEvent(keyInput) {
        this.keyEvents.push(keyInput);
    }
}

/**
 * Static inner class of `InputHandler` for tracking Key input types.
 * @inner
 * @static
 */
InputHandler.KeyInput = class KeyInput {
    /**
     * @param {keyCode} keyCode activation key code
     * @param {Function} func action to be performed
     * @param {Boolean} isMouseDown determines whether activation requires mouseDown 
     * @constructor
     */
    constructor(keyCode, func, isMouseDown=false) {
        this.keyCode = keyCode || "";
        this.func = func || (() => {});
        this.isMouseDown = isMouseDown;
    }
}

module.exports = InputHandler;