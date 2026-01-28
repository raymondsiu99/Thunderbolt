# Azure Deployment Guide - Thunderbolt Dispatch

This document provides comprehensive instructions for deploying Thunderbolt Dispatch to Microsoft Azure.

## Overview of Changes

The application has been prepared for Azure deployment with the following key updates:

1. **Database Schema Migration**: Changed from `dbo` schema to `tbs` schema
2. **CI/CD Pipeline**: Updated to include automated database deployment
3. **Backend Models**: Updated all Sequelize models to use the `tbs` schema

## Prerequisites

Before deploying to Azure, ensure you have:

- Azure subscription with active credits
- Azure CLI installed (optional, for manual configuration)
- GitHub repository connected to the project
- Azure Web App resource created
- Azure SQL Database created

## Azure Resources Required

### 1. Azure SQL Database
- **Service**: Azure SQL Database
- **Tier**: Basic or Standard (depending on workload)
- **Schema**: `tbs` (Thunderbolt Schema)
- **Firewall Rules**: Configure to allow Azure services and your IP

### 2. Azure Web App
- **Service**: Azure App Service
- **Runtime**: Node.js 18.x
- **Plan**: B1 or higher recommended
- **OS**: Linux or Windows

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

### Required Secrets

1. **AZURE_WEBAPP_PUBLISH_PROFILE**
   - Download from Azure Portal: Web App > Get publish profile
   - Copy the entire XML content

2. **AZURE_SQL_CONNECTION_STRING**
   - Format: `Server=tcp:your-server.database.windows.net,1433;Initial Catalog=your-database;User ID=your-username;Password=your-password;Encrypt=true;Connection Timeout=30;`
   - Get from: Azure SQL Database > Connection strings

## Database Schema Changes

### Schema Prefix: dbo → tbs

All database tables now use the `tbs` schema prefix:

- `tbs.Users`
- `tbs.Assets`
- `tbs.Jobs`
- `tbs.Audits`

### Files Updated

1. **database/schema.sql**
   - Added schema creation: `CREATE SCHEMA tbs`
   - Updated all table definitions to use `tbs` prefix
   - Updated foreign key references

2. **database/migrations/20231027000000-initial-schema.js**
   - Added schema creation in migration
   - Updated Sequelize migration to specify `schema: 'tbs'`

3. **Backend Models** (All updated with `schema: 'tbs'`):
   - `backend/src/users/user.model.ts`
   - `backend/src/jobs/job.model.ts`
   - `backend/src/assets/asset.model.ts`
   - `backend/src/admin/audit.model.ts`

## CI/CD Pipeline

The deployment pipeline (`ci-cd/deploy.yml`) now includes:

### Pipeline Steps

1. **Build Frontend** (React Native Web)
   - Install dependencies
   - Export web build using Expo

2. **Build Backend** (NestJS)
   - Install dependencies
   - Compile TypeScript

3. **Bundle Application**
   - Copy frontend build into backend public folder

4. **Deploy Database** (NEW)
   - Uses `azure/sql-action@v2.2`
   - Automatically runs `database/schema.sql`
   - Creates `tbs` schema if not exists
   - Creates/updates all tables

5. **Deploy Application**
   - Deploys backend (with bundled frontend) to Azure Web App

### Deployment Workflow

```yaml
# Deploy Database to Azure SQL
- name: 'Azure SQL Deploy'
  uses: azure/sql-action@v2.2
  with:
    connection-string: ${{ secrets.AZURE_SQL_CONNECTION_STRING }}
    path: './database/schema.sql'

# Deploy to Azure Web App
- name: 'Deploy to Azure Web App'
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ env.AZURE_WEBAPP_NAME }}
    publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
    package: ./backend
```

## Manual Deployment Steps

If you need to deploy manually:

### 1. Deploy Database

