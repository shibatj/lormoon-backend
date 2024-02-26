import { verify } from 'jsonwebtoken'
import { createConnection } from 'mysql2/promise'

const envConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD
}

export default async function handler(req, res) {
  if (req.method === 'GET') { 
    try {
      const connection = await createConnection({
        host: envConfig.db_host,
        user: envConfig.db_username,
        password: envConfig.db_password,
        database: envConfig.db_name
      });

      let rows = [];

      rows = await connection.execute('SELECT * FROM tbaccount_credit');
      
      // กำหนดค่า 'type' ให้กับทุก row เป็น 'debit'
      // rows.forEach(element => {
      //   element.type = 'debit';
      // });

      console.log(rows);
      
      await connection.end();

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching debit coupons:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}