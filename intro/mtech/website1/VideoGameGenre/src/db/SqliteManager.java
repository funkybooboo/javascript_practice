package db;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

/**
 * Created by danastott on 2019-06-21
 */
public class SqliteManager implements LocalDatabase {
    private static boolean initialized = false;
    public static final String DB_NAME = "tmpdb" + LockFile.getLockFileId();

    public void init() {
        if (!initialized) {
            initialized = true;
            try {
                Class.forName("org.sqlite.JDBC");
                try (Connection conn = getConnection();
                     Statement stmt = conn.createStatement()) {
                    stmt.executeUpdate("drop table if exists t");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + DB_NAME);
    }

    @Override
    public String getColumnType(Class clazz, int length) {
        if (clazz == BigDecimal.class) {
            return "DOUBLE";
        } else if (clazz == Long.class) {
            if (length == 1) {
                return "INT";
            } else {
                return "BIGINT";
            }
        } else if (clazz == Date.class) {
            if (length > 10) {
                return "DATETIME";
            } else {
                return "DATE";
            }
        } else {
            if (length < 20000) {
                return "VARCHAR(" + length + ")";
            } else if (length < 64000) {
                return "TEXT";
            } else if (length < 16000000) {
                return "MEDIUMTEXT";
            } else {
                return "LONGTEXT";
            }
        }
    }

    @Override
    public String getShowTables() {
        return "select name from sqlite_master where type = 'table' and name not like 'sqlite_%'";
    }

    @Override
    public int getShowTablesIndex() {
        return 1;
    }

    @Override
    public String getDropTable(String tableName) {
        return "DROP TABLE IF EXISTS " + tableName;
    }

    @Override
    public String getCreateIndex(String indexName, String tableName, String columnName) {
        return "create index if not exists " + indexName + " on " + tableName + "(" + columnName + ")";
    }

    @Override
    public String getDropIndex(String indexName, String tableName) {
        return "DROP INDEX IF EXISTS " + indexName;
    }

    @Override
    public int getDescribeTableColumnIndex() {
        return 2;
    }

    @Override
    public String getDescribeTable(String tableName) {
        return "pragma table_info('" + tableName + "')";
    }

    @Override
    public char getColumnNameQuoteChar() {
        return '`';
    }

    @Override
    public String getHelpUrl() {
        return "https://www.sqlite.org/lang.html";
    }
}

