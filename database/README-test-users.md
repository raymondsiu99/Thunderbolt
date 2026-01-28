# Test Data for Local Development

This directory contains scripts to seed test data (users, fleet assets, and demo jobs) for local development and testing.

## Test Users

The following test users are created with **Password: Password1**

| Username    | Role       | Email                        | Description                    |
|-------------|------------|------------------------------|--------------------------------|
| admin       | admin      | admin@thunderbolt.local      | Full system administrator      |
| driver      | driver     | driver@thunderbolt.local     | Driver role for mobile app     |
| dispatcher  | dispatcher | dispatcher@thunderbolt.local | Dispatcher/manager role        |
| orderentry  | customer   | orderentry@thunderbolt.local | Order entry/customer role      |

## Quick Start

### Seed Everything (Recommended for First Time)

```bash
cd backend
npm install
npm run seed:all
```

This will create:
- 4 test users (admin, driver, dispatcher, orderentry)
- 12 fleet vehicles (dump trucks, water trucks, float, hydroseeder, sweeper)
- 14 demo jobs in various statuses

### Individual Seed Commands

**Seed only test users:**
```bash
npm run seed:users --prefix backend
```

**Seed only demo data (fleet & jobs):**
```bash
npm run seed:demo --prefix backend
```

**Seed everything:**
```bash
npm run seed:all --prefix backend
```

### Direct Node Execution

```bash
node database/seed-test-users.js
node database/seed-demo-data.js
```

### SQL Script (Users Only)

```bash
sqlcmd -S localhost -d ThunderboltDB -U sa -P YourPassword -i database/seed-test-users.sql
```

## Demo Data Included

### Fleet Assets (12 Vehicles)
- **6 Tri-Axel Dump Trucks** (TB-101 to TB-106) - Primary service
- **2 Water Trucks** (TB-201, TB-202) - Dust control & site prep
- **2 Float Trucks** (TB-301, TB-302) - Equipment hauling
- **1 Hydroseeder** (TB-401) - Erosion control
- **1 Street Sweeper** (TB-501) - Road cleanup

All vehicles have Geotab IDs for GPS tracking integration.

### Demo Jobs (14 Orders)
Jobs across different statuses to test the full workflow:
- **3 Complete** jobs (historical data)
- **1 In Transit** job (active)
- **1 Loading** job (active)
- **1 On Site** job (active)
- **1 En Route** job (active)
- **1 Dispatched** job (scheduled soon)
- **3 Pending** jobs (awaiting dispatch)
- Includes dump truck, water truck, float, and hydroseeder jobs
- Real locations around Georgetown/Halton/Guelph, Ontario area
- Realistic materials: topsoil, gravel, sand, water, equipment transport

## Features

- **Idempotent**: Running scripts multiple times is safe - creates or updates data
- **Environment-aware**: Uses database configuration from `backend/.env`
- **Visual feedback**: Color-coded emojis and progress indicators
- **Summary tables**: Shows overview of all seeded data
- **Smart assignments**: Jobs automatically assigned to appropriate users based on status
- **Error handling**: Continues even if individual records fail

## Prerequisites

Make sure your database is running and properly configured in `backend/.env`:

```env
DB_HOST=localhost
DB_NAME=ThunderboltDB
DB_USER=sa
DB_PASSWORD=your_password
```

## Testing the Application

After seeding, you can:

### 1. Test Login
Use any of these credentials:
- Username: `admin`, Password: `Password1`
- Username: `driver`, Password: `Password1`
- Username: `dispatcher`, Password: `Password1`
- Username: `orderentry`, Password: `Password1`

### 2. Explore Fleet Management
- View 12 vehicles across 5 different types
- Check availability status (TB-105 is in maintenance)
- Test Geotab integration with placeholder IDs

### 3. Test Dispatch Workflows
- View jobs in different statuses (pending → complete)
- Active jobs assigned to driver user
- Test job assignment and status updates
- View historical completed jobs
- Map locations around Georgetown, Ontario

### 4. Demo Scenarios
- **Dispatcher View**: See load board with active and pending jobs
- **Driver View**: Jobs assigned to driver in various active states
- **Order Entry**: Create new jobs similar to pending ones
- **Admin View**: Fleet overview and user management

## Sample Data Details

### Materials Available
- **Topsoil**: Triple Mix, Screened, Garden Mix
- **Gravel**: Clear Stone (3/4", 1.5"), Granular A, Crusher Run
- **Sand**: Concrete Sand, Fill Sand
- **Stone**: Armour Stone
- **Water**: Dust Control, Site Preparation
- **Equipment**: Transport services
- **Hydroseed**: Erosion Control Mix

### Geographic Coverage
Jobs are distributed around:
- Georgetown, ON (43.6467, -79.9333)
- Milton, ON (43.6389, -79.8711)
- Guelph, ON (43.5448, -80.2482)
- Acton, ON (43.6330, -79.9100)

## Files in This Directory

- `seed-test-users.js` - Creates 4 test users with different roles
- `seed-test-users.sql` - SQL version of user seeding
- `seed-demo-data.js` - Creates fleet assets and demo jobs
- `README-test-users.md` - This documentation file

## Notes

⚠️ **Security Warning**: These credentials are for LOCAL DEVELOPMENT ONLY. Never use these in production!

The password is stored as plain text (`Password1`) because the current auth implementation uses simple comparison for development. In production, passwords should be hashed with bcrypt.

## Troubleshooting

**Error: Driver or Dispatcher user not found**
- Run `npm run seed:users --prefix backend` first
- The demo data script requires users to exist for job assignments

**Database connection issues**
- Check `backend/.env` for correct database credentials
- Ensure SQL Server is running
- Verify database name is correct (ThunderboltDB)

**Module not found errors**
- Run `npm install --prefix backend` to install dependencies
- Scripts reference node_modules from backend directory
