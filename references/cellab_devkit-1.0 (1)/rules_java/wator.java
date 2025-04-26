    /*

        This is a three species version of a "Sharks and Fish" world.
        Wator calls the "randswap" user evaluator.
        Rudy Rucker, May 23, 1989.  Translated to Java by John
        Walker, 2017-04-19.

    */

class Wator extends ruletable {
    static final int
        ShrimpBreed  = 8,   ShrimpSterile = 12,  ShrimpDie   = 15,
        FishBreed    =  3,  FishStarve  =  5,
        SharkBreed   =  2,  SharkStarve =  7;
            
    void jcruleModes() {
        setWorld(13);
        setOwnCodeRequest("randswap");
        setPatternRequest("billbord");
        setPaletteRequest("wator");
    }

    int jcrule(int NabeAndMe) {
        
        int Me, MeAge, MeHunger, MeShrimpAge, MeType,
            Nabe, NabeAge, NabeShrimpAge,
            CaRule = NabeAndMe;
            
        boolean MeShrimp, MeFish, MeShark,
                NabeShrimp, NabeFish, NabeShark;

        Me = NabeAndMe & 0xFF;
        Nabe = NabeAndMe >> 8;
        MeShrimp = (Me & 3) == 1;
        MeFish = (Me & 3) == 2;
        MeShark = (Me & 3) == 3;
        MeAge = (Me >> 2) & 7;
        MeHunger = Me >> 5;
        MeShrimpAge = Me >> 2;
        NabeShrimp = (Nabe & 3) == 1;
        NabeFish = (Nabe & 3) == 2;
        NabeShark = (Nabe & 3) == 3;
        NabeAge = (Nabe >> 2) & 7;
        NabeShrimpAge = Nabe >> 2;
        MeType = Me & 3;
        
        switch (MeType) {
            case 0:
                CaRule = 0;
                if ((NabeShrimp && (ShrimpBreed < NabeShrimpAge) &&
                   (NabeShrimpAge < ShrimpSterile))) {
                    CaRule = 1;
                }
                if (NabeFish && (NabeAge == FishBreed)) {
                    CaRule = 2;
                }
                if (NabeShark && (NabeAge == SharkBreed)) {
                    CaRule = 3;
                }
                break;
            
            case 1:
                if (NabeFish) {
                    CaRule = 0;
                } else {
                    MeShrimpAge = MeShrimpAge + 1;
                    if (MeAge == ShrimpDie) {
                        CaRule = 0;
                    } else {
                        CaRule = ((MeShrimpAge << 2) | 1) & 255;
                    }
                }       
                break;
                
            case 2:
                if (NabeShark) {
                    CaRule = 0;
                } else {
                    if (NabeShrimp) {
                        MeHunger = 0;
                    }
                    if (MeHunger >= FishStarve) {
                        CaRule = 0;
                    } else {
                        MeHunger = MeHunger + 1;
                        MeAge = (MeAge + 1) % (FishBreed + 1);
                        CaRule = ((MeHunger << 5) | (MeAge << 2) | 2) & 255;
                    }
                }
                break;
                
            case 3:
                if (NabeFish) {
                    MeHunger = 0;
                }
                if (MeHunger >= SharkStarve) {
                    CaRule = 0;
                } else {
                    MeHunger = MeHunger + 1;
                    MeAge = (MeAge + 1) % (SharkBreed + 1);
                    CaRule = ((MeHunger << 5) | (MeAge << 2) | 3) & 255;
                }
                break;
        }
        
        return CaRule;
    }
}

public class wator {
    public static void main(String args[]) {
        (new Wator()).generateRuleFile("wator");
    }
}
