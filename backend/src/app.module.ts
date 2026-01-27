import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { AssetsModule } from './assets/assets.module';
import { IntegrationModule } from './integration/integration.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'client'),
            exclude: ['/api/(.*)'],
        }),
        SequelizeModule.forRoot({
            dialect: 'mssql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '1433'),
            username: process.env.DB_USER || 'sa',
            password: process.env.DB_PASSWORD || 'Password123!',
            database: process.env.DB_NAME || 'ThunderboltDB',
            autoLoadModels: true,
            synchronize: false, // We use migrations
        }),
        AuthModule,
        UsersModule,
        JobsModule,
        AssetsModule,
        IntegrationModule,
    ],
})
export class AppModule { }
