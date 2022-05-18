/* Replace with your SQL commands */
CREATE TABLE admins(
    id SERIAL PRIMARY KEY,
    adminname VARCHAR(255) NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);