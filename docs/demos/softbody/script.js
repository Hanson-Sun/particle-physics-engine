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
      PositionLock = pphys.behaviors.PositionLock;

const canvas = document.getElementById("test");
const width = 700;
const height = 700;
const c = canvas.getContext("2d");
canvas.width = width;
canvas.height = height;

const world = new World(canvas, width, height, 45, 45, 0.05, 1, 20);
world.constrainBoundary(0, width, 0, height);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const v = new Vector2D(0,0);
const p = new Particle(new Vector2D(width - 50, height- 40), v, 500, 40, 0.9);
p.addNearBehavior(new PenaltyCollision(500));
world.addParticle(p);

softBody();

function softBody() {
    let dampen = 0;
    let grid = [];
    let size = 22;
    let w = 15;
    let stiffness = 0.06;
    let radius = 4;
    let constraint = PositionDistanceConstraint;
    let breakForce = 1000;
    let mass = 1;

    for (row = 0; row < size; row++) {
        let r = [];
        for (col = 0; col < size; col++) {
            let v = new Vector2D(0, 0);
            let p2 = new Vector2D(200 + col * w, 150 + row * w);
            let circ = new Particle(p2, v, mass, radius, 1);
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

world.enableGravity(15);
world.enableCollisions();


setInterval(function () {
    world.nextFrame();

    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, 10, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle  = "black"
    }
}, 1);

