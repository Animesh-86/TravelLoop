-- TravelLoop — Seed Data

-- Cities (50+ with real coordinates and cost indices)
INSERT INTO cities (city_id, city_name, country, region, latitude, longitude, cost_index, popularity_score, description) VALUES
('a1000001-0000-0000-0000-000000000001', 'Paris', 'France', 'Europe', 48.85660000, 2.35220000, 4, 75, 'City of Light — world-class art, cuisine, and romance'),
('a1000001-0000-0000-0000-000000000002', 'Tokyo', 'Japan', 'Asia', 35.68940000, 139.69170000, 4, 72, 'A vibrant blend of ultramodern and traditional culture'),
('a1000001-0000-0000-0000-000000000003', 'New York', 'USA', 'North America', 40.71280000, -74.00600000, 5, 74, 'The city that never sleeps — iconic skyline and Broadway'),
('a1000001-0000-0000-0000-000000000004', 'Bangkok', 'Thailand', 'Asia', 13.75630000, 100.50180000, 2, 68, 'Street food capital with ornate temples and nightlife'),
('a1000001-0000-0000-0000-000000000005', 'London', 'UK', 'Europe', 51.50740000, -0.12780000, 5, 73, 'Historic landmarks, royal palaces, and world-class museums'),
('a1000001-0000-0000-0000-000000000006', 'Dubai', 'UAE', 'Middle East', 25.20480000, 55.27080000, 4, 69, 'Futuristic skyline, luxury shopping, and desert adventures'),
('a1000001-0000-0000-0000-000000000007', 'Rome', 'Italy', 'Europe', 41.90280000, 12.49640000, 3, 70, 'Ancient ruins, Renaissance art, and world-famous pasta'),
('a1000001-0000-0000-0000-000000000008', 'Bali', 'Indonesia', 'Asia', -8.34050000, 115.09200000, 2, 67, 'Tropical paradise with rice terraces and surf beaches'),
('a1000001-0000-0000-0000-000000000009', 'Barcelona', 'Spain', 'Europe', 41.38510000, 2.17340000, 3, 66, 'Gaudi architecture, beaches, and vibrant nightlife'),
('a1000001-0000-0000-0000-000000000010', 'Istanbul', 'Turkey', 'Europe', 41.00820000, 28.97840000, 2, 64, 'Where East meets West — bazaars, mosques, and history'),
('a1000001-0000-0000-0000-000000000011', 'Sydney', 'Australia', 'Oceania', -33.86880000, 151.20930000, 4, 65, 'Harbour Bridge, Opera House, and stunning beaches'),
('a1000001-0000-0000-0000-000000000012', 'Cape Town', 'South Africa', 'Africa', -33.92490000, 18.42410000, 2, 60, 'Table Mountain, vineyards, and diverse wildlife'),
('a1000001-0000-0000-0000-000000000013', 'Amsterdam', 'Netherlands', 'Europe', 52.36760000, 4.90420000, 4, 63, 'Canals, cycling culture, and world-class museums'),
('a1000001-0000-0000-0000-000000000014', 'Singapore', 'Singapore', 'Asia', 1.35210000, 103.81980000, 4, 66, 'Garden city with futuristic architecture and hawker food'),
('a1000001-0000-0000-0000-000000000015', 'Lisbon', 'Portugal', 'Europe', 38.72230000, -9.13930000, 2, 62, 'Pastel-colored hills, tram rides, and fresh seafood'),
('a1000001-0000-0000-0000-000000000016', 'Delhi', 'India', 'Asia', 28.70410000, 77.10250000, 1, 98, 'Historic monuments, street food, and vibrant bazaars'),
('a1000001-0000-0000-0000-000000000017', 'Mumbai', 'India', 'Asia', 19.07600000, 72.87770000, 2, 97, 'Bollywood, marine drive, and the gateway of India'),
('a1000001-0000-0000-0000-000000000018', 'Jaipur', 'India', 'Asia', 26.91240000, 75.78730000, 1, 96, 'The Pink City — forts, palaces, and colorful markets'),
('a1000001-0000-0000-0000-000000000019', 'Goa', 'India', 'Asia', 15.29930000, 74.12400000, 1, 99, 'Sun-kissed beaches, Portuguese heritage, and nightlife'),
('a1000001-0000-0000-0000-000000000020', 'Varanasi', 'India', 'Asia', 25.31760000, 83.01400000, 1, 90, 'Spiritual capital of India — ghats and ancient temples'),
('a1000001-0000-0000-0000-000000000021', 'Udaipur', 'India', 'Asia', 24.58540000, 73.71250000, 1, 95, 'City of Lakes — romantic palaces and boat rides'),
('a1000001-0000-0000-0000-000000000022', 'Manali', 'India', 'Asia', 32.23960000, 77.18870000, 1, 94, 'Mountain town with adventure sports and snow valleys'),
('a1000001-0000-0000-0000-000000000023', 'Rishikesh', 'India', 'Asia', 30.08690000, 78.26760000, 1, 92, 'Yoga capital with river rafting and ashrams'),
('a1000001-0000-0000-0000-000000000024', 'Prague', 'Czech Republic', 'Europe', 50.07550000, 14.43780000, 2, 63, 'Gothic spires, cobblestone lanes, and craft beer'),
('a1000001-0000-0000-0000-000000000025', 'Kyoto', 'Japan', 'Asia', 35.01160000, 135.76810000, 3, 64, 'Traditional temples, bamboo forests, and geisha culture'),
('a1000001-0000-0000-0000-000000000026', 'Marrakech', 'Morocco', 'Africa', 31.62950000, -7.98110000, 2, 69, 'Colorful souks, riads, and Sahara gateway'),
('a1000001-0000-0000-0000-000000000027', 'Seoul', 'South Korea', 'Asia', 37.56650000, 126.97800000, 3, 75, 'K-pop culture, palaces, and street food paradise'),
('a1000001-0000-0000-0000-000000000028', 'Vienna', 'Austria', 'Europe', 48.20820000, 16.37380000, 3, 61, 'Imperial palaces, classical music, and Viennese coffee'),
('a1000001-0000-0000-0000-000000000029', 'Hanoi', 'Vietnam', 'Asia', 21.02780000, 105.83420000, 1, 70, 'Old quarter charm, pho, and motorbike madness'),
('a1000001-0000-0000-0000-000000000030', 'Cairo', 'Egypt', 'Africa', 30.04440000, 31.23570000, 1, 72, 'Pyramids, Sphinx, and ancient Egyptian history'),
('a1000001-0000-0000-0000-000000000031', 'Mexico City', 'Mexico', 'North America', 19.43260000, -99.13320000, 2, 81, 'Aztec ruins, vibrant art scene, and tacos al pastor'),
('a1000001-0000-0000-0000-000000000032', 'Buenos Aires', 'Argentina', 'South America', -34.60370000, -58.38160000, 2, 79, 'Tango, steak houses, and colorful La Boca'),
('a1000001-0000-0000-0000-000000000033', 'Santorini', 'Greece', 'Europe', 36.39320000, 25.46150000, 4, 88, 'White-washed cliffs, sunsets, and volcanic beaches'),
('a1000001-0000-0000-0000-000000000034', 'Cusco', 'Peru', 'South America', -13.53190000, -71.96740000, 1, 83, 'Gateway to Machu Picchu and Incan heritage'),
('a1000001-0000-0000-0000-000000000035', 'Reykjavik', 'Iceland', 'Europe', 64.14660000, -21.94260000, 5, 78, 'Northern lights, geysers, and volcanic landscapes'),
('a1000001-0000-0000-0000-000000000036', 'Zurich', 'Switzerland', 'Europe', 47.37690000, 8.54170000, 5, 77, 'Alpine views, chocolate, and pristine lakeside living'),
('a1000001-0000-0000-0000-000000000037', 'Phuket', 'Thailand', 'Asia', 7.88040000, 98.39230000, 2, 84, 'Island beaches, diving, and Thai cuisine'),
('a1000001-0000-0000-0000-000000000038', 'Colombo', 'Sri Lanka', 'Asia', 6.92710000, 79.86120000, 1, 74, 'Colonial heritage, spice gardens, and coastal temples'),
('a1000001-0000-0000-0000-000000000039', 'Kathmandu', 'Nepal', 'Asia', 27.71720000, 85.32400000, 1, 76, 'Himalayan gateway, stupas, and trekking base'),
('a1000001-0000-0000-0000-000000000040', 'Leh', 'India', 'Asia', 34.15260000, 77.57700000, 2, 83, 'High-altitude desert, monasteries, and Pangong Lake'),
('a1000001-0000-0000-0000-000000000041', 'Kochi', 'India', 'Asia', 9.93120000, 76.26730000, 1, 75, 'Backwaters, spice markets, and Chinese fishing nets'),
('a1000001-0000-0000-0000-000000000042', 'Amritsar', 'India', 'Asia', 31.63400000, 74.87230000, 1, 78, 'Golden Temple, Wagah border, and Punjabi cuisine'),
('a1000001-0000-0000-0000-000000000043', 'Shimla', 'India', 'Asia', 31.10480000, 77.17340000, 1, 79, 'Colonial hill station with toy train and mountain views'),
('a1000001-0000-0000-0000-000000000044', 'Agra', 'India', 'Asia', 27.17670000, 78.00810000, 1, 88, 'Home of the Taj Mahal and Mughal architecture'),
('a1000001-0000-0000-0000-000000000045', 'Bangalore', 'India', 'Asia', 12.97160000, 77.59460000, 2, 74, 'Silicon Valley of India with parks and craft beer scene'),
('a1000001-0000-0000-0000-000000000046', 'Maldives', 'Maldives', 'Asia', 3.20280000, 73.22070000, 5, 90, 'Overwater villas, crystal-clear lagoons, and coral reefs'),
('a1000001-0000-0000-0000-000000000047', 'Petra', 'Jordan', 'Middle East', 30.32850000, 35.44440000, 2, 81, 'Rose-red carved city and one of the New Seven Wonders'),
('a1000001-0000-0000-0000-000000000048', 'Havana', 'Cuba', 'Caribbean', 23.11360000, -82.36660000, 1, 77, 'Vintage cars, salsa music, and colonial architecture'),
('a1000001-0000-0000-0000-000000000049', 'Dubrovnik', 'Croatia', 'Europe', 42.65070000, 18.09440000, 3, 82, 'Walled old town, Adriatic coast, and Game of Thrones fame'),
('a1000001-0000-0000-0000-000000000050', 'Chiang Mai', 'Thailand', 'Asia', 18.78830000, 98.98530000, 1, 81, 'Night bazaars, elephant sanctuaries, and temple hopping')
ON CONFLICT (city_id) DO UPDATE SET popularity_score = EXCLUDED.popularity_score;

