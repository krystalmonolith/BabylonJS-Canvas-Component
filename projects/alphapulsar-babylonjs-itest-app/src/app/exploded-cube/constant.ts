/*
 * MIT License
 *
 * Copyright 2019 AlphaPulsar LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 */

export const BOXES_PER_SIDE = 4;        // Number of boxes in cube = BOXES_PER_SIDE**3 .aka. cubed.
export const BOX_SIZE = 20;             // Size of the Boxes.

export const SECONDS_PER_CYCLE = 6;     // Seconds per animation expand-contract cycle.
export const SECONDS_PER_TURN = 3;      // Seconds per 90 degree turn.

export const CYCLE_PAUSE_DELAY_MSEC = 1500;  // Pause delay before/after turn.

export const RANDOM_SINE_TRANSLATION_SCALING = 5;  // Translation scaling from center for each box * sin(a)
export const TURN_SINE_TRANSLATION_SCALING = 1.7;  // Translation scaling from center for each box * sin(a)

export const BOX_MAX_ANGULAR_RATE = .01;                // radians/update
export const BOX_MAX_DELTA_ANGULAR_RATE = .001;         // radians/update
export const BOX_ROTATION_MAX_RADIANS = Math.PI * 4.0;  // maximum radians/update
export const TURN_ANGLE_RADIANS = Math.PI / 2;          // how much a box turns
