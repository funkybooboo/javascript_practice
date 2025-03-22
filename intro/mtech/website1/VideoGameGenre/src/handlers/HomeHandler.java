package handlers;

import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

/**
 * Created by danastott on 10/27/20
 */
public class HomeHandler extends BaseHttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Map<String, String> parameters = getParameterMap(exchange);

    }
}
