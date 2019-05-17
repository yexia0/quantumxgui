package quantumx;

import com.sun.javafx.webkit.WebConsoleListener;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebErrorEvent;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

import static javafx.concurrent.Worker.State;

public class Main extends Application {

    private static void testHid() {
        HidConnection hidConnection = HidConnection.getInstance();
        hidConnection.open();
        int a = 0;
        while (a < 10000) {
            System.err.println("get models");
            for (String s : hidConnection.getDevices()) {
                System.err.println(s);
                byte[] arr = new byte[64];
                arr[0] = 'a';
                try {
                    byte[] result = hidConnection.sendRequest(s, "abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz1234567890".getBytes(), 100);
                    System.err.println(result.length);
                    for (int i = 0; i < result.length; i++) {
                        System.err.printf("%02x ", result[i]);
                    }
                    System.err.println();
                } catch (NoResponseException e) {
                    e.printStackTrace();
                }
            }
            try {
                Thread.sleep(1000);
            } catch (Exception e) {

            }
        }
    }
    public static void main(String[] args) {
        System.loadLibrary("connection");
        Application.launch(args);
    }

    private ConfigModel configModel;
    @Override
    public void start(final Stage stage)
    {
        configModel = new ConfigModel(stage);
        WebView webView = new WebView();
        webView.setPrefHeight(650);
        final WebEngine webEngine = webView.getEngine();
        WebConsoleListener.setDefaultListener(new WebConsoleListener(){
            public void messageAdded(WebView webView, String message, int lineNumber, String sourceId) {
                System.out.println("[" + sourceId + ":" + lineNumber + "] " + message);
            }
        });
        String url = this.getClass().getResource("/web/index.html").toExternalForm();

        webEngine.setOnError(new EventHandler<WebErrorEvent>() {
            @Override
            public void handle(WebErrorEvent event) {
                System.err.println(event);
            }
        });

        webEngine.load(url);

        webEngine.getLoadWorker().stateProperty().addListener(new ChangeListener<State>()
        {
            public void changed(ObservableValue<? extends State> ov, State oldState, State newState)
            {
                if (newState == State.SUCCEEDED) {
                    JSObject window = (JSObject) webEngine.executeScript("window");
                    window.setMember("model", configModel);
                    window.setMember("products", configModel.getProductInfos());
                    webEngine.executeScript("init()");

                    //stage.setTitle(webEngine.getTitle());
                }
            }
        });


        VBox root = new VBox();
        root.getChildren().add(webView);
        Scene scene = new Scene(root, 1000, 650);
        stage.setScene(scene);
        stage.show();
    }
}
