package db;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteWatchdog;
import org.apache.commons.exec.OS;
import org.apache.commons.exec.PumpStreamHandler;
import util.IOUtility;
import util.PropertiesUtil;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.concurrent.TimeUnit;

/**
 * Created by danastott on 2019-09-24
 */
public class LockFile {

    private static final String rootPath = new File(System.getProperty("user.home", "~") + "/" + PropertiesUtil.getHiddenDir()).getAbsolutePath();

    public static int getLockFileId() {
        return getLockFileId(rootPath);
    }

    public static int getLockFileId(String lockFileRoot) {
        for (int i = 1 ; i <= 10 ; i++) {
            File lockFile = new File(lockFileRoot, i + ".lock");
            if (!lockFile.exists()) {
                IOUtility.writeFile(lockFile, String.valueOf(getProcessId()));
                return i;
            } else {
                String pid = IOUtility.readFileAsString(lockFile);
                try {
                    if (!isProcessRunning(Integer.parseInt(pid), 500, TimeUnit.MILLISECONDS)) {
                        IOUtility.writeFile(lockFile, String.valueOf(getProcessId()));
                        return i;
                    }
                } catch (IOException ioe) {
                    ioe.printStackTrace();
                }
            }
        }
        return 0;
    }

    public static long getProcessId() {
        RuntimeMXBean bean = ManagementFactory.getRuntimeMXBean();
        String jvmName = bean.getName();
        return Long.valueOf(jvmName.split("@")[0]);
    }

    public static boolean isProcessRunning(int pid, int timeout, TimeUnit timeunit) throws IOException {
        String line;
        if (OS.isFamilyWindows()) {
            //tasklist exit code is always 0. Parse output
            //findstr exit code 0 if found pid, 1 if it doesn't
            line = "cmd /c \"tasklist /FI \"PID eq " + pid + "\" | findstr " + pid + "\"";
        }
        else {
            //ps exit code 0 if process exists, 1 if it doesn't
            line = "ps -p " + pid;
            //`-p` is POSIX/BSD-compliant, `--pid` isn't<ref>https://github.com/apache/storm/pull/296#discussion_r20535744</ref>
        }
        CommandLine cmdLine = CommandLine.parse(line);
        DefaultExecutor executor = new DefaultExecutor();
        // disable logging of stdout/strderr
        executor.setStreamHandler(new PumpStreamHandler(null, null, null));
        // disable exception for valid exit values
        executor.setExitValues(new int[]{0, 1});
        // set timer for zombie process
        ExecuteWatchdog timeoutWatchdog = new ExecuteWatchdog(timeunit.toMillis(timeout));
        executor.setWatchdog(timeoutWatchdog);
        int exitValue = executor.execute(cmdLine);
        // 0 is the default exit code which means the process exists
        return exitValue == 0;
    }
}
