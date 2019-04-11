package quantumx;

import javolution.io.Struct;

import java.nio.ByteOrder;

public class KeyFunction extends Struct {
    public final Enum8<FunctionType> type = new Enum8<>(FunctionType.values());
    public final FunctionValue value = inner(new FunctionValue());


    @Override
    public ByteOrder byteOrder() {
        return ByteOrder.LITTLE_ENDIAN;
    }
}

