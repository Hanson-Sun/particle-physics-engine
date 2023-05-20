# Particle-based Physics Engine (with constraints)

Currently in development: I'm working on several optimizations and refactorizations of the code!

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
  - [x] add walls
    - [x] general walls/world/vertical+horizontal
  - [x] add constraints
    - [x] force based
    - [x] position based
  - [x] Fix solver, world, and others
  - [ ] Fix renderer and potentially add more features
    - [ ] constraint stress colours? 
- [ ] write docs
- [ ] Standardize units (?) 
- [ ] formalize package
- [ ] Optimize
- [ ] update paper... maybe

### Bugs
- particles can teleport through walls way too easily --> perhaps implement a ray-casting algorithm instead of being velocity dependent
- some degree of instability when particles are stacked up (?) --> could be an issue of the world constraints
- unify solver behavior --> focus on position-based, velocity independent constraint and collision behavior.
  - seems to have a tendency to lose energy when constraints are used.

- wall penetration issue with charges???