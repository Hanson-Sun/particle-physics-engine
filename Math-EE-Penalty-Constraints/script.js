print = console.log;
canvas = document.getElementById("test");
const c = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = 0.9 * width;
canvas.height = 0.9 * height;
c.lineWidth = 2;
var cl = [];
var spjoint = [];
var stiffjoint = [];
var timestep = parseFloat(document.getElementById("timestep").value);
var maxforce = parseFloat(document.getElementById("maxforce").value);
var breakforce = parseFloat(document.getElementById("breakingforce").value);
var visc = parseFloat(document.getElementById("Drag").value);
var radius = parseFloat(document.getElementById("radius").value);
var mass = parseFloat(document.getElementById("mass").value);
var bouncyness = parseFloat(document.getElementById("bounciness").value);
var charge = parseFloat(document.getElementById("charge").value);
var grav = parseFloat(document.getElementById("gravity").value);
var genamount = parseFloat(document.getElementById("generate").value);
function applychanges() {
	charge = parseFloat(document.getElementById("charge").value);
	visc = parseFloat(document.getElementById("Drag").value);
	radius = parseFloat(document.getElementById("radius").value);
	mass = parseFloat(document.getElementById("mass").value);
	bouncyness = parseFloat(document.getElementById("bounciness").value);
	grav = parseFloat(document.getElementById("gravity").value);
	genamount = parseFloat(document.getElementById("generate").value);
	gravity = new Vector2D(0, grav);
	timestep = parseFloat(document.getElementById("timestep").value);
	timestep = parseFloat(document.getElementById("timestep").value);
	maxforce = parseFloat(document.getElementById("maxforce").value);
	breakforce = parseFloat(document.getElementById("breakingforce").value);

}
iterations = 50;

var key = false;
window.addEventListener('keydown', function (e) {
	key = e.keyCode;
})
window.addEventListener('keyup', function (e) {
	key = false;
})

var startmouse = { x: 0, y: 0 };
endmouse = { x: 0, y: 0 };
mouseisdown = false;
hold = false;
var currentcirc;

function getMousePos(c, evt) {
	var rect = c.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener("mousedown", function (evt) {
	var oldmousePos = getMousePos(canvas, evt);
	startmouse.x = oldmousePos.x;
	startmouse.y = oldmousePos.y;
	mouseisdown = true;
	mouseVect = new Vector2D(startmouse.x, startmouse.y);
	for (circ of cl) {
		if (circ.radius < 2) {
			if ((circ.pos.sub(mouseVect)).mag() <= circ.radius * 10 * (3 - circ.radius)) {
				hold = true;
				currentcirc = circ;
			}
		} else {
			if ((circ.pos.sub(mouseVect)).mag() <= circ.radius) {
				hold = true;
				currentcirc = circ;
			}
		}
	}

}, false);

canvas.addEventListener("mousemove", function (evt) {

	var mousePos = getMousePos(canvas, evt);

	if (hold === true) {
		currentcirc.pos = new Vector2D(mousePos.x, mousePos.y);
		currentcirc.vel = new Vector2D((mousePos.x - endmouse.x) / timestep / iterations, (mousePos.y - endmouse.y) / timestep / iterations);
	}

	endmouse.x = mousePos.x;
	endmouse.y = mousePos.y;

}, false);

canvas.addEventListener("mouseup", function (evt) {
	var newmousePos = getMousePos(canvas, evt);
	endmouse.x = newmousePos.x;
	endmouse.y = newmousePos.y;
	if (hold === false) {
		vx = (startmouse.x - endmouse.x) / 10 / timestep / iterations;
		vy = (startmouse.y - endmouse.y) / 10 / timestep / iterations;

		p = new Vector2D(startmouse.x, startmouse.y);
		v = new Vector2D(vx, vy)
		new circle(cl, p, v, mass, charge, radius, bouncyness, "green");

	} else {
		currentcirc.pos = new Vector2D(endmouse.x, endmouse.y);

		hold = false;
		currentcirc = null;
	}
	mouseisdown = false;

}, false);

class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vect) {
		return (new Vector2D(this.x + vect.x, this.y + vect.y));
	}

	sub(vect) {
		return (new Vector2D(this.x - vect.x, this.y - vect.y));
	}
	mult(a) {
		return (new Vector2D(this.x * a, this.y * a));
	}

	dot(vect) {
		return this.x * vect.x + this.y * vect.y;
	}

	cross(vect) {
		return this.x * vect.y - this.y * vect.x;
	}

	mag() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));

	}
	magsqr() {
		return (this.x * this.x) + (this.y * this.y);
	}

	normalize() {
		this.mag = Math.sqrt((this.x * this.x) + (this.y * this.y));
		return (new Vector2D((this.x / this.mag), (this.y / this.mag)))
	}

	findAngle(vect, type = "deg") {
		this.dot = this.x * vect.x + this.y * vect.y;
		this.mag1 = ((this.x ** 2) + (this.y ** 2)) ** 0.5;
		this.mag2 = ((vect.x ** 2) + (vect.y ** 2)) ** 0.5;
		if (type == "deg") {
			return Math.acos(this.dot / this.mag1 / this.mag2) * 180 / Math.PI;
		} else if (type == "rad") {
			return Math.acos(this.dot / this.mag1 / this.mag2);
		}
	}
}

