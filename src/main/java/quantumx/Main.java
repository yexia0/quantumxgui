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
    public static void main(String[] args) {
        Application.launch(args);
    }

    @Override
    public void start(final Stage stage)
    {
        TestObj testObj = new TestObj();
        WebView webView = new WebView();
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
                    window.setMember("testObj", testObj);

                    //stage.setTitle(webEngine.getTitle());
                }
            }
        });


        VBox root = new VBox();
        root.getChildren().add(webView);
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.show();
    }
}
