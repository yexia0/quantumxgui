package quantumx;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KeyPosition {
    private double x;
    private double y;
    private double width;
    private double height;
    private double rotation;

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
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

    public double getRotation() {
        return rotation;
    }

    public void setRotation(double rotation) {
        this.rotation = rotation;
    }

    public KeyPosition(@JsonProperty("x") double x,
                       @JsonProperty("y") double y,
                       @JsonProperty("width") double width,
                       @JsonProperty("height") double height,
                       @JsonProperty("rotation") double rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
}
