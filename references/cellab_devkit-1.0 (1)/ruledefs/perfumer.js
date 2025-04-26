
    /*
            
                Diffusion of a random gas
                
    */
    
    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "perfume";
    rule.palreq = "perfume";
    rule.ocodereq = "gaswall";

    function perfumer(oldstate,     nw, n  , ne,
                                    w, self, e,
                                    sw, s  , se) {
        return 0;
    }
