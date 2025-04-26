/*

        Laplace Rug rule

        This rule invokes the lapinc own code evaluator to solve
        the Laplace equation in the plane.  Since lapinc doesn't
        use the lookup table at all, this rule simply invokes
        the own code and generates an all zero lookup table. 
        Lapinc computes a weighted average of EveryCell's 8
        neighbours and adds 1.  The average has the form
        (4(n+e+s+w)+(nw+ne+se+sw))/20.

*/

    rule.worldtype = 12;         // Own code, 2D open world
    rule.ocodereq = "lapinc";

    function ruglap(lutindex) {

        return 0;
    }
