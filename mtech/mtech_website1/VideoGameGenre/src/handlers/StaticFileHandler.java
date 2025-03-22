package handlers;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.Files;

/**
 * Created by danastott on 10/27/20
 */
public class StaticFileHandler extends BaseHttpHandler {

    private final String baseDir;
    private final String rootPath;

    public StaticFileHandler(String baseDir) {
        this.baseDir = baseDir;
        rootPath = baseDir.substring(baseDir.lastIndexOf("/"));
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        URI uri = exchange.getRequestURI();
        String name = uri.getPath().replace(rootPath, "");
        File path = new File(baseDir, name);

        Headers h = exchange.getResponseHeaders();

        h.add("Content-Type", getContentType(name));

        try (OutputStream out = exchange.getResponseBody()) {
            if (path.exists()) {
                exchange.sendResponseHeaders(200, path.length());
                out.write(Files.readAllBytes(path.toPath()));
            } else {
                System.err.println("File not found: " + path.getAbsolutePath());

                exchange.sendResponseHeaders(404, 0);
                out.write("404 File not found.".getBytes());
            }
        }
    }

    private String getContentType(String name) {
        if (name.endsWith(".js")) {
            return "text/javascript";
        } else if (name.endsWith(".css")) {
            return "text/css";
        } else if (name.endsWith(".png")) {
            return "image/png";
        } else if (name.endsWith(".jpg") || name.endsWith(".jepg")) {
            return "image/jpeg";
        } else if (name.endsWith(".html") || name.endsWith(".htm")) {
            return "text/html";
        }
        return "application/octet-stream";
    }
}
