package quantumx;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

public class ConsoleLogThread extends Thread {
    private String deviceId;
    private volatile ConcurrentLinkedDeque<String> queue;
    public ConsoleLogThread(String deviceId) {
        this.deviceId = deviceId;
        this.nextLine = "";
        this.queue = new ConcurrentLinkedDeque<>();
    }

    private String nextLine;
    @Override
    public void run() {
        System.err.println("Console log thread started");
        HidConnection hidConnection = HidConnection.getInstance();
        while (true) {
            try {
                byte[] r = hidConnection.getConsoleLog(deviceId, 200);
                if (r != null) {
                    queue.addLast(toString(r));
                    System.err.print(toString(r));
                }
            } catch (Exception e) {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e2) {
                    // pass
                }
            }
        }
    }

    private String toString(byte[] bArray) {
        int i = 0;
        while (i < bArray.length && bArray[i] != 0) {
            i++;
        }
        return new String(Arrays.copyOfRange(bArray, 0, i));
    }

    public synchronized List<String> getNextLines() {
        List<String> result = new ArrayList<>();
        while (true) {
            String s = queue.poll();
            if (s == null) {
                if (!result.isEmpty()) {
                    //System.err.println("Return: " + result);
                }
                return result;
            }
            String[] tokens = s.split("\n", -1);
            int numTokens = tokens.length;
            for (int i = 0; i < numTokens - 1; i++) {
                nextLine += tokens[i];
                result.add(nextLine);
                nextLine = "";
            }
            nextLine += tokens[numTokens - 1];

        }
    }
}
