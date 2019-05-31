package quantumx;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;

public class ConfigModel {
    private byte COMMAND_SET_KEYMAP = 1;
    private byte COMMAND_GET_KEYMAP = 2;
    private byte COMMAND_SET_KEYBOARD_NAME = 3;
    private byte COMMAND_GET_KEYBOARD_NAME = 4;

    private Stage stage;
    private LayerMap layerMap;
    private static ObjectMapper mapper = new ObjectMapper();
    private FileChooser.ExtensionFilter extensionFilter = new FileChooser.ExtensionFilter("Keymap Model (*.kmm)", "*.kmm");
    private FileChooser fileChooser;
    private List<ProductInfo> productInfos;
    public ConfigModel(Stage stage) {
        this.stage = stage;
        fileChooser = new FileChooser();
        fileChooser.getExtensionFilters().add(extensionFilter);
        InputStream in = this.getClass().getResourceAsStream("/products.dat");
        try {
            productInfos = mapper.readValue(in, new TypeReference<List<ProductInfo>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    public void newMap(short modelId, short numKeys) {
        layerMap = new LayerMap();
        layerMap.setModelId(modelId);
        layerMap.setNumLayers(6);
        layerMap.setNumKeys(numKeys);
    }

    public void setNumLayers(short n) {
        layerMap.setNumLayers(n);
    }

    public int getNumLayers() {
        return layerMap.getNumLayers();
    }

    public int getModelId() {
        return layerMap.getModelId();
    }

    public int getNumKeys() {
        return layerMap.getNumKeys();
    }
    public void setKey(short layer, short key, KeyFunction keyFunction) {
        layerMap.map[layer][key] = keyFunction;
    }

    public KeyFunction getKey(short layer, short key) {
        return layerMap.map[layer][key];
    }

    public void setNumKeys(short n) {
        layerMap.setNumKeys(n);
    }
    public void saveToFile() {
        fileChooser.setTitle("Set save path for keymap file");
        File file = fileChooser.showSaveDialog(stage);
        System.err.println("save to " + file.getAbsolutePath());
        if (file != null) {
            try {
                new FileOutputStream(file).write(layerMap.toBytes());
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void loadFromFile() {
        fileChooser.setTitle("Select keymap file to load from");
        File file = fileChooser.showOpenDialog(stage);
        System.err.println("load from " + file.getAbsolutePath());
        if (file != null) {
            try {
                byte[] bytes = IOUtils.toByteArray(new FileInputStream(file));
                layerMap = LayerMap.fromBytes(bytes);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void deploy() {
        HidConnection hidConnection = HidConnection.getInstance();
        try {
            byte[] layerMapBytes = layerMap.toBytes();
            String deviceId = hidConnection.getAllDevices()[0];
            System.err.println("Device id: " + deviceId);
            byte[] message = new byte[layerMapBytes.length + 1];
            message[0] = COMMAND_SET_KEYMAP;
            System.arraycopy(layerMapBytes, 0, message, 1, layerMapBytes.length);
            hidConnection.sendRequest(deviceId, message, 500);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void loadFromDevice() {
        HidConnection hidConnection = HidConnection.getInstance();
        try {
            String deviceId = hidConnection.getAllDevices()[0];
            System.err.println("Device id: " + deviceId);
            byte[] message = new byte[1];
            message[0] = COMMAND_GET_KEYMAP;
            byte[] response = hidConnection.sendRequest(deviceId, message, 500);
            System.err.println("response size " + response.length);
            Utils.printByteArray(response);
            if (response.length != 0) {
                layerMap = LayerMap.fromBytes(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public List<ProductInfo> getProductInfos() {
        return productInfos;
    }


    public KeyFunction newKey(String type) {
        KeyFunction result = new KeyFunction();
        ByteBuffer byteBuffer = ByteBuffer.allocate(result.size());
        byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
        result.setByteBuffer(byteBuffer, 0);
        result.type.set(FunctionType.valueOf(type));
        return result;
    }

    public String toHex(KeyFunction keyFunction) {
        byte[] bytes = keyFunction.getByteBuffer().array();
        StringBuffer stringBuffer = new StringBuffer();
        for (byte b : bytes) {
            stringBuffer.append(String.format("0x%02x ", b));
        }
        return stringBuffer.toString();
    }

    public void setKeyboardName(String name) {
        HidConnection hidConnection = HidConnection.getInstance();
        try {
            String deviceId = hidConnection.getAllDevices()[0];
            System.err.println("Device id:" + deviceId);

            byte[] nameArr = name.getBytes();
            byte[] message = new byte[nameArr.length + 1];
            message[0] = COMMAND_SET_KEYBOARD_NAME;
            System.arraycopy(nameArr, 0, message,1 , nameArr.length);
            byte[] response = hidConnection.sendRequest(deviceId, message, 500);
            System.err.println("response size " + response.length);
            Utils.printByteArray(response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getKeyboardName() {
        HidConnection hidConnection = HidConnection.getInstance();
        try {
            String deviceId = hidConnection.getAllDevices()[0];
            System.err.println("Device id:" + deviceId);
            byte[] message = new byte[1];
            message[0] = COMMAND_GET_KEYBOARD_NAME;
            byte[] response = hidConnection.sendRequest(deviceId, message, 500);
            System.err.println("response size " + response.length);
            String name = new String(response);
            return name;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
