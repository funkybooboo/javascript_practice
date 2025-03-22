package util;

import javax.swing.JTable;
import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URL;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Date;
import java.sql.NClob;
import java.sql.Ref;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.RowId;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

public class HttpResultSet implements ResultSet {

    public static final ThreadLocal<SimpleDateFormat> dateTimeFormat1 = new ThreadLocal<SimpleDateFormat>() {
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        }
    };

    public static final ThreadLocal<SimpleDateFormat> dateTimeFormat2 = new ThreadLocal<SimpleDateFormat>() {
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };

    public static final ThreadLocal<SimpleDateFormat> dateTimeFormat3 = new ThreadLocal<SimpleDateFormat>() {
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat();
        }
    };

    public static final String KEY = "Key";

    protected String[] headerRow;
    protected List<String[]> results;
    protected int pos = 0;
    protected String[] row;
    protected String environment;
    protected String key;
    protected String tableName;
    protected String userData;

    public HttpResultSet(String[] headerRow, List<String[]> results) {
        this.headerRow = headerRow;
        this.results = cleanResults(results);
    }

    public HttpResultSet(String environment, List<String[]> results) {
        this.environment = environment;
        this.headerRow = results.get(0);
        this.results = cleanResults(results.subList(1, results.size()));
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getUserData() {
        return userData;
    }

    public void setUserData(String userData) {
        this.userData = userData;
    }

    public void reorderColumns(List<String> columnOrder) {
        List<String> foundColumns = new ArrayList<>();
        String[] header = new String[headerRow.length];
        int[] columnIndexPointers = new int[headerRow.length];
        reorderHeader(columnOrder, foundColumns, header, columnIndexPointers);
        List<String[]> rows = reorderRows(columnIndexPointers);

        headerRow = header;
        results = rows;
    }

    private List<String[]> reorderRows(int[] columnIndexPointers) {
        List<String[]> rows = new ArrayList<>();
        for (String[] row : results) {
            String[] r = new String[row.length];
            for (int x = 0 ; x < row.length ; x++) {
                r[x] = row[columnIndexPointers[x]];
            }
            rows.add(r);
        }
        return rows;
    }

    private void reorderHeader(List<String> columnOrder, List<String> foundColumns, String[] header, int[] columnIndexPointers) {
        int i = 0;
        for (String col : columnOrder) {
            boolean found = false;
            int oldIndex = 0;
            for (String s : headerRow) {
                if (s.equals(col)) {
                    found = true;
                    header[i++] = col;
                    break;
                }
                oldIndex++;
            }
            if (found) {
                columnIndexPointers[i-1] = oldIndex;
                foundColumns.add(col);
            }
        }
        List<String> h = new ArrayList<>(Arrays.asList(headerRow));
        h.removeAll(foundColumns);
        for (String s : h) {
            header[i] = s;
            int oldIndex = 0;
            for (String n : headerRow) {
                if (n.equals(s)) {
                    columnIndexPointers[i++] = oldIndex;
                    break;
                }
                oldIndex++;
            }
        }
    }

    public void findTableName(String sql) {
        tableName = findTableNameFromSql(sql);
    }

    public static String findTableNameFromSql(String sql) {
        String[] split = sql.split(" ");
        boolean fromFound = false;
        StringBuilder buffer = new StringBuilder();
        for (String s : split) {
            if (fromFound) {
                buffer.append(s);
                fromFound = false;
            }
            if (s.equalsIgnoreCase("from")) {
                fromFound = true;
            }
        }
        return buffer.toString();
    }

    public void filterToColumns(String[] filterColumns) {
        if (filterColumns != null) {
            String[] header = getHeaderRow();
            List<String[]> rows = getResults();
            List<String[]> filteredRows = new ArrayList<>();
            for (String[] row : rows) {
                int i = 0;
                String[] filteredRow = new String[filterColumns.length];
                for (String filterColumn : filterColumns) {
                    for (int c = 0 ; c < header.length ; c++) {
                        if (header[c].equalsIgnoreCase(filterColumn)) {
                            filteredRow[i++] = row[c];
                            break;
                        }
                    }
                }
                filteredRows.add(filteredRow);
            }
            setHeaderRow(filterColumns);
            setResults(filteredRows);
        }
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getKey() {
        if (key == null) {
            key = environment;
        }
        return key;
    }

    private List<String[]> cleanResults(List<String[]> results) {
        for (String[] result : results) {
            if (result.length > headerRow.length) {
                StringBuilder sb = new StringBuilder();
                boolean inSelect = false;
                int index = 0;
                int columnInSelect = 0;
                for (String s : result) {
                    if (s == null) s = "";
                    String lower = s.toLowerCase();
                    inSelect = lower.contains("select ") || (inSelect && !lower.contains(" limit ") && result.length - (index + columnInSelect) > (headerRow.length - index));
                    if (inSelect) {
                        if (sb.length() > 0) {
                            sb.append(",");
                        }
                        sb.append(s);
                        columnInSelect++;
                    } else {
                        if (sb.length() > 0) {
                            result[index++] = sb.toString() + "," + s;
                            sb.setLength(0);
                            columnInSelect = 0;
                        } else {
                            result[index++] = s;
                        }
                    }
                }
            }
        }
        return results;
    }

    public static HttpResultSet convertToHttpResultSet(JTable table) {
        return convertToHttpResultSet(table, false);
    }

    public static HttpResultSet convertToHttpResultSet(JTable table, boolean selectedOnly) {
        String[] header;
        List<String[]> rows = new ArrayList<>();
        if (selectedOnly) {
            header = new String[table.getSelectedColumnCount()];
            int[] selectedColumns = table.getSelectedColumns();
            int c = 0;
            for (int col : selectedColumns) {
                header[c] = table.getColumnName(col);
            }
            int[] selectedRows = table.getSelectedRows();
            c = 0;
            for (int selectedRow : selectedRows) {
                String[] row = new String[table.getColumnCount()];
                for (int selectedColumn : selectedColumns) {
                    Object value = table.getValueAt(selectedRow, selectedColumn);
                    if (value == null) {
                        value = "\\N";
                    }
                    row[c++] = value.toString();
                }
                rows.add(row);
            }
        } else {
            header = new String[table.getColumnCount()];
            for (int c = 0 ; c < table.getColumnCount() ; c++) {
                header[c] = table.getColumnName(c);
            }
            for (int r = 0 ; r < table.getRowCount() ; r++) {
                String[] row = new String[table.getColumnCount()];
                for (int c = 0 ; c < table.getColumnCount() ; c++) {
                    Object value = table.getValueAt(r, c);
                    if (value == null) {
                        value = "\\N";
                    }
                    row[c] = value.toString();
                }
                rows.add(row);
            }
        }
        return new HttpResultSet(header, rows);
    }

    public void insertColumn(int pos, String headerName, List<String> rows) {
        String[] header = new String[headerRow.length + 1];
        int i = 0;
        for (int c = 0 ; c < header.length ; c++) {
            if (c == pos) {
                header[c] = headerName;
            } else {
                header[c] = headerRow[i++];
            }
        }
        List<String[]> newResults = new ArrayList<>();
        int r = 0;
        for (String[] resultsRow : results) {
            String[] row = new String[resultsRow.length + 1];
            i = 0;
            for (int c = 0; c < header.length; c++) {
                if (c == pos) {
                    row[c] = rows.get(r++);
                } else {
                    row[c] = resultsRow[i++];
                }
            }
            newResults.add(row);
        }
        this.headerRow = header;
        this.results = newResults;
        this.pos = 0;
    }

    public HttpResultSet(String customKey, String[] header, List<HttpResultSet> resultSets) {
        if (resultSets.size() > 1) {
            if (header == null) {
                header = new String[]{"Error"};
            }
            this.headerRow = new String[header.length + 1];
            if (customKey != null && !customKey.isEmpty()) {
                this.headerRow[0] = customKey;
            } else {
                this.headerRow[0] = KEY;
            }
            System.arraycopy(header, 0, headerRow, 1, header.length);
            results = new ArrayList<>();
            for (HttpResultSet resultSet : resultSets) {
                List<String[]> rs = resultSet.getResults();
                for (String[] r : rs) {
                    String[] x = new String[r.length + 1];
                    x[0] = resultSet.getKey();
                    System.arraycopy(r, 0, x, 1, r.length);
                    results.add(x);
                }
            }
        } else if (resultSets.size() > 0) {
            this.headerRow = header;
            this.results = resultSets.get(0).getResults();
        }
    }

    public String[] getHeaderRow() {
        return headerRow;
    }

    public void setHeaderRow(String[] headerRow) {
        this.headerRow = headerRow;
    }

    public List<String[]> getResults() {
        return results;
    }

    public void setResults(List<String[]> results) {
        this.results = results;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public void orderByColumn(int columnIndex, Class columnType, boolean desc) {
        results.sort((o1, o2) -> {
            if (desc) {
                return getValueAsType(columnType, o2[columnIndex]).compareTo(getValueAsType(columnType, o1[columnIndex]));
            } else {
                return getValueAsType(columnType, o1[columnIndex]).compareTo(getValueAsType(columnType, o2[columnIndex]));
            }
        });
    }

    private Comparable getValueAsType(Class type, String value) {
        if (Integer.class.equals(type)) {
            value = value.trim().replace(",", "");
            try {
                return Integer.parseInt(value);
            } catch (Exception e) {
                // ignore
            }
        } else if (Long.class.equals(type)) {
            value = value.trim().replace(",", "");
            try {
                return Long.parseLong(value);
            } catch (Exception e) {
                // ignore
            }
        } else if (Double.class.equals(type)) {
            value = value.trim().replace(",", "");
            try {
                return Double.parseDouble(value);
            } catch (Exception e) {
                // ignore
            }
        } else if (Date.class.equals(type)) {
            try {
                return dateTimeFormat1.get().parse(value);
            } catch (Exception e) {
                try {
                    return dateTimeFormat2.get().parse(value);
                } catch (Exception e1) {
                    try {
                        return dateTimeFormat3.get().parse(value);
                    } catch (Exception e2) {
                        // ignore
                    }
                }
            }
        }
        return value == null ? "" : value;
    }

    public int getRowCount() {
        if (results != null) {
            return results.size();
        }
        return 0;
    }

    public String getValueAt(int rowIndex, int columnIndex) {
        try {
            return results.get(rowIndex)[columnIndex];
        } catch (Exception e) {
            return "Oops: " + e.getMessage();
        }
    }

    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
        if (aValue != null) {
            String[] row = results.get(rowIndex);
            if (columnIndex >= row.length) {
                row = Arrays.copyOf(row, row.length + (columnIndex + 1 - row.length));
                row[columnIndex] = aValue.toString();
                results.set(rowIndex, row);
            }
            results.get(rowIndex)[columnIndex] = aValue.toString();
        }
    }

    public void addRow(String[] row) {
        if (row != null) {
            results.add(row);
        }
    }

    @Override
    public boolean next() {
        if (pos < results.size()) {
            row = results.get(pos++);
            return true;
        }
        return false;
    }

    @Override
    public void close() {

    }

    @Override
    public boolean wasNull() {
        return false;
    }

    @Override
    public String getString(int columnIndex) {
        return row[columnIndex - 1];
    }

    @Override
    public boolean getBoolean(int columnIndex) {
        String value = getString(columnIndex);
        if ("0".equals(value)) {
            return false;
        } else if ("1".equals(value)) {
            return true;
        }
        return Boolean.parseBoolean(value);
    }

    @Override
    public byte getByte(int columnIndex) {
        return getString(columnIndex).getBytes()[0];
    }

    @Override
    public short getShort(int columnIndex) {
        return Short.valueOf(getString(columnIndex));
    }

    @Override
    public int getInt(int columnIndex) {
        try {
            return Integer.parseInt(getString(columnIndex));
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public long getLong(int columnIndex) {
        try {
            return Long.parseLong(getString(columnIndex));
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public float getFloat(int columnIndex) {
        try {
            return Float.parseFloat(getString(columnIndex));
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public double getDouble(int columnIndex) {
        try {
            return Double.parseDouble(getString(columnIndex));
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    @Deprecated
    public BigDecimal getBigDecimal(int columnIndex, int scale) {
        return new BigDecimal(new BigInteger(getString(columnIndex)), scale);
    }

    @Override
    public byte[] getBytes(int columnIndex) {
        return getString(columnIndex).getBytes();
    }

    @Override
    public Date getDate(int columnIndex) {
        try {
            try {
                return new Date(dateTimeFormat1.get().parse(getString(columnIndex)).getTime());
            } catch (Exception ex) {
                try {
                    return new Date(dateTimeFormat2.get().parse(getString(columnIndex)).getTime());
                } catch (Exception ex2) {
                    return new Date(dateTimeFormat3.get().parse(getString(columnIndex)).getTime());
                }
            }
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Time getTime(int columnIndex) {
        try {
            return new Time(dateTimeFormat3.get().parse(getString(columnIndex)).getTime());
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Timestamp getTimestamp(int columnIndex) {
        try {
            return new Timestamp(dateTimeFormat1.get().parse(getString(columnIndex)).getTime());
        } catch (Exception ex) {
            try {
                return new Timestamp(dateTimeFormat2.get().parse(getString(columnIndex)).getTime());
            } catch (ParseException e) {
                try {
                    return new Timestamp(dateTimeFormat3.get().parse(getString(columnIndex)).getTime());
                } catch (ParseException e2) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    @Override
    public InputStream getAsciiStream(int columnIndex) {
        return null;
    }

    @Override
    @Deprecated
    public InputStream getUnicodeStream(int columnIndex) {
        return null;
    }

    @Override
    public InputStream getBinaryStream(int columnIndex) {
        return null;
    }

    @Override
    public String getString(String columnLabel) {
        return getString(getColumnLabelPos(columnLabel));
    }

    @Override
    public boolean getBoolean(String columnLabel) {
        return getBoolean(getColumnLabelPos(columnLabel));
    }

    @Override
    public byte getByte(String columnLabel) {
        return getByte(getColumnLabelPos(columnLabel));
    }

    @Override
    public short getShort(String columnLabel) {
        return getShort(getColumnLabelPos(columnLabel));
    }

    @Override
    public int getInt(String columnLabel) {
        return getInt(getColumnLabelPos(columnLabel));
    }

    @Override
    public long getLong(String columnLabel) {
        return getLong(getColumnLabelPos(columnLabel));
    }

    @Override
    public float getFloat(String columnLabel) {
        return getFloat(getColumnLabelPos(columnLabel));
    }

    @Override
    public double getDouble(String columnLabel) {
        return getDouble(getColumnLabelPos(columnLabel));
    }

    @Override
    @Deprecated
    public BigDecimal getBigDecimal(String columnLabel, int scale) {
        return getBigDecimal(getColumnLabelPos(columnLabel), scale);
    }

    @Override
    public byte[] getBytes(String columnLabel) {
        return getBytes(getColumnLabelPos(columnLabel));
    }

    @Override
    public Date getDate(String columnLabel) {
        return getDate(getColumnLabelPos(columnLabel));
    }

    @Override
    public Time getTime(String columnLabel) {
        return getTime(getColumnLabelPos(columnLabel));
    }

    @Override
    public Timestamp getTimestamp(String columnLabel) {
        return getTimestamp(getColumnLabelPos(columnLabel));
    }

    @Override
    public InputStream getAsciiStream(String columnLabel) {
        return null;
    }

    @Override
    @Deprecated
    public InputStream getUnicodeStream(String columnLabel) {
        return null;
    }

    @Override
    public InputStream getBinaryStream(String columnLabel) {
        return null;
    }

    @Override
    public SQLWarning getWarnings() {
        return null;
    }

    @Override
    public void clearWarnings() {

    }

    @Override
    public String getCursorName() {
        return null;
    }

    @Override
    public ResultSetMetaData getMetaData() {
        return new ResultSetMetaData() {
            @Override
            public int getColumnCount() {
                if (headerRow != null) {
                    return headerRow.length;
                }
                return 0;
            }

            @Override
            public boolean isAutoIncrement(int column) {
                return false;
            }

            @Override
            public boolean isCaseSensitive(int column) {
                return false;
            }

            @Override
            public boolean isSearchable(int column) {
                return false;
            }

            @Override
            public boolean isCurrency(int column) {
                return false;
            }

            @Override
            public int isNullable(int column) {
                return 0;
            }

            @Override
            public boolean isSigned(int column) {
                return false;
            }

            @Override
            public int getColumnDisplaySize(int column) {
                return 0;
            }

            @Override
            public String getColumnLabel(int column) {
                if (column > 0) {
                    return headerRow[column - 1];
                }
                return null;
            }

            @Override
            public String getColumnName(int column) {
                if (column > 0) {
                    return headerRow[column - 1];
                }
                return null;
            }

            @Override
            public String getSchemaName(int column) {
                if (column > 0) {
                    return headerRow[column - 1];
                }
                return null;
            }

            @Override
            public int getPrecision(int column) {
                return 0;
            }

            @Override
            public int getScale(int column) {
                return 0;
            }

            @Override
            public String getTableName(int column) {
                return null;
            }

            @Override
            public String getCatalogName(int column) {
                return null;
            }

            @Override
            public int getColumnType(int column) {
                return 0;
            }

            @Override
            public String getColumnTypeName(int column) {
                return null;
            }

            @Override
            public boolean isReadOnly(int column) {
                return false;
            }

            @Override
            public boolean isWritable(int column) {
                return false;
            }

            @Override
            public boolean isDefinitelyWritable(int column) {
                return false;
            }

            @Override
            public String getColumnClassName(int column) {
                return null;
            }

            @Override
            public <T> T unwrap(Class<T> iface) {
                return null;
            }

            @Override
            public boolean isWrapperFor(Class<?> iface) {
                return false;
            }
        };
    }

    @Override
    public Object getObject(int columnIndex) {
        return getString(columnIndex);
    }

    @Override
    public Object getObject(String columnLabel) {
        return getString(getColumnLabelPos(columnLabel));
    }

    @Override
    public int findColumn(String columnLabel) {
        return getColumnLabelPos(columnLabel);
    }

    @Override
    public Reader getCharacterStream(int columnIndex) {
        return null;
    }

    @Override
    public Reader getCharacterStream(String columnLabel) {
        return null;
    }

    @Override
    public BigDecimal getBigDecimal(int columnIndex) {
        return new BigDecimal(getString(columnIndex));
    }

    @Override
    public BigDecimal getBigDecimal(String columnLabel) {
        return new BigDecimal(getString(getColumnLabelPos(columnLabel)));
    }

    @Override
    public boolean isBeforeFirst() {
        return pos == 0;
    }

    @Override
    public boolean isAfterLast() {
        return pos > results.size();
    }

    @Override
    public boolean isFirst() {
        return pos == 1;
    }

    @Override
    public boolean isLast() {
        return pos == results.size();
    }

    @Override
    public void beforeFirst() {

    }

    @Override
    public void afterLast() {

    }

    @Override
    public boolean first() {
        pos = 0;
        return isFirst();
    }

    @Override
    public boolean last() {
        pos = results.size();
        return isLast();
    }

    @Override
    public int getRow() {
        return pos;
    }

    @Override
    public boolean absolute(int row) {
        return false;
    }

    @Override
    public boolean relative(int rows) {
        return false;
    }

    @Override
    public boolean previous() {
        return false;
    }

    @Override
    public void setFetchDirection(int direction) {

    }

    @Override
    public int getFetchDirection() {
        return 0;
    }

    @Override
    public void setFetchSize(int rows) {

    }

    @Override
    public int getFetchSize() {
        return 0;
    }

    @Override
    public int getType() {
        return 0;
    }

    @Override
    public int getConcurrency() {
        return 0;
    }

    @Override
    public boolean rowUpdated() {
        return false;
    }

    @Override
    public boolean rowInserted() {
        return false;
    }

    @Override
    public boolean rowDeleted() {
        return false;
    }

    @Override
    public void updateNull(int columnIndex) {

    }

    @Override
    public void updateBoolean(int columnIndex, boolean x) {

    }

    @Override
    public void updateByte(int columnIndex, byte x) {

    }

    @Override
    public void updateShort(int columnIndex, short x) {

    }

    @Override
    public void updateInt(int columnIndex, int x) {

    }

    @Override
    public void updateLong(int columnIndex, long x) {

    }

    @Override
    public void updateFloat(int columnIndex, float x) {

    }

    @Override
    public void updateDouble(int columnIndex, double x) {

    }

    @Override
    public void updateBigDecimal(int columnIndex, BigDecimal x) {

    }

    @Override
    public void updateString(int columnIndex, String x) {

    }

    @Override
    public void updateBytes(int columnIndex, byte[] x) {

    }

    @Override
    public void updateDate(int columnIndex, Date x) {

    }

    @Override
    public void updateTime(int columnIndex, Time x) {

    }

    @Override
    public void updateTimestamp(int columnIndex, Timestamp x) {

    }

    @Override
    public void updateAsciiStream(int columnIndex, InputStream x, int length) {

    }

    @Override
    public void updateBinaryStream(int columnIndex, InputStream x, int length) {

    }

    @Override
    public void updateCharacterStream(int columnIndex, Reader x, int length) {

    }

    @Override
    public void updateObject(int columnIndex, Object x, int scaleOrLength) {

    }

    @Override
    public void updateObject(int columnIndex, Object x) {

    }

    @Override
    public void updateNull(String columnLabel) {

    }

    @Override
    public void updateBoolean(String columnLabel, boolean x) {

    }

    @Override
    public void updateByte(String columnLabel, byte x) {

    }

    @Override
    public void updateShort(String columnLabel, short x) {

    }

    @Override
    public void updateInt(String columnLabel, int x) {

    }

    @Override
    public void updateLong(String columnLabel, long x) {

    }

    @Override
    public void updateFloat(String columnLabel, float x) {

    }

    @Override
    public void updateDouble(String columnLabel, double x) {

    }

    @Override
    public void updateBigDecimal(String columnLabel, BigDecimal x) {

    }

    @Override
    public void updateString(String columnLabel, String x) {

    }

    @Override
    public void updateBytes(String columnLabel, byte[] x) {

    }

    @Override
    public void updateDate(String columnLabel, Date x) {

    }

    @Override
    public void updateTime(String columnLabel, Time x) {

    }

    @Override
    public void updateTimestamp(String columnLabel, Timestamp x) {

    }

    @Override
    public void updateAsciiStream(String columnLabel, InputStream x, int length) {

    }

    @Override
    public void updateBinaryStream(String columnLabel, InputStream x, int length) {

    }

    @Override
    public void updateCharacterStream(String columnLabel, Reader reader, int length) {

    }

    @Override
    public void updateObject(String columnLabel, Object x, int scaleOrLength) {

    }

    @Override
    public void updateObject(String columnLabel, Object x) {

    }

    @Override
    public void insertRow() {

    }

    @Override
    public void updateRow() {

    }

    @Override
    public void deleteRow() {

    }

    @Override
    public void refreshRow() {

    }

    @Override
    public void cancelRowUpdates() {

    }

    @Override
    public void moveToInsertRow() {

    }

    @Override
    public void moveToCurrentRow() {

    }

    @Override
    public Statement getStatement() {
        return null;
    }

    @Override
    public Object getObject(int columnIndex, Map<String, Class<?>> map) {
        return null;
    }

    @Override
    public Ref getRef(int columnIndex) {
        return null;
    }

    @Override
    public Blob getBlob(int columnIndex) {
        return null;
    }

    @Override
    public Clob getClob(int columnIndex) {
        return null;
    }

    @Override
    public Array getArray(int columnIndex) {
        return null;
    }

    @Override
    public Object getObject(String columnLabel, Map<String, Class<?>> map) {
        return null;
    }

    @Override
    public Ref getRef(String columnLabel) {
        return null;
    }

    @Override
    public Blob getBlob(String columnLabel) {
        return null;
    }

    @Override
    public Clob getClob(String columnLabel) {
        return null;
    }

    @Override
    public Array getArray(String columnLabel) {
        return null;
    }

    @Override
    public Date getDate(int columnIndex, Calendar cal) {
        return null;
    }

    @Override
    public Date getDate(String columnLabel, Calendar cal) {
        return null;
    }

    @Override
    public Time getTime(int columnIndex, Calendar cal) {
        return null;
    }

    @Override
    public Time getTime(String columnLabel, Calendar cal) {
        return null;
    }

    @Override
    public Timestamp getTimestamp(int columnIndex, Calendar cal) {
        return null;
    }

    @Override
    public Timestamp getTimestamp(String columnLabel, Calendar cal) {
        return null;
    }

    @Override
    public URL getURL(int columnIndex) {
        return null;
    }

    @Override
    public URL getURL(String columnLabel) {
        return null;
    }

    @Override
    public void updateRef(int columnIndex, Ref x) {

    }

    @Override
    public void updateRef(String columnLabel, Ref x) {

    }

    @Override
    public void updateBlob(int columnIndex, Blob x) {

    }

    @Override
    public void updateBlob(String columnLabel, Blob x) {

    }

    @Override
    public void updateClob(int columnIndex, Clob x) {

    }

    @Override
    public void updateClob(String columnLabel, Clob x) {

    }

    @Override
    public void updateArray(int columnIndex, Array x) {

    }

    @Override
    public void updateArray(String columnLabel, Array x) {

    }

    @Override
    public RowId getRowId(int columnIndex) {
        return null;
    }

    @Override
    public RowId getRowId(String columnLabel) {
        return null;
    }

    @Override
    public void updateRowId(int columnIndex, RowId x) {

    }

    @Override
    public void updateRowId(String columnLabel, RowId x) {

    }

    @Override
    public int getHoldability() {
        return 0;
    }

    @Override
    public boolean isClosed() {
        return false;
    }

    @Override
    public void updateNString(int columnIndex, String nString) {

    }

    @Override
    public void updateNString(String columnLabel, String nString) {

    }

    @Override
    public void updateNClob(int columnIndex, NClob nClob) {

    }

    @Override
    public void updateNClob(String columnLabel, NClob nClob) {

    }

    @Override
    public NClob getNClob(int columnIndex) {
        return null;
    }

    @Override
    public NClob getNClob(String columnLabel) {
        return null;
    }

    @Override
    public SQLXML getSQLXML(int columnIndex) {
        return null;
    }

    @Override
    public SQLXML getSQLXML(String columnLabel) {
        return null;
    }

    @Override
    public void updateSQLXML(int columnIndex, SQLXML xmlObject) {

    }

    @Override
    public void updateSQLXML(String columnLabel, SQLXML xmlObject) {

    }

    @Override
    public String getNString(int columnIndex) {
        return null;
    }

    @Override
    public String getNString(String columnLabel) {
        return null;
    }

    @Override
    public Reader getNCharacterStream(int columnIndex) {
        return null;
    }

    @Override
    public Reader getNCharacterStream(String columnLabel) {
        return null;
    }

    @Override
    public void updateNCharacterStream(int columnIndex, Reader x, long length) {

    }

    @Override
    public void updateNCharacterStream(String columnLabel, Reader reader, long length) {

    }

    @Override
    public void updateAsciiStream(int columnIndex, InputStream x, long length) {

    }

    @Override
    public void updateBinaryStream(int columnIndex, InputStream x, long length) {

    }

    @Override
    public void updateCharacterStream(int columnIndex, Reader x, long length) {

    }

    @Override
    public void updateAsciiStream(String columnLabel, InputStream x, long length) {

    }

    @Override
    public void updateBinaryStream(String columnLabel, InputStream x, long length) {

    }

    @Override
    public void updateCharacterStream(String columnLabel, Reader reader, long length) {

    }

    @Override
    public void updateBlob(int columnIndex, InputStream inputStream, long length) {

    }

    @Override
    public void updateBlob(String columnLabel, InputStream inputStream, long length) {

    }

    @Override
    public void updateClob(int columnIndex, Reader reader, long length) {

    }

    @Override
    public void updateClob(String columnLabel, Reader reader, long length) {

    }

    @Override
    public void updateNClob(int columnIndex, Reader reader, long length) {

    }

    @Override
    public void updateNClob(String columnLabel, Reader reader, long length) {

    }

    @Override
    public void updateNCharacterStream(int columnIndex, Reader x) {

    }

    @Override
    public void updateNCharacterStream(String columnLabel, Reader reader) {

    }

    @Override
    public void updateAsciiStream(int columnIndex, InputStream x) {

    }

    @Override
    public void updateBinaryStream(int columnIndex, InputStream x) {

    }

    @Override
    public void updateCharacterStream(int columnIndex, Reader x) {

    }

    @Override
    public void updateAsciiStream(String columnLabel, InputStream x) {

    }

    @Override
    public void updateBinaryStream(String columnLabel, InputStream x) {

    }

    @Override
    public void updateCharacterStream(String columnLabel, Reader reader) {

    }

    @Override
    public void updateBlob(int columnIndex, InputStream inputStream) {

    }

    @Override
    public void updateBlob(String columnLabel, InputStream inputStream) {

    }

    @Override
    public void updateClob(int columnIndex, Reader reader) {

    }

    @Override
    public void updateClob(String columnLabel, Reader reader) {

    }

    @Override
    public void updateNClob(int columnIndex, Reader reader) {

    }

    @Override
    public void updateNClob(String columnLabel, Reader reader) {

    }

    @Override
    public <T> T getObject(int columnIndex, Class<T> type) {
        return null;
    }

    @Override
    public <T> T getObject(String columnLabel, Class<T> type) {
        return null;
    }

    @Override
    public <T> T unwrap(Class<T> iface) {
        return null;
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) {
        return false;
    }

    private int getColumnLabelPos(String columnLabel) {
        int idx = 1;
        for (String s : headerRow) {
            if (s.equalsIgnoreCase(columnLabel)) {
                return idx;
            }
            idx++;
        }
        throw new RuntimeException("Invalid column label " + columnLabel);
    }
}
