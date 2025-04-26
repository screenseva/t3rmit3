    /*

                    Forest Fire

        Plane 0 indicates the presence of a tree:
            1 = tree, 0 = empty
        Plane 1 indicates whether a tree is burning:
            1 = burning, 0 = not burning

        The transition rules are as follows.

        1.  A burning tree turns into an empty cell.
        2.  A non-burning tree with one burning neighbour turns
            into a burning tree.
        3.  A tree with no burning neighbour ignites with
            probability f due to lightning.
        4.  An empty space grows a new tree with probability p.
        
        These rules are as given in Drossel, B. and Schwabl, F.
        (1992), "Self-organized critical forest-fire model." Phys. Rev.
        Lett. 69, 1629-1632.
        
        We use planes 2-5 to indicate the age of a tree or fire
        afterglow.  This plays no part in the evaluation of the
        rule, but simply determines the intensity of green or
        orange/brown in which the cell is displayed.
        
        The only reason this is implemented as an evaluator
        instead of as a conventional rule is that we require
        probabilities for f and p which are smaller than can be
        obtained by using random input to a one-byte state.

    */

    rule.evaluator.f = 0.00002;         // Probability of lightning
    rule.evaluator.p = 0.002;           // Probability of new growth

    function forest(cells, phyx, phyy, p) {
        var self = cells[p];

        var tree = (self & 1) != 0,
            burning = (self & 2) != 0,
            age = (self >> 2);

        if (tree && burning) {
            return 4;       // Burning tree becomes empty cell with age of 1
        }

        if (tree) {
            if ((cells[p - phyx] & 2) ||        // n
                (cells[p - 1] & 2) ||           // w
                (cells[p + 1] & 2) ||           // e
                (cells[p + phyx] & 2)           // s
                                            ||
                (cells[p - (phyx + 1)] & 2) ||  // nw
                (cells[p - (phyx - 1)] & 2) ||  // ne
                (cells[p + (phyx - 1)] & 2) ||  // sw
                (cells[p + (phyx + 1)] & 2)     // se
               ) {
                return 3;   // Tree with burning neighbour burns
            }

            if (Math.random() <= rule.evaluator.f) {
                return 3;   // Tree struck by lightning
            }
            
            //  Tree unaffected: increment age for display
            return (self & 3) | (Math.min(15, age + 1) << 2);
        }

        if (Math.random() <= rule.evaluator.p) {
            return 1;       // Empty cell grows new tree
        }
        return (age > 0) ? (Math.min(15, (self >> 2) + 1) << 2) : 0;
    }
