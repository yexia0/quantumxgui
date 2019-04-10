package quantumx;

import javolution.io.Struct;

public class ComboKey extends Struct {
    public final Unsigned8 modifierMap = new Unsigned8();
    public final Unsigned8 id = new Unsigned8();
}
