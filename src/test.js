
// TODO: test collisions and add constraints
// also constrain boundaries.

// BRUH SOMETHING IS WRONG WITH GRAVITY --> implementation of addTo is kind of messed up
// wait why... i dont get it....

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
var c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 8, 8, 0.001, 1, 10);

const pos = new Vector2D(250, 100);
const pos2 = new Vector2D(250, 400);
const vel = new Vector2D(0, 0);
const vel2 = new Vector2D(0, 1);
const vel3 = new Vector2D(0, -1);

const mag = 0.5;
const mass = 10
const bounce = 0.9999;

for (let i = 0; i < 10; i++) {
	let s1 = Math.random() < 0.5 ? -1 : 1;
	let s2 = Math.random() < 0.5 ? -1 : 1;
	let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
	let p = new Vector2D(( width - 50) * Math.random() + 25, (height - 50) * Math.random() + 25);
	let part = new Particle(p, v, mass, 7, bounce)
	world.addParticle(part);
}

const pt = new Particle(pos, vel2, mass, 20, bounce);
const pt2 = new Particle(pos2, vel3, 10, 30, bounce);

world.addParticle(pt);
world.addParticle(pt2);

const cons = new ForceDistanceConstraint(pt, pt2, 300, 10000);

world.addConstraint(cons);

softBody();

world.enableGravity(600);
world.addWall(new WallBoundary(250, 300, 600, 300));
world.addWall(new WallBoundary(200, 300, 500, 450));

world.enableCollisions();
world.constrainBoundary(0, width, 0, height);
//world.enableDrag(0.10);

var count = 0;
setInterval(function () {
	world.nextFrame();
	for (let p of world.particles.findNear(pt)) {
		c.beginPath();
		c.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
		c.fillStyle = "blue";
		c.fill();
	}

	c.beginPath();
	c.arc(pt2.pos.x, pt2.pos.y, pt2.radius, 0, Math.PI * 2, false);
	c.fillStyle = "green";
	c.fill();
}, 1);


function softBody() {
    dampen = 0;
    grid = [];
    size = 10;
    w = 20;
	stiffness = 0.001;
	radius = 8;
	constraint = PositionDistanceConstraint;
    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(400 + col * w, 100 + row * w);
            circ = new Particle(p2, v, 1, radius, 1);
            r.push(circ);
			world.addParticle(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                let c = new constraint(grid[row + 1][col], grid[row][col], w, stiffness);
				world.addConstraint(c);
            }
            if (col + 1 < size) {
                let c = new constraint(grid[row][col], grid[row][col + 1], w, stiffness);
				world.addConstraint(c);
            }
            if (row + 1 < size && col + 1 < size) {
                let c1 = new constraint(grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, stiffness);
                let c2 = new constraint(grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, stiffness);
				world.addConstraint(c1);
				world.addConstraint(c2);
            }
        }
    }
}

