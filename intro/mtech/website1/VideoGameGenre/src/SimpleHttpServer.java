import com.sun.net.httpserver.HttpServer;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import db.LocalDatabaseManager;
import handlers.HomeHandler;
import handlers.SearchHandler;
import handlers.StaticFileHandler;
import util.CommonJXTable;
import util.DBUtil;
import util.HttpResultSet;
import util.IOUtility;
import util.SqlResultsTableModel;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by danastott on 10/27/20
 */
public class SimpleHttpServer {

    private static final String TABLE_NAME = "games";

    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Missing static files parameter");
            return;
        }
        try {
            System.out.println("Filling database...");
            fillDatabase(args[0]);
            System.out.println("Starting server...");
            LocalDatabaseManager.loadDatabaseEngineSetting();
            HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
            server.createContext("/", new HomeHandler());
            server.createContext("/search", new SearchHandler(args[0]));
            server.createContext("/resources", new StaticFileHandler(args[0]));
            server.setExecutor(null);
            server.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void fillDatabase(String rootPath) {
        SqlResultsTableModel model = createTableModel(true, IOUtility.readFileAsString(new File(rootPath, "db/db.csv")), new char[] {','});
        CommonJXTable table = new CommonJXTable(model);
        try (Connection conn = LocalDatabaseManager.getConnection()) {
            try (Statement stmt = conn.createStatement()) {
                dropIndex(stmt, TABLE_NAME);
                dropTable(stmt, TABLE_NAME);
                stmt.executeUpdate(table.generateCreateTableStatement(TABLE_NAME));
                fillTable(table, TABLE_NAME);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void fillTable(CommonJXTable table, String tableName) {
        long startTime = System.nanoTime();
        AtomicBoolean done = new AtomicBoolean(false);
        try (Connection conn = LocalDatabaseManager.getConnection()) {
            DBUtil.setAutoCommit(conn, false);
            try (PreparedStatement ps = conn.prepareStatement(table.generatePreparedStatement(tableName))) {
                try {
                    for (int r = 0; r < table.getRowCount(); r++) {
                        for (int c = 0; c < table.getColumnCount(); c++) {
                            Class clazz = table.getColumnClass(c);
                            if (clazz == Date.class) {
                                Date d = table.getDateAt(r, c);
                                if (d == null) {
                                    ps.setNull(c + 1, Types.DATE);
                                } else {
                                    if (hasTime(d)) {
                                        ps.setTimestamp(c + 1, new Timestamp(d.getTime()));
                                    } else {
                                        ps.setDate(c + 1, new java.sql.Date(d.getTime()));
                                    }
                                }
                            } else if (clazz == BigDecimal.class) {
                                BigDecimal bd = table.getBigDecimalAt(r, c);
                                if (bd == null) {
                                    ps.setNull(c + 1, Types.DECIMAL);
                                } else {
                                    ps.setBigDecimal(c + 1, bd);
                                }
                            } else if (clazz == Long.class) {
                                Long l = table.getLongAt(r, c);
                                if (l == null) {
                                    ps.setNull(c + 1, Types.BIGINT);
                                } else {
                                    ps.setLong(c + 1, l);
                                }
                            } else {
                                String s = table.getStringAt(r, c);
                                if (s == null) {
                                    ps.setNull(c + 1, Types.VARCHAR);
                                } else {
                                    ps.setString(c + 1, s);
                                }
                            }
                        }
                        ps.addBatch();
                        if (r > 0 && r % 1000 == 0) {
                            ps.executeBatch();
                        }
                    }
                    ps.executeBatch();
                    conn.commit();
                } finally {
                    DBUtil.setAutoCommit(conn, true);
                }
            } catch (SQLException sqle) {
                throw new RuntimeException(sqle);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean hasTime(Date date) {
        if (date == null) {
            return false;
        }
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        if (c.get(Calendar.HOUR_OF_DAY) > 0) {
            return true;
        }
        if (c.get(Calendar.MINUTE) > 0) {
            return true;
        }
        if (c.get(Calendar.SECOND) > 0) {
            return true;
        }
        return c.get(Calendar.MILLISECOND) > 0;
    }

    public static SqlResultsTableModel createTableModel(boolean firstRowHeader, String text, char[] delimiters) {
        if (firstRowHeader) {
            StringBuilder header = new StringBuilder();
            int pos = text.indexOf("\n");
            if (pos != -1) {
                String firstLine = text.substring(0, pos);
                StringBuilder field = new StringBuilder();
                char del = '\n';
                for (int i = 0; i < firstLine.length(); i++) {
                    char c = firstLine.charAt(i);
                    if (del == '\n') {
                        for (char delimiter : delimiters) {
                            if (c == delimiter) {
                                del = delimiter;
                                break;
                            }
                        }
                    }
                    if (c == del) {
                        if (!Character.isAlphabetic(field.charAt(0))) {
                            header.append("c");
                        }
                        header.append(field);
                        header.append(del);
                        field.setLength(0);
                    } else {
                        field.append(c);
                    }
                }
                if (field.length() > 0) {
                    header.append(field);
                }
                text = text.replace(firstLine, header.toString());
            }
        }
        List<String[]> parsedRows = parseCsvText(text, delimiters);

        String[] header = parsedRows.get(0);
        parsedRows.remove(0);

        HttpResultSet rs = createHttpResultSet(parsedRows, header);
        return new SqlResultsTableModel(rs);
    }

    private static HttpResultSet createHttpResultSet(List<String[]> parsedRows, String[] header) {
        List<String[]> rows = new ArrayList<>();
        for (String[] parsedRow : parsedRows) {
            if (header == null) {
                header = parsedRow;
                Set<String> uniqueColumnNames = new HashSet<>();
                for (int c = 0; c < header.length; c++) {
                    if (header[c].equals("\\N")) {
                        header[c] = "c" + (c + 1);
                    }
                    if (!uniqueColumnNames.add(header[c])) {
                        header[c] = header[c] + (c + 1);
                    }
                }
            } else {
                rows.add(parsedRow);
            }
        }
        return new HttpResultSet(header, rows);
    }

    private static List<String[]> parseCsvText(String text, char[] delimiters) {
        CsvParserSettings settings = new CsvParserSettings();
        settings.setDelimiterDetectionEnabled(true, delimiters);
        settings.setMaxCharsPerColumn(-1);
        settings.setMaxColumns(4096);
        settings.setNullValue("\\N");
        CsvParser csvParser = new CsvParser(settings);
        return csvParser.parseAll(new StringReader(text));
    }

    private static void dropIndex(Statement stmt, String tableName) {
        try {
            stmt.executeUpdate(LocalDatabaseManager.getLocalDatabase().getDropIndex("dsidx_" + tableName, tableName));
        } catch (Exception e) {
            // ignore
        }
    }

    private static void dropTable(Statement stmt, String tableName) {
        try {
            stmt.executeUpdate(LocalDatabaseManager.getLocalDatabase().getDropTable(tableName));
        } catch (SQLException e) {
            // ignore
        }
    }
}
