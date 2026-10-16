# ArmReach build status — 2026-10-16

Implemented interactive FK/IK simulation, adjustable lengths and limits, target picking, two solutions, unreachable/limited/singular status and JSON export. Includes sample configuration, README and CI workflow. No deployment or hardware.

Local verification: 10 Node tests pass, including 1,225 synthetic round trips; maximum position residual 1.7772239894833365e-15 m. app.js syntax passes. Browser verification status follows below. Remote CI status is reported with the pull request.

Local Chromium download returned invalid ZIP data, so browser smoke testing could not run locally. CI is configured to run the supplied browser test; consult the actual run result. No browser success is assumed.
