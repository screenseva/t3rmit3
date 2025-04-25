
    rule.worldtype = 10;         // 2D open semitotalistic rule

    function hodge(oldstate, SUM_8) {
        var temp = 0;

        if (oldstate == 0) {
            if (SUM_8 < 5) {
                temp = 0;
            } else {
                if (SUM_8 < 100) {
                    temp = 2;
                } else {
                    temp = 3;
                }
            }
        } else if ((oldstate > 0) && (oldstate < 31)) {
            temp = ((SUM_8 >> 3) + 5) & 255;
        }
        if (temp > 31) {
            temp = 31;
        }
        if (oldstate == 31) {
            temp = 0;
        }
        return temp;
    }
