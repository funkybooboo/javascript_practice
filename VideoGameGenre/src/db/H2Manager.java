package db;

import util.PropertiesUtil;

import java.io.File;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;

/**
 * Created by danastott on 2019-06-21
 */
public class H2Manager implements LocalDatabase {

    private static boolean initialized = false;
    private static final String DB_NAME = "h2db" + LockFile.getLockFileId();
    private static final String dbDir = new File(System.getProperty("user.home", "~") + "/" + PropertiesUtil.getHiddenDir()).getAbsolutePath() + "/" + DB_NAME;

    public void init() {
        if (!initialized) {
            initialized = true;
            try {
                Class.forName("org.h2.Driver");
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
        return DriverManager.getConnection("jdbc:h2:" + dbDir + ";DATABASE_TO_UPPER=FALSE;AUTO_SERVER=TRUE", "sa", "");
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
                return "TIMESTAMP";
            } else {
                return "DATE";
            }
        } else {
            if (length < 20000) {
                return "VARCHAR(" + length + ")";
            } else if (length < 64000) {
                return "CLOB";
            } else if (length < 16000000) {
                return "CLOB";
            } else {
                return "CLOB";
            }
        }
    }

    @Override
    public String getShowTables() {
        return "show tables";
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
        return "DROP INDEX IF EXISTS dsidx_" + tableName;
    }

    @Override
    public int getDescribeTableColumnIndex() {
        return 1;
    }

    @Override
    public String getDescribeTable(String tableName) {
        return "show columns from " + tableName;
    }

    @Override
    public char getColumnNameQuoteChar() {
        return '`';
    }

    @Override
    public String getHelpUrl() {
        return "https://www.h2database.com/html/grammar.html";
    }

    public Connection getConnection(String compatibilityMode) throws SQLException {
        if ("H2".equals(compatibilityMode)) {
            return getConnection();
        }
        return DriverManager.getConnection("jdbc:h2:" + dbDir + ";DATABASE_TO_UPPER=FALSE;MODE=" + compatibilityMode, "sa", "");
    }
}
