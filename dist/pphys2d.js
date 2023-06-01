/*!
 * pphys2d 1.0.0 by @hanson-sun
 *   i need to make this
 *   License MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) Hanson Sun.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pphys", [], factory);
	else if(typeof exports === 'object')
		exports["pphys"] = factory();
	else
		root["pphys"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module encapsulation and export for entire physics engine
 */

const pphys = module.exports;

pphys.utils = __webpack_require__(1);
pphys.constraints = __webpack_require__(10);
pphys.walls = __webpack_require__(14);
pphys.core = __webpack_require__(18);
pphys.behaviors = __webpack_require__(28);
pphys.renderers = __webpack_require__(33);





/***/ }),
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module exports for the utils directory (i think ill add more later...)
 */

const utils = module.exports

utils.Vector2D = __webpack_require__(2);
utils.InputHandler = __webpack_require__(3);

/***/ }),
/* 2 */
/***/ ((module) => {

/**
 * Vector2D is a light-weight 2D vector class that implements several vector operations.
 * 
 * **Note**: modifying "to" methods that do not return a new Vector2D are more efficient, but there seems to a math consistency bug with those.
 */
class Vector2D {
	/**
	 * @constructor instantiate a new Vector2D.
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * returns a new added vector denoted by `this + v`.
	 * @param {Vector2D} v vector to be added
	 * @returns {Vector2D} 
	 */
	add(v) {
		return new Vector2D(this.x + v.x, this.y + v.y);
	}

	/**
	 * adds a vector to the current vector (`this = this + v`).
	 * @modifies this
	 * @param {Vector2D} v 
	 */
	addTo(v) {
		this.x = this.x + v.x;
		this.y = this.y + v.y;
	}

	/**
	 * returns a new subtracted vector denoted by `this - v`.
	 * @param {Vector2D} v vector to be added
	 * @returns {Vector2D} 
	 */
	sub(v) {
		return new Vector2D(this.x - v.x, this.y - v.y);
	}

	/**
	 * subtracts a vector to the current vector (`this = this - v`).
	 * @modifies this
	 * @param {Vector2D} v 
	 */
	subTo(v) {
		this.x = this.x - v.x;
		this.y = this.y - v.y;
	}

	/**
	 * returns a new scalar-multiplied vector denoted by `this * a`.
	 * @param {number} a scalar multiple
	 * @returns {Vector2D} 
	 */	
	mult(a) {
		return new Vector2D(this.x * a, this.y * a);
	}

	/**
	 * multiplies a scalar to the current vector (`this = this * a`).
	 * @modifies this
	 * @param {number} a 
	 */	
	multTo(a) {
		this.x = this.x * a;
		this.y = this.y * a;
	}

	/**
	 * returns the dot product of two vectors (`this` and `v`).
	 * @param {Vector2D} v  
	 * @returns {number}
	 */
	dot(v) {
		return this.x * v.x + this.y * v.y;
	}

	/**
	 * returns the "cross-product" of two vectors (`this` and `v`). Since these are 2D vectors, this is the 
	 * z-coordinate of the 3D counter parts of these 2D vectors. It returns a scalar.
	 * @param {Vector2D} v 
	 * @returns {number}
	 */
	cross(v) {
		return this.x * v.y - v.x * this.y;
	}

	/**
	 * returns the magnitude of the vector.
	 * @returns {number}
	 */
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);

	}

	/**
	 * returns the magnitude squared of the vector.
	 * @returns {number}
	 */
	magSqr() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * returns a new normalized Vector2D.
	 * @returns {Vector2D}
	 */
	normalize() {
		const mag = Math.sqrt(this.x * this.x + this.y * this.y);
		return new Vector2D(this.x / mag, this.y / mag);
	}

	/**
	 * normalizes the `this` Vector2D.
	 * @modifies this
	 */
	normalizeTo() {
		const mag = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x = this.x / mag;
		this.y = this.y / mag;
	}

	/**
	 * return the angle between `this` and v.  
	 * @param {Vector2D} v 
	 * @param {boolean} type  default set to `true` to return radians. Setting to false will return `degrees`.
	 * @returns {number}
	 */
	angleBetween(v, type = true) {
		const dot = this.x * v.x + this.y * v.y;
		const mag1 = ((this.x ** 2) + (this.y ** 2)) ** 0.5;
		const mag2 = ((v.x ** 2) + (v.y ** 2)) ** 0.5;
		if (type) {
			return Math.acos(dot / mag1 / mag2);
		}
		return Math.acos(dot / mag1 / mag2) * 180 / Math.PI;
	}

	/**
	 * Performs the mirror reflection for `this` about a normal vector.
	 * @param {Vector2D} normal 
	 * @returns Vector2D
	 */
	reflect(normal) {
		let dot2 = 2 * (this.x * normal.x + this.y * normal.y);
		let x = this.x - normal.x * dot2;
		let y = this.y - normal.y * dot2;
		return new Vector2D(x, y);
	}
}

module.exports = Vector2D;

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Particle = __webpack_require__(4);
const Vector2D = __webpack_require__(2);
const ForcePivotConstraint = __webpack_require__(8);

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
        handler.particleConstraint = new ForcePivotConstraint(handler.mousePosition, handler.currentlySelectedParticle, 0, stiffness, stiffness/5);
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

/***/ }),
/* 4 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const HashGridItem = __webpack_require__(5);
const Vector2D = __webpack_require__(2);
const SelfBehavior = __webpack_require__(6);
const NearBehavior = __webpack_require__(7);

/**
 * `Particle` is the main object of this physics engine. It is a 2D circle that is treated like a point mass at the center
 * and does **not** rotate. `Particle` is also a `HashGridItem` so it can be added to a `SpatialHashGrid`.
 */

class Particle extends HashGridItem {
	/**
	 * Instantiates new `Particle`
	 * @param {Vector2D} pos cartesian coordinates of the particle
	 * @param {Vector2D} vel velocity of the particle
	 * @param {Number} mass 
	 * @param {Number} radius 
	 * @param {Number} bounciness a value in [0,1] that represents the amount of energy retained after collision
	 * @param {Number} charge similar to real physical charge
	 * @param {String} color currently only supports HTML canvas colors format
	 */
	constructor(pos, vel, mass, radius, bounciness = 1, charge = 0, color="black") {
        super();
		this.charge = charge || 0;
		this.pos = pos;
		this.vel = vel || new Vector2D(0,0);
        this.force = new Vector2D(0, 0);
        this.mass = mass || 1;
        this.originalMass = mass || 1;
		this.radius = radius || 10;
		this.bounciness = bounciness || 1;
		this.prevPos = this.pos;
        this.color = color;
		this.nearBehavior = [];
		this.selfBehavior = [];
	}

	/**
	 * Increments the position by velocity `v`
	 * @param {Vector2D} v 
	 * @param {Number} timeStep 
	 */
	applyVelocity(v, timeStep) {
		this.pos = this.pos.add(v.mult(timeStep));
	}

	/**
	 * Applies force `f` to the velocity
	 * @param {Vector2D} f 
	 * @param {Number} timeStep 
	 */
    applyForce(f, timeStep) {
		this.vel = this.vel.add(f.mult(timeStep / this.mass));
	}

	/**
	 * Increments the velocity by an acceleration `a`
	 * @param {Vector2D} a 
	 * @param {Number} timeStep 
	 */
	applyAcceleration(a, timeStep) {
		this.vel = this.vel.add(a.mult(timeStep));
	}

