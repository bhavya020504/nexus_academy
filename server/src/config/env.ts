import dotenv from 'dotenv';

dotenv.config();

console.log("API Key Loaded:", !!process.env.SNAPSERVE_API_KEY);
console.log("Agent ID:", process.env.SNAPSERVE_AGENT_ID);
console.log("Base URL:", process.env.SNAPSERVE_BASE_URL);

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? 'placeholder-secret',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5432/runit',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  snapserveApiKey: process.env.SNAPSERVE_API_KEY ?? '',
  snapserveAgentId: Number(process.env.SNAPSERVE_AGENT_ID ?? 0),
  snapserveBaseUrl: process.env.SNAPSERVE_BASE_URL ?? 'https://app.snapserve.ai/api',
};