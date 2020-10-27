package util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;

/**
 * Created on 10/31/16 by danastott.
 */
public class PropertiesUtil {
    public static final String PREFERENCES_PROPERTIES = "preferences.properties";
    public static final String LOCAL_DATABASE_ENGINE = "local_database_engine";
    public static final String LOCAL_DATABASE_ENGINE_PORT = "local_database_engine_port";
    public static final String MAX_TOOLTIP_TEXT = "max_tooltip_text";
    private static String hiddenDir;
    private static String resourcePath;

    public static Properties readProperties(String propertyName) {
        File propertyFile = getPropertyFile(propertyName, true);
        return readProperties(propertyFile);
    }

    public static Properties readProperties(File propertyFile) {
        Properties properties = new Properties();
        boolean cleanFile = loadProperties(propertyFile, properties);
        if (cleanFile) {
            removeInvalidUnicodeCharacters(propertyFile);
            loadProperties(propertyFile, properties);
        }
        return properties;
    }

    private static boolean loadProperties(File propertyFile, Properties properties) {
        boolean cleanFile = false;
        try (FileInputStream fis = new FileInputStream(propertyFile)) {
            properties.load(fis);
        } catch (IllegalArgumentException ia) {
            cleanFile = true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return cleanFile;
    }

    private static void removeInvalidUnicodeCharacters(File propertyFile) {
        String s = IOUtility.readFileAsString(propertyFile);
        StringBuilder sb = new StringBuilder();
        for (int c = 0 ; c < s.length() ; c++) {
            char aChar = s.charAt(c);
            if (aChar == '\\' && c + 1 < s.length()) {
                aChar = s.charAt(++c);
                if (aChar == 'u') {
                    // Read the xxxx
                    int value = 0;
                    for (int i = 0; i < 4; i++) {
                        if (c + 1 < s.length()) {
                            aChar = s.charAt(++c);
                            switch (aChar) {
                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                    value = (value << 4) + aChar - '0';
                                    break;
                                case 'a':
                                case 'b':
                                case 'c':
                                case 'd':
                                case 'e':
                                case 'f':
                                    value = (value << 4) + 10 + aChar - 'a';
                                    break;
                                case 'A':
                                case 'B':
                                case 'C':
                                case 'D':
                                case 'E':
                                case 'F':
                                    value = (value << 4) + 10 + aChar - 'A';
                                    break;
                                default:
                                    // invalid character
                                    value = 0;
                                    c += i-1;
                                    i = 4;
                                    break;
                            }
                        }
                    }
                    if (value != 0) {
                        sb.append((char) value);
                    }
                } else {
                    sb.append(aChar);
                }
            } else {
                sb.append(aChar);
            }
        }
        IOUtility.writeFile(propertyFile, sb.toString());
    }

    public static void saveProperties(Properties properties, String propertyName) {
        File propertiesFile = getPropertyFile(propertyName, false);
        try (FileOutputStream fos = new FileOutputStream(propertiesFile)) {
            properties.store(fos, new Date().toString());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        propertiesFile = new File(System.getProperty("WorkingDirectory", ".") + "/" + propertyName);
        if (propertiesFile.exists()) {
            IOUtility.delete(propertiesFile);
        }
    }

    public static List<String> readOrderedList(String propertyName) {
        File propertyFile = getPropertyFile(propertyName, true);
        String values = IOUtility.readFileAsString(propertyFile);
        String[] split = values.split("\n");
        return new ArrayList<>(Arrays.asList(split));
    }

    public static void saveOrderedlist(List<String> values, String propertyName) {
        File propertyFile = getPropertyFile(propertyName, true);
        StringBuilder sb = new StringBuilder();
        for (String value : values) {
            if (sb.length() > 0) {
                sb.append("\n");
            }
            sb.append(value);
        }
        IOUtility.writeFile(propertyFile, sb.toString());
    }

    public static String getHiddenDir() {
        if (hiddenDir == null) {
            StackTraceElement[] stElements = Thread.currentThread().getStackTrace();
            for (int i = 1; i < stElements.length; i++) {
                StackTraceElement ste = stElements[i];
                if (ste.getClassName().startsWith("com.domo.") && !ste.getClassName().startsWith("com.domo.admin")) {
                    hiddenDir = "." + ste.getClassName().split("\\.")[2];
                    break;
                }
            }
        }
        if (hiddenDir == null) {
            hiddenDir = ".dataadmin";
        }
        return hiddenDir;
    }

    public static Date getLastModified(String propertyName) {
        File propertyFile = getPropertyFile(propertyName, true);
        return new Date(propertyFile.lastModified());
    }

    public static File getPropertyFile(String propertyName, boolean readFromOldDir) {
        File propertyFile = new File(System.getProperty("user.home", "~") + "/" + getHiddenDir() + "/" + propertyName);
        if (!propertyFile.getParentFile().exists()) {
            if (!propertyFile.getParentFile().mkdirs()) {
                throw new RuntimeException("Unable to create directory " + propertyFile.getParentFile());
            }
        }
        File oldPropertyFile = new File(System.getProperty("WorkingDirectory", ".") + "/" + propertyName);
        if (readFromOldDir && !propertyFile.exists()) {
            if (oldPropertyFile.exists()) {
                if (!oldPropertyFile.renameTo(propertyFile)) {
                    System.out.println("Unable to copy " + oldPropertyFile + " to " + propertyFile);
                }
            }
        } else if (readFromOldDir) {
            IOUtility.delete(oldPropertyFile);
        }
        try {
            if (!propertyFile.exists() && !propertyFile.createNewFile()) {
                System.out.println("Unable to create " + propertyFile);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return propertyFile;
    }
}
