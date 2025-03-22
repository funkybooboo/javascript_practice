package util;

import com.joestelmach.natty.DateGroup;
import com.joestelmach.natty.ParseLocation;
import com.joestelmach.natty.Parser;
import db.LocalDatabase;
import db.LocalDatabaseManager;

import javax.swing.JComponent;
import javax.swing.JTable;
import javax.swing.JToolTip;
import javax.swing.KeyStroke;
import javax.swing.ListSelectionModel;
import javax.swing.ToolTipManager;
import javax.swing.table.TableCellRenderer;
import javax.swing.table.TableColumnModel;
import javax.swing.table.TableModel;
import java.awt.Component;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TimeZone;
import java.util.Vector;

/**
 * Created by danastott on 2019-05-08
 */
public class CommonJXTable extends JTable {
    private static SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
    private static SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static SimpleDateFormat dateTimeMilliesFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    private static SimpleDateFormat bigDecimalDateTimeFormatter = new SimpleDateFormat("yyyyMMddHHmmss.SSS");
    private static final Parser dateParser = new Parser(TimeZone.getTimeZone("UTC"));
    private Map<Integer, Boolean> alwaysShowTooltipColumnsMap = new HashMap<>();
    private static final int maxTooltipText;
    static {
        Properties properties = PropertiesUtil.readProperties(PropertiesUtil.PREFERENCES_PROPERTIES);
        maxTooltipText = Integer.parseInt(properties.getProperty(PropertiesUtil.MAX_TOOLTIP_TEXT, "4096"));
    }

    public CommonJXTable() {
        setDismissDelay();
    }

    public CommonJXTable(TableModel dm) {
        super(dm);
        setDismissDelay();
    }

    public CommonJXTable(TableModel dm, TableColumnModel cm) {
        super(dm, cm);
        setDismissDelay();
    }

    public CommonJXTable(TableModel dm, TableColumnModel cm, ListSelectionModel sm) {
        super(dm, cm, sm);
        setDismissDelay();
    }

    public CommonJXTable(int numRows, int numColumns) {
        super(numRows, numColumns);
        setDismissDelay();
    }

    public CommonJXTable(Vector<?> rowData, Vector<?> columnNames) {
        super(rowData, columnNames);
        setDismissDelay();
    }

    public CommonJXTable(Object[][] rowData, Object[] columnNames) {
        super(rowData, columnNames);
        setDismissDelay();
    }

    private void setDismissDelay() {
        Properties p = PropertiesUtil.readProperties(PropertiesUtil.PREFERENCES_PROPERTIES);
        String initialDelay = p.getProperty("tooltip_initial_delay", "500");
        String dismissDelay = p.getProperty("tooltip_dismiss_delay", "10000");
        ToolTipManager.sharedInstance().setInitialDelay(Integer.parseInt(initialDelay));
        ToolTipManager.sharedInstance().setDismissDelay(Integer.parseInt(dismissDelay));
    }

    protected boolean processKeyBinding(KeyStroke ks, KeyEvent e, int condition, boolean pressed) {
        // Don't start when just a modifier is pressed
        int code = e.getKeyCode();
        if (code == KeyEvent.VK_SHIFT || code == KeyEvent.VK_CONTROL || code == KeyEvent.VK_ALT) {
            return false;
        }
        if (code == KeyEvent.VK_A && ((e.getModifiers() & InputEvent.SHIFT_MASK) > 0) && (((e.getModifiers() & InputEvent.CTRL_MASK) > 0) || ((e.getModifiers() & InputEvent.META_MASK) > 0))) {
            int column = getSelectedColumn();
            setColumnSelectionInterval(column, column);
            setRowSelectionInterval(0, getRowCount() - 1);
            return true;
        } else {
            return super.processKeyBinding(ks, e, condition, pressed);
        }
    }

    public void addAlwaysShowTooltipColumn(int column) {
        alwaysShowTooltipColumnsMap.put(column, true);
    }

    @Override
    public JToolTip createToolTip() {
//        JScrollableToolTip tip = new JScrollableToolTip(1024, 480);
//        tip.setComponent(this);
//        return tip;
        return super.createToolTip();
    }