-- Activities seed data (60+ across popular cities)
INSERT INTO activities (activity_id, city_id, activity_name, description, category, estimated_cost, duration_minutes, rating) VALUES
-- Paris
('b2000001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', 'Eiffel Tower Visit', 'Iconic iron tower with panoramic city views', 'sightseeing', 26.00, 120, 4.70),
('b2000001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', 'Louvre Museum', 'Home to the Mona Lisa and thousands of masterpieces', 'sightseeing', 17.00, 180, 4.80),
('b2000001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 'Seine River Cruise', 'Scenic boat ride past Notre-Dame and bridges', 'sightseeing', 15.00, 90, 4.50),
('b2000001-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000001', 'French Cooking Class', 'Learn to make croissants and classic French dishes', 'food', 85.00, 180, 4.60),
-- Tokyo
('b2000001-0000-0000-0000-000000000005', 'a1000001-0000-0000-0000-000000000002', 'Shibuya Crossing Walk', 'Experience the busiest pedestrian crossing on Earth', 'sightseeing', 0.00, 30, 4.40),
('b2000001-0000-0000-0000-000000000006', 'a1000001-0000-0000-0000-000000000002', 'Tsukiji Fish Market Tour', 'Fresh sushi and street food at the outer market', 'food', 35.00, 120, 4.70),
('b2000001-0000-0000-0000-000000000007', 'a1000001-0000-0000-0000-000000000002', 'Meiji Shrine Visit', 'Serene Shinto shrine surrounded by ancient forest', 'sightseeing', 0.00, 90, 4.60),
('b2000001-0000-0000-0000-000000000008', 'a1000001-0000-0000-0000-000000000002', 'Akihabara Electronics Tour', 'Explore anime, gaming, and tech shops', 'shopping', 50.00, 180, 4.30),
-- Bangkok
('b2000001-0000-0000-0000-000000000009', 'a1000001-0000-0000-0000-000000000004', 'Grand Palace Tour', 'Ornate royal palace complex with Emerald Buddha', 'sightseeing', 15.00, 150, 4.60),
('b2000001-0000-0000-0000-000000000010', 'a1000001-0000-0000-0000-000000000004', 'Floating Market Visit', 'Colorful canal market with local delicacies', 'food', 10.00, 180, 4.40),
('b2000001-0000-0000-0000-000000000011', 'a1000001-0000-0000-0000-000000000004', 'Thai Massage Experience', 'Traditional full-body massage in a local spa', 'wellness', 20.00, 120, 4.70),
-- Bali
('b2000001-0000-0000-0000-000000000012', 'a1000001-0000-0000-0000-000000000008', 'Tegallalang Rice Terraces', 'Stunning UNESCO-listed rice paddies in Ubud', 'sightseeing', 5.00, 120, 4.60),
('b2000001-0000-0000-0000-000000000013', 'a1000001-0000-0000-0000-000000000008', 'Uluwatu Temple Sunset', 'Clifftop temple with traditional Kecak fire dance', 'sightseeing', 8.00, 150, 4.70),
('b2000001-0000-0000-0000-000000000014', 'a1000001-0000-0000-0000-000000000008', 'Surfing Lesson at Kuta', 'Beginner surf class on famous Bali waves', 'adventure', 30.00, 120, 4.40),
-- Delhi
('b2000001-0000-0000-0000-000000000015', 'a1000001-0000-0000-0000-000000000016', 'Red Fort Exploration', 'Mughal-era fort with sound and light show', 'sightseeing', 5.00, 120, 4.30),
('b2000001-0000-0000-0000-000000000016', 'a1000001-0000-0000-0000-000000000016', 'Chandni Chowk Food Walk', 'Street food tour through Old Delhi lanes', 'food', 10.00, 150, 4.70),
('b2000001-0000-0000-0000-000000000017', 'a1000001-0000-0000-0000-000000000016', 'Qutub Minar Visit', 'UNESCO World Heritage minaret from 1193 AD', 'sightseeing', 3.00, 90, 4.50),
-- Jaipur
('b2000001-0000-0000-0000-000000000018', 'a1000001-0000-0000-0000-000000000018', 'Amber Fort Tour', 'Hilltop fortress with mirror-work interiors', 'sightseeing', 7.00, 150, 4.70),
('b2000001-0000-0000-0000-000000000019', 'a1000001-0000-0000-0000-000000000018', 'Hawa Mahal Photography', 'Iconic pink sandstone palace of winds', 'sightseeing', 3.00, 60, 4.50),
('b2000001-0000-0000-0000-000000000020', 'a1000001-0000-0000-0000-000000000018', 'Jaipur Bazaar Shopping', 'Handicrafts, textiles, and gemstones in local markets', 'shopping', 25.00, 180, 4.40),
-- Goa
('b2000001-0000-0000-0000-000000000021', 'a1000001-0000-0000-0000-000000000019', 'Beach Hopping Tour', 'Visit Calangute, Baga, and Anjuna beaches', 'adventure', 15.00, 240, 4.50),
('b2000001-0000-0000-0000-000000000022', 'a1000001-0000-0000-0000-000000000019', 'Dudhsagar Falls Trek', 'Hike to the majestic four-tiered waterfall', 'adventure', 20.00, 300, 4.60),
('b2000001-0000-0000-0000-000000000023', 'a1000001-0000-0000-0000-000000000019', 'Old Goa Church Visit', 'Basilica of Bom Jesus — UNESCO World Heritage', 'sightseeing', 0.00, 90, 4.40),
-- London
('b2000001-0000-0000-0000-000000000024', 'a1000001-0000-0000-0000-000000000005', 'Tower of London', 'Medieval castle housing the Crown Jewels', 'sightseeing', 33.00, 150, 4.60),
('b2000001-0000-0000-0000-000000000025', 'a1000001-0000-0000-0000-000000000005', 'British Museum', 'World-class museum with free entry', 'sightseeing', 0.00, 180, 4.80),
('b2000001-0000-0000-0000-000000000026', 'a1000001-0000-0000-0000-000000000005', 'West End Theatre Show', 'See a world-famous musical in the theatre district', 'entertainment', 65.00, 180, 4.70),
-- Rome
('b2000001-0000-0000-0000-000000000027', 'a1000001-0000-0000-0000-000000000007', 'Colosseum Tour', 'Explore the ancient Roman gladiator arena', 'sightseeing', 18.00, 120, 4.70),
('b2000001-0000-0000-0000-000000000028', 'a1000001-0000-0000-0000-000000000007', 'Vatican Museums', 'Sistine Chapel ceiling and Renaissance masterpieces', 'sightseeing', 17.00, 180, 4.80),
('b2000001-0000-0000-0000-000000000029', 'a1000001-0000-0000-0000-000000000007', 'Trastevere Food Tour', 'Authentic Roman pasta, pizza, and gelato', 'food', 45.00, 150, 4.60),
-- New York
('b2000001-0000-0000-0000-000000000030', 'a1000001-0000-0000-0000-000000000003', 'Statue of Liberty Ferry', 'Ferry to Liberty Island and Ellis Island', 'sightseeing', 24.00, 180, 4.50),
('b2000001-0000-0000-0000-000000000031', 'a1000001-0000-0000-0000-000000000003', 'Central Park Bike Tour', 'Guided cycling tour through iconic park landmarks', 'adventure', 40.00, 120, 4.60),
('b2000001-0000-0000-0000-000000000032', 'a1000001-0000-0000-0000-000000000003', 'Broadway Musical', 'Catch a top-rated show in the theatre district', 'entertainment', 120.00, 180, 4.80),
-- Dubai
('b2000001-0000-0000-0000-000000000033', 'a1000001-0000-0000-0000-000000000006', 'Burj Khalifa Observation', 'View from the top of the tallest building', 'sightseeing', 45.00, 90, 4.60),
('b2000001-0000-0000-0000-000000000034', 'a1000001-0000-0000-0000-000000000006', 'Desert Safari', 'Dune bashing, camel ride, and BBQ dinner', 'adventure', 60.00, 300, 4.70),
('b2000001-0000-0000-0000-000000000035', 'a1000001-0000-0000-0000-000000000006', 'Dubai Mall & Aquarium', 'Shopping and underwater zoo experience', 'shopping', 35.00, 240, 4.50),
-- Barcelona
('b2000001-0000-0000-0000-000000000036', 'a1000001-0000-0000-0000-000000000009', 'Sagrada Familia Tour', 'Gaudi masterpiece basilica with guided visit', 'sightseeing', 26.00, 120, 4.90),
('b2000001-0000-0000-0000-000000000037', 'a1000001-0000-0000-0000-000000000009', 'La Boqueria Market', 'Vibrant food market on La Rambla street', 'food', 20.00, 90, 4.50),
-- Manali
('b2000001-0000-0000-0000-000000000038', 'a1000001-0000-0000-0000-000000000022', 'Solang Valley Paragliding', 'Tandem paragliding with Himalayan views', 'adventure', 25.00, 60, 4.60),
('b2000001-0000-0000-0000-000000000039', 'a1000001-0000-0000-0000-000000000022', 'Rohtang Pass Day Trip', 'Snow-capped mountain pass at 13,000 ft', 'adventure', 30.00, 360, 4.50),
-- Rishikesh
('b2000001-0000-0000-0000-000000000040', 'a1000001-0000-0000-0000-000000000023', 'White Water Rafting', 'Rapids on the Ganges with professional guides', 'adventure', 15.00, 180, 4.70),
('b2000001-0000-0000-0000-000000000041', 'a1000001-0000-0000-0000-000000000023', 'Yoga Retreat Session', 'Traditional yoga and meditation by the river', 'wellness', 10.00, 120, 4.60),
-- Udaipur
('b2000001-0000-0000-0000-000000000042', 'a1000001-0000-0000-0000-000000000021', 'Lake Pichola Boat Ride', 'Sunset boat ride past the Lake Palace', 'sightseeing', 10.00, 60, 4.70),
('b2000001-0000-0000-0000-000000000043', 'a1000001-0000-0000-0000-000000000021', 'City Palace Museum', 'Grand lakeside palace with art and artifact displays', 'sightseeing', 7.00, 120, 4.60),
-- Agra
('b2000001-0000-0000-0000-000000000044', 'a1000001-0000-0000-0000-000000000044', 'Taj Mahal Sunrise Visit', 'Experience the wonder at golden hour', 'sightseeing', 15.00, 150, 4.90),
('b2000001-0000-0000-0000-000000000045', 'a1000001-0000-0000-0000-000000000044', 'Agra Fort Tour', 'Mughal red sandstone fortress on the Yamuna', 'sightseeing', 5.00, 120, 4.50)
ON CONFLICT DO NOTHING;
