# Particle-based Physics Engine (with constraints)

Currently in development: I'm working on several optimizations and major refactorizations of the code!

https://hanson-sun.github.io/particle-physics-engine/

Some of my research about modelling constrained 2D particle-based physics systems. In my paper, I investigate the extent of which penalty and relaxed-geometric constraints can model 2D particle physics systems. The focus of this investigation leaned towards the mathematical aspect of constrained systems. However, I still provided a programmatic implementation. I would like to work on this further in the future, including adding more constraint types, as well as a more detailed section about programmatic implementation.

It took me a while to research and write everything, read the paper here https://github.com/Hanson-Sun/Math-EE/blob/main/HansonS_Math_EE.pdf (HansonS_Math_EE.pdf)

This repository also includes additional files for demo purposes


### TODO
- [ ] Refactor code
  - [ ] Add behaviors (Maybe add more behaviors)
    - [x] Collision 
    - [x] Attraction
    - [x] Drag
    - [x] Pivots (its very scuffed tho)
    - [ ] area constraints (low priority)
  - [x] add walls
    - [x] general walls/world/vertical+horizontal
  - [x] add constraints
    - [x] force based
    - [x] position based
  - [x] Fix solver, world, and others
  - [x] Fix renderer and potentially add more features
    - [x] constraint stress colours? 
  - [x] Add constraint breaking
- [ ] write docs
- [ ] Standardize units (?) grim... i need to do physics
- [ ] formalize package (important!!!)
- [ ] Optimize
- [ ] update paper... maybe

### Bugs
- some degree of instability when particles are stacked up (?) --> could be an issue of the world constraints (kind of fixed)
- unify solver behavior --> focus on position-based, velocity independent constraint and collision behavior.
  - seems to have a tendency to lose energy when constraints are used.
  - !!! i seem to have an issue with understanding when to change velocity in behavior. (consider velocity change in constraint)
- Vector2D modify methods are inconsistent for some reason --> test this
- **Fix iteration per frame to use sub-stepping** --> somehow include it idk
- resolve constructor complexity by changing how the options work
- clearing constraints or particles clearly do not work. (should be fixed)
- fix mouse edge movement instability
- IMPROVE SPATIAL HASH ALGORITHM (make it dense) + test if its actually better

Notes:
i think ill leave the rendering step with more freedom to the users 

theres a setSolverUpdate() function that is like unity's Update() but kind of different...


i think ill name it `PPhys2D` for **P**article-based **P**hysics engine **2D**