	/**
	 * Adds a `SelfBehavior` to the particle
	 * @param {SelfBehavior} b 
	 */
	addSelfBehavior(b) {
		this.selfBehavior.push(b);
	}

	/**
	 * Adds a `NearBehavior` to the particle
	 * @param {NearBehavior} b 
	 */
	addNearBehavior(b) {
		this.nearBehavior.push(b);
	}

	/**
	 * Removes `NearBehavior` `b` if the particle has `b`  
	 * @param {NearBehavior} b 
	 * @returns {Boolean} true if the action is successful
	 */
	removeNearBehavior(b) {
		const index = this.nearBehavior.indexOf(b);
		if (index > -1) {
			this.nearBehavior.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Removes `SelfBehavior` `b` if the particle has `b`  
	 * @param {SelfBehavior} b 
	 * @returns {Boolean} true if the action is successful
	 */
	removeSelfBehavior(b) {
		const index = this.selfBehavior.indexOf(b);
		if (index > -1) {
			this.selfBehavior.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Clears all behaviors of the particle
	 */
	clearBehaviors() {
		this.nearBehavior = [];
		this.selfBehavior = [];
	}

    /**
     * @override
     * @returns {[Number, Number]} 
     */
	getHashPos() {
		return [this.pos.x, this.pos.y];
	}

    /**
     * @override
     * @returns {[Number, Number]} 
     */
	getHashDimensions() {
		return [this.radius * 2, this.radius * 2];
	}
}

module.exports = Particle;

/***/ }),
/* 5 */
/***/ ((module) => {

/**
 * Interface for all items that can be used with a `HashGrid`.
 * 
 * @interface
 */
class HashGridItem {
    _gridIndex = []
    _queryId = -1
    wallCollide = true;

    /**
     * @constructor interface cannot be instantiated
     */
    constructor() {
        if (this.constructor == HashGridItem) {
            throw new Error("HashGridItem interface class cannot be instantiated.");
        }
    }

    /**
     * Computes the coordinate position for the item within the `HashGrid`, expects center position.
     * @abstract
     * @returns {[Number, Number]} 
     */
    getHashPos() {
        throw new Error("Method 'getHashPos()' must be implemented.");
    }

    /**
     * Computes the dimensions of the item for the `HashGrid`.
     * @abstract
     * @returns {[Number, Number]} rectangular dimensions in [width, height]
     */
    getHashDimensions() {
        throw new Error("Method 'getHashDimensions()' must be implemented.");
    }

}

module.exports = HashGridItem;

/***/ }),
/* 6 */
/***/ ((module) => {

/**
 * Abstract class that represents self interactions. These behaviors are only dependent on the singular particle it is attached to.
 */
class SelfBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
        if (this.constructor == SelfBehavior) {
            throw new Error("SelfBehavior interface class cannot be instantiated.");
        }
    }

    /**
     * Apply behavior on `particle`
     * @param {Particle} particle 
     * @param {Number} timeStep 
     * @abstract
     */
    applyBehavior(particle, timeStep) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * Apply a positional correction to `particle`
     * @param {Particle} particle 
     * @abstract
     */
    applyCorrection(particle) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

}

module.exports = SelfBehavior;

/***/ }),
/* 7 */
/***/ ((module) => {

/**
 * Abstract class that represents nearby interactions. This type behavior will influence, or is dependent on a set of particles in its near proximity
 */
class NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor() {
        if (this.constructor == NearBehavior) {
            throw new Error("NearBehavior interface class cannot be instantiated.");
        }
    }

    /**
     * Apply behavior on `particle` and/or `particles`
     * @param {Particle} particle main particle
     * @param {Number} timeStep time step of simulation
     * @param {Particle[]} particles surrounding particles
     * @abstract
     */
    applyBehavior(particle, timeStep, particles) {
        throw new Error("Method 'applyBehavior()' must be implemented.");
    }

    /**
     * Returns the effective range / defines the size of the nearby range
     * @returns {[Number, Number]} pair of rectangular dimensions that represent the effective range
     * @abstract
     */
    range() {
        throw new Error("Method 'range()' must be implemented.");
    }

    /**
     * Apply a positional correction to `particle` and/or `particles`
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     * @abstract
     */
    applyCorrection(particle, particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }
}

module.exports = NearBehavior;

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Constraint = __webpack_require__(9);
const Particle = __webpack_require__(4);
const Vector2D = __webpack_require__(2);

/**
 * `ForcePivotConstraint` is a `Constraint` that limits the motion of a particle to a certain length away from a 
 * point in space. The implementation of this constraint is force-based like that of `ForceDistanceConstraint`.
 */
class ForcePivotConstraint extends Constraint {
    /**
     * Instantiates new `ForcePivotConstraint`
     * @param {Vector2D} pos - position of pivot
     * @param {Particle} c1 - constrained particle
     * @param {Number} len - constrained length
     * @param {Number} stiffness - the "spring constant", higher values are more stiff
     * @param {Number} dampening - damping force on constraint, must be greater than 0
     * @param {Number} breakForce - force at which the constraint breaks
     */
    constructor(pos, c1, len, stiffness, dampening = 0, breakForce = Infinity) {
        super();
        if (c1 === null) {
            throw new Error("One of the particles is null!");
        }
		this.pos = pos;
		this.c1 = c1;
		this.breakForce = breakForce;
		this.dampening = dampening;
        this.stiffness = stiffness;
		this.len = len;
        this.color = "black";
		this.force = new Vector2D(0,0);	
	}

    /**
     * @override
     * @param {Number} timeStep 
     */
    update(timeStep) {
        let dp = this.c1.pos.sub(this.pos);
        let dpMag = dp.mag();
        if(dpMag != 0) {
            let dpUnit = dp.mult(1 / dpMag);
            let dxMag = dpMag - this.len;
            let dv = this.c1.vel;
            let damp = this.dampening * dv.dot(dp) / dpMag;

            this.force = dpUnit.mult(-this.stiffness * dxMag - damp);

            const a1 = this.force.mult(1 / this.c1.mass);
            let x1 = a1.mult(timeStep * timeStep);

            this.c1.pos = this.c1.pos.add(x1);

        }
    }

    /**
     * @override
     * @returns {Vector2D[]}
     */    
	vertices() {
        return [this.pos, this.c1.pos];
    }

}

module.exports = ForcePivotConstraint;

/***/ }),
/* 9 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Vector2D = __webpack_require__(2);

/**
 * Interface for all Constraints
 * @interface
 */
class Constraint {
    /**
     * @constructor `Constraint` interface cannot be instantiated
     */
    constructor() {
        this.color = "black";
		this.force = new Vector2D(0,0);	
        this.breakForce = Infinity;
        if (this.constructor == Constraint) {
            throw new Error("Constraint interface class cannot be instantiated.");
        }
    }

    /**
     * Updates the constraint.
     * @param {Number} timeStep 
     */
    update(timeStep) {
        throw new Error("Method 'update()' must be implemented.");
    }

    /**
     * Calculates the list of vertices that will be used in the rendering process
     * @returns {Vector2D[]}
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented");
    }
}

module.exports = Constraint;

/***/ }),
/* 10 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module exports for the constraints directory
 */

const constraints =  module.exports;

