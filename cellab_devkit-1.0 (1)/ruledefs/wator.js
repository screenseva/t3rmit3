    /*

        This is a three species version of a "Sharks and Fish" world.
        Wator calls the randswap evaluator.
        
        For the original simulation upon which this is based, see
            A. K. Dewdney, The Armchair Universe,
	        W. H. Freeman: New York, 1988, pp. 239-251.

        Rudy Rucker, May 23, 1989.

    */

    rule.worldtype = 13;         // 2D torus world, user evaluator
    rule.patreq = "billbord";
    /*  Our palette codes:
            1:  Red     Newborn shrimp
            2:  Green   Newborn fish
            3:  Blue    Newborn shark
            All non-newborns of these species are
            displayed in subdued versions of these
            colors.  */
    rule.palreq = "wator";
    rule.ocodereq = "randswap";

    function wator(NabeAndMe) {
        var ShrimpBreed   =  8,     // Shrimp: breeding age begins
            ShrimpSterile = 12,     //         breeding age ends
            ShrimpDie     = 15,     //         lifespan if not eaten
            FishBreed     =  3,     // Fish:   breeding age
            FishStarve    =  5,     //         starve if no food for
            SharkBreed    =  2,     // Sharks: breeding age
            SharkStarve   =  7;     //         starve if no food for

        var Me, MeAge, MeHunger, MeShrimpAge, MeType,
            Nabe, NabeAge, NabeShrimpAge,
            MeShrimp, MeFish, MeShark, NabeShrimp, NabeFish, NabeShark,
            newState;

        /*  NabeAndMe supplies our state in the low byte and
            the state of a randomly-selected neighbor in the
            high byte.  Extract the properties for me and my
            neighbor.  Cell tyle codes:

                0   Empty cell
                1   Shrimp
                2   Fish
                3   Shark
        */
        Me = NabeAndMe & 0xFF;          // My state
        Nabe = NabeAndMe >> 8;          // Neighbor state
        MeShrimp = (Me & 3) == 1;       // Am I a shrimp ?
        MeFish = (Me & 3) == 2;         //        fish ?
        MeShark = (Me & 3) == 3;        //        shark ?
        MeAge = (Me >> 2) & 7;          // My age (0-7) if fish, shark
        MeHunger = Me >> 5;             // My hunger state (0-7)
        MeShrimpAge = Me >> 2;          // My age (0-63) if shrimp
        NabeShrimp = (Nabe & 3) == 1;   // Is neighbor a shrimp ?
        NabeFish = (Nabe & 3) == 2;     //               fish ?
        NabeShark = (Nabe & 3) == 3;    //               shark ?
        NabeAge = (Nabe >> 2) & 7;      // Neighbor's age (0-7) if fish, shark
        NabeShrimpAge = Nabe >> 2;      // Neighbor's age (0-63) if shrimp
        MeType = Me & 3;                // My type as a number

        switch (MeType) {
            case 0:             // I am an empty cell
                newState = 0;
                /*  If my neighbor is a shrimp which is above
                    breeding age and below sterile age, I become
                    a newly-born shrimp.  */
                if ((NabeShrimp && (ShrimpBreed < NabeShrimpAge) &&
                   (NabeShrimpAge < ShrimpSterile))) {
                    newState = 1;
                }
                /*  If my neighbor is a fish which is of breeding
                    age, I become a newly-born fish.  */
                else if (NabeFish && (NabeAge == FishBreed)) {
                    newState = 2;
                }
                /*  if my neighbor is a shark which is of breeding
                    age, I become a newly-born shark.  */
                else if (NabeShark && (NabeAge == SharkBreed)) {
                    newState = 3;
                }
                //  All of these outcomes set the newborn's age to 0
                break;

            case 1:             // I am a shrimp
                //  If my neighbor is a fish, I get eaten
                if (NabeFish) {
                    newState = 0;
                } else {
                    /*  Increment my age.  If I've reached ShrimpDie,
                        I die of old age.  Otherwise, I just age.  */
                    MeShrimpAge = MeShrimpAge + 1;
                    if (MeAge == ShrimpDie) {
                        newState = 0;
                    } else {
                        newState = ((MeShrimpAge << 2) | 1) & 255;
                    }
                }
                break;

            case 2:             // I am a fish
                //  If my neighbor is a shark, I get eaten
                if (NabeShark) {
                    newState = 0;
                } else {
                    /*  If my neighbor is a shrimp, eat it.  This
                        resets my hunger counter to zero.  */
                    if (NabeShrimp) {
                        MeHunger = 0;
                    }
                    /*  If my hunger counter has reached FishStarve,
                        I die of starvation.  */
                    if (MeHunger >= FishStarve) {
                        newState = 0;
                    } else {
                        //  Otherwise, increment my age and hunger
                        MeHunger = MeHunger + 1;
                        MeAge = (MeAge + 1) % (FishBreed + 1);
                        newState = ((MeHunger << 5) | (MeAge << 2) | 2) & 255;
                    }
                }
                break;

            case 3:             // I am a shark
                /*  If my neighbor is a fish, eat it and reset
                    my hunger counter to zero.  */
                if (NabeFish) {
                    MeHunger = 0;
                }
                /*  If my hunger has reached SharkStarve, I die
                    of starvation.  */
                if (MeHunger >= SharkStarve) {
                    newState = 0;
                } else {
                    //  Otherwise, increment my age and hunger
                    MeHunger = MeHunger + 1;
                    MeAge = (MeAge + 1) % (SharkBreed + 1);
                    newState = ((MeHunger << 5) | (MeAge << 2) | 3) & 255;
                }
                break;
        }

        return newState;
    }
