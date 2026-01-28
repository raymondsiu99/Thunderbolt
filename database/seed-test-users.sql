-- Seed Test Users for Local Development
-- All users have password: Password1

-- Clear existing test users (optional - uncomment if needed)
-- DELETE FROM Users WHERE username IN ('admin', 'dispatcher', 'driver', 'orderentry');

-- Insert Test Users
INSERT INTO Users (username, password_hash, role, email)
VALUES 
    ('admin', 'Password1', 'admin', 'admin@thunderbolt.local'),
    ('driver', 'Password1', 'driver', 'driver@thunderbolt.local'),
    ('dispatcher', 'Password1', 'dispatcher', 'dispatcher@thunderbolt.local'),
    ('orderentry', 'Password1', 'customer', 'orderentry@thunderbolt.local');

-- Verify insertion
SELECT id, username, role, email, created_at 
FROM Users 
WHERE username IN ('admin', 'dispatcher', 'driver', 'orderentry');