var gravity = new Vector2D(0, grav);
var wind = new Vector2D(0, 0);


class circle {
	constructor(list, pos, vel, mass, charge, radius, bouncyness, color, ispivot = false) {
		this.list = list;
		this.list.push(this);
		this.charge = charge;
		this.pos = pos;
		this.vel = vel;
		this.mass = mass;
		this.radius = radius;
		this.bouncyness = bouncyness;
		this.color = color;
		this.prevpos = this.pos;
		this.futurepos = new Vector2D(0, 0)
		this.force = new Vector2D(0, 0);
		this.ispivot = ispivot;
		if (this.ispivot == true) {
			this.mass = 0;
		}

		if (this.charge < 0) {
			this.color = "red";
		} else if (this.charge > 0) {
			this.color = "blue";
		} else {
			this.color = color;
		}
		this.c = canvas.getContext("2d");
	}

	velocity(v) {
		this.pos = this.pos.add(v.mult(timestep));
		//this.pos.x = this.pos.x + v.x * timestep
		//this.pos.y = this.pos.y + v.y * timestep
	}

	accelerate(a) {
		this.vel = this.vel.add(a.mult(timestep));
		// this.vel.x = this.vel.x + a.x * timestep;
		// this.vel.y = this.vel.y + a.y * timestep;
	}


	edgeDetect() {
		if (this.pos.x >= canvas.width - this.radius) {

			this.vel.x *= -1 * this.bouncyness;

		} if (this.pos.x <= this.radius) {

			this.vel.x *= -1 * this.bouncyness;


		} if (this.pos.y >= canvas.height - this.radius) {

			this.vel.y *= -1 * this.bouncyness;

		} if (this.pos.y <= this.radius) {

			this.vel.y *= -1 * this.bouncyness;
		}
	}


	edgeDetectPosition() {
		if (this.pos.x >= canvas.width - this.radius) {
			this.pos.x = canvas.width - this.radius;



		} if (this.pos.x <= this.radius) {
			this.pos.x = this.radius;


		} if (this.pos.y >= canvas.height - this.radius) {
			this.pos.y = canvas.height - this.radius;


		} if (this.pos.y <= this.radius) {
			this.pos.y = this.radius;

		}

	}

	drag() {
		if (this.vel.x && this.vel.y && visc != 0) {
			this.dragc = 0.0001 * (Math.PI * visc * this.radius) / this.mass;
			this.vnormal = this.vel.normalize();
			this.vmagsqr = this.vel.magsqr();
			this.fdrag = this.vnormal.mult((this.vmagsqr) * -this.dragc);
			this.force = this.force.add(this.fdrag);
			this.vel = this.vel.add(this.force.mult(timestep));
		}
	}

