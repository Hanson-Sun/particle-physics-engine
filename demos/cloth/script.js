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

const world = new World(canvas, width, height, 10, 10, 0.05, 1, 20);
world.constrainBoundary(0, width, 0, height);
const handler = new InputHandler(world);

handler.startMouseHandling();
handler.startKeyHandling();

const v = new Vector2D(0,0);
const p = new Particle(new Vector2D(width / 2, height- 40), v, 3000, 40, 0.9);
p.addNearBehavior(new PenaltyCollision(500));
world.addParticle(p);

genCloth();

function genCloth() {
    let grid = [];
    let size = 40;
    let w = 8;
    let stiffness = 1;
    let breakForce = 11000;
    let mass = 1;
    let radius = 0.01;
    let bounciness = 0.99;

    for (let row = 0; row < size; row++) {
        let r = [];
        for (col = 0; col < size; col++) {
            let v = new Vector2D(0, 0);
            let p2 = new Vector2D(160 + col * w, 150 + row * w);
            let circ = new Particle(p2, v, mass, radius, bounciness);
            world.addParticle(circ);
            r.push(circ);

        }
        grid.push(r);
    }

    for (let row = 0; row < size; row++) {
        for (col = 0; col < size; col++) {
            if (row + 1 < size) {
                world.addConstraint(new PositionDistanceConstraint(grid[row + 1][col], grid[row][col], w, stiffness, breakForce));
            }
            if (col + 1 < size) {
                world.addConstraint(new PositionDistanceConstraint(grid[row][col], grid[row][col + 1], w, stiffness, breakForce));
            }
        }
    }

    for (let i = 0; i < grid.length; i += 5) {
        grid[0][i].addSelfBehavior(new PositionLock(grid[0][i].pos));
    }

    grid[0][0].addSelfBehavior(new PositionLock(grid[0][0].pos));
    grid[0][size - 1].addSelfBehavior(new PositionLock(grid[0][size - 1].pos));

}

world.enableGravity(15);
//world.enableCollisions();


setInterval(function () {
    world.nextFrame();

    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, 100, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle  = "black"
    }
}, 1);

