package db;

import ch.vorburger.mariadb4j.DB;
import ch.vorburger.mariadb4j.DBConfigurationBuilder;
import util.IOUtility;
import util.PropertiesUtil;

import java.io.File;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Date;
import java.util.Properties;

/**
 * Created by danastott on 2019-06-21
 */
public class MariaDB4jManager implements LocalDatabase {

    private static boolean initialized = false;
    public static final String DB_NAME = "mariadb" + LockFile.getLockFileId();
    private static final String dbDir = new File(System.getProperty("user.home", "~") + "/" + PropertiesUtil.getHiddenDir()).getAbsolutePath() + "/" + DB_NAME;
    private static DBConfigurationBuilder config;
    private static DB db;

    public void init() {
        if (!initialized) {
            initialized = true;
            config = DBConfigurationBuilder.newBuilder();
            Properties properties = PropertiesUtil.readProperties(PropertiesUtil.PREFERENCES_PROPERTIES);
            config.setPort(Integer.parseInt(properties.getProperty(PropertiesUtil.LOCAL_DATABASE_ENGINE_PORT, "0"))); // 0 => automatically detect free port
            config.setDeletingTemporaryBaseAndDataDirsOnShutdown(false);
            config.setDataDir(dbDir);
            for (int i = 0 ; i < 2 ; i++) {
                try {
                    killPreviousProcess();
                    db = DB.newEmbeddedDB(config.build());
                    db.start();
                    db.createDB(DB_NAME);
                } catch (Exception e) {
                    try {
                        db.stop();
                    } catch (Exception ex) {
                        // ignore
                    }
                    IOUtility.delete(new File(dbDir));
                    if (i == 1) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    private void killPreviousProcess() {
        File[] files = new File(dbDir).listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.getName().endsWith(".pid")) {
                    String s = IOUtility.readFileAsString(file).trim();
                    try {
                        Integer.parseInt(s);
                        ProcessBuilder pb = new ProcessBuilder("kill", s);
                        pb.start();
                        pb = new ProcessBuilder("kill", "-9", s);
                        pb.start();
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                    IOUtility.delete(file);
                }
            }
        }
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(config.getURL(DB_NAME), "root", "");
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
        return "DROP INDEX IF EXISTS " + indexName + " ON " + tableName;
    }

    @Override
    public int getDescribeTableColumnIndex() {
        return 1;
    }

    @Override
    public String getDescribeTable(String tableName) {
        return "describe " + tableName;
    }

    @Override
    public char getColumnNameQuoteChar() {
        return '`';
    }

    @Override
    public String getHelpUrl() {
        return "https://dev.mysql.com/doc/refman/5.7/en/functions.html";
    }
}
