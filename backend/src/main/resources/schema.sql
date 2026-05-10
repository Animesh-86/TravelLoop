-- TravelLoop — Database Schema (PostgreSQL 15)

CREATE TABLE IF NOT EXISTS users (
    user_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    full_name        VARCHAR(100) NOT NULL,
    phone_number     VARCHAR(20),
    city             VARCHAR(100),
    country          VARCHAR(100),
    profile_photo_url VARCHAR(500),
    role             VARCHAR(20) DEFAULT 'USER',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    trip_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    trip_name        VARCHAR(200) NOT NULL,
    description      TEXT,
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    country          VARCHAR(100),
    city             VARCHAR(100),
    cover_photo_url  VARCHAR(500),
    status           VARCHAR(20) DEFAULT 'upcoming',
    is_public        BOOLEAN DEFAULT FALSE,
    share_token      VARCHAR(100) UNIQUE,
    total_budget     DECIMAL(12, 2) DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
    city_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_name        VARCHAR(100) NOT NULL,
    country          VARCHAR(100) NOT NULL,
    region           VARCHAR(100),
    latitude         DECIMAL(10, 8),
    longitude        DECIMAL(11, 8),
    cost_index       INTEGER CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score INTEGER DEFAULT 0,
    description      TEXT,
    image_url        VARCHAR(500),
    metadata         JSONB
);

CREATE TABLE IF NOT EXISTS trip_stops (
    stop_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id          UUID NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    city_id          UUID REFERENCES cities(city_id),
    arrival_date     DATE NOT NULL,
    departure_date   DATE NOT NULL,
    stop_order       INTEGER NOT NULL,
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, stop_order)
);

CREATE TABLE IF NOT EXISTS activities (
    activity_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id          UUID NOT NULL REFERENCES cities(city_id) ON DELETE CASCADE,
    activity_name    VARCHAR(200) NOT NULL,
    description      TEXT,
    category         VARCHAR(50) NOT NULL,
    estimated_cost   DECIMAL(10, 2) DEFAULT 0,
    duration_minutes INTEGER DEFAULT 60,
    image_url        VARCHAR(500),
    rating           DECIMAL(3, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trip_activities (
    trip_activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_id          UUID NOT NULL REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    activity_id      UUID REFERENCES activities(activity_id),
    custom_name      VARCHAR(200),
    scheduled_date   DATE,
    scheduled_time   TIME,
    actual_cost      DECIMAL(10, 2),
    status           VARCHAR(20) DEFAULT 'planned',
    notes            TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budgets (
    budget_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id          UUID NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    category         VARCHAR(50) NOT NULL,
    estimated_amount DECIMAL(10, 2) DEFAULT 0,
    actual_amount    DECIMAL(10, 2) DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packing_items (
    item_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id          UUID NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    item_name        VARCHAR(100) NOT NULL,
    category         VARCHAR(50) DEFAULT 'general',
    is_packed        BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_notes (
    note_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id          UUID NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    stop_id          UUID REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    title            VARCHAR(200),
    note_content     TEXT NOT NULL,
    note_type        VARCHAR(20) DEFAULT 'general',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trip_collaborators (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id          UUID NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    user_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role             VARCHAR(20) DEFAULT 'viewer',
    invited_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, user_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user        ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status      ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_public      ON trips(is_public);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip    ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_city    ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_cat     ON activities(category);
CREATE INDEX IF NOT EXISTS idx_trip_act_stop      ON trip_activities(stop_id);
CREATE INDEX IF NOT EXISTS idx_budgets_trip       ON budgets(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_trip       ON packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_trip         ON trip_notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_collab_trip        ON trip_collaborators(trip_id);
CREATE INDEX IF NOT EXISTS idx_cities_country     ON cities(country);
CREATE INDEX IF NOT EXISTS idx_cities_popularity  ON cities(popularity_score DESC);

CREATE TABLE IF NOT EXISTS community_messages (
    message_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    content          TEXT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
