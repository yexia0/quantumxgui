package quantumx;

import javolution.io.Union;

public class FunctionValue extends Union {
    public final NormalKey normalKey = inner(new NormalKey());
    public final ModifierKey modifierKey = inner(new ModifierKey());
}
