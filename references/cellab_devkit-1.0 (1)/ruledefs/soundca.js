   /*

          This is an implementation of one of the rules from the
          standalone SoundCa program from the original RC
          directory.  SoundCa is a semitotalistic rule which
          looks at two bits each of a cell and its two
          neighbors.  Depending on what the center cell's state
          is, the cell reacts differently to the neighborhood
          sum.  This rule is meant to be used as a template, so
          that you can key in any SoundCa rule that interests
          you.

   */


    rule.worldtype = 5;          // 1D ring world, 4 neighbours

    function soundca(oldstate,     l2, l1, self, r1, r2) {
        var ruleTable = [
            // For a Sum of:           6   5   4   3   2   1   0
            /* States 0 and 3 use: */  3,  2,  1,  3,  1,  2,  0,
            /* States 1 and 2 use: */  0,  1,  0,  3,  3,  1,  0
        ];
        
        var sum, index = 0;

        sum = l1 + r1;
        switch (oldstate & 3) {
            case 0:
            case 3:
                index = 6 - sum;
                break;

            case 1:
            case 2:
                index = 13 - sum;
                break;
        }
        return ruleTable[index];
        
    }
