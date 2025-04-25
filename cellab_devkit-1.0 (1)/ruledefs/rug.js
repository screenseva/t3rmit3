/*

    This program runs an eight cell averaging rule of eight bits
    per cell.  We program it as a nowrap worldtype 12 calling
    the semi8 evaluator.

*/

    rule.worldtype = 12;         // User evaluator, 2D open world
    rule.ocodereq = "semi8";

    function rug(lutindex) {
        return ((lutindex >> 3) + 1) & 0xFF;
    }
