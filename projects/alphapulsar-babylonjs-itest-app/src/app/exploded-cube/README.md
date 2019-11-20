Exploded Cube: Definitions used in the code...
---
- Cube: The main object animated that expands and contracts.
- The "Cube"'s six facets are comprised of "Box" objects. There is one "Cube".
---
- Box: The individual rotating BABYLONJS.Mesh "Box"es that comprise the Cube.
- The total number of "Box"es is "BOXES_PER_SIDE" cubed, .aka. BOXES_PER_SIDE^^3.
---
- Cycle: One expand-contract animation iteration of the Cube.
---
- Turn: A persistent N*90 degree rotation where N is an odd positive integer.
---
- Frame: One step in a Cycle or Turn. _Not_ the same as rendering FPS.
- A Frame's duration can stretch as necessary to complete processing and even overlap the next frame.
- Frame processing is signaled at a maximum rate of FRAMES_PER_SECOND using setInterval().
---

State Machine: Six state transitions occur: ST0 -> ST5

- ST0 = RENDER_CUBE_EXPAND_COLLAPSE -> PAUSE_BEFORE_ROTATION
- ST1 = PAUSE_BEFORE_ROTATION -> PAUSE
- ST2 = PAUSE_BEFORE_ROTATION -> via async setTimeout -> RENDER_BOX_ROTATION
- ST3 = RENDER_BOX_ROTATION -> PAUSE_AFTER_ROTATION
- ST4 = PAUSE_AFTER_ROTATION -> PAUSE
- ST5 = PAUSE_AFTER_ROTATION -> via async setTimeout -> RENDER_CUBE_EXPAND_COLLAPSE
---
