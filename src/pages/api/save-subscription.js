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
  if (req.method === 'POST') {
    const { token, subscription, AccountID } = req.body; // เพิ่ม AccountID ใน body

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }
    if (!AccountID) {
      return res.status(400).json({ error: 'Missing AccountID' });
    }

    try {
      // Verify the JWT token
      await verify(token, envConfig.secret);

      // Update the subscription in the database
      const result = await updateSubscription(AccountID, subscription);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function updateSubscription(accountId, subscription) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    const sql = `
      UPDATE tbaccount 
      SET subscription = ? 
      WHERE AccountID = ?
    `;
    const [result] = await connection.execute(sql, [JSON.stringify(subscription), accountId]);
    
    return result;
  } catch (error) {
    console.error('Error:', error);

    return { error };
  } finally {
    // Ensure the connection is closed.
    await connection.end();
  }
}
