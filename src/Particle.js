class Particle extends HashGridItem{
	#isPivot

	constructor(pos, vel, mass, radius, bounciness = 1, charge = 0) {
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
		this.#isPivot = false;
        this.color = "black";
		this.nearBehavior = [];
		this.selfBehavior = [];
	}

    makePivot() {
        this.#isPivot = true;
        this.mass = 0;
    }

    unPivot() {
        this.#isPivot = false;
        this.mass = this.originalMass;
    }

    get isPivot() {
        return this.#isPivot;
    }

	set setIsPivot(bool) {
		this.#isPivot = bool;
	}

	applyVelocity(v, timeStep) {
		this.pos = this.pos.add(v.mult(timeStep));
	}

    applyForce(f, timeStep) {
		this.vel = this.vel.add(f.mult(timeStep / this.mass));
	}

	applyAcceleration(a, timeStep) {
		this.vel = this.vel.add(a.mult(timeStep));
	}

	addSelfBehavior(b) {
		this.selfBehavior.push(b);
	}

	addNearBehavior(b) {
		this.nearBehavior.push(b);
	}

	removeNearBehavior(b) {
		const index = this.nearBehavior.indexOf(b);
		if (index > -1) {
			this.nearBehavior.splice(index, 1);
		}
	}

	removeSelfBehavior(b) {
		const index = this.selfBehavior.indexOf(b);
		if (index > -1) {
			this.selfBehavior.splice(index, 1);
		}
	}

	clearBehaviors() {
		this.nearBehavior = [];
		this.selfBehavior = [];
	}


	getHashPos() {
		return [this.pos.x, this.pos.y];
	}
	

	getHashDimensions() {
		return [this.radius * 2, this.radius * 2];
	}
}
