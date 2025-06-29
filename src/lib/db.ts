import { neon } from '@neondatabase/serverless';

// const sql = neon(process.env.DATABASE_URL);
const sql = neon('postgresql://neondb_owner:npg_cBeqg8uZd1wL@ep-lingering-hill-a1o2e7qc-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require');

export { sql };