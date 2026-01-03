const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NODE_ENV'
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    console.error('❌ Missing environment variables:\n', missing.join('\n'));
    process.exit(1);
} else {
    console.log('✅ All required environment variables are set.');
}