	chargeinteract() {
		if (this.charge != 0) {
			for (this.circ2 of this.list) {
				if ((this != this.circ2) && (this.circ2.charge != 0)) {
					this.q1 = this.charge;
					this.q2 = this.circ2.charge;
					this.x1 = this.pos;
					this.x2 = this.circ2.pos;
					this.dx = this.x1.sub(this.x2);
					this.dxmsqr = this.dx.magsqr();
					if (this.dxmsqr > (this.radius + this.circ2.radius) * (this.radius + this.circ2.radius)) {
						this.dxnorm = this.dx.normalize();
						this.f = this.dxnorm.mult(2 * this.q1 * this.q2 / this.dxmsqr);
						this.circ2.force = this.circ2.force.add(this.f.mult(-1));
						this.force = this.force.add(this.f);
						this.vel = this.vel.add(this.force.mult(1 / this.mass * timestep));
						circ.vel = circ.vel.add(circ.force.mult(1 / circ.mass * timestep));
					}
				}
			}
		}

	}
	gravityinteract() {
		for (this.circ2 of this.list) {
			if (this != this.circ2) {
				this.q1 = this.mass;
				this.q2 = this.circ2.mass;
				this.x1 = this.pos;
				this.x2 = this.circ2.pos;
				this.dx = this.x1.sub(this.x2);
				this.dxmsqr = this.dx.magsqr();
				if (this.dxmsqr > (this.radius + this.circ2.radius) * (this.radius + this.circ2.radius)) {
					this.dxnorm = this.dx.normalize();
					this.f = this.dxnorm.mult(0.001 * this.q1 * this.q2 / this.dxmsqr);
					this.circ2.force = this.circ2.force.add(this.f.mult(-1));
					this.force = this.force.add(this.f.mult(-1));
				}
			}
		}

	}

	collide() {
		for (var circ of this.list) {
			if (circ != this) {
				this.posdiff1 = this.pos.sub(circ.pos);
				if (this.posdiff1.magsqr() <= (this.radius + circ.radius) * (this.radius + circ.radius)) {
					this.direction1 = (circ.pos.sub(this.pos)).normalize();
					this.direction2 = (this.pos.sub(circ.pos)).normalize();
					this.overlap = this.radius + circ.radius - this.posdiff1.mag();

					this.posdiff1 = this.pos.sub(circ.pos);

					this.posdiffmagsqr = this.posdiff1.magsqr();

					this.massconst1 = 2 * circ.mass / (this.mass + circ.mass);
					this.vdiff1 = this.vel.sub(circ.vel);
					this.dot1 = (this.vdiff1.dot(this.posdiff1)) / (this.posdiffmagsqr);

					this.massconst2 = 2 * this.mass / (this.mass + circ.mass);
					this.vdiff2 = circ.vel.sub(this.vel);
					this.posdiff2 = circ.pos.sub(this.pos);
					this.dot2 = (this.vdiff2.dot(this.posdiff2)) / (this.posdiffmagsqr);

					//this.pos = this.pos.sub(this.direction1.mult(this.overlap * circ.mass / (this.mass + circ.mass)));
					//circ.pos = circ.pos.sub(this.direction2.mult(this.overlap * this.mass / (this.mass + circ.mass)));






					if (circ.ispivot) {
						this.vel = (this.vel.sub(this.posdiff1.mult(this.dot1 * 2))).mult(this.bouncyness);
					} else {
						this.vel = (this.vel.sub(this.posdiff1.mult(this.dot1 * this.massconst1))).mult(this.bouncyness);
					}

					if (this.ispivot) {
						circ.vel = (circ.vel.sub(this.posdiff2.mult(this.dot2 * 2))).mult(this.bouncyness);
					} else {
						circ.vel = (circ.vel.sub(this.posdiff2.mult(this.dot2 * this.massconst2))).mult(this.bouncyness);
					}


					//this.velocity(this.vel);
					//circ.velocity(circ.vel);

				}
			}
		}
	}
	collidecorrect() {
		for (var circ of this.list) {
			if (circ != this) {
				this.posdiff1 = this.pos.sub(circ.pos);
				if (this.posdiff1.magsqr() <= (this.radius + circ.radius) * (this.radius + circ.radius)) {
					this.direction1 = (circ.pos.sub(this.pos)).normalize();
					this.direction2 = (this.pos.sub(circ.pos)).normalize();
					this.overlap = this.radius + circ.radius - this.posdiff1.mag();


					this.pos = this.pos.sub(this.direction1.mult(this.overlap * circ.mass / (this.mass + circ.mass)));
					circ.pos = circ.pos.sub(this.direction2.mult(this.overlap * this.mass / (this.mass + circ.mass)));
				}
			}
		}
	}

