import * as fs from 'fs';
import * as path from 'path';

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'env-validation.log');

const env = {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: !!process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
};

const checks: Record<string, boolean> = {
    NODE_ENV: env.NODE_ENV === 'development',
    JWT_SECRET: env.JWT_SECRET === true,
    FRONTEND_URL: typeof env.FRONTEND_URL === 'string' && env.FRONTEND_URL.startsWith('https://'),
    DATABASE_URL: env.DATABASE_URL === true,
};

const failedVars = Object.keys(checks).filter((key) => !checks[key]);

if (failedVars.length > 0) {
    const errorMessage = `Failed validation for: ${failedVars.join(', ')}. Context: ${process.env.NODE_ENV || 'unknown'}`;
    const logMessage = `[${new Date().toISOString()}] ERROR: ${errorMessage}\n`;

    fs.appendFileSync(logFile, logMessage);
    console.error(`❌ ${failedVars[0]} not found in environment context` + (failedVars.length > 1 ? ` (and ${failedVars.length - 1} others)` : ''));
    process.exit(1);
} else {
    console.log(JSON.stringify(env, null, 2));
}