constraints.Constraint = __webpack_require__(9);
constraints.ForceDistanceConstraint = __webpack_require__(11);
constraints.ForcePivotConstraint = __webpack_require__(8);
constraints.PositionDistanceConstraint = __webpack_require__(12);
constraints.PositionPivotConstraint = __webpack_require__(13);


/***/ }),
/* 11 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Constraint = __webpack_require__(9);
const Particle = __webpack_require__(4);
const Vector2D = __webpack_require__(2);

/**
 * `ForceDistanceConstraint` is a `Constraint` that constrains the distance between two particles.
 * It uses a force-based implementation and can be thought of as a spring between two particles.
 * In general, energy conservation is better at lower stiffness, and it can behave unstable or 
 * energetically inconsistent at higher stiffness.
 */
class ForceDistanceConstraint extends Constraint {
    /**
     * Instantiates new `ForceDistanceConstraint`
     * @param {Particle} c1 - particle 1
     * @param {Particle} c2 - particle 2
     * @param {Number} len - constrained length
     * @param {Number} stiffness - the "spring constant", higher values are more stiff
     * @param {Number} dampening - damping force on constraint, must be greater than 0
     * @param {Number} breakForce - force at which the constraint breaks
     */
    constructor(c1, c2, len, stiffness, dampening = 0, breakForce = Infinity) {
        super();
        if (c1 === null || c2 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.c2 = c2;
		this.breakForce = breakForce;
		this.dampening = dampening;
        this.stiffness = stiffness;
		this.len = len;

	}

    /**
     * @override
     * @param {Number} timeStep 
     */
    update(timeStep) {
        let dp = this.c1.pos.sub(this.c2.pos);
        let dpMag = dp.mag();

        let dpUnit = dp.mult(1 / dpMag);
        let dxMag = dpMag - this.len;
        let dv = this.c1.vel.sub(this.c2.vel);
        let damp = this.dampening * dv.dot(dp) / dpMag;

        this.force = dpUnit.mult(-this.stiffness * dxMag - damp);

        const a1 = this.force.mult(1 / this.c1.mass);
        const a2 = this.force.mult(-1 / this.c2.mass);

        let x1 = a1.mult(timeStep * timeStep);
        let x2 = a2.mult(timeStep * timeStep);

        this.c1.pos = this.c1.pos.add(x1);
        //this.c1.vel = this.c1.vel.add(a1.mult(timeStep));
        this.c2.pos = this.c2.pos.add(x2);
        //this.c2.vel = this.c2.vel.add(a2.mult(timeStep));
    }

    /**
     * @override
     * @returns {Vector2D[]}
     */
	vertices() {
        return [this.c1.pos, this.c2.pos];
    }

}

module.exports = ForceDistanceConstraint;

/***/ }),
/* 12 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Constraint = __webpack_require__(9);
const Particle = __webpack_require__(4);
const Vector2D = __webpack_require__(2);

/**
 * `PositionDistanceConstraint` is a `Constraint` that constrains the distance between two particles using a purely position-based method.
 * This implementation is more energetically stable; however, it is also less energy conservative and cannot be affected by damping. 
 * The stiffness parameters are closer to a relaxation factor in [0,1]. Similar to other constraints, the stiffer this constraint, 
 * the less energy conservative it becomes.
 */
class PositionDistanceConstraint extends Constraint {
	/**
	 * Instantiates new `PositionDistanceConstraint`
     * @param {Particle} c1 - particle 1
     * @param {Particle} c2 - particle 2
	 * @param {Number} len - constrained length
	 * @param {Number} stiffness - a relaxation parameter that is stable between [0,1] (higher is more stiff)
	 * @param {Number} breakForce - force at which the constraint breaks
	 */
    constructor(c1, c2, len, stiffness, breakForce = Infinity) {
        super();
        if (c1 === null || c2 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.c2 = c2;
		this.breakForce = breakForce;
        this.stiffness = stiffness;
		this.len = len;
	}

	/**
     * @override
     * @param {Number} timeStep 
     */
    update(timeStep) {
        let pos1 = this.c1.pos;
        let pos2 = this.c2.pos;
        let m1 = this.c1.mass;
        let m2 = this.c2.mass;

		let dp = pos2.sub(pos1);
		let dpMag = dp.mag();
		let dpDiff = (dpMag - this.len) * this.stiffness;
		let dpUnit = dp.normalize();
		let dd = dpUnit.mult(dpDiff);
		let disP = dd.mult(1 / (m1 + m2));
		this.force = disP;

		this.c1.pos = pos1.add((disP.mult(m1)));
		//this.c1.vel = this.c1.vel.add(disP.mult(m1 / timeStep));
		this.c2.pos = pos2.sub((disP.mult(m2)));
		//this.c2.vel = this.c2.vel.add(disP.mult(m2 / timeStep));
	}

    /**
     * @override
     * @returns {Vector2D[]}
     */	
	vertices() {
        return [this.c1.pos, this.c2.pos];
    }
}

module.exports = PositionDistanceConstraint;

/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Constraint = __webpack_require__(9);
const Particle = __webpack_require__(4);
const Vector2D = __webpack_require__(2);

/**
 * `PositionPivotConstraint` is a `Constraint` that limits the motion of a particle to a certain length away from a 
 * point in space. The implementation of this constraint is position-based like that of `PositionDistanceConstraint`.
 */
class PositionPivotConstraint extends Constraint {
	/**
	 * Instantiates new `PositionPivotConstraint`
     * @param {Vector2D} pos - position of pivot
     * @param {Particle} c1 - constrained particle
	 * @param {Number} len - constrained length
	 * @param {Number} stiffness - a relaxation parameter that is stable between [0,1] (higher is more stiff)
	 * @param {Number} breakForce - force at which the constraint breaks
	 */
    constructor(pos, c1, len, stiffness, breakForce = Infinity) {
        super();
        if (c1 === null) {
            throw new Error("One of the particles is null!");
        }
		this.c1 = c1;
		this.pos = pos;
		this.breakForce = breakForce;
        this.stiffness = stiffness;
		this.len = len;
	}

	/**
     * @override
     * @param {Number} timeStep 
     */
    update(timeStep) {
        let pos1 = this.c1.pos;
        let pos2 = this.pos;

		let dp = pos2.sub(pos1);
		let dpMag = dp.mag();
        if (dpMag != 0) {
            let dpDiff = (dpMag - this.len) * this.stiffness;
            let dpUnit = dp.normalize();
            let dd = dpUnit.mult(dpDiff);
            this.force = dd;

            this.c1.pos = pos1.add(dd);
            //this.c1.vel = this.c1.vel.add(disP.mult(m1 / timeStep));
        }
	}

    /**
     * @override
     * @returns {Vector2D[]}
     */	
	vertices() {
        return [this.c1.pos, this.pos];
    }
}

module.exports = PositionPivotConstraint;

/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module exports for the walls directory
 */

const walls = module.exports;

walls.Wall = __webpack_require__(15);
walls.WallBoundary = __webpack_require__(16);
walls.RectangularWorldBoundary = __webpack_require__(17);


/***/ }),
/* 15 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const HashGridItem = __webpack_require__(5);

/**
 * `Wall` is an Interface for any wall objects. Walls are `HashGridItems`; however, it only uses the SpatialHashGrid methods
 * that calculate the particles in its close proximity and **cannot** be added to the grid itself. Wall objects
 * are also stationary and are not influenced by any external factors.
 * @interface
 */
