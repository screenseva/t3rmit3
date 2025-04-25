/*

        Second-order dynamics: The time tunnel

        (Toffoli & Margolus, section 6.3, page 52)

*/

class Timetun extends ruletable {
    static final int ttmap[] = {0, 1, 1, 1, 1, 0};

    void jcruleModes() {
        setWorld(1);
        setPatternRequest("timetun");
        setPaletteRequest("default");
    }

    int jcrule(int oldstate) {
        return (ttmap[self + n + s + w + e] ^ ((oldstate >> 1) & 1)) |
                (self << 1);
    }
}

public class timetun {
    public static void main(String args[]) {
        (new Timetun()).generateRuleFile("timetun");
    }
}
