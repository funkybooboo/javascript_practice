package util;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import javax.swing.table.AbstractTableModel;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.TableCellRenderer;
import java.lang.reflect.Constructor;
import java.math.BigDecimal;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

public class SqlResultsTableModel extends AbstractTableModel {
    private static final Pattern dateTimePattern = Pattern.compile("\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d.\\d\\d\\d");

    ResultSetMetaData metaData;
    public HttpResultSet resultSet;
    HttpResultSet unfilteredResultSet = null;
    Map<Integer, Class> columnTypes = new HashMap<>();
    Map<Integer, TableCellRenderer> columnRenderers = new HashMap<>();
    Map<Integer, Boolean> columnEditable = new HashMap<>();
    Map<Pair<Integer, Integer>, Object> changesMap = new HashMap<>();

    public SqlResultsTableModel(HttpResultSet resultSet) {
        if (resultSet != null) {
            this.resultSet = resultSet;
            this.unfilteredResultSet = resultSet;
            this.metaData = resultSet.getMetaData();
        }
    }

    public int getColumnCount() {
        if (metaData != null) {
            try {
                return metaData.getColumnCount();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return 0;
    }

    @Override
    public String getColumnName(int column) {
        if (metaData != null) {
            try {
                return metaData.getColumnName(column + 1);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return "";
    }

    public void filter(String value) {
        clearFilter();
        value = value.toLowerCase();
        List<String[]> matchingRows = new ArrayList<>();
        for (String[] row : resultSet.getResults()) {
            for (String s : row) {
                if (s.toLowerCase().contains(value)) {
                    matchingRows.add(row);
                    break;
                }
            }
        }
        resultSet = new HttpResultSet(resultSet.getHeaderRow(), matchingRows);
    }

    public void insertColumn(int pos, String headerName, List<String> rows) {
        resultSet.insertColumn(pos, headerName, rows);
        reset();
    }

    public void reset() {
        columnTypes = new HashMap<>();
        columnRenderers = new HashMap<>();
        columnEditable = new HashMap<>();
        changesMap = new HashMap<>();
        unfilteredResultSet = resultSet;
        this.metaData = resultSet.getMetaData();
    }

    public void clearFilter() {
        resultSet = unfilteredResultSet;
    }

    public TableCellRenderer getCellRenderer(int column) {
        return columnRenderers.get(column);
    }

    public void setTableCellRenderer(int column, TableCellRenderer renderer) {
        columnRenderers.put(column, renderer);
    }

    public List<String[]> getSubList(int startIndex, int endIndex) {
        return resultSet.getResults().subList(startIndex, endIndex);
    }

    public void sortByColumn(int column, boolean descending) {
        if (column >= 0) {
            resultSet.getResults().sort(descending ? (Comparator<String[]>) (o1, o2) -> {
                if (o2[column] != null) {
                    return o2[column].compareTo(o1[column]);
                }
                return -1;
            } : (Comparator<String[]>) (o1, o2) -> {
                if (o1[column] != null) {
                    return o1[column].compareTo(o2[column]);
                }
                return -1;
            });
        }
    }

    public boolean isCellEditable(int row, int column) {
        Boolean editable = columnEditable.get(column);
        return editable != null && editable;
    }

    public void setColumnEditable(int column, boolean editable) {
        columnEditable.put(column, editable);
    }

    public void setColumnTypes(Map<Integer, Class> columnTypes) {
        this.columnTypes = columnTypes;
    }

    public void addRow(List<String> row) {
        (resultSet).addRow(row.toArray(new String[row.size()]));
        fireTableRowsInserted((resultSet).getRowCount()-1, (resultSet).getRowCount()-1);
    }

    @Override
    public void setValueAt(Object aValue, int rowIndex, int columnIndex) {
        if (resultSet != null) {
            changesMap.put(ImmutablePair.of(rowIndex, columnIndex), resultSet.getValueAt(rowIndex, columnIndex));
            resultSet.setValueAt(aValue, rowIndex, columnIndex);
            fireTableCellUpdated(rowIndex, columnIndex);
        }
    }

    public void setValueAt(Object newValue, Object oldValue, int rowIndex, int columnIndex) {
        if (resultSet != null) {
            changesMap.put(ImmutablePair.of(rowIndex, columnIndex), oldValue);
            resultSet.setValueAt(newValue, rowIndex, columnIndex);
            fireTableCellUpdated(rowIndex, columnIndex);
        }
    }

    public boolean hasChanges() {
        return changesMap.size() > 0;
    }

    public boolean rowHasChanges(int row) {
        Map<Integer, Object> rowChanges = getRowChanges(row);
        boolean hasChanges = false;
        for (Map.Entry<Integer, Object> entry : rowChanges.entrySet()) {
            Object value = getValueAt(row, entry.getKey());
            if (value != null && entry.getValue() != null && !value.toString().equals(entry.getValue().toString())) {
                hasChanges = true;
                break;
            }
        }
        return hasChanges;
    }

    public Map<Pair<Integer, Integer>, Object> getChangesMap() {
        return new HashMap<>(changesMap);
    }

    public Map<Integer, Object> getRowChanges(int row) {
        Map<Integer, Object> changes = new HashMap<>();
        for (Map.Entry<Pair<Integer, Integer>, Object> entry : changesMap.entrySet()) {
            if (entry.getKey().getLeft().equals(row)) {
                changes.put(entry.getKey().getRight(), entry.getValue());
            }
        }
        return changes;
    }

    public void clearChanges() {
        changesMap.clear();
    }

    public Class getColumnClass(int column) {
        if (columnTypes.size() == 0) {
            for (int c = 0; c < getColumnCount(); c++) {
                Class clazz = String.class;
                Set<Class> types = new HashSet<>();
                columnRenderers.put(c, new DefaultTableCellRenderer());
                for (int r = 0; r < Math.min(getRowCount(), 100); r++) {
                    Object v = getValueAt(r, c);
                    String value = "null";
                    if (v != null) {
                        value = v.toString();
                    }
                    if (value.length() > 0 && !"null".equals(value)) {
                        try {
                            new Long(value);
                            clazz = Long.class;
                        } catch (Exception e) {
                            try {
                                new BigDecimal(value);
                                clazz = BigDecimal.class;
                                if (dateTimePattern.matcher(value).matches()) {
                                    columnRenderers.put(c, new DateTimeRenderer());
                                }
                            } catch (Exception e2) {
                                clazz = String.class;
                                if (value.length() > 7 && value.length() < 24) {
                                    if ((value.charAt(0) == '1' || value.charAt(0) == '2') && Character.isDigit(value.charAt(1)) &&
                                            value.charAt(4) == '-' && value.charAt(7) == '-' &&
                                            Character.isDigit(value.charAt(5)) && Character.isDigit(value.charAt(8))){
                                        clazz = Date.class;
                                    } else {
                                        boolean hasDigit = false;
                                        for (int i = 0 ; i < value.length() ; i++) {
                                            if (Character.isDigit(value.charAt(i))) {
                                                hasDigit = true;
                                                break;
                                            }
                                        }
                                        if (hasDigit) {
                                            Date date = CommonJXTable.parseDate(value);
                                            if (date != null) {
                                                clazz = Date.class;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    types.add(clazz);
                }
                if (types.contains(String.class)) {
                    clazz = String.class;
                } else if (types.contains(BigDecimal.class)) {
                    clazz = BigDecimal.class;
                } else if (types.contains(Date.class)) {
                    clazz = Date.class;
                } else {
                    clazz = Long.class;
                }
                columnTypes.put(c, clazz);
            }
        }
        return columnTypes.get(column);
    }

    public int getRowCount() {
        if (resultSet != null) {
            return ( resultSet).getRowCount();
        }
        return 0;
    }

    public Object getValueAt(int rowIndex, int columnIndex) {
        if (resultSet != null) {
            Object value = ( resultSet).getValueAt(rowIndex, columnIndex);
            Class clazz = columnTypes.get(columnIndex);
            if (clazz != null && clazz != String.class) {
                if ("".equals(value)) {
                    value = null;
                } else {
                    try {
                        Constructor ctor = clazz.getConstructor(String.class);
                        value = ctor.newInstance(new String[]{value.toString()});
                    } catch (Exception e) {
                        // ignore
                    }
                }
            }
            return value;
        }
        return null;
    }

    public static class DateTimeRenderer extends DefaultTableCellRenderer {

        private static final long serialVersionUID = 1L;
        private Date dateValue;
        private SimpleDateFormat sdfOrigFormat = new SimpleDateFormat("yyyyMMddHHmmss.S");
        private SimpleDateFormat sdfNewFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        private String valueToString = "";

        @Override
        public void setValue(Object value) {
            if ((value != null) && value.toString().length() > 0) {
                String stringFormat = value.toString();
                try {
                    dateValue = sdfOrigFormat.parse(stringFormat);
                    valueToString = sdfNewFormat.format(dateValue);
                    value = valueToString;
                } catch (Exception e) {
                    // ignore
                }
            }
            super.setValue(value);
        }
    }
}

