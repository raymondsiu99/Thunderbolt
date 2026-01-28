import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { AssetsModule } from './assets/assets.module';
import { IntegrationModule } from './integration/integration.module';
import { AdminModule } from './admin/admin.module';
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
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const isTrusted = config.get<string>('DB_TRUSTED_CONNECTION') === 'true';
                console.log('=== DATABASE CONFIGURATION ===');
                console.log('ENV CHECK:', process.env.DB_TRUSTED_CONNECTION);
                console.log('DB Config:', {
                    host: config.get<string>('DB_HOST'),
                    isTrusted,
                    username: isTrusted ? undefined : (config.get<string>('DB_USER') || 'sa'),
                });
                console.log('===============================');

                return {
                    dialect: 'mssql',
                    host: config.get<string>('DB_HOST') || 'localhost',
                    port: parseInt(config.get<string>('DB_PORT') || '1433'),
                    database: config.get<string>('DB_NAME') || 'ThunderboltDB',
                    dialectOptions: {
                        options: {
                            encrypt: false,
                            trustServerCertificate: true,
                            trustedConnection: isTrusted,
                            instanceName: config.get<string>('DB_INSTANCE'),
                        },
                        authentication: isTrusted ? {
                            type: 'default'
                        } : undefined,
                    },
                    username: isTrusted ? undefined : (config.get<string>('DB_USER') || 'sa'),
                    password: isTrusted ? undefined : (config.get<string>('DB_PASSWORD') || 'Password123!'),
                    autoLoadModels: true,
                    synchronize: false,
                };
            },
        }),
        AuthModule,
        UsersModule,
        JobsModule,
        AssetsModule,
        IntegrationModule,
        AdminModule,
    ],
})
export class AppModule { }
