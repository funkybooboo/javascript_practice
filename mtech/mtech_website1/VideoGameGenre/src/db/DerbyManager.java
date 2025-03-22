package db;

import org.apache.derby.jdbc.EmbeddedDriver;
import util.PropertiesUtil;

import java.io.File;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Date;

/**
 * Created by danastott on 2019-06-21
 */
public class DerbyManager implements LocalDatabase {

    private static boolean initialized = false;
    public static final String DB_NAME = "derby" + LockFile.getLockFileId();
    private static final String dbDir = new File(System.getProperty("user.home", "~") + "/" + PropertiesUtil.getHiddenDir()).getAbsolutePath() + "/" + DB_NAME;

    public void init() {
        if (!initialized) {
            initialized = true;
            Driver derbyEmbeddedDriver = new EmbeddedDriver();
            try {
                DriverManager.registerDriver(derbyEmbeddedDriver);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:derby:" + dbDir + ";create=true;collation=TERRITORY_BASED:SECONDARY");
    }

    @Override
    public String getColumnType(Class clazz, int length) {
        if (clazz == BigDecimal.class) {
            return "DOUBLE";
        } else if (clazz == Long.class) {
            if (length == 1) {
                return "INTEGER";
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
            if (length < 31000) {
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
        return "select * from SYS.SYSTABLES";
    }

    @Override
    public int getShowTablesIndex() {
        return 2;
    }

    @Override
    public String getDropTable(String tableName) {
        return "DROP TABLE " + tableName;
    }

    @Override
    public String getCreateIndex(String indexName, String tableName, String columnName) {
        return "create index " + indexName + " on " + tableName + "(" + columnName + ")";
    }

    @Override
    public String getDropIndex(String indexName, String tableName) {
        return "DROP INDEX " + indexName + " ON " + tableName;
    }

    @Override
    public int getDescribeTableColumnIndex() {
        return 1;
    }

    @Override
    public String getDescribeTable(String tableName) {
        return "select COLUMNNAME, COLUMNDATATYPE from SYS.SYSCOLUMNS where REFERENCEID = (select TABLEID from SYS.SYSTABLES where TABLENAME = '" + tableName.toUpperCase() + "') order by COLUMNNUMBER";
    }

    @Override
    public char getColumnNameQuoteChar() {
        return '\"';
    }

    @Override
    public String getHelpUrl() {
        return "https://db.apache.org/derby/docs/10.14/ref";
    }
}
