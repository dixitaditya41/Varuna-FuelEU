-- FuelEU Maritime Schema

-- 1. Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) UNIQUE NOT NULL,
    vessel_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    ghg_intensity FLOAT NOT NULL,
    fuel_tons FLOAT NOT NULL,
    distance_km FLOAT NOT NULL,
    total_emissions_t FLOAT NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE
);

-- 2. Ship Compliance Balance Table
CREATE TABLE IF NOT EXISTS ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    cb_gco2eq FLOAT NOT NULL,
    UNIQUE (ship_id, year)
);

-- 3. Banking Entries Table
CREATE TABLE IF NOT EXISTS bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    amount_gco2eq FLOAT NOT NULL
);

-- 4. Pools Table
CREATE TABLE IF NOT EXISTS pools (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Pool Members Table
CREATE TABLE IF NOT EXISTS pool_members (
    id SERIAL PRIMARY KEY,
    pool_id INTEGER REFERENCES pools(id),
    ship_id VARCHAR(50) NOT NULL,
    cb_before FLOAT NOT NULL,
    cb_after FLOAT NOT NULL
);