	draw() {
		this.c.beginPath();
		this.c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
		this.c.strokeStyle = this.color;
		this.c.fillStyle = this.color;
		//this.c.fill();
		this.c.stroke();
	}

}


class Stiffjoint {
	constructor(list, c1, c2, len, breakforce, dampening, stiffness = 1) {
		this.c1 = c1;
		this.c2 = c2;
		this.breakforce = breakforce;
		this.dampening = dampening;
		this.len = len;
		this.force;
		this.dv;
		this.list = list;
		this.list.push(this);
		this.dd;
		this.color;
		this.stiffness = stiffness
	}


	update() {

		this.dp = this.c2.pos.sub(this.c1.pos);
		this.dpmag = this.dp.mag();
		this.dpdiff = (this.dpmag - this.len) * this.stiffness;
		this.dpunit = this.dp.normalize();


		this.dv = this.dpunit.mult(this.dpdiff / timestep);
		this.dd = this.dpunit.mult(this.dpdiff);

		this.force = this.dpdiff / timestep / timestep;


		if (this.force >= this.breakforce) {
			this.index = this.list.indexOf(this);

			if (this.index > -1) {
				this.list.splice(this.index, 1);
			}
		}

		this.r = this.force * 510 / maxforce;
		if (this.r <= 255) {
			this.color = "rgb(" + Math.floor(this.r) + ", 255,0)";
		} else if (this.r <= 510) {
			this.color = "rgb(255," + (510 - Math.floor(this.r)) + ",0)";

		} else {
			this.color = "rgb(255,0,0)";
		}

		// this.force = this.dd.mult(1/timestep/timestep/(this.c1.mass + this.c2.mass));
		// let drag = 0;
		// let dv = this.c2.vel.sub(this.c1.vel)
		// this.f1 = (this.force.sub(dv.mult(drag))).mult(this.c1.mass)
		// this.f2 = (this.force.sub(dv.mult(drag))).mult(this.c2.mass)

		//this.dc = this.c2.vel.sub(this.c1.vel);
		//this.damp = this.dc.mult(this.dampening * timestep / (this.c1.mass + this.c2.mass))

		let disp = this.dd.mult(1 / (this.c1.mass + this.c2.mass));

		if (!this.c1.ispivot) {


			// this.c1.vel = (this.c1.vel).add(this.f1.mult(timestep));
			// this.c1.pos = (this.c1.pos).add(this.f1.mult(timestep * timestep));
			this.c1.vel = this.c1.vel.add(disp.mult(this.c1.mass / timestep))
			this.c1.pos = this.c1.pos.add((disp.mult(this.c1.mass)))

		} if (!this.c2.ispivot) {

			// this.c2.vel = (this.c2.vel).sub(this.f2.mult(timestep));
			// this.c2.pos = (this.c2.pos).sub(this.f2.mult(timestep * timestep));
			this.c2.vel = this.c2.vel.sub(disp.mult(this.c2.mass / timestep))
			this.c2.pos = this.c2.pos.sub((disp.mult(this.c2.mass)))
		}

	}
	draw() {
		c.lineWidth = 2;
		c.strokeStyle = this.color;
		c.beginPath();
		c.moveTo(this.c1.pos.x, this.c1.pos.y);
		c.lineTo(this.c2.pos.x, this.c2.pos.y);
		c.stroke();


	}

}
function clear() {
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}



