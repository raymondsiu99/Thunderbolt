/**
 * Seed Test Users for Local Development
 * Usage: node database/seed-test-users.js
 * 
 * Creates 4 test users:
 * - admin (admin role)
 * - driver (driver role)  
 * - dispatcher (dispatcher role)
 * - orderentry (customer role)
 * 
 * All users have password: Password1
 */

const path = require('path');
const sql = require(path.join(__dirname, '../backend/node_modules/mssql'));
require(path.join(__dirname, '../backend/node_modules/dotenv')).config({ path: path.join(__dirname, '../backend/.env') });

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ThunderboltDB',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const testUsers = [
    { username: 'admin', password_hash: 'Password1', role: 'admin', email: 'admin@thunderbolt.local' },
    { username: 'driver', password_hash: 'Password1', role: 'driver', email: 'driver@thunderbolt.local' },
    { username: 'dispatcher', password_hash: 'Password1', role: 'dispatcher', email: 'dispatcher@thunderbolt.local' },
    { username: 'orderentry', password_hash: 'Password1', role: 'customer', email: 'orderentry@thunderbolt.local' }
];

async function seedUsers() {
    let pool;
    try {
        console.log('Connecting to database...');
        pool = await sql.connect(config);
        
        console.log('Seeding test users...');
        
        for (const user of testUsers) {
            try {
                await pool.request()
                    .input('username', sql.NVarChar(50), user.username)
                    .input('password_hash', sql.NVarChar(255), user.password_hash)
                    .input('role', sql.NVarChar(20), user.role)
                    .input('email', sql.NVarChar(100), user.email)
                    .query(`
                        IF NOT EXISTS (SELECT 1 FROM Users WHERE username = @username)
                        BEGIN
                            INSERT INTO Users (username, password_hash, role, email)
                            VALUES (@username, @password_hash, @role, @email)
                            SELECT 'Created' as Status, @username as Username, @role as Role
                        END
                        ELSE
                        BEGIN
                            UPDATE Users 
                            SET password_hash = @password_hash, role = @role, email = @email
                            WHERE username = @username
                            SELECT 'Updated' as Status, @username as Username, @role as Role
                        END
                    `);
                console.log(`✓ ${user.username} (${user.role}) - Ready`);
            } catch (err) {
                console.error(`✗ Failed to seed user ${user.username}:`, err.message);
            }
        }
        
        console.log('\n📋 Test Users Summary:');
        const result = await pool.request().query(`
            SELECT username, role, email 
            FROM Users 
            WHERE username IN ('admin', 'dispatcher', 'driver', 'orderentry')
            ORDER BY role
        `);
        console.table(result.recordset);
        
        console.log('\n✅ Seeding complete!');
        console.log('Login credentials:');
        console.log('  Username: admin, driver, dispatcher, or orderentry');
        console.log('  Password: Password1');
        
    } catch (err) {
        console.error('❌ Error seeding users:', err.message);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

seedUsers();
