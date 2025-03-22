package handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import util.IOUtility;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by danastott on 10/27/20
 */
public abstract class BaseHttpHandler implements HttpHandler {

    public Map<String, String> getParameterMap(HttpExchange httpExchange) {
        String query = httpExchange.getRequestURI().getQuery();
        return parseParameterString(query);
    }

    private Map<String, String> parseParameterString(String query) {
        if (query != null) {
            Map<String, String> result = new HashMap<>();
            for (String param : query.split("&")) {
                String[] entry = param.split("=");
                if (entry.length > 1) {
                    result.put(entry[0], entry[1]);
                } else {
                    result.put(entry[0], "");
                }
            }
            return result;
        }
        return new HashMap<>();
    }

    public Map<String, String> readFormPost(HttpExchange httpExchange) {
        return parseParameterString(IOUtility.readStream(httpExchange.getRequestBody()));
    }

    protected void respondWithStackTrace(HttpExchange exchange, Exception e) throws IOException {
        try (OutputStream out = exchange.getResponseBody()) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            e.printStackTrace(new PrintStream(baos));
            out.write(baos.toByteArray());
        }
    }
}
