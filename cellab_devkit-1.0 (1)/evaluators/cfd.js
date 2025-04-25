    /*

                    Computational Fluid Dynamics

                    Lattice-Boltzmann Algorithm

            This program is based upon:
                http://physics.weber.edu/schroeder/fluids/
            by Prof. Daniel V. Schroeder, Weber State
            University. Please see the copyright statement at
            the end governing this derivative work.

            This evaluator manages its own map, where each cell
            consists of 12 (single-precision) floating-point
            numbers which specify the microscopic densities for
            the cell and its eight neighbours, the macroscopic
            density, and macroscopic velocity (x and y) for its
            contents, plus a flag distinguishing impermeable
            barrier cells from those containing fluid.  An
            additional array holding the curl of each cell is
            used only in displaying the map if curl display if
            desired, and is computed on demand.

            A source of fluid flowing with rule.evaluator.speed
            is placed at the left edge of the map.  Boundary
            conditions at the other edges are fixed to the
            initial density condition.

            The evaluator can compute multiple
            rule.evaluator.stepsPerGeneration for every update
            of the visible map.  Setting this to an appropriate
            value can roughly double the effective speed of
            evolution of the model.

            The evaluator uses no lookup table, and assumes it
            is being run with the wind.jcc colour palette.  This
            palette provides a false colour range for states
            from 1-254, with state 255 indicating barrier cells.
            
            If you draw barriers at the top and bottom of the
            pattern, leaving a "letterbox" for the fluid to flow
            within, evaluation will skip the barriers, speeding up
            execution time.

    */

    //  Simulation parameters
    rule.evaluator.speed = 0.1;
    rule.evaluator.viscosity = 0.02;
    rule.evaluator.stepsPerGeneration = 10;
    rule.evaluator.display = 4;         // Display: 0 Density
                                        //          1 x Velocity
                                        //          2 y Velocity
                                        //          3 Speed
                                        //          4 Curl

    rule.evaluator.nColours = 253;      // Colours in rendering palette
    rule.evaluator.contrast = 0;        // Contrast (-10 to 10)

    rule.evaluator.dimx = map[0].dimx;
    rule.evaluator.dimy = map[0].dimy;

    rule.evaluator.mapsize = rule.evaluator.dimx * rule.evaluator.dimy;
    rule.evaluator.arraysize = rule.evaluator.mapsize * 4;

    //  Microscopic densities for each neighbour direction
    rule.evaluator.n0 = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nN = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nS = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nE = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nW = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nNE = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nSE = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nNW = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.nSW = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    //  Macroscopic density
    rule.evaluator.rho = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    //  Macroscopic velocity
    rule.evaluator.ux = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    rule.evaluator.uy = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    //  Curl (used only for display, computed if needed after update)
    rule.evaluator.curl = new Float32Array(new ArrayBuffer(rule.evaluator.arraysize));
    //  Is cell a barrier ?
    rule.evaluator.barrier = new Uint8Array(new ArrayBuffer(rule.evaluator.mapsize));

    //  Constants
    rule.evaluator.four9ths = 4.0 / 9.0;
    rule.evaluator.one9th = 1.0 / 9.0;
    rule.evaluator.one36th = 1.0 / 36.0;

    //  Return linear map address for (x, y) co-ordinates
    //  Can't declare these as usual functions because it confuses
    //  the evaluator parser.
    var la = function(x, y) {
        return (y * rule.evaluator.dimx) + x;
    };
    rule.evaluator.la = la;         //  Make it easier for evaluator to access

    //  Set barriers from the presence of state 255 cells in the map

    var setBarriers = function() {
        rule.evaluator.barrier.fill(0);     //  Clear any existing barriers
        for (var y = 0; y < rule.evaluator.dimy; y++) {
            for (var x = 0; x < rule.evaluator.dimx; x++) {
                if (map[omap].cells[(x + 1) + ((y + 1) * map[omap].phyx)] == 255) {
                    rule.evaluator.barrier[la(x, (rule.evaluator.dimy - 1) - y)] = 1;
                }
            }
        }

        /*  Now determine the first and last lines which contain
            any non-barrier cells.  */

        rule.evaluator.top = -1;
        for (y = 0; y < rule.evaluator.dimy; y++) {
            for (x = 0; x < rule.evaluator.dimx; x++) {
                if (rule.evaluator.barrier[la(x, y)] == 0) {
                    if (rule.evaluator.top < 0) {
                        rule.evaluator.top = y;
                    }
                    rule.evaluator.bottom = y;
                    break;
                }
            }
        }
//console.log("Top = " + rule.evaluator.top + "  Bottom = " + rule.evaluator.bottom);
    };

    //  Initialise the fluid flow

    var initFluid = function(speed) {
        for (var y = 0; y < rule.evaluator.dimy; y++) {
            for (var x = 0; x < rule.evaluator.dimx; x++) {
                setEquil(x, y, speed, 0, 1);
                rule.evaluator.curl[la(x, y)] = 0;
            }
        }
    };

    /*  Set all the densities in a cell to their equilibrium
        values for a given velocity (newux, newuy) and
        density (newrho).  If newrho is not specified, the
        cell's density is left unchanged.  */

    var setEquil = function(x, y, newux, newuy, newrho) {
        var i = la(x, y);
        if (typeof newrho == 'undefined') {
                newrho = rule.evaluator.rho[i];
        }
        var ux3 = 3 * newux;
        var uy3 = 3 * newuy;
        var ux2 = newux * newux;
        var uy2 = newuy * newuy;
        var uxuy2 = 2 * newux * newuy;
        var u2 = ux2 + uy2;
        var u215 = 1.5 * u2;
        rule.evaluator.n0[i]  = rule.evaluator.four9ths * newrho * (1
                                                       - u215);
        rule.evaluator.nE[i]  =   rule.evaluator.one9th * newrho * (1 + ux3       +
                                    4.5 * ux2          - u215);
        rule.evaluator.nW[i]  =   rule.evaluator.one9th * newrho * (1 - ux3       +
                                    4.5 * ux2          - u215);
        rule.evaluator.nN[i]  =   rule.evaluator.one9th * newrho * (1 + uy3       +
                                    4.5 * uy2          - u215);
        rule.evaluator.nS[i]  =   rule.evaluator.one9th * newrho * (1 - uy3       +
                                    4.5 * uy2          - u215);
        rule.evaluator.nNE[i] =  rule.evaluator.one36th * newrho * (1 + ux3 + uy3 +
                                    4.5 * (u2 + uxuy2) - u215);
        rule.evaluator.nSE[i] =  rule.evaluator.one36th * newrho * (1 + ux3 - uy3 +
                                    4.5 * (u2 - uxuy2) - u215);
        rule.evaluator.nNW[i] =  rule.evaluator.one36th * newrho * (1 - ux3 + uy3 +
                                    4.5 * (u2 - uxuy2) - u215);
        rule.evaluator.nSW[i] =  rule.evaluator.one36th * newrho * (1 - ux3 - uy3 +
                                    4.5 * (u2 + uxuy2) - u215);
        rule.evaluator.rho[i] = newrho;
        rule.evaluator.ux[i] = newux;
        rule.evaluator.uy[i] = newuy;
    };

    /*  Set boundary conditions at the edges of the map.  */

    var setBoundaries = function(speed) {
        for (var x = 0; x < rule.evaluator.dimx; x++) {
            setEquil(x, rule.evaluator.top, speed, 0, 1);
            setEquil(x, rule.evaluator.bottom, speed, 0, 1);
        }

        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom; y++) {
            setEquil(0, y, speed, 0, 1);
            setEquil(rule.evaluator.dimx - 1, y, speed, 0, 1);
        }
    };

    //  Collide particles within cells

    var collide = function(viscosity) {
        var omega = 1 / (3 * viscosity + 0.5);  // reciprocal of relaxation time
        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom; y++) {
            var i = la(1, y);
            for (var x = 1; x < rule.evaluator.dimx - 1; x++) {
                var thisrho = rule.evaluator.n0[i] +
                              rule.evaluator.nN[i] +
                              rule.evaluator.nS[i] +
                              rule.evaluator.nE[i] +
                              rule.evaluator.nW[i] +
                              rule.evaluator.nNW[i] +
                              rule.evaluator.nNE[i] +
                              rule.evaluator.nSW[i] +
                              rule.evaluator.nSE[i];
                rule.evaluator.rho[i] = thisrho;

                var thisux = (rule.evaluator.nE[i] +
                              rule.evaluator.nNE[i] +
                              rule.evaluator.nSE[i] -
                              rule.evaluator.nW[i] -
                              rule.evaluator.nNW[i] -
                              rule.evaluator.nSW[i]) / thisrho;
                rule.evaluator.ux[i] = thisux;

                var thisuy = (rule.evaluator.nN[i] +
                              rule.evaluator.nNE[i] +
                              rule.evaluator.nNW[i] -
                              rule.evaluator.nS[i] -
                              rule.evaluator.nSE[i] -
                              rule.evaluator.nSW[i]) / thisrho;
                rule.evaluator.uy[i] = thisuy

                //  Compute common sub-expressions we'll use below
                var one9thrho = rule.evaluator.one9th * thisrho;
                var one36thrho = rule.evaluator.one36th * thisrho;
                var ux3 = 3 * thisux;
                var uy3 = 3 * thisuy;
                var ux2 = thisux * thisux;
                var uy2 = thisuy * thisuy;
                var uxuy2 = 2 * thisux * thisuy;
                var u2 = ux2 + uy2;
                var u215 = 1.5 * u2;

                rule.evaluator.n0[i]  += omega * (rule.evaluator.four9ths*thisrho * (1
                                                               - u215) - rule.evaluator.n0[i]);
                rule.evaluator.nE[i]  += omega * (   one9thrho * (1 + ux3       +
                                            4.5 * ux2          - u215) - rule.evaluator.nE[i]);
                rule.evaluator.nW[i]  += omega * (   one9thrho * (1 - ux3       +
                                            4.5 * ux2          - u215) - rule.evaluator.nW[i]);
                rule.evaluator.nN[i]  += omega * (   one9thrho * (1 + uy3       +
                                            4.5 * uy2          - u215) - rule.evaluator.nN[i]);
                rule.evaluator.nS[i]  += omega * (   one9thrho * (1 - uy3       +
                                            4.5 * uy2          - u215) - rule.evaluator.nS[i]);
                rule.evaluator.nNE[i] += omega * (  one36thrho * (1 + ux3 + uy3 +
                                            4.5 * (u2 + uxuy2) - u215) - rule.evaluator.nNE[i]);
                rule.evaluator.nSE[i] += omega * (  one36thrho * (1 + ux3 - uy3 +
                                            4.5 * (u2 - uxuy2) - u215) - rule.evaluator.nSE[i]);
                rule.evaluator.nNW[i] += omega * (  one36thrho * (1 - ux3 + uy3 +
                                            4.5 * (u2 - uxuy2) - u215) - rule.evaluator.nNW[i]);
                rule.evaluator.nSW[i] += omega * (  one36thrho * (1 - ux3 - uy3 +
                                            4.5 * (u2 + uxuy2) - u215) - rule.evaluator.nSW[i]);
                i++;
            }
        }

        /*  At the right end of the map, copy left-flowing
            densities from next row to the left.  */

        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom - 1; y++) {
            rule.evaluator.nW[la(rule.evaluator.dimx - 1, y)] =
                rule.evaluator.nW[la(rule.evaluator.dimx - 2, y)];
            rule.evaluator.nNW[la(rule.evaluator.dimx - 1, y)] =
                rule.evaluator.nNW[la(rule.evaluator.dimx - 2, y)];
            rule.evaluator.nSW[la(rule.evaluator.dimx - 1, y)] =
                rule.evaluator.nSW[la(rule.evaluator.dimx - 2, y)];
        }
    };

    //  Move particles in their direction of flow

    var stream = function() {
        var p, dimx = rule.evaluator.dimx, dimy = rule.evaluator.dimy;

        //  Start from NW corner
        for (var y = rule.evaluator.bottom - 1; y > rule.evaluator.top; y--) {
            p = la(1, y);
            for (var x = 1; x < dimx - 1; x++) {
                rule.evaluator.nN[p] = rule.evaluator.nN[p - dimx];          // Move the north-moving particles
                rule.evaluator.nNW[p] = rule.evaluator.nNW[(p - dimx) + 1];  // and the northwest-moving particles
                p++;
            }
        }
        //  Start from NE corner
        for (var y = rule.evaluator.bottom - 1; y > rule.evaluator.top; y--) {
            p = la(dimx - 2, y);
            for (var x = dimx - 2; x > 0; x--) {
                rule.evaluator.nE[p] = rule.evaluator.nE[p - 1];            // Move the east-moving particles
                rule.evaluator.nNE[p] = rule.evaluator.nNE[p - (dimx + 1)]; // and the northeast-moving particles
                p--;
            }
        }
        //  Start from SE corner
        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom; y++) {
            p = la(dimx - 2, y);
            for (var x = dimx - 2; x > 0; x--) {
                rule.evaluator.nS[p] = rule.evaluator.nS[p + dimx];         // Move the south-moving particles
                rule.evaluator.nSE[p] = rule.evaluator.nSE[(p + dimx) - 1]; // and the southeast-moving particles
                p--;
            }
        }
        //  Start from SW corner
        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom; y++) {
            p = la(1, y);
            for (var x = 1; x < rule.evaluator.dimx - 1; x++) {
                rule.evaluator.nW[p] = rule.evaluator.nW[p + 1];            // Move the west-moving particles
                rule.evaluator.nSW[p] = rule.evaluator.nSW[p + dimx + 1];   // and the southwest-moving particles
                p++;
            }
        }

        //  Handle bounce-back from barriers
        for (var y = rule.evaluator.top + 1; y < rule.evaluator.bottom; y++) {
            p = la(1, y);
            for (var x = 1; x < rule.evaluator.dimx - 1; x++) {
                if (rule.evaluator.barrier[p]) {
                    rule.evaluator.nE[p + 1] = rule.evaluator.nW[p];
                    rule.evaluator.nW[p - 1] = rule.evaluator.nE[p];
                    rule.evaluator.nN[p + dimx] = rule.evaluator.nS[p];
                    rule.evaluator.nS[p - dimx] = rule.evaluator.nN[p];
                    rule.evaluator.nNE[(p + dimx) + 1] = rule.evaluator.nSW[p];
                    rule.evaluator.nNW[(p + dimx) - 1] = rule.evaluator.nSE[p];
                    rule.evaluator.nSE[(p - dimx) + 1] = rule.evaluator.nNW[p];
                    rule.evaluator.nSW[(p - dimx) - 1] = rule.evaluator.nNE[p];
                }
                p++;
            }
        }
    };

    //  Check for numerical instability at the end of a step
    var isStable = function() {
        var stable = true;
                for (var x = 0; x < rule.evaluator.dimx; x++) {
                        /*  Check only the middle row.  If any cell's density
                has gone non-positive, we've blown up.  */
                        if (rule.evaluator.rho[la(x, rule.evaluator.dimy / 2)] <= 0) {
                return false;
            }
                }
        return true;
    };

    //  When the pattern changes, re-initialise barriers from the map
    rule.evaluator.onChange = function(w) {
        rule.evaluator.generationFirstDone = false;
    };

    //  Before the first generation, initialise arrays
    rule.evaluator.generationFirst = function() {
         // Contrast mapping states to colours
        rule.evaluator.contrastm =  Math.pow(1.2, rule.evaluator.contrast);
        setBarriers();                          // Set barriers from map
        initFluid(rule.evaluator.speed);        // Initialise to flow speed
    };

    /*  At the start of the generation, update the map.  Note
        that this performs the entire update of our internal
        map.  When we're done, the only thing left for the
        cell-by-cell evaluator to do is return the requested
        colour index based upon the cell property being displayed.  */

    rule.evaluator.generationStart = function() {
        setBoundaries(rule.evaluator.speed);

        for (var step = 0; step < rule.evaluator.stepsPerGeneration; step++) {
            collide(rule.evaluator.viscosity);
            stream();
        }
        if (!isStable()) {
                        alert("Numerical instability: fluid flow speed too high.");
            if (running) {
                pauseButton();
            }
        }
        if (rule.evaluator.display == 4) {
            //  Internal cells only; edges remain zero
            var p = la(1, 1), dimx = rule.evaluator.dimx;
            for (var y = 1; y < rule.evaluator.dimy - 1; y++) {
                for (var x = 1; x < rule.evaluator.dimx - 1; x++) {
                    rule.evaluator.curl[p] =
                        rule.evaluator.uy[p + 1] -
                        rule.evaluator.uy[p - 1] -
                        rule.evaluator.ux[p + dimx] +
                        rule.evaluator.ux[p - dimx];
                    p++;
                }
            }
        }
    }

    function cfd(cells, phyx, phyy, p, lut, ncells) {
        //  Blast update the new cells array in one pass
        var i = rule.evaluator.la(0, rule.evaluator.dimy - 1);
        for (var y = 0; y < rule.evaluator.dimy; y++) {
            for (var x = 0; x < rule.evaluator.dimx; x++) {
                if (rule.evaluator.barrier[i]) {
                    ncells[p] =  255;   // 255 denotes barrier cell
                } else {
                    var px;

                    switch (rule.evaluator.display) {
                        case 0:     // Density
                            px = (rule.evaluator.rho[i] - 1) * 6;
                            break;

                        case 1:     // x Velocity
                            px = (rule.evaluator.ux[i] - 1) * 2;
                            break;

                        case 2:     // y Velocity
                            px = (rule.evaluator.uy[i] - 1) * 2;
                            break;

                        case 3:     // Speed
                            px = Math.sqrt(
                                (rule.evaluator.ux[i] * rule.evaluator.ux[i]) +
                                (rule.evaluator.uy[i] * rule.evaluator.uy[i])) * 4;
                            break;

                        case 4:     // Curl
                            px = rule.evaluator.curl[i] * 5;
                            break;
                    }
                    ncells[p] = Math.round(rule.evaluator.nColours *
                        (px * rule.evaluator.contrastm +
                        ((rule.evaluator.display == 3) ? 0 : 0.5))) + 1;
                }
                p++;
                i++;
            }
            p += 2;             // Skip wrap-around cells at end of line
            i -= rule.evaluator.dimx * 2;   // Back up to previous line
        }
        return null;            // Terminate evaluator call loop

        /*
            This software is derived from:

                A lattice-Boltzmann fluid simulation in JavaScript,
                using HTML5 canvas for graphics:
                    http://physics.weber.edu/schroeder/fluids/

                    Copyright 2013, Daniel V. Schroeder

                Permission is hereby granted, free of charge, to any
                person obtaining a copy of  this software and
                associated data and documentation (the "Software"),
                to deal in  the Software without restriction,
                including without limitation the rights to  use,
                copy, modify, merge, publish, distribute,
                sublicense, and/or sell copies  of the Software, and
                to permit persons to whom the Software is furnished
                to do  so, subject to the following conditions:

                The above copyright notice and this permission
                notice shall be included in all  copies or
                substantial portions of the Software.

                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
                OF ANY KIND, EXPRESS OR IMPLIED,  INCLUDING BUT NOT
                LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A  PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE
                LIABLE FOR  ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR
                OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
                WITH THE SOFTWARE OR THE USE OR  OTHER DEALINGS IN
                THE SOFTWARE.

                Except as contained in this notice, the name of the
                author shall not be used in  advertising or
                otherwise to promote the sale, use or other dealings
                in this  Software without prior written
                authorization.

                    Credits:
                The "wind tunnel" entry/exit conditions are inspired
                by Graham Pullan's code
                        (http://www.many-core.group.cam.ac.uk/projects/LBdemo.shtml).
                Additional inspiration from  Thomas Pohl's applet
                    (http://thomas-pohl.info/work/lba.html).
                Other portions of code are based on Wagner
                    (http://www.ndsu.edu/physics/people/faculty/wagner/lattice_boltzmann_codes/)
                and Gonsalves
                    (http://www.physics.buffalo.edu/phy411-506-2004/index.html);
                code adapted from Succi,
                        (http://global.oup.com/academic/product/the-lattice-boltzmann-equation-9780199679249).
        */
   }
