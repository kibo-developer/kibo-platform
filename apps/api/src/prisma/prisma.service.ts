import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        await this.connectWithRetry();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    private async connectWithRetry(retries = 5, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.$connect();
                this.logger.log('Successfully connected to database');
                return;
            } catch (error) {
                this.logger.error(`Failed to connect to database (attempt ${i + 1}/${retries}): ${error.message}`);
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
}