    @Override
    public Component prepareRenderer(TableCellRenderer renderer, int row, int column) {
        try {
            Component c = super.prepareRenderer(renderer, row, column);
            if (c instanceof JComponent) {
                JComponent jc = (JComponent) c;
                Object value = getValueAt(row, column);
                jc.setToolTipText(null);
                if (value != null) {
                    String cellContent = value.toString();
                    if (alwaysShowTooltipColumnsMap.getOrDefault(column, false)) {
                        return renderer.getTableCellRendererComponent(this, cellContent, false, false, row, column);
                    }
                }
            }
            return c;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String generatePreparedStatement(String tableName) {
        StringBuilder sb = new StringBuilder();
        sb.append("(");
        for (int c = 0 ;c < getColumnCount() ; c++) {
            if (sb.length() > 1) {
                sb.append(", ");
            }
            sb.append("?");
        }
        sb.append(")");
        return generateInsertIntoStatement(tableName) + sb.toString();
    }

    public Date getDateAt(int row, int column) {
        Object o = getValueAt(row, column);
        if (o == null || "\\N".equals(o.toString()) || "null".equalsIgnoreCase(o.toString()) || "Unknown".equals(o.toString())) {
            return null;
        } else {
            return parseDate(o.toString());
        }
    }

    public BigDecimal getBigDecimalAt(int row, int column) {
        Object o = getValueAt(row, column);
        if (o == null || "\\N".equals(o.toString()) || "null".equalsIgnoreCase(o.toString()) || "Unknown".equals(o.toString())) {
            return null;
        } else if (o instanceof BigDecimal) {
            return ((BigDecimal) o);
        } else {
            try {
                return new BigDecimal(o.toString());
            } catch (Exception e) {
                return new BigDecimal(0);
            }
        }
    }

    public Long getLongAt(int row, int column) {
        Object o = getValueAt(row, column);
        if (o == null || "\\N".equals(o.toString()) || "null".equalsIgnoreCase(o.toString()) || "Unknown".equals(o.toString())) {
            return null;
        } else if (o instanceof Long) {
            return (Long) o;
        } else {
            try {
                return new Long(o.toString());
            } catch (Exception e) {
                return 0L;
            }
        }
    }

    public String getStringAt(int row, int column) {
        Object o = getValueAt(row, column);
        if (o == null || "\\N".equals(o.toString()) || "null".equalsIgnoreCase(o.toString())) {
            return null;
        } else {
            return o.toString();
        }
    }

    public List<String> generateInsertStatements(String tableName, int maxRowsPerInsert) {
        List<String> insertStatements = new ArrayList<>();
        if (getRowCount() > 0) {
            StringBuilder sb = new StringBuilder();
            int[] widths = getColumnWidths();
            sb.append(generateInsertIntoStatement(tableName));
            int batchSize = 0;
            Object o;
            for (int r = 0; r < getRowCount(); r++) {
                if (batchSize > 0) {
                    sb.append(",");
                }
                sb.append("(");
                for (int c = 0; c < getColumnCount(); c++) {
                    if (c > 0) {
                        sb.append(",");
                    }
                    o = getValueAt(r, c);
                    Class clazz = getColumnClass(c);
                    if (clazz == Date.class) {
                        if (o == null || "\\N".equals(o.toString()) || "Unknown".equals(o.toString())) {
                            sb.append("null");
                        } else {
                            Date date = parseDate(o.toString());
                            if (date != null) {
                                if (widths[c] > 10) {
                                    sb.append("'").append(dateTimeFormatter.format(date)).append("'");
                                } else {
                                    sb.append("'").append(dateFormatter.format(date)).append("'");
                                }
                            } else {
                                sb.append("null");
                            }
                        }
                    } else if (clazz == BigDecimal.class) {
                        if (o == null || "\\N".equals(o.toString()) || "Unknown".equals(o.toString())) {
                            sb.append("null");
                        } else {
                            try {
                                sb.append(((BigDecimal) o).toPlainString());
                            } catch (Exception e) {
                                sb.append("null");
                            }
                        }
                    } else if (clazz == Long.class) {
                        if (o == null || "\\N".equals(o.toString()) || "Unknown".equals(o.toString())) {
                            sb.append("null");
                        } else {
                            sb.append(o.toString().replaceAll(",", ""));
                        }
                    } else {
                        if (o == null || "\\N".equals(o.toString())) {
                            sb.append("null");
                        } else {
                            sb.append("'").append(o.toString().replaceAll("'", "''")).append("'");
                        }
                    }
                }
                sb.append(")");
                if (batchSize++ >= maxRowsPerInsert) {
                    insertStatements.add(sb.toString());
                    batchSize = 0;
                    sb.setLength(0);
                    sb.append(generateInsertIntoStatement(tableName));
                }
            }
            if (sb.length() > 0) {
                insertStatements.add(sb.toString());
            }
        }
        return insertStatements;
    }

    public static Date parseDate(String dateString) {
        if (dateString != null) {
            Date d = simpleParseDate(dateString);
            if (d != null) {
                return d;
            }
            try {
                List<DateGroup> dateGroups = dateParser.parse(dateString);
                DateGroup dateGroup = dateGroups.isEmpty() ? null : dateGroups.get(0);
                if (dateGroup != null) {
                    List<ParseLocation> parseLocations = dateGroup.getParseLocations().getOrDefault("formal_year", dateGroup.getParseLocations().get("int_four_digits"));
                    if (parseLocations == null || parseLocations.size() == 0) {
                        parseLocations = dateGroup.getParseLocations().get("relaxed_date");
                    }
                    if (parseLocations != null && parseLocations.size() > 0) {
                        List<Date> dates = dateGroup.getDates();
                        if (dates.size() > 0) {
                            return dates.get(0);
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("Unable to parse " + dateString);
                e.printStackTrace();
            }
        }
        return null;
    }

    private static Date simpleParseDate(String dateString) {
        if (dateString != null) {
            try {
                if (dateString.length() > 14 && dateString.contains(".")) {
                    try {
                        return bigDecimalDateTimeFormatter.parse(dateString);
                    } catch (Exception e) {
                        return dateTimeMilliesFormatter.parse(dateString);
                    }
                } else if (dateString.length() > 20) {
                    return dateTimeMilliesFormatter.parse(dateString);
                } else if (dateString.length() > 18) {
                    return dateTimeFormatter.parse(dateString);
                } else if (dateString.length() == 10) {
                    return dateFormatter.parse(dateString);
                }
            } catch (Exception e) {
                // ignore
            }
        }
        return null;
    }

    private String generateInsertIntoStatement(String tableName) {
        StringBuilder sb = new StringBuilder();
        sb.append("INSERT INTO ").append(tableName).append(" (");
        for (int c = 0 ; c < getColumnCount() ; c++) {
            if (c > 0) {
                sb.append(",");
            }
            appendColumnName(sb, c);
        }
        sb.append(") VALUES ");
        return sb.toString();
    }

    private void appendColumnName(StringBuilder sb, int c) {
        String quoteChar = String.valueOf(LocalDatabaseManager.getLocalDatabase().getColumnNameQuoteChar());
        String columnName = getColumnName(c).replaceAll(quoteChar, "");
        if ("\\N".equals(columnName) || columnName.length() == 0 || !Character.isAlphabetic(columnName.charAt(0))) {
            columnName = "c" + (c + 1);
        }
        sb.append(quoteChar).append(columnName).append(quoteChar);
    }

    public String generateCreateTableStatement(String tableName) {
        LocalDatabase localDatabase = LocalDatabaseManager.getLocalDatabase();
        StringBuilder sb = new StringBuilder();
        int[] widths = getColumnWidths();
        sb.append("CREATE TABLE ").append(tableName).append(" (");
        for (int c = 0 ; c < getColumnCount() ; c++) {
            if (c > 0) {
                sb.append(",");
            }
            appendColumnName(sb, c);
            Class clazz = getColumnClass(c);
            sb.append(" ").append(localDatabase.getColumnType(clazz, widths[c]));
        }
        sb.append(")");
        return sb.toString();
    }

    public int[] getColumnWidths() {
        int[] widths = new int[getColumnCount()];
        Arrays.fill(widths, 0);
        Object o;
        for (int r = 0 ; r < getRowCount() ; r++) {
            for (int c = 0; c < getColumnCount(); c++) {
                o = getValueAt(r, c);
                if (o != null) {
                    if (o.toString().length() > widths[c]) {
                        widths[c] = o.toString().length();
                    }
                }
            }
        }
        return widths;
    }
}
