package db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by danastott on 2019-08-05
 */
public class LocalDatabaseManager {
    public enum DatabaseEngine {h2, mariadb, sqlite, derby}

    private static LocalDatabase localDatabase;

    static {
        loadDatabaseEngineSetting();
    }

    public static void loadDatabaseEngineSetting() {
        DatabaseEngine databaseEngine = DatabaseEngine.valueOf("h2");
        switch (databaseEngine) {
            case h2:
                localDatabase = new H2Manager();
                break;
            case mariadb:
                localDatabase = new MariaDB4jManager();
                break;
            case sqlite:
                localDatabase = new SqliteManager();
                break;
            case derby:
                localDatabase = new DerbyManager();
                break;
        }
        try {
            localDatabase.init();
        } catch (Exception e) {
            e.printStackTrace();
            localDatabase = new H2Manager();
            localDatabase.init();
        }
    }

    public static Connection getConnection() throws SQLException {
        return localDatabase.getConnection();
    }

    public static LocalDatabase getLocalDatabase() {
        return localDatabase;
    }
}