```bash
# Connect to Azure SQL
az sql server firewall-rule create --resource-group YOUR_RG --server YOUR_SERVER --name AllowMyIP --start-ip-address YOUR_IP --end-ip-address YOUR_IP

# Run schema script
sqlcmd -S YOUR_SERVER.database.windows.net -d YOUR_DATABASE -U YOUR_USERNAME -P YOUR_PASSWORD -i database/schema.sql
```

### 2. Build and Deploy Application

```bash
# Build frontend
cd frontend
npm ci
npx expo export:web

# Build backend
cd ../backend
npm ci
npm run build

# Bundle frontend into backend
mkdir -p client
cp -r ../frontend/web-build/* client/

# Deploy to Azure (using Azure CLI or FTP)
az webapp deploy --resource-group YOUR_RG --name YOUR_WEBAPP --src-path . --type zip
```

## Environment Variables

Configure the following environment variables in Azure Web App (Configuration > Application settings):

```
NODE_ENV=production
PORT=8080
DATABASE_HOST=your-server.database.windows.net
DATABASE_PORT=1433
DATABASE_NAME=your-database
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_ENCRYPT=true
DATABASE_SCHEMA=tbs
JWT_SECRET=your-jwt-secret
GEOTAB_DATABASE=your-geotab-database
GEOTAB_USERNAME=your-geotab-username
GEOTAB_PASSWORD=your-geotab-password
```

## Backend Configuration Update

Ensure your backend Sequelize configuration (`app.module.ts`) includes the schema setting:

```typescript
SequelizeModule.forRoot({
  dialect: 'mssql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  schema: 'tbs', // Important: Use tbs schema
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  },
  models: [User, Job, Asset, Audit],
  autoLoadModels: true,
  synchronize: false // Use migrations instead
})
```

## Verification Steps

After deployment, verify:

1. **Database Schema**
   ```sql
   -- Check schema exists
   SELECT * FROM sys.schemas WHERE name = 'tbs'
   
   -- Check tables exist
   SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'tbs'
   ```

2. **Application Health**
   - Navigate to: `https://your-app.azurewebsites.net`
   - Check API endpoints: `https://your-app.azurewebsites.net/api/health`

3. **Database Connectivity**
   - Test login functionality
   - Verify data operations (create/read/update/delete)

## Troubleshooting

### Common Issues

1. **Database Connection Fails**
   - Verify Azure SQL firewall rules allow Azure services
   - Check connection string format and credentials
   - Ensure DATABASE_ENCRYPT=true in environment variables

2. **Schema Not Found**
   - Verify schema creation ran successfully
   - Check database permissions for schema creation
   - Run schema.sql manually if needed

3. **Deployment Fails**
   - Check GitHub Actions logs for detailed errors
   - Verify all secrets are configured correctly
   - Ensure Azure resources exist and are accessible

## Monitoring and Logging

- **Application Insights**: Enable for monitoring application performance
- **Log Stream**: View real-time logs in Azure Portal
- **Metrics**: Monitor database DTU usage, response times, and errors

## Rollback Procedures

If deployment fails:

1. **Application Rollback**
   - Use Azure Portal > Deployment Center > Previous deployment

2. **Database Rollback**
   - Maintain database backups before each deployment
   - Use Azure SQL Database point-in-time restore if needed

## Cost Optimization

- Use Azure SQL Database serverless tier for development/staging
- Enable auto-pause for non-production databases
- Scale down App Service plan during off-hours
- Use reserved instances for production workloads

## Security Best Practices

1. **Database**
   - Use Azure AD authentication when possible
   - Implement row-level security (RLS) if needed
   - Enable transparent data encryption (TDE)
   - Regular security audits

2. **Application**
   - Store secrets in Azure Key Vault
   - Enable HTTPS only
   - Implement rate limiting
   - Regular dependency updates

## Next Steps

1. Set up staging environment for testing
2. Configure custom domain and SSL certificate
3. Implement database backup strategy
4. Set up monitoring alerts
5. Configure auto-scaling rules

## Support

For issues or questions:
- Check GitHub Issues
- Review Azure Portal diagnostics
- Consult Azure documentation
