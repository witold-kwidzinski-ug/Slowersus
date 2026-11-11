
CREATE DATABASE keycloak_db;
CREATE DATABASE app_db;

CREATE USER keycloak WITH PASSWORD 'keycloak';

GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak;

\connect keycloak_db

ALTER SCHEMA public OWNER TO keycloak;
GRANT ALL ON SCHEMA public TO keycloak;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO keycloak;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO keycloak;


\connect app_db

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(20),
    bio TEXT,
    points REAL,
    wins INT,
    losses INT,
    streak INT
);

CREATE TABLE blacklisted_ids (
    id UUID PRIMARY KEY
);