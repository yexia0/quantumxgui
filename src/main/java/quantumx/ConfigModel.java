package quantumx;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.util.List;

public class ConfigModel {
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

    public void newMap() {
        layerMap = new LayerMap();
        layerMap.setNumLayers(6);
        layerMap.setNumKeys(20);
    }

    public void setNumLayers(short n) {
        layerMap.setNumLayers(n);
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


    public List<ProductInfo> getProductInfos() {
        return productInfos;
    }
}