class Wall extends HashGridItem {
    /**
     * Instantiates new `Wall`
     */
    constructor() {
        super();
        if (this.constructor == Wall) {
            throw new Error("Wall interface class cannot be instantiated.");
        }
    }

    /**
     * Resolve the collisions between the surrounding particles and the Wall itself.
     * @param {Particle[]} particles surrounding particles that interact with the wall 
     * @param {Number} timeStep 
     */
    resolveCollisions(particles, timeStep) {
        throw new Error("Method 'resolveCollisions()' must be implemented.");
    }

    /**
     * Applies positional corrections on particles (walls do not move)
     * @param {Particle[]} particles 
     */
    applyCorrection(particles) {
        throw new Error("Method 'applyCorrection()' must be implemented.");
    }

    /**
     * Calculates the vertices of the wall
     * @returns {Vector2D[]}
     */
    vertices() {
        throw new Error("Method 'vertices()' must be implemented.");
    }
}

module.exports = Wall;

/***/ }),
/* 16 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Vector2D = __webpack_require__(2);
const Wall = __webpack_require__(15);

/**
 * `WallBoundary` is a simple `Wall` that is comprised of a straight-line between two spatial coordinates. Wall positions
 * are generally meant to be immutable since the normal vector is calculated upon instantiation. However, wall position
 * can be modified with some care.
 */
class WallBoundary extends Wall {

    /**
     * Instantiates new `WallBoundary`
     * @param {*} x1 x-position of first vertex
     * @param {*} y1 y-position of first vertex
     * @param {*} x2 x-position of second vertex
     * @param {*} y2 y-position of second vertex
     * @param {*} width rendered line width of wall (does not effect physics)
     */
    constructor(x1, y1, x2, y2, width=1) {
        super();
        this.p1 = new Vector2D(x1, y1);
        this.p2 = new Vector2D(x2, y2);
        this.direction = this.p1.sub(this.p2);
        this.width = width;
        this.normal = (new Vector2D((y2-y1), -(x2-x1))).normalize();
    }


    /**
     * @override
     * @param {Particle[]} particles 
     * @param {Number} timeStep 
     */
    resolveCollisions(particles, timeStep) {
        for (let particle of particles) {
            let pos = particle.pos;
            let bounciness = particle.bounciness;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }
        
            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();

            if (distance <= particle.radius && lambda < 0) {
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance <= particle.radius && lambda > 1) {
                let diff = pos.sub(this.p2);
                let velocity = particle.vel;
                let vDot = - (velocity.dot(diff)) / (diff.magSqr());
                //particle.vel = (velocity.sub(diff.mult(vDot * 2))).mult(bounciness);
                particle.pos = particle.pos.add(diff.mult(vDot * 2 * bounciness * timeStep));
            } else if (distance <= particle.radius) {
                //particle.vel = particle.vel.reflect(this.normal).mult(bounciness);
                //let mag = particle.vel.reflect(this.normal).dot(this.normal);
                //particle.pos = particle.pos.add(this.normal.mult(2 * timeStep * mag * bounciness));
                let mag = particle.vel.reflect(this.normal).sub(particle.vel).mult(timeStep * bounciness);
                particle.pos = particle.pos.add(mag);
            }
        }
    }

    /**
     * @override
     * @param {Particle[]} particles 
     */
    applyCorrection(particles) {
        for (let particle of particles) {
            let pos = particle.pos;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }
        
            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();
            let overlap = distance - particle.radius;

            if (distance < particle.radius && lambda < 0) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            } else if (distance < particle.radius && lambda > 1) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            } else if (distance < particle.radius) {
                particle.pos = particle.pos.sub(projectedDiff.normalize().mult(overlap));
            }
        }
    }

    /**
     * Checks if a Particle is colliding with the Wall
     * @param {Particle} particle 
     * @returns {Boolean} true if particle is colliding with wall
     */
    isCollide(particle) {
        let pos = particle.pos;

            let diff = pos.sub(this.p1);
            let segVect = this.p2.sub(this.p1);
          
            let dot = diff.dot(segVect);
            let len_sq = segVect.magSqr();
    
            let lambda = -1;
            if (len_sq != 0) { 
                lambda = dot / len_sq;
            }
    
            let projected;
          
            if (lambda < 0) {
              projected = this.p1;
            } else if (lambda > 1) {
              projected = this.p2;
            } else {
              projected = this.p1.add(segVect.mult(lambda));
            }

            let projectedDiff = pos.sub(projected);
            let distance = projectedDiff.mag();

            return distance < particle.radius;
    }

    /**
     * @override
     * @returns {[Number, Number]} 
     */
    getHashPos() {
        return [(this.p2.x + this.p1.x) / 2, (this.p2.y + this.p1.y) / 2];
    }

    /**
     * @override
     * @returns {[Number, Number]} 
     */
    getHashDimensions() {
        return [Math.abs(this.p2.x - this.p1.x), Math.abs(this.p2.y - this.p1.y)];
    }

    /**
     * @override
     * @returns {[Vector2D, Vector2D]} 
     */
    vertices() {
        return [this.p1, this.p2];
    }
}

module.exports = WallBoundary;

/***/ }),
/* 17 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Wall = __webpack_require__(15);

// stand-in until i figure out how to implement the other walls.
class RectangularWorldBoundary extends Wall {

    constructor(minW, maxW, minH, maxH) {
        super();
        this.minW = minW;
        this.maxW = maxW;
        this.minH = minH;
        this.maxH = maxH;        
    }

    resolveCollisions(particles, timeStep) {
        for (let particle of particles) {
            const posX = particle.pos.x;
            const posY = particle.pos.y;
            const radius = particle.radius;
            const bounce = particle.bounciness;
            const velX = particle.vel.x;
            const velY = particle.vel.y;
            
            if (posX > this.maxW - radius) {
                //particle.vel.x = velX * -1 * bounce;
                particle.pos.x = posX +  2 * velX * -1 * bounce * timeStep;
            } 

            if (posX < this.minW + radius) {
                //particle.vel.x = velX * -1 * bounce;
                particle.pos.x = posX +  2 * velX * -1 * bounce * timeStep;
            } 

            if (posY > this.maxH - radius) {
                //particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * velY * -1 * bounce * timeStep;
            } 

            if (posY < this.minH + radius) {
                //particle.vel.y = velY * -1 * bounce;
                particle.pos.y = posY + 2 * velY * -1 * bounce * timeStep;
            }
        }
    }

    applyCorrection(particles) {
        for (let particle of particles) {
            const radius = particle.radius;
            if (particle.pos.x > this.maxW - radius) {
                particle.pos.x = this.maxW - radius;
            }

            if (particle.pos.x < this.minW + radius) {
                particle.pos.x = this.minW + radius;
            }

            if (particle.pos.y > this.maxH - radius) {
                particle.pos.y = this.maxH - radius;
            }

            if (particle.pos.y < this.minH + radius) {
                particle.pos.y = this.minH + radius;
            }
        }
    }

    isCollide(particle) {
        const posX = particle.pos.x;
        const posY = particle.pos.y;
        const radius = particle.radius;
        
        return  (posX >= this.maxW - radius) || (posX <= this.minW + radius) || 
                (posY >= this.maxH - radius) || (posY <= this.minH + radius) || 
                (particle.pos.x >= this.maxW - radius) || (particle.pos.x <= this.minW + radius) || 
                (particle.pos.y >= this.maxH - radius) || (particle.pos.y <= this.minH + radius)
    }

    getHashPos() {
        return [(this.maxW + this.minW) / 2, (this.maxH + this.minH) / 2];
    }

    getHashDimensions() {
        return [this.maxW - this.minW, this.maxH - this.minH];
    }

    vertices() {
        return [];
    }
}

module.exports = RectangularWorldBoundary;

/***/ }),
/* 18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module exports for the core directory
 */

