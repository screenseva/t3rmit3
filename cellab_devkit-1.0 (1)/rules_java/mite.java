/* Mite (ne' gause2)

    Designed and implemented in C by Dan Drake in January 1990.
    Converted to JavaScript by John Walker in April 2017.

    This was inspired by the Volterra-Gause Law of ecology:
    Two species can't occupy the same ecological niche.  It
    could be fun to model that kind of system, but I haven't
    succeeded in cramming an interesting model of two
    competing species into the available 8 bits of CA
    information.  Anyway, the family of programs was
    originally called Gause because Volterra has too many
    letters to allow adding extra digits for version
    numbers, and besides, Gause is number two and probably
    tries harder, and sounds a little like Cows, which I
    originally thought my herbivores were going to be.

    The idea, initially, was that there's vegetation (Grass)
    at various densities, with herbivores (Cows) eating it.

    The previous version, GAUSE1, let Cows double their
    numbers when there was enough to eat.  Grass starts
    spreading to any cell that has 3 neighbors with
    established Grass.  The result is a constantly shifting
    world, but one that's satisfyingly stable in that it
    generally stays alive.

    This one, GAUSE2, is the same except that the Grass has
    to be very well established, in fact saturating its
    cell, before it can spread. The slower spread means that
    large islands of Grass get chewed up; but in a large
    stable system there are always other Cow-free islands
    forming and preparing to get large enough to be invaded
    and eaten up.

    This thing wound up with rather a nice model of certain
    sorts of ecosystem, but now that it's working, it looks
    less like cows eating grass than like predatory mites
    eating strawberry mites which exist on a continuous
    substrate of strawberry plants.  Hence the new name.

    It's fun to observe how a system that starts out too
    small can end with all the predators starving (and maybe
    no viable population of prey), while a large enough
    system will go on forever.

    If you want to set up your own starting patterns, create
    predators on plane 7 and prey on planes 5-6.  Normally,
    you want both 5 and 6 on if 7 is on, to let the predator
    not starve too soon.  Clear plane 4 (phase) and make
    plane 0 a copy of plane 7.  Yuck.

    This program stole a modification of Naive Diffusion
    from the Dendrites program.

        We use plane #0 to show bits for updating.
        We use planes #1,2,3 for randomizer info.
        We use plane #4 for the phase:
          If bit #4 is 0 we update the Cows,
          If bit #4 is 1 we update the Grass.
        We use planes #5-6 to indicate increasing density of Grass,
        We use plane #7 to indicate presence of Cows.

*/

class Mite extends ruletable {
    static final int
            Randombit =  1,
            Randombits = 3,
            Phasebit =   (Randombit + Randombits),
            Phasebits =  1,
            Grassbit  =  (Phasebit + Phasebits),
            Grassbits =  2,
            Cowbit  =    (Grassbit + Grassbits),

            Grassmin =   3,         // Lowest value that propagates
            Grassjump =  3;         // Neighbors needed to propagate

    void jcruleModes() {
        setWorld(1);
        setPatternRequest("mite");
        setPaletteRequest("mite");
        setRandomInput(Randombit, Randombits);
    }

    int jcrule(int oldstate) {
        int newstate, phase, grass, cow, direction, newself = 0, eightsum;

        cow = BITFIELD(Cowbit, 1);
        grass = BITFIELD(Grassbit, Grassbits);
        phase = BITFIELD(Phasebit, Phasebits);

        switch (phase) {
            case 0:             // Update Cows
                if (cow == 0) {
                    direction = BITFIELD(Randombit, Randombits);
                    switch (direction) {
                        case 0: cow = nw;
                            break;
                        case 1: cow = n;
                            break;
                        case 2: cow = ne;
                            break;
                        case 3: cow = e;
                            break;
                        case 4: cow = se;
                            break;
                        case 5: cow = s;
                            break;
                        case 6: cow = sw;
                            break;
                        case 7: cow = w;
                            break;
                    }
                }
                if (grass == 0) {
                    cow = 0;
                }
                phase = 1;
                if (grass >= Grassmin) {
                    newself = 1;
                } else {
                    newself = 0;
                }
                break;

            case 1:              // Update Grass
                eightsum = SUM_8;
                if (cow != 0) {
                    if (grass > 0) {
                        grass--;
                    }
                }  else  {
                    switch (grass) {
                        case 0:
                            if (eightsum >= Grassjump)
                                grass = 1;
                            break;
                        case 1:
                        case 2:
                            grass += 1;
                            break;
                    }
                }
                newself = cow;
                phase = 0;
        }

        return BF(cow, Cowbit) |
               BF(grass, Grassbit) |
               BF(phase, Phasebit) |
               newself;
    }
}

public class mite {
    public static void main(String args[]) {
        (new Mite()).generateRuleFile("mite");
    }
}
