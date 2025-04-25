/*

    This program runs an eightcell averaging rule of eight bits per
    cell.  We program it as a nowrap owncode WorldType 12 calling
    semi8.jco.

*/

class Rug extends ruletable {
    void jcruleModes() {
        setWorld(12);
        setOwnCodeRequest("semi8");
    }

    int jcrule(int oldstate) {
        return ((oldstate >> 3) + 1) & 0xFF;
    }
}

public class rug {
    public static void main(String args[]) {
        (new Rug()).generateRuleFile("rug");
    }
}
