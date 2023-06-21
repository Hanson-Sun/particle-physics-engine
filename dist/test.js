


const Vector2D = pphys.utils.Vector2D,
      Particle = pphys.core.Particle,
      World = pphys.core.World,
      ForceDistanceConstraint = pphys.constraints.ForceDistanceConstraint,
      PositionPivotConstraint = pphys.constraints.PositionPivotConstraint,
      WallBoundary = pphys.walls.WallBoundary,
      Collision = pphys.behaviors.Collision,
      ConstraintRenderer = pphys.renderers.ConstraintRenderer,
      InputHandler = pphys.utils.InputHandler,
      Drag = pphys.behaviors.Drag,
      ChargeInteraction = pphys.behaviors.ChargeInteraction,
      ForcePivotConstraint = pphys.constraints.ForcePivotConstraint, 
      PositionDistanceConstraint = pphys.constraints.PositionDistanceConstraint,
      PenaltyCollision = pphys.behaviors.PenaltyCollision,
      Pressure = pphys.behaviors.Pressure,
      RigidGroup = pphys.constraints.RigidGroup,
      Viscosity = pphys.behaviors.Viscosity;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 40, 40, 0.05, 1, 20);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();
handler.addKeyEvent(new InputHandler.KeyInput("a", 
    () => {
        bruh = world.particlesList[0];
        world.removeParticle(bruh);
    }));

const pos = new Vector2D(600, 100);
const pos2 = new Vector2D(600, 400);
const pos3 = new Vector2D(600, 600);
const vel = new Vector2D(0, 0);
const vel2 = new Vector2D(0, 20);
const vel3 = new Vector2D(0, -90);

const mag = 0.5;
const mass = 10;
const bounce = 0.95;


for (let i = 0; i < 4000; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 50, (height/11) * Math.random() + 25);
    let part = new Particle(p, v, mass, 1, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new Pressure(10, 20, 5, 100, true));
    part.addNearBehavior(new Viscosity(10, 1, 0.1));
}

for (let i = 0; i < 0; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 100, (height - 50) * Math.random() + 25);
    let part = new Particle(p, v, mass, 3, bounce, 0);
    world.addParticle(part);
    part.addNearBehavior(new Pressure(35, 25, 1, 140, true));
    part.addNearBehavior(new Viscosity(35, 10, 1));
}


for (let i = 0; i < 0; i++) {
    let s1 = Math.random() < 0.5 ? -1 : 1;
    let s2 = Math.random() < 0.5 ? -1 : 1;
    let v = new Vector2D(s1 * mag * Math.random(), s2 * mag * Math.random());
    let p = new Vector2D((width - 50) * Math.random() + 25, (height - 50) * Math.random() + 25);
    let part = new Particle(p, v, mass, 1, bounce, 0);
    world.addParticle(part);
}


let radius = 15;
const pt = new Particle(pos, vel, mass * 10, radius, bounce, 0);
const pt2 = new Particle(pos2, vel, mass * 30, radius, bounce, 0);
const pt3 = new Particle(pos3, vel, mass * 10, radius * 2, bounce, 0);



world.addParticle(pt);
world.addParticle(pt2);
//world.addParticle(pt3);
//world.makePivot(pt2);

v = new Vector2D(0, -2);


const cons = new ForceDistanceConstraint(pt, pt2, 200, 100);
world.addConstraint(cons);

//rigidGroup();

//world.addConstraint(new ForcePivotConstraint(pos2, pt2, 0, 100));
//softBody();

world.enableGravity(1);
world.addWall(new WallBoundary(50, 130, width, 100));
world.addWall(new WallBoundary(0, 250, width - 80, 320));
world.addWall(new WallBoundary(300, 480, width, 400));
world.addWall(new WallBoundary(0, 400, 270, 480));
world.addWall(new WallBoundary(270, 480, 270, 505));
world.addWall(new WallBoundary(300, 480, 300, 505));
//world.addWall(new WallBoundary(50, 690, 650, 690));
// world.addWall(new WallBoundary(0, 0, 700, 0));
//  world.addWall(new WallBoundary(0, 700, 700, 700));
//  world.addWall(new WallBoundary(0, 0, 0, 700));
//  world.addWall(new WallBoundary(700, 0, 700, 700));
world.enableCollisions();
//world.addGlobalNearBehavior(new PenaltyCollision(500));

world.constrainBoundary(0, width, 0, height);
// world.enableDrag(100);
// world.enableChargeInteractions();

let count = 0;
world.setSolverUpdate(
    () => {
        if (Collision.isCollide(pt, pt2)) {
            count += 1;
            console.log(count);
        }
    }
)


setInterval(function () {
    world.nextFrame();

    for (let p of world.particles.findNear(pt)) {
        c.beginPath();
        c.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2, false);
        c.fillStyle = "blue";
        c.fill();
    }

    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, cons.breakForce, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle  = "black"
    }

    c.beginPath();
    c.arc(pt2.pos.x, pt2.pos.y, pt2.radius, 0, Math.PI * 2, false);
    c.fillStyle = "green";
    c.fill();
}, 1);

function rigidGroup() {
    let dampen = 0;
    let grid = [];
    let size = 10;
    let w = 12;
    let stiffness = 1;
    let radius = 3;
    let breakForce = 1;
    let mass = 1;

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(100 + col * w, 100 + row * w);
            circ = new Particle(p2, v, mass, radius, 1);
            grid.push(circ);
            world.addParticle(circ);
        }
    }

    world.addConstraint(new RigidGroup(grid, stiffness))
}


function softBody() {
    let dampen = 0;
    let grid = [];
    let size = 30;
    let w = 12;
    let stiffness = 0.01;
    let radius = 3;
    let constraint = PositionDistanceConstraint;
    let breakForce = 1;
    let mass = 1;

    for (row = 0; row < size; row++) {
        r = [];
        for (col = 0; col < size; col++) {
            v = new Vector2D(0, 0);
            p2 = new Vector2D(100 + col * w, 100 + row * w);
            circ = new Particle(p2, v, mass, radius, 1);
            r.push(circ);
            world.addParticle(circ);

        }
        grid.push(r);
    }

    for (row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                let c = new constraint(grid[row + 1][col], grid[row][col], w, stiffness, breakForce, 0);
                world.addConstraint(c);
            }
            if (col + 1 < size) {
                let c = new constraint(grid[row][col], grid[row][col + 1], w, stiffness, breakForce, 0);
                world.addConstraint(c);
            }
            if (row + 1 < size && col + 1 < size) {
                let c1 = new constraint(grid[row][col], grid[row + 1][col + 1], 2 ** 0.5 * w, stiffness, breakForce, 0);
                let c2 = new constraint(grid[row + 1][col], grid[row][col + 1], 2 ** 0.5 * w, stiffness, breakForce, 0);
                world.addConstraint(c1);
                world.addConstraint(c2);
            }
        }
    }
}

