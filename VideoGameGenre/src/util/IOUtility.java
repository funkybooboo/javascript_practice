package util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PushbackInputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.Deflater;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;


/**
 * Utility functions for dealing with IO.
 */
public class IOUtility {
    /**
     * Gets the root exception for a given exception.
     */
    public static String getRootExceptionMessage(Throwable ex) {
        Throwable rootException = ex;
        while (rootException.getCause() != null) {
            rootException = rootException.getCause();
        }

        String result = rootException.getMessage();
        if (result == null) {
            result = ex.getClass().getName();
        }

        return result;
    }


    /**
     * Returns the directory where the class is located.
     */
    public static File getClassDir(Class classObject) {
        return new File(classObject.getProtectionDomain().getCodeSource().getLocation().getPath());
    }


    public static void writeFile(File file, String text) {
        try {
            Writer writer = new OutputStreamWriter(new FileOutputStream(file), "UTF-8");
            try {
                writer.write(text);
            } finally {
                writer.close();
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static void writeFile(File file, byte[] bytes) {
        try {
            try (OutputStream out = new FileOutputStream(file)) {
                out.write(bytes);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static void writeFile(File file, InputStream in) {
        try {
            try (OutputStream out = new FileOutputStream(file)) {
                copyStream(in, out);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }


    /**
     * Read an entire file into a string.
     */
    public static String readFileAsString(File file) {
        try {
            return readReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }


    /**
     * Read an entire stream into a string.
     */
    public static String readStream(InputStream inputStream) {
        try {
            return readReader(new InputStreamReader(inputStream, "UTF-8"));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }


    /**
     * Read an entire stream into a reader.
     */
    public static String readReader(Reader inputReader) throws IOException {
        StringBuilder result = new StringBuilder(1000);

        BufferedReader reader = new BufferedReader(inputReader);
        try {
            char[] buf = new char[1024];
            int numRead;
            while ((numRead = reader.read(buf)) != -1) {
                result.append(buf, 0, numRead);
                buf = new char[1024];
            }
        } finally {
            reader.close();
        }

        return result.toString();
    }


    /**
     * Read a stream into a byte buffer.
     */
    public static byte[] readStreamAsBytes(InputStream is) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        int numRead;
        byte[] data = new byte[16384];

        while ((numRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, numRead);
        }

        buffer.flush();

        return buffer.toByteArray();
    }


    /**
     * Read a file into a byte buffer.
     */
    public static byte[] readFileAsBytes(File file) throws IOException {

        byte[] bytes;

        InputStream is = new BufferedInputStream(new FileInputStream(file));
        try {

            long length = file.length();

            bytes = new byte[(int) length];

            // Read in the bytes
            int offset = 0;
            int numRead;
            while ((offset < bytes.length) && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) {
                offset += numRead;
            }
        } finally {
            is.close();
        }

        return bytes;
    }

    /**
     * Given an uncompressed InputStream, compress it and return the
     * result as new byte array.
     */
    public static byte[] compress(final InputStream is) {
        GZIPOutputStream gzos = null;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            gzos = new GZIPOutputStream(baos);
            stream(is, gzos);
            gzos.finish();
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            closeStream(gzos);
        }
    }

    /**
     * Given a GZIP'ed compressed InputStream, uncompresses it and returns
     * the result as new byte array.  Does NOT close the InputStream; it's
     * up to the caller to close the InputStream when necessary.
     */
    public static byte[] uncompress(final InputStream is) {
        GZIPInputStream gzis = null;
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            gzis = new GZIPInputStream(is);
            stream(gzis, baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            closeStream(gzis);
        }
    }

    /**
     * Given an uncompressed byte-array, compress it using GZIP
     * compression and return the compressed array.
     */
    public static byte[] compress(final byte[] input) {
        return compress(new ByteArrayInputStream(input));
    }

    /**
     * Given a GZIP'ed compressed byte array, uncompresses it and
     * returns the result as new byte array.
     */
    public static byte[] uncompress(final byte[] input) {
        return uncompress(new ByteArrayInputStream(input));
    }

    /**
     * GZIP's a source file to destination file
     */
    public static void compress(File sourceFile, File destGzipFile) {
        try {
            FileInputStream fis = new FileInputStream(sourceFile);
            GZIPOutputStream fos = new GZIPOutputStream(new FileOutputStream(destGzipFile));
            try {
                copyStream(fis, fos);
            }
            finally {
                closeStream(fos);
                closeStream(fis);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * Uncompresses a GZIP'ed source file to destination file
     */
    public static void uncompress(File sourceGzipFile, File destFile) {
        try {
            GZIPInputStream fis = new GZIPInputStream(new FileInputStream(sourceGzipFile));
            FileOutputStream fos = new FileOutputStream(destFile);
            try {
                copyStream(fis, fos);
            }
            finally {
                closeStream(fos);
                closeStream(fis);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * Returns the public network IP address.
     * Some linux flavors return the localhost address rather than the public network address unless you actually look at all of the NICs.
     */
    public static String getIpv4Address() {

        String result = "127.0.0.1";

        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();
                for (InterfaceAddress address : networkInterface.getInterfaceAddresses()) {
                    String addressText = address.getAddress().getHostAddress();
                    if ((addressText.indexOf(':') == -1) && (!addressText.startsWith("127.0.0.1"))) {
                        result = addressText;
                        break;
                    }
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }

        return result;
    }


    /**
     * Recursive delete for directory, or simple delete for a file.
     */
    public static void delete(File file) {
        if (file != null) {
            if (file.isDirectory()) {

                String[] childFilenames = file.list();

                if ((childFilenames != null) && (childFilenames.length > 0)) {
                    for (String childFilename : childFilenames) {
                        delete(new File(file, childFilename));
                    }
                }

            }

            if (file.exists() && !file.delete()) {
                System.out.println("Unable to delete " + file);
            }
        }
    }


    /**
     * Make all slashes in a file path into backslashes.
     */
    public static String normalizeSeparators(String tmpDir) {
        tmpDir = tmpDir.replaceAll("\\\\", "/");
        return tmpDir;
    }


    @Deprecated
    public static long stream(InputStream input, OutputStream output) throws IOException {
        ReadableByteChannel inputChannel = null;
        WritableByteChannel outputChannel = null;

        try {
            inputChannel = Channels.newChannel(input);
            outputChannel = Channels.newChannel(output);
            ByteBuffer buffer = ByteBuffer.allocate(10240);
            long size = 0;

            while (inputChannel.read(buffer) != -1) {
                buffer.flip();
                size += outputChannel.write(buffer);
                buffer.clear();
            }

            return size;
        } finally {
            if (outputChannel != null) {
                try {
                    outputChannel.close();
                } catch (IOException ignore) {
                    // ignore
                }
            }

            if (inputChannel != null) {
                try {
                    inputChannel.close();
                } catch (IOException ignore) {
                    // ignore
                }
            }
        }
    }

    public static long copyStream(InputStream inputStream, OutputStream outputStream) {
        try {
            return copyStream(inputStream, outputStream, null);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public static long copyStream(InputStream inputStream, OutputStream outputStream, CopyStreamCallbackHandler copyStreamCallbackHandler) throws InterruptedException {
        long size = 0;
        try {
            byte[] buffer = new byte[32 * 1024];
            int n;
            while ((n = inputStream.read(buffer)) != -1) {
                size += n;
                outputStream.write(buffer, 0, n);
                if (copyStreamCallbackHandler != null && !copyStreamCallbackHandler.continueProcessing(size)) {
                    throw new InterruptedException("Copy stream interrupted by caller");
                }
            }
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }

        return size;
    }


    public static void closeStream(final OutputStream output) {
        try {
            if (output != null) {
                output.close();
            }
        } catch (IOException i) {
            // ignore
        }
    }

    public static void closeStream(final InputStream input) {
        try {
            if (input != null) {
                input.close();
            }
        } catch (IOException i) {
            // ignore
        }
    }

    public static void closeReader(final Reader reader) {
        try {
            if (reader != null) {
                reader.close();
            }
        } catch (IOException i) {
            // ignore
        }
    }

    public static void closeWriter(final Writer writer) {
        try {
            if (writer != null) {
                writer.close();
            }
        } catch (IOException i) {
            // ignore
        }
    }

    public static List<File> splitFileByLine(File file, File destDir, String filePrefix, String fileSuffix, boolean compress, long desiredFileByteSize) {
        List<File> files = new ArrayList<>();
        int partNum = 1;
        try {
            if (!destDir.exists() && !destDir.mkdirs()) {
                throw new RuntimeException("Unable to create destintation directory " + destDir);
            }
            try (InputStream is = ensureDecompressed(new FileInputStream(file));
                 BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is), 64 * 1024)) {
                String line;
                int fileSize = 0;
                PartStream partStream = new PartStream(destDir, filePrefix, fileSuffix, compress, partNum).invoke();
                while ((line = bufferedReader.readLine()) != null) {
                    if (fileSize + line.getBytes().length > desiredFileByteSize) {
                        partStream.close();
                        if (fileSize > 0) {
                            files.add(partStream.getPartFile());
                        }
                        partStream = new PartStream(destDir, filePrefix, fileSuffix, compress, ++partNum).invoke();
                        partStream.getWriter().write(line);
                        fileSize = line.getBytes().length;
                    } else {
                        if (fileSize > 0) {
                            partStream.getWriter().write("\n");
                        }
                        partStream.getWriter().write(line);
                        fileSize += line.getBytes().length;
                    }
                }
                partStream.close();
                if (fileSize > 0) {
                    files.add(partStream.getPartFile());
                }
            }
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
        return files;
    }

    public static OutputStream ensureCompressed(OutputStream outputStream) throws IOException {
        return new GZIPOutputStream(outputStream) {
            {
                def.setLevel(Deflater.BEST_SPEED);
            }
        };
    }

    public static  InputStream ensureDecompressed(InputStream inputStream) throws IOException {
        PushbackInputStream pb = new PushbackInputStream(inputStream, 2);
        byte[] headerBytes = new byte[2];
        int readCount = pb.read(headerBytes);
        if (readCount > 0)
            pb.unread(headerBytes, 0, readCount);

        inputStream = pb;

        if (readCount == 2 && isGzipStream(headerBytes)) {
            inputStream = new GZIPInputStream(pb, 64 * 1024);
        }

        return inputStream;
    }

    public static boolean isGzipStream(byte[] headerBytes) {
        return (headerBytes[1] == -117 && headerBytes[0] == 31);
    }

    public interface CopyStreamCallbackHandler {
        boolean continueProcessing(long bytesCopied);
    }

    private static class PartStream {
        private File destDir;
        private String filePrefix;
        private String fileSuffix;
        private boolean compress;
        private int partNum;
        private File partFile;
        private OutputStream out;
        private BufferedWriter writer;

        public PartStream(File destDir, String filePrefix, String fileSuffix, boolean compress, int partNum) {
            this.destDir = destDir;
            this.filePrefix = filePrefix;
            this.fileSuffix = fileSuffix;
            this.compress = compress;
            this.partNum = partNum;
        }


        public File getPartFile() {
            return partFile;
        }

        public OutputStream getOut() {
            return out;
        }

        public BufferedWriter getWriter() {
            return writer;
        }

        public PartStream invoke() throws IOException {
            partFile = new File(destDir, filePrefix + partNum + fileSuffix + (compress ? ".gz" : ""));
            out = new FileOutputStream(partFile);
            if (compress) {
                out = ensureCompressed(out);
            }
            writer = new BufferedWriter(new OutputStreamWriter(out, "UTF-8"), 64 * 1024);
            return this;
        }

        public void close() {
            try {
                writer.flush();
            } catch (IOException e) {
                // ignore
            }
            IOUtility.closeWriter(writer);
            IOUtility.closeStream(out);
        }
    }

}
