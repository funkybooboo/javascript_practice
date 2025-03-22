package db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Created by danastott on 2019-08-05
 */
public interface LocalDatabase {

    void init();

    Connection getConnection() throws SQLException;

    String getColumnType(Class clazz, int length);

    String getShowTables();

    int getShowTablesIndex();

    String getDropTable(String tableName);

    String getCreateIndex(String indexName, String tableName, String columnName);

    String getDropIndex(String indexName, String tableName);

    int getDescribeTableColumnIndex();

    String getDescribeTable(String tableName);

    char getColumnNameQuoteChar();

    String getHelpUrl();

}