const core = module.exports;

core.HashGridItem = __webpack_require__(5);
core.Particle = __webpack_require__(4);
core.Solver = __webpack_require__(19);
core.SpatialHashGrid = __webpack_require__(20);
core.World = __webpack_require__(21);

/***/ }),
/* 19 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Constraint = __webpack_require__(9);
const Wall = __webpack_require__(15);
const Particle = __webpack_require__(4);
const SpatialHashGrid = __webpack_require__(20);

/**
 * `Solver` is the discrete solver algorithm that calculates the movement of the physics world. It uses a modified 
 * predictive-corrective semi-implicit Euler implementation. Because this is a local iterative solver, there may be 
 * divergence issues at higher timeSteps and convergence can be tuned with the iterationPerFrame.
 */
class Solver {
    /**
     * Instantiates new `Solver`
     * @param {Number} timeStep the change in time per frame (smaller is more accurate)
     * @param {Number} iterationPerFrame the amount of time the solver is called per frame (**not** substepping, timeStep remains constant)
     * @param {Number} constraintIteration the amount of times the constraints are solved per frame
     * @param {SpatialHashGrid} particles SpatialHashGrid of particles
     * @param {Constraint[]} constraints list of constraints
     * @param {Wall[]} walls list of walls
     */
    constructor(timeStep, iterationPerFrame, constraintIteration, particles, constraints, walls) {
        this.timeStep = timeStep;
        this.iterationPerFrame = iterationPerFrame;
        this.particles = particles;
        this.constraints = constraints;
        this.constraintIteration = constraintIteration;
        this.run = true;
        this.particles = particles;
        this.particleList = this.particles.values();
        this.walls = walls;
    }

    /**
     * Solves one iteration of the current physics world
     */
    solve() {
        // calculate future pos and store current pos as previous pos
        // apply behaviors, any forces, and corrections
        // calculate constraint correction based on current position
        // apply correction, set forces to 0, apply velocity to get final pos.
        // there might be duplicate processes... i think i need to fix that
        this.preMove();
        this.update();
        this.handleBehaviors();
        this.handleConstraints();
        this.handleWallCollisions();
        this.updateVelocity();
        this.positionCorrection();
    }

    /**
     * Optional function that can be defined to exhibit certain behavior in the solve loop.
     */
    update(){
        return;
    }

    /**
     * Move particle positions forward to the "future-position"
     */
    preMove() {
        for (let circ of this.particleList) {
            circ.prevPos = circ.pos;
            circ.applyVelocity(circ.vel, this.timeStep);
        }
    }

    /**
     * Solve physics interactions from Behaviors
     */
    handleBehaviors() {
        for (let circ of this.particleList) {

            for (let sb of circ.selfBehavior) {
                sb.applyBehavior(circ, this.timeStep);
            }

            for (let nb of circ.nearBehavior) {
                nb.applyBehavior(circ, this.timeStep, this.particles.findNear(circ, nb.range()));
            }       
        }
    }

    /**
     * Solve physics interactions from Constraints
     */
    handleConstraints() {
        let dt = this.timeStep / this.constraintIteration;
        for (let i = 0; i < this.constraintIteration; i++) {
            for (let c of this.constraints) {
                c.update(dt);
                if (c.breakForce !== ( false || Infinity) && c.force.mag() > c.breakForce) {
                    const index = this.constraints.indexOf(c);
                    if (index > -1) {
                        this.constraints.splice(index, 1);
                    }
                }
            }
        }
    }

    /**
     * Solve collision interactions with Walls
     */
    handleWallCollisions() {
        for (let wall of this.walls) {
            wall.resolveCollisions(this.particles.findNear(wall), this.timeStep);
        }
    }

    /**
     * Update final particle velocities
     */
    updateVelocity() {
        for (let circ of this.particleList) {
            circ.vel = circ.pos.sub(circ.prevPos).mult(1 / this.timeStep);
            this.particles.updateItem(circ);
        }
    }

    /**
     * Correct particle positions 
     */
    positionCorrection() {
        for (let circ of this.particleList) {

            for (let sb of circ.selfBehavior) {
                sb.applyCorrection(circ);
            }

            for (let nb of circ.nearBehavior) {
                nb.applyCorrection(circ, this.particles.findNear(circ, nb.range()));
            }       
        }

        for (let wall of this.walls) {
            wall.applyCorrection(this.particles.findNear(wall));
        }
    }

    /**
     * Computes next frame or "world-state"
     */
    nextFrame() {
        for (let i = 0; i < this.iterationPerFrame; i++) {
            this.solve();
        }
    }

    /**
     * Update the particle positions in the SpatialHashGrid
     */
    updateSolverParticles() {
        this.particleList = this.particles.values();
    }
}

module.exports = Solver;

