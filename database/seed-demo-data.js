/**
 * Seed Demo Data for Thunderbolt Trucking
 * Usage: node database/seed-demo-data.js
 * 
 * Creates:
 * - Fleet of vehicles (Assets) - dump trucks, water trucks, float, hydroseeder, sweeper
 * - Demo jobs/orders with various statuses and locations
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

// Fleet Assets - Based on Thunderbolt Trucking services
const fleetAssets = [
    // Tri-Axel Dump Trucks (Primary service)
    { name: 'TB-101 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB101', availability: true },
    { name: 'TB-102 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB102', availability: true },
    { name: 'TB-103 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB103', availability: true },
    { name: 'TB-104 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB104', availability: true },
    { name: 'TB-105 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB105', availability: false }, // In maintenance
    { name: 'TB-106 Tri-Axel', type: 'dump_truck', geotab_id: 'GEOTAB_TB106', availability: true },
    
    // Water Trucks (For dust control, etc.)
    { name: 'TB-201 Water Truck', type: 'water_truck', geotab_id: 'GEOTAB_TB201', availability: true },
    { name: 'TB-202 Water Truck', type: 'water_truck', geotab_id: 'GEOTAB_TB202', availability: true },
    
    // Float Trucks (For equipment hauling)
    { name: 'TB-301 Float', type: 'float', geotab_id: 'GEOTAB_TB301', availability: true },
    { name: 'TB-302 Float', type: 'float', geotab_id: 'GEOTAB_TB302', availability: true },
    
    // Hydroseeder (For erosion control/landscaping)
    { name: 'TB-401 Hydroseeder', type: 'hydroseeder', geotab_id: 'GEOTAB_TB401', availability: true },
    
    // Sweeper (For road cleanup)
    { name: 'TB-501 Street Sweeper', type: 'sweeper', geotab_id: 'GEOTAB_TB501', availability: true }
];

// Demo Jobs - Various statuses around Georgetown/Halton/Guelph area
// Georgetown coords: 43.6467, -79.9333
const demoJobs = [
    {
        status: 'complete',
        truck_type: 'dump_truck',
        material: 'Topsoil - Triple Mix',
        quantity: 15.5,
        location_lat: 43.6467,
        location_long: -79.9333,
        timing_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        timing_end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
    },
    {
        status: 'complete',
        truck_type: 'dump_truck',
        material: 'Gravel - 3/4" Clear Stone',
        quantity: 18.0,
        location_lat: 43.6550,
        location_long: -79.9200,
        timing_start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        timing_end: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    },
    {
        status: 'complete',
        truck_type: 'dump_truck',
        material: 'Sand - Concrete Sand',
        quantity: 20.0,
        location_lat: 43.5448,
        location_long: -80.2482, // Guelph area
        timing_start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timing_end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000)
    },
    {
        status: 'in_transit',
        truck_type: 'dump_truck',
        material: 'Gravel - Granular A',
        quantity: 17.5,
        location_lat: 43.6389,
        location_long: -79.8711, // Milton area
        timing_start: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        timing_end: null
    },
    {
        status: 'loading',
        truck_type: 'dump_truck',
        material: 'Topsoil - Screened',
        quantity: 16.0,
        location_lat: 43.6500,
        location_long: -79.9400,
        timing_start: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        timing_end: null
    },
    {
        status: 'on_site',
        truck_type: 'dump_truck',
        material: 'Aggregate - Crusher Run',
        quantity: 19.0,
        location_lat: 43.6420,
        location_long: -79.9280,
        timing_start: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
        timing_end: null
    },
    {
        status: 'en_route',
        truck_type: 'dump_truck',
        material: 'Sand - Fill Sand',
        quantity: 18.5,
        location_lat: 43.6330,
        location_long: -79.9100, // Acton area
        timing_start: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
        timing_end: null
    },
    {
        status: 'dispatched',
        truck_type: 'dump_truck',
        material: 'Stone - Armour Stone',
        quantity: 14.0,
        location_lat: 43.6580,
        location_long: -79.9450,
        timing_start: new Date(Date.now() + 30 * 60 * 1000), // In 30 mins
        timing_end: null
    },
    {
        status: 'pending',
        truck_type: 'dump_truck',
        material: 'Gravel - 1.5" Clear Stone',
        quantity: 20.0,
        location_lat: 43.6400,
        location_long: -79.9500,
        timing_start: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
        timing_end: null
    },
    {
        status: 'pending',
        truck_type: 'dump_truck',
        material: 'Topsoil - Garden Mix',
        quantity: 12.5,
        location_lat: 43.5500,
        location_long: -80.2500, // Guelph
        timing_start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        timing_end: null
    },
    // Water Truck Jobs
    {
        status: 'complete',
        truck_type: 'water_truck',
        material: 'Water - Dust Control',
        quantity: 5000, // Liters
        location_lat: 43.6467,
        location_long: -79.9333,
        timing_start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timing_end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
    },
    {
        status: 'dispatched',
        truck_type: 'water_truck',
        material: 'Water - Site Preparation',
        quantity: 6000,
        location_lat: 43.6389,
        location_long: -79.8711,
        timing_start: new Date(Date.now() + 1 * 60 * 60 * 1000), // In 1 hour
        timing_end: null
    },
    // Float Truck Job
    {
        status: 'pending',
        truck_type: 'float',
        material: 'Equipment Transport - Excavator',
        quantity: 1,
        location_lat: 43.6467,
        location_long: -79.9333,
        timing_start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        timing_end: null
    },
    // Hydroseeder Job
    {
        status: 'pending',
        truck_type: 'hydroseeder',
        material: 'Hydroseed - Erosion Control Mix',
        quantity: 2000, // Square feet
        location_lat: 43.5448,
        location_long: -80.2482,
        timing_start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        timing_end: null
    }
];

async function seedDemoData() {
    let pool;
    try {
        console.log('🚛 Thunderbolt Trucking - Demo Data Seeding');
        console.log('='.repeat(50));
        console.log('Connecting to database...\n');
        
        pool = await sql.connect(config);
        
        // Get user IDs for job assignment
        const usersResult = await pool.request().query(`
            SELECT id, username, role FROM Users 
            WHERE username IN ('driver', 'dispatcher', 'admin')
        `);
        
        const driverUser = usersResult.recordset.find(u => u.username === 'driver');
        const dispatcherUser = usersResult.recordset.find(u => u.username === 'dispatcher');
        
        if (!driverUser || !dispatcherUser) {
            console.error('❌ Error: Driver or Dispatcher user not found. Please run seed-test-users.js first.');
            process.exit(1);
        }
        
        // Seed Fleet Assets
        console.log('🚛 Seeding Fleet Assets...');
        for (const asset of fleetAssets) {
            try {
                await pool.request()
                    .input('name', sql.NVarChar(100), asset.name)
                    .input('type', sql.NVarChar(20), asset.type)
                    .input('geotab_id', sql.NVarChar(50), asset.geotab_id)
                    .input('availability', sql.Bit, asset.availability)
                    .query(`
                        IF NOT EXISTS (SELECT 1 FROM Assets WHERE name = @name)
                        BEGIN
                            INSERT INTO Assets (name, type, geotab_id, availability)
                            VALUES (@name, @type, @geotab_id, @availability)
                        END
                        ELSE
                        BEGIN
                            UPDATE Assets 
                            SET type = @type, geotab_id = @geotab_id, availability = @availability
                            WHERE name = @name
                        END
                    `);
                
                const statusIcon = asset.availability ? '✓' : '🔧';
                console.log(`  ${statusIcon} ${asset.name} (${asset.type})`);
            } catch (err) {
                console.error(`  ✗ Failed to seed asset ${asset.name}:`, err.message);
            }
        }
        
        // Seed Demo Jobs
        console.log('\n📋 Seeding Demo Jobs...');
        for (let i = 0; i < demoJobs.length; i++) {
            const job = demoJobs[i];
            try {
                const driverId = ['dispatched', 'en_route', 'on_site', 'loading', 'in_transit', 'dumping', 'complete'].includes(job.status) 
                    ? driverUser.id 
                    : null;
                const approverId = job.status === 'complete' ? dispatcherUser.id : null;
                
                await pool.request()
                    .input('status', sql.NVarChar(20), job.status)
                    .input('truck_type', sql.NVarChar(20), job.truck_type)
                    .input('material', sql.NVarChar(100), job.material)
                    .input('quantity', sql.Float, job.quantity)
                    .input('location_lat', sql.Float, job.location_lat)
                    .input('location_long', sql.Float, job.location_long)
                    .input('timing_start', sql.DateTime2, job.timing_start)
                    .input('timing_end', sql.DateTime2, job.timing_end)
                    .input('driver_id', sql.Int, driverId)
                    .input('approver_id', sql.Int, approverId)
                    .query(`
                        INSERT INTO Jobs (status, truck_type, material, quantity, location_lat, location_long, 
                                         timing_start, timing_end, driver_id, approver_id)
                        VALUES (@status, @truck_type, @material, @quantity, @location_lat, @location_long,
                                @timing_start, @timing_end, @driver_id, @approver_id)
                    `);
                
                const statusEmoji = {
                    'pending': '⏳',
                    'dispatched': '📤',
                    'en_route': '🚚',
                    'on_site': '📍',
                    'loading': '⬆️',
                    'in_transit': '🚛',
                    'dumping': '⬇️',
                    'complete': '✅',
                    'cancelled': '❌'
                };
                
                console.log(`  ${statusEmoji[job.status]} Job #${i + 1}: ${job.material} (${job.quantity} ${job.truck_type === 'dump_truck' ? 'tons' : 'units'}) - ${job.status}`);
            } catch (err) {
                console.error(`  ✗ Failed to seed job #${i + 1}:`, err.message);
            }
        }
        
        // Display Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 Summary Report');
        console.log('='.repeat(50));
        
        const assetsSummary = await pool.request().query(`
            SELECT type, COUNT(*) as count, 
                   SUM(CASE WHEN availability = 1 THEN 1 ELSE 0 END) as available
            FROM Assets
            GROUP BY type
            ORDER BY type
        `);
        
        console.log('\n🚛 Fleet Assets:');
        console.table(assetsSummary.recordset);
        
        const jobsSummary = await pool.request().query(`
            SELECT status, COUNT(*) as count
            FROM Jobs
            GROUP BY status
            ORDER BY 
                CASE status
                    WHEN 'pending' THEN 1
                    WHEN 'dispatched' THEN 2
                    WHEN 'en_route' THEN 3
                    WHEN 'on_site' THEN 4
                    WHEN 'loading' THEN 5
                    WHEN 'in_transit' THEN 6
                    WHEN 'dumping' THEN 7
                    WHEN 'complete' THEN 8
                    ELSE 9
                END
        `);
        
        console.log('\n📋 Jobs by Status:');
        console.table(jobsSummary.recordset);
        
        console.log('\n✅ Demo data seeding complete!');
        console.log('\n💡 Quick Stats:');
        console.log(`   • ${fleetAssets.length} fleet vehicles loaded`);
        console.log(`   • ${demoJobs.length} demo jobs created`);
        console.log('   • Ready for dispatch testing!\n');
        
    } catch (err) {
        console.error('\n❌ Error seeding demo data:', err.message);
        console.error(err);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

seedDemoData();
