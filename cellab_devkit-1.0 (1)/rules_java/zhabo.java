/*

        The Zhabotinsky reaction of Margolus & Toffoli

*/

class Zhabo extends ruletable {

    void jcruleModes() {
    	setWorld(1);
	setPatternRequest("zhabo");
        setPaletteRequest("zhabo");
        setTemporalPhase(1, 2);
    }

    int jcrule(int oldstate) {
        int alarm, time, newself;
        boolean alarmset;

        alarmset = BITSET(3);
        time = TPHASE();

        newself = (time == 0) ? 1 : 0;

        time = (time > 0) ? time - 1 : 0;

        if (self == 1 && alarmset) {
           time = 3;
        }

        alarm = ((SUM_8 == 2) || (SUM_8 > 3)) ? 1 : 0;

        return BF(alarm, 3) | BF(time, 1) | newself;
    }
}

public class zhabo {
    public static void main(String args[]) {
        (new Zhabo()).generateRuleFile("zhabo");
    }
}
