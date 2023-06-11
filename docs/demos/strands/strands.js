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
      PenaltyCollision = pphys.behaviors.PenaltyCollision;

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

const v = new Vector2D(0,0);
const p = new Particle(new Vector2D(width/2, height/2), v, 100, 40, 1);

function generateStrand(x, y) {
    let length = 400;
    let separation = 10;
    let radius = 4;
    let mass = 10;
    let bounce = 1;
    let stiffness = 100;
    let pos = new Vector2D(x, y);


    let prev = new Particle(pos, new Vector2D(0,0), mass, radius, bounce);
    world.addParticle(prev);
    for (let i = 0; i < length; i = i + separation) {
        pos.y = y + i;
        let part = new Particle(pos, new Vector2D(0,0), mass, radius, bounce);
        let constraint = new ForceDistanceConstraint(prev, pos, separation, stiffness);
    }

}


setInterval(function () {
    world.nextFrame();
}, 1);

