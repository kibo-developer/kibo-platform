import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@kibo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect();
        } catch (error) {
            console.error('Failed to connect to database during startup, but continuing...', error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