// v = new Vector2D(0, 0);



p = new Vector2D(200, 400);

p3 = new Vector2D(200, 412);
v = new Vector2D(0, 0);
c1 = new circle(cl, p, v, 0.5, 0, 1, 1, "black");
c3 = new circle(cl, p3, v, 1, 0, 1, 1, "black");
stable = [c1, c3];
k = breakforce;
dampen = 50;

for (i = 1; i < 30; i++) {
	p2 = new Vector2D(200 + i * 12, 400);
	p4 = new Vector2D(200 + i * 12, 412);
	c2 = new circle(cl, p2, v, 0.5, -0, 1, 1, "black");
	c4 = new circle(cl, p4, v, 0.5, -0, 1, 1, "black");

	new Stiffjoint(spjoint, c1, c2, 12, breakforce, dampen);
	new Stiffjoint(spjoint, c2, c4, 12, breakforce, dampen);
	new Stiffjoint(spjoint, c4, c3, 12, breakforce, dampen);
	new Stiffjoint(spjoint, c3, c1, 12, breakforce, dampen);
	new Stiffjoint(spjoint, c1, c4, 288 ** 0.5, breakforce, dampen);
	new Stiffjoint(spjoint, c2, c3, 288 ** 0.5, breakforce, dampen);
	c1 = c2;
	c3 = c4;

}

// cl[0].ispivot = true;
// cl[1].ispivot = true;
cl[cl.length - 1].ispivot = true;
cl[cl.length - 2].ispivot = true;
dampen = 100;
p2 = new Vector2D(600, 200);
p4 = new Vector2D(500, 200);
p5 = new Vector2D(450, 250);
circ3 = new circle(cl, p2, v, 0.5, -0, 1, 1, "black");
var circ4 = new circle(cl, p4, v, 0.5, -0, 1, 1, "black");
circ3.ispivot = true;
new Stiffjoint(spjoint, circ3, circ4, 100, breakforce, dampen);

var data = [];



function gencloth() {
	grid = [];
	size = 10;
	w = 20;
	for (row = 0; row < size; row++) {
		r = [];
		for (col = 0; col < size; col++) {
			v = new Vector2D(0, 0);
			p2 = new Vector2D(150 + col * w, 150 + row * w);
			circ = new circle(cl, p2, v, 0.1, 0, 5, 1, "black")
			r.push(circ);

		}
		grid.push(r);
	}

	for (row = 0; row < size; row++) {
		for (col = 0; col < size; col++) {
			if (row + 1 < size) {
				new Stiffjoint(spjoint, grid[row + 1][col], grid[row][col], w, breakforce, 1, 0.1);
			}
			if (col + 1 < size) {
				new Stiffjoint(spjoint, grid[row][col], grid[row][col + 1], w, breakforce, 1, 0.1);
			}
		}
	}

	for (circ of grid[0]) {
		circ.ispivot = true;
	}

}

//gencloth();
// p = new Vector2D(200, 100);
// p3 = new Vector2D(200, 130);
// v = new Vector2D(0, 0);
// c1 = new circle(cl, p, v, 10, 0, 10, 1, "black");
// c3 = new circle(cl, p3, v, 10, 0, 10, 1, "black");
// dampen = 0;
// stiffness = 0.005;
// for (i = 1; i < 2; i++) {
// 	p2 = new Vector2D(200 + i * 30, 100);
// 	p4 = new Vector2D(200 + i * 30, 130);
// 	c2 = new circle(cl, p2, v, 10, 0, 10, 1, "black");
// 	c4 = new circle(cl, p4, v, 10, 0, 10, 1, "black");