/***/ }),
/* 20 */
/***/ ((module) => {

/**
 * The `SpatialHashGrid` is is a data structure that stores and sorts items into distinct "2D grids".
 * It allows for the quick access of nearby items without brute force iteration.
 * This data structure can increase performance by ~100x for sufficiently large collision interactions in close proximity. 
 * Note that this data structure is not directly iterable.
 *  
 * **Important:** Only items that implement the `HashGridItem` interface are compatible with the `SpatialHashGrid`.
 */
class SpatialHashGrid {
    #queryIds;
    #cells;

    /**
     * @constructor instantiates new SpatialHashGrid
     * @param {Number} width width of HashGrid
     * @param {Number} height height of HashGrid
     * @param {int} xGrids number of grid separations on the x-axis
     * @param {int} [yGrids=null] optional param number of grid separations on the y-axis, defaults to same as xGrids
     * @access public
     */
    constructor(width, height, xGrids, yGrids=null) {
        this.width = width;
        this.height = height;
        this.xGrids = Math.floor(xGrids);
        this.yGrids = Math.floor(yGrids) || Math.floor(xGrids);
        this.#cells = [];
        this.#initialize();
        this.#queryIds = 0;
    }

    /**
     * Adds an item to the HashGrid.
     * @param {HashGridItem} item 
     * @access public
     */
    add(item) {
        this.#insert(item);
    }

    /**
     * Private method that initializes 2D grid.
     * @access private
     */
    #initialize() {
        for (let x = 0; x < this.xGrids; x++) {
            let row = [];
            for(let y = 0; y < this.yGrids; y++) {
                row.push(new Set());
            }
            this.#cells.push(row);
        }
    }

    /**
     * Private method that inserts the item into its corresponding grid cell
     * @param {HashGridItem} item 
     * @access private
     */
    #insert(item) {
        const [x, y] = item.getHashPos();
        const [w, h] = item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        item._gridIndex = [i1, i2];

        for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
                this.#cells[x][y].add(item);
            }
        }
    }

    /**
     * Finds the nearest grid coordinate that the encapsulates (x, y).
     * @param {Number} x 
     * @param {Number} y 
     * @returns {[int, int]} grid coordinates
     * @access private
     */
    #getCellIndex(x, y) {
        // 1.1 because it will not work for xScaled=1
        const xScaled = Math.min(Math.max((x / this.width), 0.0), 1);
        const yScaled = Math.min(Math.max((y / this.height), 0.0), 1);

        const xIndex = Math.round((this.xGrids - 1) * xScaled);
        const yIndex = Math.round((this.yGrids - 1) * yScaled);

        return [xIndex, yIndex];

        
    }

    /**
     * Finds the nearby items for a given item, and updates the queryId.
     * @param {HashGridItem} item 
     * @param {[Number, Number]} range - optional param that overrides the `getHashDimensions` default surrounding dimensions of the hash item.
     * @returns {HashGridItem[]}
     * @access public
     */
    findNear(item, range = null) {
        const [x, y] = item.getHashPos();
        const [w, h] = range || item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        const queryId = this.#queryIds++;
        if (queryId >= Number.MAX_SAFE_INTEGER) {
            this.#queryIds = 0;
        }
        
        const items = [];
        for (let x = i1[0], xn = i2[0]; x <= xn; x++) {
            for (let y = i1[1], yn = i2[1]; y <= yn; y++) {
                for (let v of this.#cells[x][y]) {
                    if (v.queryId !== queryId) {
                        v.queryId = queryId;
                        items.push(v);
                    }
                }
            }
        }
        return items;
    }

    /**
     * Updates the grid positions of the item within the HashGrid. This function **MUST** be called after any position change.
     * @param {HashGridItem} item 
     * @access public
     */
    updateItem(item) {
        const [x, y] = item.getHashPos();
        const [w, h] = item.getHashDimensions();

        const i1 = this.#getCellIndex(x - w / 2, y - h / 2);
        const i2 = this.#getCellIndex(x + w / 2, y + h / 2);

        const gridIndex1 = item._gridIndex[0];
        const gridIndex2 = item._gridIndex[1];
        if (gridIndex1[0] === i1[0] &&
            gridIndex1[1] === i1[1] &&
            gridIndex2[0] === i2[0] &&
            gridIndex2[1] === i2[1]) {
                return;
        }
        
        this.deleteItem(item);
        this.#insert(item);
    }
    
    /**
     * Delete item from HashGrid.
     * @modifies this
     * @param {HashGridItem} item
     */
    deleteItem(item) {
        const [i1, i2] = item._gridIndex;

        for (let x = i1[0], xn = i2[0]; x <= xn; x++) {
            for (let y = i1[1], yn = i2[1]; y <= yn; y++) {
                this.#cells[x][y].delete(item);
            }
        }
    }

    /**
     * Returns a unique list of all HashGridItems the HashGrid. 
     * @modifies this
     * @returns {HashGridItem[]}
     */
    values() {
        const iterable = [];

        const queryId = this.#queryIds++;
        if (queryId >= Number.MAX_SAFE_INTEGER) {
            this.#queryIds = 0;
        }

        for (let row of this.#cells) {
            for (let set of row) {
                for (let i of set) {
                    if (i.queryId !== queryId) {
                        i.queryId = queryId;
                        iterable.push(i);
                    }
                }
            }
        }
        return iterable;
    }
}

module.exports = SpatialHashGrid;

/***/ }),
/* 21 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RectangularWorldBoundary = __webpack_require__(17);
const Collision = __webpack_require__(22);
const SpatialHashGrid = __webpack_require__(20);
const Solver = __webpack_require__(19);
const Renderer = __webpack_require__(23);
const Gravity = __webpack_require__(27);

/**
 * `World` the global-state instance of the physics engine that keeps track of all the objects. This provides
 * a higher level of abstraction from the user but may be limiting in some ways. It is a good idea to extend and 
 * override this class for any specific properties. With the current SpatialHashing algorithm, the world should have
 * finite bounds.
 */
class World {
    /**
     * Instantiates new `World` instance
     * @param {HTMLCanvasElement} canvas HTML canvas where the elements are displayed
     * @param {Number} width width of world
     * @param {Number} height height of world
     * @param {Number} xGrids integer number of grid separations in the x direction
     * @param {Number} yGrids integer number of grid separations in the y direction
     * @param {Number} timeStep change in time per solve iteration
     * @param {Number} iterationPerFrame number of solve iterations per frame
     * @param {Number} constraintIteration number of times constraints are solved per iteration
     */
    constructor(canvas, width, height, xGrids, yGrids = null, timeStep = 1, iterationPerFrame = 1, constraintIteration = 1) {
        this.timeStep = timeStep;
        this.iterationPerFrame = iterationPerFrame;
        this.constraintIteration = constraintIteration;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.xGrids = xGrids;
        this.yGrids = yGrids;
        this.gravity = null;
        
        this.particles = new SpatialHashGrid(width, height, xGrids, yGrids);
        this.particlesList = [];
        this.constraints = [];
        this.walls = [];
        
        this.solver = new Solver(this.timeStep, this.iterationPerFrame, this.constraintIteration, this.particles, this.constraints, this.walls);
        this.renderer = new Renderer(this.solver, this.canvas);

        this.isRender = true;
    }

    /**
     * Adds a particle to the world
     * @param {Particle} p 
     */
    addParticle(p) {
        this.particles.add(p);
        this.updateParticleList();
    }

    /**
     * Adds a constraint to the world
     * @param {Constraint} c 
     */
    addConstraint(c) {
        this.constraints.push(c);
    }

    /**
     * Removes a constraint from the world
     * @param {Constraint} c 
     * @returns {Boolean} true if the constraint is removed
     */
    removeConstraint(c) {
        const index = this.constraints.indexOf(c);
		if (index > -1) {
			this.constraints.splice(index, 1);
			return true;
		}
		return false;
    }

    /**
     * Adds a wall to the world
     * @param {Wall} w 
     */
    addWall(w) {
        this.walls.push(w);
    }

    /**
     * Clears all of the particles
     */
    clearParticles() {
        this.particles = new SpatialHashGrid(this.width, this.height, this.xGrids, this.yGrids);
        this.updateParticleList();
    }

    /**
     * Clears all of the constraints
     */
    clearConstraints() {
        this.constraints = [];
        this.updateParticleList();
    }

    /**
     * Update the list of particles. Must be called every time the number of particles change.
     */
    updateParticleList() {
        this.particlesList = this.particles.values();
        this.renderer.updateRendererParticles(this.particlesList);
        this.solver.updateSolverParticles();
    }

    /**
     * Adds a SelfBehavior to all the particles
     * @param {SelfBehavior} b 
     */
    addGlobalBehavior(b) {
        for (let p of this.particlesList) {
            p.addSelfBehavior(b);
        }
    }

    /**
     * Removes a SelfBehavior from all the particles
     * @param {SelfBehavior} b 
     */
    removeGlobalBehavior(b) {
        for (let p of this.particlesList) {
            p.removeSelfBehavior(b);
        }
    }

