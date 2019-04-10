package quantumx;

import javolution.io.Union;

public class FunctionValue extends Union {
    public final NopParam nopParam = inner(new NopParam());
    public final NormalKey normalKey = inner(new NormalKey());
    public final ModifierKey modifierKey = inner(new ModifierKey());
    public final LayerKey layerKey = inner(new LayerKey());
    //public final Unsigned16 defaultLayer = new Unsigned16();
    public final ComboKey comboKey = inner(new ComboKey());
    public final MacroAddr macroAddr = inner(new MacroAddr());

    public boolean isPacked() {
        return true;
    }
}
