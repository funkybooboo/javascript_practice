package util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by danastott on 10/27/20
 */
public class DBUtil {

    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            }
            catch (SQLException e) {
                // ignore
            }
        }
    }

    public static void close(Statement s) {
        if (s != null) {
            try {
                s.close();
            }
            catch (SQLException e) {
                // ignore
            }
        }
    }

    public static void close(PreparedStatement ps) {
        if (ps != null) {
            try {
                ps.close();
            }
            catch (SQLException e) {
                // ignore
            }
        }
    }

    public static void close(Connection c) {
        if (c != null) {
            try {
                c.clearWarnings();
            }
            catch (SQLException e) {
                // ignore
            }
            finally {
                try {
                    c.close();
                } catch (SQLException e) {
                    // ignore
                }
            }
        }
    }

    public static void setAutoCommit(Connection c, boolean flag) {
        if (c != null) {
            try {
                c.setAutoCommit(flag);
            }
            catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void commit(Connection c) {
        if (c != null) {
            try {
                c.commit();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void rollback(Connection c) {
        if (c != null) {
            try {
                c.rollback();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void setCatalog(Connection c, String catalog) {
        if (c != null) {
            try {
                c.setCatalog(catalog);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

}
