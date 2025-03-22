package handlers;

import com.sun.net.httpserver.HttpExchange;
import db.LocalDatabaseManager;
import util.IOUtility;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by danastott on 10/27/20
 */
public class SearchHandler extends BaseHttpHandler {

    private final String baseDir;

    public SearchHandler(String baseDir) {
        this.baseDir = baseDir;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Map<String, String> parameters = readFormPost(exchange);
        String gameName = parameters.get("q");
        String html = IOUtility.readFileAsString(new File(baseDir + "/html/searchresults.html"));
        try (Connection conn = LocalDatabaseManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("select Genre from games where Name ilike '%" + gameName + "%'")) {
            Set<String> genres = new HashSet<>();
            while (rs.next()) {
                genres.add(rs.getString(1));
            }
            StringBuilder sb = new StringBuilder();
            String message = "";
            if (genres.size() > 0) {
                String inClause = "'" + String.join("','", genres) + "'";
                message = "'" + gameName + "' has genres of " + inClause + ". Other games with those genres are:";
                try (Statement stmt2 = conn.createStatement();
                     ResultSet rs2 = stmt2.executeQuery("select Name from games where Genre in (" + inClause + ") limit 20")) {
                    while (rs2.next()) {
                        if (sb.length() > 0) {
                            sb.append("\n");
                        }
                        sb.append("<li>").append(rs2.getString(1)).append("</li>");
                    }
                }
            } else {
                message = "Nothing found for \"" + gameName + "\"";
            }
            html = html.replace("{message}", message);
            html = html.replace("{line_items}", sb.toString());
            try (OutputStream out = exchange.getResponseBody()) {
                byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, bytes.length);
                out.write(bytes);
            }
        } catch (Exception e) {
            respondWithStackTrace(exchange, e);
        }
    }
}