    /**
     * Adds a NearBehavior to all the particles
     * @param {NearBehavior} b 
     */
    addGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.addNearBehavior(b);
        }
    }

    /**
     * Removes a NearBehavior to all the particles
     * @param {NearBehavior} b 
     */
    removeGlobalNearBehavior(b) {
        for (let p of this.particlesList) {
            p.removeNearBehavior(b);
        }
    }

    /**
     * Disables gravity and adds a new global gravity behavior to all the particles, while updating 
     * the gravity pointer
     * @param {Number} num 
     */
    enableGravity(num) {
        if (this.gravity) {
            this.disableGravity();
        }
        this.gravity = new Gravity(new Vector2D(0, num));
        this.addGlobalBehavior(this.gravity);
    }

    /**
     * Removes the global gravity behavior
     * @returns {Boolean} true if gravity is successfully disabled
     */
    disableGravity() {
        if (this.gravity) {
            this.removeGlobalBehavior(this.gravity);
            return true;
        }
        return false;
    }

    /**
     * Progresses world to next area
     */
    nextFrame() {
        this.solver.nextFrame();
        if (this.isRender) {
            this.renderer.renderFrame();
        }
    }

    enableCollisions() {
        if (this.collision) {
            this.disableCollisions();
        }
        this.collision = new Collision();
        this.addGlobalNearBehavior(this.collision);
    }

    disableCollisions() {
        if (this.collision) {
            this.removeGlobalNearBehavior(this.collision);
            return true;
        }
        return false;
    }

    // TODO: implement rayCasting for line obstacle support
    constrainBoundary(x1= -Infinity, x2= Infinity, y1= -Infinity, y2= Infinity) {
        this.worldConstraint = new RectangularWorldBoundary(x1, x2, y1, y2);
        this.walls.push(this.worldConstraint);
    }

    enableDrag(viscosity) {
        if (this.dragBehavior) {
            this.disableDrag();
        }
        this.dragBehavior = new Drag(viscosity);
        this.addGlobalBehavior(this.dragBehavior);
    }

    disableDrag() {
        if (this.dragBehavior) {
            this.removeGlobalBehavior(this.dragBehavior);
            return true;
        }
        return false;
    }

    enableChargeInteractions() {
        if(this.chargeBehavior) {
           this.disableChargeInteractions();
        }
        this.chargeBehavior = new ChargeInteraction();
        this.addGlobalNearBehavior(this.chargeBehavior);
    }

    disableChargeInteractions() {
        if (this.chargeBehavior) {
            this.removeGlobalBehavior(this.chargeBehavior);
            return true;
        }
        return false;
    }

    makePivot(p, pos=null) {
        // this is incredibly scuffed, but this is what i could think of without introducing high cohesion
        for (let b of p.selfBehavior) {
            console.log(b);
            if(b instanceof PositionLock) {
                return false;
            }
        }
        p.mass = p.mass + Number.MAX_SAFE_INTEGER / 10;
        if(pos === null) {
            p.addSelfBehavior(new PositionLock(p.pos));
        } else {
            p.addSelfBehavior(new PositionLock(pos));
        }
        return true;
    }

    freePivot(p) {
        for (let b of p.selfBehavior) {
            if(b instanceof PositionLock) {
                p.mass = p.mass - Number.MAX_SAFE_INTEGER / 10;
                p.removeSelfBehavior(b);
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {Function} update 
     */
    setSolverUpdate(update) {
        this.solver.update = update;
    }

}

module.exports = World;


/***/ }),
/* 22 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const NearBehavior = __webpack_require__(7);

/**
 * `Collision` is a `NearBehavior` that calculates collision interactions between a particle and its nearby particles.
 * Collisions operate on impulse-based dynamics and are quite stiff. There are some potential issues with collision instability
 * when too much force / number of collisions stack.
 */
class Collision extends NearBehavior {

	/**
	 * Instantiates new Collision behavior object
	 * @constructor
	 */
    constructor() {
        super();
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     * @param {Particle[]} particles 
     */
    applyBehavior(particle, timeStep, particles) {
        this.collide(particle, particles, timeStep);
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     */
	applyCorrection(particle, particles) {
        this.collideCorrection(particle, particles);
    }

	/**
	 * Perform the collision update of a `Particle` by calculating impulse based velocity and position changes. 
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 * @param {Number} timeStep 
	 */
	collide(particle, particles, timeStep) {
		let impulse = new Vector2D(0,0);
		let position = particle.pos;
		let mass = particle.mass;
		let velocity = particle.vel;
		let bounciness = particle.bounciness;
		let radius = particle.radius;

		for (let circ of particles) {
			if (circ != particle) {
                let c_position = circ.pos;
                let c_mass = circ.mass;
                let c_velocity = circ.vel;
                let c_radius = circ.radius;

				let posDiff1 = position.sub(c_position);
				if (posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius)) {
					let posDiffMagSqr = posDiff1.magSqr();
					let massConst1 = 2 * c_mass / (mass + c_mass);
					let vDiff1 = velocity.sub(c_velocity);
					let dot1 = (vDiff1.dot(posDiff1)) / (posDiffMagSqr);

					let massConst2 = 2 * mass / (mass + c_mass);
					let vDiff2 = c_velocity.sub(velocity);
					let posDiff2 = c_position.sub(position);
					let dot2 = (vDiff2.dot(posDiff2)) / (posDiffMagSqr);
					impulse = impulse.add(posDiff1.mult(dot1 * massConst1));
					// idk why this works tbh but it just does
					circ.vel = (c_velocity.sub(posDiff2.mult(dot2 * massConst2)));
					circ.pos = circ.pos.sub(posDiff2.mult(dot2 * massConst2 * bounciness * timeStep));
				}
			}
		}

		particle.vel = velocity.sub(impulse);
		particle.pos = position.sub(impulse.mult(timeStep));
	}

	/**
	 * Performs the position-based correction after impulse collision. This ensures that particles are not stuck within each other.
	 * @param {Particle} particle - particle with collision check
	 * @param {Particle[]} particles - nearby particles that interact with `particle`
	 */
	collideCorrection(particle, particles) {
		for (let circ of particles) {
			if (circ != particle) {
                let position = particle.pos;
                let mass = particle.mass;
                let radius = particle.radius;

                let c_position = circ.pos;
                let c_mass = circ.mass;
                let c_radius = circ.radius;

				let posDiff1 = position.sub(c_position);
				if (posDiff1.magSqr() <= (radius + c_radius) * (radius + c_radius)) {
					let direction1 = posDiff1.normalize();
					let overlap = radius + c_radius - posDiff1.mag();

					circ.pos = circ.pos.sub(direction1.mult(overlap * mass / (mass + c_mass)));
					particle.pos = position.add(direction1.mult(overlap * c_mass / (mass + c_mass)));
					
				}
			}
		}
	}

   	/**
     * @override
     * @returns {null}
     */
    range() {
        return null;
    }

	/**
	 * A static method that checks whether two particles are colliding
	 * @param {Particle} p1 
	 * @param {Particle} p2 
	 * @returns boolean
	 * @static
	 */
	static isCollide(p1, p2) {
		let position = p1.pos;
		let radius = p1.radius;
		let c_position = p2.pos;
		let c_radius = p2.radius;
		let posDiff1 = position.sub(c_position);
		return posDiff1.magSqr() < (radius + c_radius) * (radius + c_radius);
	}
}

module.exports = Collision;

/***/ }),
/* 23 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ConstraintRenderer = __webpack_require__(24);
const ParticleRenderer = __webpack_require__(25);
const WallRenderer = __webpack_require__(26);

class Renderer {
    constructor(solver, canvas) {
        this.solver = solver;
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.constraintRenderer = new ConstraintRenderer(solver.constraints, this.context);
        this.particleRenderer = new ParticleRenderer(solver.particles.values(), this.context);
        this.wallRenderer = new WallRenderer(solver.walls, this.context);
    }

    // call this anytime a new particle is added
    updateRendererParticles(list) {
        this.particleRenderer.particles = list;
    }

    updateContext(context) {
        this.constraintRenderer.context = context;
        this.particleRenderer.context = context;
    }

    renderFrame() {
        this.clear();
        this.particleRenderer.renderFrame();
        this.constraintRenderer.renderFrame();
        this.wallRenderer.renderFrame();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

module.exports = Renderer;

/***/ }),
/* 24 */
/***/ ((module) => {

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

module.exports = ConstraintRenderer;

/***/ }),
/* 25 */
/***/ ((module) => {

class ParticleRenderer {

    constructor(particles, context) {
        this.particles = particles;
        this.context = context;
    }

    // call this anytime a new particle is added
    renderFrame() {
        for (let p of this.particles) {
            this.draw(p);
        }
    }

	draw(p) {
		this.context.beginPath();
		this.context.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
		this.context.strokeStyle = p.color;
		this.context.fillStyle = p.color;
		this.context.stroke();
        
	}

}

module.exports = ParticleRenderer;

/***/ }),
/* 26 */
/***/ ((module) => {

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

module.exports = WallRenderer;

/***/ }),
/* 27 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SelfBehavior = __webpack_require__(6);

/**
 * `Gravity` is a `SelfBehavior` that applies a constant acceleration downwards.
 */
