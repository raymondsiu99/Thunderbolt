-- Thunderbolt Dispatch OS Schema

-- Create TBS Schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'tbs')
BEGIN
    EXEC('CREATE SCHEMA tbs')
END
GO

-- Users Table
CREATE TABLE tbs.Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('admin', 'dispatcher', 'driver', 'customer')),
    email NVARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Assets Table
CREATE TABLE tbs.Assets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    type NVARCHAR(20) NOT NULL CHECK (type IN ('dump_truck', 'water_truck', 'float', 'hydroseeder', 'sweeper')),
    geotab_id NVARCHAR(50),
    availability BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Jobs Table
CREATE TABLE tbs.Jobs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending', 'dispatched', 'en_route', 'on_site', 'loading', 'in_transit', 'dumping', 'complete', 'cancelled')),
    truck_type NVARCHAR(20) NOT NULL,
    material NVARCHAR(100),
    quantity FLOAT,
    location_lat FLOAT,
    location_long FLOAT,
    timing_start DATETIME2,
    timing_end DATETIME2,
    photos_json NVARCHAR(MAX), -- JSON array of URLs
    signature NVARCHAR(MAX),
    ticket_pdf_url NVARCHAR(255),
    driver_id INT FOREIGN KEY REFERENCES tbs.Users(id),
    approver_id INT FOREIGN KEY REFERENCES tbs.Users(id),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- Audits Table
CREATE TABLE tbs.Audits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    action NVARCHAR(255) NOT NULL,
    user_id INT FOREIGN KEY REFERENCES tbs.Users(id),
    timestamp DATETIME2 DEFAULT SYSUTCDATETIME(),
    details NVARCHAR(MAX)
);

-- Indexes
CREATE INDEX IX_Jobs_Status ON tbs.Jobs(status);
CREATE INDEX IX_Jobs_Driver ON tbs.Jobs(driver_id);
