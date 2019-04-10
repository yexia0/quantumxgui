package quantumx;

import javolution.io.Struct;

public class MacroAddr extends Struct {
    public final Unsigned16 offset = new Unsigned16();
    private String s;

    public String setOffsetAndReturnString(int i) {
        this.offset.set(i);
        return this.s;
    }

    public void setS(String s) {
        this.s = s;
    }
}
