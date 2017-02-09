import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.NotDirectoryException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SQLBuilder {



    public static void main(String[] args) throws Exception{

        File file = new File("src/main/webapp/home/img/samples");
        System.out.println(getInsertSampleSQL(file));

    }

    public static String getInsertSampleSQL(File dir)
        throws NotDirectoryException {

        Map<String, List<String>> sampleMap = getSampleMap(dir);

        String prefix = "INSERT INTO SAMPLE\nVALUES (\n\tnull,\n";
        String postfix = ");\n";

        StringBuilder sb = new StringBuilder();

        for (Map.Entry<String, List<String>> entry : sampleMap.entrySet()) {

            String projectName = entry.getKey();
            String urlPrefix = "home/img/samples/";

            for (String fileName : entry.getValue()) {

                sb.append(prefix)
                    .append("\t\'").append(urlPrefix).append(projectName)
                    .append("/").append(fileName).append("\',\n")
                    .append("\t'description'").append(",\n")
                    .append("\t\'").append(projectName).append("\'\n")
                    .append(postfix);
            }
        }
        return sb.toString();
    }

    public static Map<String, List<String>> getSampleMap(File dir)
        throws NotDirectoryException {

        File[] files = dir.listFiles();
        String prefix = "home/img/samples/";

        if (files == null)
            throw new NotDirectoryException(dir.toString());

        Map<String, List<String>> sampleMap = new HashMap<>();

        Stream.of(files)
            .filter(File::isDirectory)
            .forEach(file -> {
                List<String> samples = Stream.of(file.list())
                    .filter(s -> s.endsWith(".png") || s.endsWith(".jpg"))
                    .collect(Collectors.toList());
                sampleMap.put(file.getName(), samples);
            });
        return sampleMap;
    }
}
