export const BOXES_PER_SIDE: number = 5;        // Number of boxes in cube = BOXES_PER_SIDE**3 .aka. cubed.
export const BOX_SIZE: number = 20;             // Size of the Boxes.

export const SECONDS_PER_CYCLE: number = 8;     // Seconds per animation expand-contract cycle.
export const SECONDS_PER_TURN: number = 2;      // Seconds per 90 degree turn.

export const CYCLE_PAUSE_DELAY_MSEC: number = 500;  // Pause delay before/after turn.

export const RANDOM_SINE_TRANSLATION_SCALING = 5;  // Translation scaling from center for each box * sin(a)
export const TURN_SINE_TRANSLATION_SCALING = 1.5;  // Translation scaling from center for each box * sin(a)

export const BOX_MAX_ANGULAR_RATE: number = .01;                // radians/update
export const BOX_MAX_DELTA_ANGULAR_RATE: number = .001;         // radians/update
export const BOX_ROTATION_MAX_RADIANS: number = Math.PI * 4.0;  // maximum radians/update
export const TURN_ANGLE_RADIANS: number = Math.PI / 2;          // how much a box turns