class Gravity extends SelfBehavior {
	/**
	 * Instantiates new Gravity behavior object
	 * @constructor
	 */     
    constructor(acceleration) {
        super();
        this.acceleration = acceleration;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
    applyBehavior(particle, timeStep) {
        //particle.applyAcceleration(this.acceleration, timeStep);
        particle.pos = particle.pos.add(this.acceleration.mult(timeStep * timeStep));
    }

    /**
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }
}

module.exports = Gravity;

/***/ }),
/* 28 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module export for the the behaviors directory.
 */

const behaviors = module.exports;

behaviors.ChargeInteraction = __webpack_require__(29);
behaviors.Collision = __webpack_require__(22);
behaviors.Drag = __webpack_require__(30);
behaviors.Force = __webpack_require__(31);
behaviors.Gravity = __webpack_require__(27);
behaviors.PositionLock = __webpack_require__(32);
behaviors.NearBehavior = __webpack_require__(7);
behaviors.SelfBehavior = __webpack_require__(6);

/***/ }),
/* 29 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const NearBehavior = __webpack_require__(7);

/**
 * `ChargeInteraction` is a NearBehavior that calculates the charge repulsion/attraction forces between "nearby" particles.
 * It follows Coulomb's law with `k=2`, which is arbitrarily chosen. Although charge interactions have infinite range, the default
 * effective radius for this behavior is set to 100000 pixels. Many charge interactions can lead to instability.
 */
class ChargeInteraction extends NearBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor(radius=100000) {
        super();
        this.radius = radius;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     * @param {Particle[]} particles 
     */
    applyBehavior(particle, timeStep, particles) {
        if(particle.charge !== 0){
			for (let circ of particles) {
                if (particle !== circ && circ.charge !== 0) {
                    let q1 = particle.charge;
                    let q2 = circ.charge;
                    let x1 = particle.pos;
                    let x2 = circ.pos;
                    let dx = x1.sub(x2);
                    let dxmSqr = dx.magSqr();
                    if (dxmSqr > (particle.radius + circ.radius) * (particle.radius + circ.radius) && dxmSqr < this.radius * this.radius) {
                        let dxNorm = dx.normalize();
                        let f = dxNorm.mult(2 * q1 * q2 / dxmSqr * timeStep);
                        
                        //circ.vel = circ.vel.sub(f)
                        circ.pos = circ.pos.sub(f.mult(timeStep / circ.mass));
                        //particle.vel = particle.vel.add(f)
                        particle.pos = particle.pos.add(f.mult(timeStep * timeStep / particle.mass));
                        
                    }
                } 	
		    }
		}
    }

    /**
     * @override
     * @returns {[Number, Number]}
     */
    range() {
        return [this.radius, this.radius];
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Particle[]} particles 
     */
    applyCorrection(particle, particles) {
        return;
    }
}

module.exports = ChargeInteraction;

/***/ }),
/* 30 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SelfBehavior = __webpack_require__(6);

/**
 * `Drag` is a `SelfBehavior` that applies a viscous drag force on the particle itself.
 * It generally follows the circular quadratic drag formula in turbulent fluids. Units are arbitrary and should be tuned experimentally.
 */
class Drag extends SelfBehavior {
	/**
	 * Instantiates new Drag behavior object
	 * @constructor
	 */    
    constructor(viscosity) {
        super();
        this.viscosity = viscosity;
        this.LOWER_LIMIT = 0.01;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
    applyBehavior(particle, timeStep) {
        let vel = particle.vel;
        let vMagSqr = vel.magSqr();
		if (vMagSqr > this.LOWER_LIMIT && this.viscosity != 0) {
			let dragC = 0.0001 * (Math.PI * this.viscosity * particle.radius) / particle.mass;
			let vNormal = vel.normalize();
			let fDrag = vNormal.mult(vMagSqr * dragC);
			//particle.vel = vel.sub(fDrag.mult(timeStep));
            particle.pos = particle.pos.sub(fDrag.mult(timeStep * timeStep));
		}
	}

     /**
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }
}

module.exports = Drag;

/***/ }),
/* 31 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SelfBehavior = __webpack_require__(6);

/**
 * `Force` is a `SelfBehavior` that applies a constant force on the particle.   
 */
class Force extends SelfBehavior {
	/**
	 * Instantiates new Force behavior object
	 * @constructor
	 */    
    constructor(force) {
        super();
        this.force = force;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */
    applyBehavior(particle, timeStep) {
        //particle.applyForce(this.force, timeStep);
        particle.pos = particle.pos.add(this.force.mult(timeStep * timeStep / particle.mass));
    }
    
    /**
     * @override
     * @param {Particle} particle 
     */
	applyCorrection(particle) {
        return;
    }

}

module.exports = Force;

/***/ }),
/* 32 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SelfBehavior = __webpack_require__(6);

/**
 * 
 */
class PositionLock extends SelfBehavior {
    /**
     * @constructor abstract class cannot be instantiated
     */
    constructor(position) {
        super();
        this.position = position;
    }

    /**
     * @override
     * @param {Particle} particle 
     * @param {Number} timeStep 
     */    
    applyBehavior(particle, timeStep) {
        return;
    }

     /**
     * @override
     * @param {Particle} particle 
     */
    applyCorrection(particle) {
        particle.vel = new Vector2D(0,0);
        particle.pos = this.position;
    }
}

module.exports = PositionLock;

/***/ }),
/* 33 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Node module exports for the renderers directory
 */

const renderers = module.exports;

renderers.Renderer = __webpack_require__(23);
renderers.ParticleRenderer = __webpack_require__(25);
renderers.ConstraintRenderer = __webpack_require__(24);
renderers.WallRenderer = __webpack_require__(26);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});