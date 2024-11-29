

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
      PositionLock = pphys.behaviors.PositionLock,
      KeyInput = pphys.utils.InputHandler.KeyInput,
      Pressure = pphys.behaviors.Pressure,
      Viscosity = pphys.behaviors.Viscosity;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 10, 10, 0.07, 1, 5);
world.constrainBoundary(0, width, 0, height);
const handler = new InputHandler(world);

const v = new Vector2D(0,0);
const p = new Particle(new Vector2D(0,300), v, 50, 20, 0.7);
p.addNearBehavior(new Collision(500));
world.addParticle(p);

world.addWall(new WallBoundary(100, 600, 300, 600)); // Platform 1
world.addWall(new WallBoundary(400, 500, 600, 500)); // Platform 2
world.addWall(new WallBoundary(300, 400, 400, 400)); // Platform 3
world.addWall(new WallBoundary(500, 300, 700, 300)); // Platform 4

world.addWall(new WallBoundary(600, 200, 700, 200)); // Platform 4

// Adding walls to complete the well
world.addWall(new WallBoundary(50, 500, 150, 530)); 
world.addWall(new WallBoundary(150, 530, 250, 500)); 
world.addWall(new WallBoundary(250, 500, 300, 400)); 
world.addWall(new WallBoundary(0, 400, 50, 500));

// world.addWall(new WallBoundary(100, 350, 200, 0)); // Slope 4
world.addWall(new WallBoundary(200, 300, 300, 250)); // Slope 5
world.addWall(new WallBoundary(340, 250, 440, 220)); // Slope 6

softBody(500, 600);
generateTruss(80, 100, 430, 20, 18, 1.1, 5, 10);

const mag = 0.5;
const mass = 15;
const bounce = 0.95;

for (let i = 0; i < 30; i++) {
    let v = new Vector2D(0, 0);
    let p = new Vector2D(25 * (i % 6) + 50, 350 + Math.floor(i / 6) * 25);
    let part = new Particle(p, v, mass, 15, bounce, 0, "green");
    world.addParticle(part);
    part.addNearBehavior(new PenaltyCollision(300))
}



world.enableGravity(50);

handler.startMouseHandling();
handler.startKeyHandling();

const keys = {};
let canJump = true;
let jumpPower = 120;
let jumpCooldown = 500;
let lastJumpTime = 0;
let drawVel = false;

addEventListener("keydown", (e) => {
    keys[e.key] = true;
    keys["active"] = true;

    if (e.key === " " && canJump) {
        p.vel.y -= jumpPower;
        canJump = false;
        drawVel = true;
        lastJumpTime = Date.now();
    }
});

addEventListener("keyup", (e) => {
    keys[e.key] = false;
    keys["active"] = false;
});

const scale = 2.5;
setInterval(function () {
    world.nextFrame();

    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, 3000, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle = "black"
    }

    if (keys["active"]) {
        let targetVel = new Vector2D(0, 0);
        let diff = 45;
        let y = 0;
        if (keys[" "] && drawVel) {
            // targetVel.y -= diff;
            y = jumpPower;
            drawVel = false;
        }
        if (keys["s"]) {
            targetVel.y += diff;
        }
        if (keys["a"]) {
            targetVel.x -= diff;
        }
        if (keys["d"]) {
            targetVel.x += diff;
        }
        diffVel = targetVel.sub(p.vel)
        diffVel.multTo(0.15);

        if (Math.abs(targetVel.x) !== 0)
            p.vel.x += diffVel.x;
        if (Math.abs(targetVel.y) !== 0)
            p.vel.y += diffVel.y;
    
        c.beginPath();
        c.moveTo(p.pos.x, p.pos.y);
        c.lineTo(p.pos.x + targetVel.x * scale, p.pos.y + (targetVel.y - y) * scale); 
        c.strokeStyle = 'red';
        c.stroke();
    }

    c.beginPath();
    c.moveTo(p.pos.x, p.pos.y);
    c.lineTo(p.pos.x + p.vel.x * scale, p.pos.y + p.vel.y * scale); 
    c.strokeStyle = 'blue';
    c.stroke();

    if (!canJump && (Date.now() - lastJumpTime) >= jumpCooldown) {
        canJump = true;
    }
}, 10);

