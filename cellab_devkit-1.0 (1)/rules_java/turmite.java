    /*

        This program creates a table to be used with the turmite
        evaluator.

        Turmite's Bit Usage:
        7,6   turmite bits.
        5     reserved for speed bit.
        4,3,2 direction bits.
        1,0   tile bits.

        Turmite Nomencalture:
            Cell is the cell I update, Source is its state,
            Target is a cell near Cell, Sink is Target's state,
            Mite & Tile are  new cell values I compute.

        Turmite's action:
        (0) Get Source cell.  Test Source against Turmite bits.  If zero,
            copy Source to Cell in New Buffer and exit.
        (1) If Source has nonzero Turmite bits, use direction bits to select
            Target and load Sink value.
        (2) Use the lookup table to determine Mite state.
        (3) Put Mite in Target position in New Buffer.
        (4) Mask Source to get Tile and put Tile in Cell in New Buffer.

    */

class Turmite extends ruletable {
            
    void jcruleModes() {
        setWorld(12);
        setOwnCodeRequest("turmite");
        setPatternRequest("turmite");
        setPaletteRequest("turmite");
    }

    int jcrule(int TState) {
        
        int Source, TurType, Sink, TargTile, NewTargTile = 0,
            Dir, NewDir = 0, Mite;
        
        Source = TState & 0xFF;
        Dir = (Source >> 2) & 7;
        TurType = Source >> 6;
        Sink = TState >> 8;
        TargTile = Sink & 1;

        Mite = 0;
        switch (TurType) {
            case 1:
                switch (TargTile) {
                    case 0:
		                NewDir = (Dir + 2) % 8;
		                NewTargTile = 1;
                        break;
                        
	                case 1:
		                NewDir = (Dir + 6) % 8;
		                NewTargTile = 0;
                        break;
		        }
                Mite = (TurType << 6) | (NewDir << 2) | NewTargTile;
                break;
                
            case 2:
                switch (TargTile) {
                    case 0:
		                NewDir = (Dir + 6) % 8;
		                NewTargTile = 1;
		                break;
                        
	                case 1:
		                NewDir = (Dir + 2) % 8;
		                NewTargTile = 0;
		                break;
                }
                Mite = (TurType << 6) | (NewDir << 2) | NewTargTile;
                break;
            
            case 3:
                switch (TargTile) {
                    case 0:
		                NewDir = (Dir + 1) % 8;
		                NewTargTile = 1;
		                break;
                        
	                case 1:
		                NewDir = (Dir + 7) % 8;
		                NewTargTile = 0;
		                break;
                }
                Mite = (TurType << 6) | (NewDir << 2) | NewTargTile;
                break;
        }

        return Mite;
    }
}

public class turmite {
    public static void main(String args[]) {
        (new Turmite()).generateRuleFile("turmite");
    }
}
