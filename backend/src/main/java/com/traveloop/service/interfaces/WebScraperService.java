package com.traveloop.service.interfaces;

import java.util.Map;

public interface WebScraperService {
    /**
     * Scrape Wikivoyage for a destination's travel guide.
     * Returns a map containing sections like 'Understand', 'Get in', 'Get around', 'See', 'Do', 'Buy', 'Eat', 'Drink', 'Sleep'.
     *
     * @param cityName Name of the city
     * @return Map of section title to HTML/Markdown content
     */
    Map<String, String> scrapeDestinationGuide(String cityName);
}
