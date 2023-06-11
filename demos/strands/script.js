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

function generateStrand(x, y) {
    let length = 400;
    let separation = 10;
    let radius = 0.1;
    let mass = 1;
    let bounce = 0.9;
    let stiffness =100000;
    let pos = new Vector2D(x, y);


    let prev = new Particle(pos, new Vector2D(0,0), mass, radius, bounce);
    world.addParticle(prev);
    prev.addSelfBehavior(new PositionLock(prev.pos));
    for (let i = 0; i < length; i += separation) {
        pos = pos.add(new Vector2D(0, separation));
        let part = new Particle(pos, new Vector2D(0,0), mass, radius, bounce);
        world.addParticle(part);
        //let c = new ForceDistanceConstraint(part, prev, separation, stiffness, 5_000_000, 1000);
        let c = new PositionDistanceConstraint(part, prev, separation, 1, 30000);
        world.addConstraint(c);
        prev = part;
    }

}

let h = 20;
let end = 450;
let start = 300;
let distance = 1;
for (let i = start; i < end; i += distance) {
    generateStrand(i, h);
}

world.enableGravity(15);


setInterval(function () {
    world.nextFrame();

    for (let cons of world.constraints) {
        c.strokeStyle  = ConstraintRenderer.calculateStressColor(cons, 3000, 0, 4);
        world.renderer.constraintRenderer.draw(cons);
        c.strokeStyle  = "black"
    }
}, 1);