// 	new Stiffjoint(spjoint, c1, c2, 30, breakforce, dampen, stiffness);
// 	new Stiffjoint(spjoint, c2, c4, 30, breakforce, dampen, stiffness);
// 	new Stiffjoint(spjoint, c4, c3, 30, breakforce, dampen, stiffness);
// 	new Stiffjoint(spjoint, c3, c1, 30, breakforce, dampen, stiffness);
// 	new Stiffjoint(spjoint, c1, c4, 1800 ** 0.5, breakforce, dampen, stiffness);
// 	new Stiffjoint(spjoint, c2, c3, 1800 ** 0.5, breakforce, dampen, stiffness);
// 	c1 = c2;
// 	c3 = c4;

// }

function generate() {
	vell = new Vector2D(0, 0);
	genamount = parseFloat(document.getElementById("generate").value);
	for (i = 0; i < genamount; i++) {
		p = new Vector2D((width - radius) * Math.random(), (height - radius) * Math.random());
		new circle(cl, p, vell, mass, charge, radius, bouncyness, "black");
	}
}

//constructor(list, pos, vel, mass, charge, radius, bouncyness, color)

function animate() {

	for (circ of cl) {

		if (circ.ispivot || circ == currentcirc) {
			circ.vel = new Vector2D(0, 0);
		}

		if (!circ.ispivot || (circ.ispivot && circ == currentcirc)) {
			circ.accelerate(circ.force);
			circ.vel = circ.vel.add(gravity.mult(timestep));

			circ.acceleration = new Vector2D(0, 0);
			circ.force = new Vector2D(0, 0);

			circ.prevpos = circ.pos;
			circ.velocity(circ.vel);

		}

	}

	for (joint of spjoint) {
		joint.update();
	}

	for (circ of cl) {
		prevpos = circ.pos;
		circ.collide();
		circ.edgeDetect();


		//circ.drag();
		//dont really recommend adding random gravity, effect is too small to see at smaller masses anyways
		//circ.gravityinteract();

		//circ.pos = circ.prevpos.add(circ.vel.mult(timestep));
		circ.pos.x = circ.prevpos.x + circ.vel.x * timestep;
		circ.pos.y = circ.prevpos.y + circ.vel.y * timestep

		circ.edgeDetectPosition();
		circ.collidecorrect();
		//circ.vel = (circ.pos.sub(prevpos)).mult(1/timestep)

	}

	for (circ of cl) {
		if (!circ.ispivot && circ != currentcirc) {
			circ.vel.x = (circ.pos.x - circ.prevpos.x) / timestep;
			circ.vel.y = (circ.pos.y - circ.prevpos.y) / timestep;
			//circ.vel = (circ.pos.sub(circ.prevpos)).mult(1 / timestep);
		}
	}

}


setInterval(function () {
	clear();
	//UI magic dw about this
	if (canvas.mousedown == true) {
		mousePos = mousemove;
		canvas.onmousedown = mousedown;
		canvas.onmouseup = mouseup;
	}
	if (key == 9) {
		cl.pop();
	} else if (key == 46) {
		cl = [];
	}
	if (mouseisdown == true && hold == false) {
		c.beginPath();
		c.arc(startmouse.x, startmouse.y, radius, 0, Math.PI * 2, false);
		c.strokeStyle = "green";
		c.fillStyle = "green";
		c.fill();
		c.stroke();
		c.beginPath();
		c.moveTo(startmouse.x, startmouse.y);
		c.lineTo(endmouse.x, endmouse.y);
		c.stroke();
	} else if (hold == true) {
		c.beginPath();
		c.arc(currentcirc.pos.x, currentcirc.pos.y, currentcirc.radius, 0, Math.PI * 2, false);

		c.fillStyle = "green";
		c.fill();
	}
	//end of UI magic
	for (i = 0; i < iterations; i++) {
		animate();
	}
	for (joint of spjoint) {
		joint.draw();
	}
	for (circ of cl) {
		circ.draw();
	}

}, 1);


function download_csv() {
	var csv = '';

	for (row of data) {
		csv += row.join(',');
		csv += "\n";
	}

	console.log(csv);
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'position.csv';
	hiddenElement.click();
}

