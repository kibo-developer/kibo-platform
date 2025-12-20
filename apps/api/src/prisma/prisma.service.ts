import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@kibo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            console.error('Failed to connect to database during startup, but continuing...', error);
        }
    }
}
