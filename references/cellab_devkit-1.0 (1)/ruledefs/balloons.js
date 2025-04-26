/*

    This realizes one of the RC ruletables.  Any other RC
    ruletable can be specified in the table below.  The Balloons
    rule was invented by Brian Silverman.

*/

    rule.worldtype = 1;
    rule.ruleName = "balloons";
    rule.palreq = "rc";
    
    function balloons(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {
        var ruleTable = [
           /*                      EightSum
                        0   1   2   3   4   5   6   7   8 */
        /* State */
         /* 0 */        0,  0, 15,  0,  0,  0,  5,  0,  0,
         /* 1 */        0,  0,  0,  0,  0,  0,  0,  0,  0,
         /* 2 */        0,  0,  0,  0,  0,  0,  0,  0,  0,
         /* 3 */        0,  0,  0,  0,  0,  0,  0,  0,  0,
         /* 4 */        4,  4,  8,  4,  4,  4,  4,  4,  4,
         /* 5 */        5,  5,  5,  5,  5,  7,  7,  9, 11,
         /* 6 */        2,  2,  2,  2,  2,  2,  2,  2,  2,
         /* 7 */        5,  5,  5,  5,  5, 13, 13,  9, 11,
         /* 8 */        8,  8, 10,  8,  8,  8,  8,  8,  8,
         /* 9 */        2,  2,  2,  2,  2,  9, 13,  9, 11,
        /* 10 */       10, 10,  0, 10, 10, 10, 10, 10, 10,
        /* 11 */       14, 14, 14, 14, 14, 14, 14, 14, 11,
        /* 12 */       12, 12,  4, 12, 12, 12, 12, 12, 12,
        /* 13 */        6,  6,  6,  6, 13, 13, 13,  9, 11,
        /* 14 */       14, 14, 14, 12, 14, 14, 14, 14, 14,
        /* 15 */        2,  2,  2,  2,  2,  2,  2,  2,  2
           ];
           
        var eightSum = nw + n + ne + e + se + s + sw + w;
        
        return ruleTable[(9 * (oldstate & 15)) + eightSum];
    }
