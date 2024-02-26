import { verify } from 'jsonwebtoken'
import { createConnection } from 'mysql2/promise'

const envConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD
}

export default async function handler(req, res) {

  // ตั้งค่า CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // หรือระบุ domain ของเว็บไซต์ของคุณแทน '*'
  res.setHeader('Access-Control-Allow-Credentials', 'true');
    

  //res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  //res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


  if (req.method === 'GET') {


    try {
      const data = await retrieve_data();

      return res.status(200).json(data);
    } catch (error) {
      console.log(error)

      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

async function retrieve_data() {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    let sql = 'SELECT * FROM tbpininfo';

    const [rows] = await connection.execute(sql);
    
    return rows;
  } finally {
    await connection.end();
  }
}
