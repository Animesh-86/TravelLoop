import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.util.*;

public class Scratch {
    public static void main(String[] args) throws Exception {
        Document doc = Jsoup.connect("https://en.wikivoyage.org/wiki/Leh").userAgent("TravelLoopApp/1.0").get();
        Elements contents = doc.select(".mw-parser-output");
        System.out.println("Found " + contents.size() + " .mw-parser-output elements");
        for (Element e : contents) {
            System.out.println("Size: " + e.html().length());
        }
    }
}
