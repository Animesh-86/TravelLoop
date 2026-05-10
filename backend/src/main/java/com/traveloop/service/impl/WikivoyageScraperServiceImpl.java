package com.traveloop.service.impl;

import com.traveloop.service.interfaces.WebScraperService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WikivoyageScraperServiceImpl implements WebScraperService {

    private static final Logger log = LoggerFactory.getLogger(WikivoyageScraperServiceImpl.class);
    private static final String WIKIVOYAGE_URL = "https://en.wikivoyage.org/wiki/";
    
    private static final List<String> TARGET_SECTIONS = List.of(
            "Understand", "Get in", "Get around", "See", "Do", "Buy", "Eat", "Drink", "Sleep", "Stay safe"
    );

    @Override
    public Map<String, String> scrapeDestinationGuide(String cityName) {
        Map<String, String> guideData = new LinkedHashMap<>();
        
        // Format city name for Wikipedia (e.g. "New York" -> "New_York")
        String formattedName = cityName.trim().replace(" ", "_");
        String url = WIKIVOYAGE_URL + formattedName;
        
        try {
            Document doc = Jsoup.connect(url).userAgent("TravelLoopApp/1.0").get();
            
            // Wikivoyage often has multiple .mw-parser-output divs (e.g., in warning banners).
            // Find the one with the most text/content, which is the actual article body.
            Element content = null;
            Elements outputs = doc.select(".mw-parser-output");
            for (Element el : outputs) {
                if (content == null || el.html().length() > content.html().length()) {
                    content = el;
                }
            }
            
            if (content == null) {
                log.warn("No content found for city: {}", cityName);
                return guideData;
            }

            // Extract the summary (paragraphs before the first TOC or h2)
            StringBuilder summary = new StringBuilder();
            Elements allChildren = content.children();
            for (Element child : allChildren) {
                if (child.tagName().matches("h2|h3|h4|div") && child.hasClass("toc")) {
                    break; // Stop at table of contents or first heading
                }
                if (child.tagName().equals("p")) {
                    summary.append(child.text()).append("\n\n");
                }
            }
            if (!summary.isEmpty()) {
                guideData.put("Summary", summary.toString().trim());
            }

            // Extract sections
            Elements headings = content.select("h2");
            for (Element heading : headings) {
                String sectionTitle = heading.text().replace("[edit]", "").trim();
                
                if (TARGET_SECTIONS.stream().anyMatch(sectionTitle::equalsIgnoreCase)) {
                    StringBuilder sectionContent = new StringBuilder();
                    
                    // The h2 is inside a div.mw-heading which is inside a <section>
                    Element sectionWrapper = heading.parent() != null && heading.parent().hasClass("mw-heading") 
                            ? heading.parent().parent() : heading.parent();
                            
                    if (sectionWrapper != null && sectionWrapper.tagName().equals("section")) {
                        // Grab all text content inside the section, but let's structure it simply
                        // Select paragraphs, lists, and subheadings directly within the section's tree
                        Elements elements = sectionWrapper.select("p, ul, h3, .mw-heading3");
                        for (Element el : elements) {
                            if (el.tagName().equals("p") || el.tagName().equals("ul")) {
                                sectionContent.append(el.text()).append("\n\n");
                            } else if (el.tagName().equals("h3") || el.hasClass("mw-heading3")) {
                                sectionContent.append("### ").append(el.text().replace("[edit]", "")).append("\n");
                            }
                        }
                    } else {
                        // Fallback to old sibling iteration if not in <section>
                        Element nextSibling = (heading.parent() != null && heading.parent().hasClass("mw-heading")) 
                                ? heading.parent().nextElementSibling() : heading.nextElementSibling();
                        
                        while (nextSibling != null && !nextSibling.tagName().equals("h2") && !nextSibling.hasClass("mw-heading")) {
                            if (nextSibling.tagName().equals("p") || nextSibling.tagName().equals("ul")) {
                                sectionContent.append(nextSibling.text()).append("\n\n");
                            } else if (nextSibling.tagName().equals("h3") || nextSibling.hasClass("mw-heading3")) {
                                sectionContent.append("### ").append(nextSibling.text().replace("[edit]", "")).append("\n");
                            }
                            nextSibling = nextSibling.nextElementSibling();
                        }
                    }
                    
                    if (!sectionContent.isEmpty()) {
                        guideData.put(sectionTitle, sectionContent.toString().trim());
                    }
                }
            }
            
            log.info("Successfully scraped Wikivoyage for {}", cityName);
            
        } catch (IOException e) {
            log.error("Failed to scrape Wikivoyage for {}: {}", cityName, e.getMessage());
            guideData.put("Error", "Could not fetch guide data at this time.");
        }
        
        return guideData;
    }
}
