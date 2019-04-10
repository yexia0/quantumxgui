package quantumx;

import org.junit.Test;

import java.nio.ByteBuffer;

public class TestMain {
    @Test
    public void test1() {
        LayerMap layerMap = new LayerMap();
        System.err.println(layerMap.size());
        System.err.println(new ComboKey().size());
        System.err.println(new MacroAddr().size());
        System.err.println(new NopParam().size());
        System.err.println(new LayerKey().size());
        System.err.println(new FunctionValue().size());
        layerMap.setByteBuffer(ByteBuffer.allocate(layerMap.size()), 0);
        layerMap.map[1][2].type.set(FunctionType.NORMAL);
        layerMap.map[1][2].value.normalKey.id.set((short)0x88);
        layerMap.map[0][0].type.set(FunctionType.MODIFIER);
        layerMap.map[0][0].value.modifierKey.map.set((short)0x01);
        layerMap.map[0][0].value.modifierKey.stickyThreshold.set((short)200);
        layerMap.map[0][1].type.set(FunctionType.MACRO);
        layerMap.map[0][1].value.macroAddr.setS("hello");


        print(layerMap.getByteBuffer());
    }

    private void print(ByteBuffer buffer) {
        for (byte b : buffer.array()) {
            System.err.printf("0x%02x ", b);
        }
    }
}
