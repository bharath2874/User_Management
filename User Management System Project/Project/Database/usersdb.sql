-- Step 1: Database create
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

-- Step 2: Drop table if already exists
DROP TABLE IF EXISTS data;

-- Step 3: Create table
CREATE TABLE data (
    id INT NOT NULL,
    uname CHAR(20) NOT NULL,
    pwd CHAR(20) NOT NULL,
    gender CHAR(10) NOT NULL,
    role CHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

-- Step 4: Insert data
INSERT INTO data (id, uname, pwd, gender, role) VALUES
(111, 'Arun', 'Arun@123', 'Male', 'Fresher'),
(112, 'dowell', 'dowell@123', 'Female', 'Manager'),
(113, 'Kumari', 'Kumari@123', 'Female', 'Manager');