function generateTruss(x, y, length, height, segments, stiffness = 0.99, mass = 10, radius = 5, fixend = true, fixstart = true) {
    let nodes = [];
    let constraint = PositionDistanceConstraint;

    // Create nodes
    for (let i = 0; i <= segments; i++) {
        let v = new Vector2D(0, 0);
        let p1 = new Vector2D(x + i * length / segments, y);
        let p2 = new Vector2D(x + i * length / segments, y + height);
        let node1 = new Particle(p1, v, mass, radius, 1);
        let node2 = new Particle(p2, v, mass, radius, 1);
        nodes.push([node1, node2]);
        node1.addNearBehavior(new PenaltyCollision(400));
        node2.addNearBehavior(new PenaltyCollision(400));
        world.addParticle(node1);
        world.addParticle(node2);

        if (i === 0 && fixstart) {
            node1.addSelfBehavior(new PositionLock(node1.pos));
            node2.addSelfBehavior(new PositionLock(node2.pos));
        }
        if (i === segments && fixend) {
            node1.addSelfBehavior(new PositionLock(node1.pos));
            node2.addSelfBehavior(new PositionLock(node2.pos));
        }
    }

    // Create horizontal constraints
    for (let i = 0; i < segments; i++) {
        let c1 = new constraint(nodes[i][0], nodes[i + 1][0], length / segments, stiffness, Infinity, 0);
        let c2 = new constraint(nodes[i][1], nodes[i + 1][1], length / segments, stiffness, Infinity, 0);
        world.addConstraint(c1);
        world.addConstraint(c2);
    }

    // Create diagonal constraints to form triangles
    for (let i = 0; i < segments; i++) {
        let c1 = new constraint(nodes[i][0], nodes[i + 1][1], Math.sqrt((length / segments) ** 2 + height ** 2), stiffness, Infinity, 0);
        let c2 = new constraint(nodes[i + 1][0], nodes[i][1], Math.sqrt((length / segments) ** 2 + height ** 2), stiffness, Infinity, 0);
        world.addConstraint(c1);
        world.addConstraint(c2);
    }

    // Create vertical constraints to complete the triangles
    for (let i = 0; i <= segments; i++) {
        let c = new constraint(nodes[i][0], nodes[i][1], height, stiffness, Infinity, 0);
        world.addConstraint(c);
    }
}


function addSquare(x, y, r, m = 10, gap = 1, stiffness = 0.99) {
    grim = r + gap;
    let p1 = new Particle(new Vector2D(x - grim, y - grim), new Vector2D(0, 0), m, r, 0.9);
    let p2 = new Particle(new Vector2D(x + grim, y - grim), new Vector2D(0, 0), m, r, 0.9);
    let p3 = new Particle(new Vector2D(x + grim, y + grim), new Vector2D(0, 0), m, r, 0.9);
    let p4 = new Particle(new Vector2D(x - grim, y + grim), new Vector2D(0, 0), m, r, 0.9);

    world.addConstraint(new PositionDistanceConstraint(p1, p2, 2 * grim, stiffness));
    world.addConstraint(new PositionDistanceConstraint(p2, p3, 2 * grim, stiffness));
    world.addConstraint(new PositionDistanceConstraint(p3, p4, 2 * grim, stiffness));
    world.addConstraint(new PositionDistanceConstraint(p4, p1, 2 * grim, stiffness));

    world.addConstraint(new PositionDistanceConstraint(p1, p3, 2 * Math.sqrt(2) * grim, stiffness));
    world.addConstraint(new PositionDistanceConstraint(p2, p4, 2 * Math.sqrt(2) * grim, stiffness));

    world.addParticle(p1);
    world.addParticle(p2);
    world.addParticle(p3);
    world.addParticle(p4);

    p1.addNearBehavior(new PenaltyCollision(400));
    p2.addNearBehavior(new PenaltyCollision(400));
    p3.addNearBehavior(new PenaltyCollision(400));
    p4.addNearBehavior(new PenaltyCollision(400));
}


function softBody(x, y, size = 4, w = 21, stiffness = 0.99, radius = 10, mass = 5, breakForce = Infinity) {
    let grid = [];
    let constraint = PositionDistanceConstraint;

    for (let row = 0; row < size; row++) {
        let r = [];
        for (let col = 0; col < size; col++) {
            let v = new Vector2D(0, 0);
            let p2 = new Vector2D(x + col * w, y + row * w);
            let circ = new Particle(p2, v, mass, radius, 1);
            r.push(circ);
            world.addParticle(circ);
        }
        grid.push(r);
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (row + 1 < size) {
                let c = new constraint(grid[row + 1][col], grid[row][col], w, stiffness, breakForce, 0);
                world.addConstraint(c);
            }
            if (col + 1 < size) {
                let c = new constraint(grid[row][col], grid[row][col + 1], w, stiffness, breakForce, 0);
                world.addConstraint(c);
            }
            if (row + 1 < size && col + 1 < size) {
                let c1 = new constraint(grid[row][col], grid[row + 1][col + 1], Math.sqrt(2) * w, stiffness, breakForce, 0);
                let c2 = new constraint(grid[row + 1][col], grid[row][col + 1], Math.sqrt(2) * w, stiffness, breakForce, 0);
                world.addConstraint(c1);
                world.addConstraint(c2);
            }
        }
    }
}

