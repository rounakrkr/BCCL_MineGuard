-- schema.sql

CREATE DATABASE IF NOT EXISTS mineguard_db;
USE mineguard_db;

-- Table 1: All registered coal mines
CREATE TABLE mines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mine_name VARCHAR(100) NOT NULL,           -- e.g. "Jharia Mine Block A"
  mine_code VARCHAR(20) UNIQUE NOT NULL,      -- e.g. "JH-A"
  location VARCHAR(100),                      -- e.g. "Jharia, Jharkhand"
  latitude DECIMAL(10, 6),                   -- for weather API
  longitude DECIMAL(10, 6),
  depth_meters INT,                           -- approx underground depth
  active_workers INT DEFAULT 0,
  device_id VARCHAR(50),                      -- ESP8266 device identifier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: All sensor readings (time-series data)
CREATE TABLE sensor_readings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  mine_id INT NOT NULL,
  device_id VARCHAR(50),
  methane_ppm DECIMAL(8,2),                  -- MQ-4 reading in PPM
  co_ppm DECIMAL(8,2),                       -- MQ-7 reading in PPM
  smoke_ppm DECIMAL(8,2),                    -- MQ-2 reading in PPM
  temperature_c DECIMAL(5,2),                -- DHT11 temperature
  humidity_percent DECIMAL(5,2),             -- DHT11 humidity
  fire_detected BOOLEAN DEFAULT FALSE,       -- IR Flame Sensor
  status ENUM('SAFE','WARNING','DANGER') DEFAULT 'SAFE',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mine_id) REFERENCES mines(id)
);

-- Table 3: Alert log
CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mine_id INT NOT NULL,
  alert_type VARCHAR(50),                    -- e.g. "HIGH_METHANE", "FIRE_DETECTED"
  sensor_value DECIMAL(8,2),
  threshold_value DECIMAL(8,2),
  severity ENUM('WARNING','DANGER'),
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (mine_id) REFERENCES mines(id)
);

-- Seed data: 5 dummy mines
INSERT INTO mines (mine_name, mine_code, location, latitude, longitude, depth_meters, active_workers, device_id)
VALUES
  ('Jharia Block A', 'JH-A', 'Jharia, Jharkhand', 23.7500, 86.4200, 120, 45, 'ESP_001'),
  ('Kusunda Mine', 'KS-1', 'Kusunda, Dhanbad', 23.7891, 86.4532, 95, 38, 'ESP_002'),
  ('Katras Colliery', 'KT-1', 'Katras, Jharkhand', 23.8012, 86.3890, 140, 52, 'ESP_003'),
  ('Sijua Mine', 'SJ-2', 'Sijua, Jharkhand', 23.7234, 86.4780, 110, 29, 'ESP_004'),
  ('Bhaga Colliery', 'BH-1', 'Bhaga, Dhanbad', 23.8134, 86.4321, 88, 41, 'ESP_005');
