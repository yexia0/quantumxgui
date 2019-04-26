package quantumx;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class ProductInfo {
    private short modelId;
    private String description;
    private int numKeys;
    private double width;
    private double height;
    private List<KeyPosition> keyPositions;

    @JsonCreator
    public ProductInfo(@JsonProperty("modelId") short modelId,
                       @JsonProperty("description") String description,
                       @JsonProperty("numKeys") int numKeys,
                       @JsonProperty("width") double width,
                       @JsonProperty("height") double height,
                       @JsonProperty("keyPositions") List<KeyPosition> keyPositions) {
        this.modelId = modelId;
        this.description = description;
        this.numKeys = numKeys;
        this.width = width;
        this.height = height;
        this.keyPositions = keyPositions;
    }

    public short getModelId() {
        return modelId;
    }

    public void setModelId(short modelId) {
        this.modelId = modelId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getNumKeys() {
        return numKeys;
    }

    public void setNumKeys(int numKeys) {
        this.numKeys = numKeys;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public List<KeyPosition> getKeyPositions() {
        return keyPositions;
    }

    public void setKeyPositions(List<KeyPosition> keyPositions) {
        this.keyPositions = keyPositions;
    }
}
