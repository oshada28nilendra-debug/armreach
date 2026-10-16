# ArmReach

An offline planar two-link robot arm simulator for robotics learners exploring how joint angles map to positions and how a target can admit two arm configurations. **Simulation only: no hardware control.**

## Run

Open `index.html` directly in a modern browser. No installation, internet, server, paid APIs or build step required. Keep the JS/CSS files alongside it. Alternatively use `python -m http.server 8000 --bind 127.0.0.1` in this folder and open http://localhost:8000.

1. Adjust link lengths and shoulder/elbow limits.
2. Move angle sliders to inspect forward kinematics.
3. Enter target coordinates or click the diagram, then solve.
4. Select either inverse solution when available; dashed arms display the candidates.
5. Export a JSON snapshot containing units, configuration, current pose, target and inverse solutions.

Try links 1 m / 1 m and target (1,1): two solutions. Target (3,0): unreachable. Elbow limits [0,180]: one solution. Target (0,0) with equal links: infinitely many shoulder angles; a valid representative is shown. `examples/configuration.json` documents an exported snapshot. Import is not included.

## Geometry and conventions

Base at (0,0), +x right, +y up. Shoulder angle is measured counterclockwise from +x; elbow is relative to the first link. Lengths are metres, angles degrees. Forward position is `x=L1*cos(q1)+L2*cos(q1+q2)` and `y=L1*sin(q1)+L2*sin(q1+q2)`.

Inverse kinematics uses the cosine law to find ±q2, then subtracts the elbow offset from atan2(y,x) to obtain q1. Equivalent ±360° representations are checked against inclusive limits, and equivalent boundary poses are deduplicated. Fully extended/folded poses are singular. At the exact equal-link origin, q1 is free and q2 must be ±180°; only a representative of that infinite family is returned.

Supported links: 0.01–10 m; joint limits: ordered intervals within ±180°; target coordinates: ±100 m. Targets outside the diagram remain solvable through numeric entry. Reach comparisons use tolerance `1e-10*(L1+L2)` metres; joint-limit comparisons use 1e-9 degrees. Extremely close boundary targets may be clamped to the boundary. Invalid input is reported and export disabled; the last valid diagram is retained.

## Architecture and trade-offs

`kinematics.js`: pure validation/FK/IK, usable in Node and browser. `app.js`: controls, SVG drawing and JSON export. `style.css`: responsive layout. `tests/core.test.js`: dependency-free Node tests. The shaded annulus is geometric reach **without** joint-limit restrictions; solution filtering enforces limits. Pure analytic IK is small and predictable for two links but does not extend directly to arbitrary robots.

No dynamics, torque, inertia, trajectory planning, collision checking, calibration, obstacle avoidance or physical actuation. Solutions describe positions, not safe motions. This is an educational tool, not a production robot controller or novelty claim.

## Verification

```sh
node --test tests/core.test.js
node --check app.js
```

Node 22+; no npm dependencies. Ten tests cover known forward positions, both inverse solutions, unreachable inner/outer regions, singularities, limits, ±180° equivalence, invalid input and a synthetic 1,225-pose grid. Measured maximum FK→IK→FK position error: 1.7772239894833365e-15 m on Node 24. This is floating-point geometry on simulated poses, not physical accuracy. GitHub Actions repeats the tests on Node 22.

## Interview explanation

“I separated analytical kinematics from the UI, enumerated both elbow configurations, filtered them against joint limits, and handled singular targets explicitly. I validated geometric round trips and edge cases rather than claiming hardware accuracy.”
