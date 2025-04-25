    /*
                Langton's Ant

            Bit plane assignments:

                0:      Ant is present in cell
                1-2:    Ant direction
                            0   North
                            1   East
                            2   West
                            3   South
                3:      Cell state
                            0   White
                            1   Black

        We use the vonn3 evaluator, which provides us the
        states of our von Neumann neighbours in oldstate as:

            C C C C N N N W   W W E E E S S S
            
        References:
            http://mathworld.wolfram.com/LangtonsAnt.html
            https://en.wikipedia.org/wiki/Langton's_ant

    */

    rule.worldtype = 13;         // 2D torus world
    rule.patreq = "dot";
    rule.palreq = "lant";
    rule.ocodereq = "vonn3";

    function lant(oldstate) {
        // Cardinal points and self
        const N = 0, E = 1, W = 2, S = 3, SELF = 4;

        // Shift count for neighbours, self
        const nbr = [ 9, 3, 6, 0, 12 ];

        //  New direction based upon old direction + (state << 2)
        const newdir = [ E, S, N, W,
                         W, N, S, E ];

        //  If ant is in this cell, flip its state and remove ant
        if (ant(SELF)) {
            return (state(SELF) ^ 1) << 3;
        }

        //  Does a neighbour contain an ant bound our way ?

        var newant = 0, olddir;

        if (ant(N) && (direction(N) == S)) {
            newant = 1;
            olddir = S;
        } else if (ant(E) && (direction(E) == W)) {
            newant = 1;
            olddir = W;
        } else if (ant(S) && (direction(S) == N)) {
            newant = 1;
            olddir = N;
        } else if (ant(W) && (direction(W) == E)) {
            newant = 1;
            olddir = E;
        }

        if (newant) {
            /*  Neighbour contains inbound ant.  Set ant present
                here on next step and adjust the ant's direction
                based upon its old direction and our current
                state. */
            return newant |
                   (newdir[olddir + (state(SELF) << 2)] << 1) |
                   (state(SELF) << 3);
        }

        //  No ant or inbound ant: state is unchanged
        return state(SELF) << 3;

        //  Functions to inquire state of neighbours

        //  Ant in this neighbour ?
        function ant(neigh) {
            return (oldstate >> nbr[neigh]) & 1;
        }

        //  Direction of ant in this neighbour
        function direction(neigh) {
            return (oldstate >> (nbr[neigh] + 1)) & 3;
        }

        //  State of this neighbour
        function state(neigh) {
            return (oldstate >> (nbr[neigh] + 3)) & 1;
        }
    }
