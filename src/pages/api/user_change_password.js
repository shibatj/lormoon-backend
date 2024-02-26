import { verify } from 'jsonwebtoken'
import { createConnection } from 'mysql2/promise'
import { compare } from 'bcryptjs'

const bcrypt = require('bcryptjs')

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
  if (req.method === 'POST') {
    const { token, currentPassword, newPassword } = req.body

    console.log('user_change_password incoming', token, currentPassword, newPassword, req.body)

    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret) // เปลี่ยน 'your-secret-key' เป็นคีย์ลับของคุณ
      const userId = decoded.userId
      const data = await update_password(userId, currentPassword, newPassword)

      return res.status(200).json(data)
    } catch (error) {
      console.log(error)

      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}


async function update_password(userId, currentPassword, newPassword) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM tbuser WHERE UserID = ?', [userId]);

    if (rows.length > 0) {
      const user = rows[0];

      if (await compare(currentPassword, user.Password)) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
  
          const updateQuery = 'UPDATE tbuser SET Password=? WHERE UserID = ?';
          await connection.execute(updateQuery, [hashedPassword, userId]);
  
          return { msg: 'Password Updated Successfully.' };
        } catch (error) {
          console.error('Error updating password:', error);
          
          return { msg: 'Inter server error.' };
        }
      } else {
        return { msg: 'Password does not matched.' };
      }
    }
  } finally {
    await connection.end();
  }

  return { msg: 'Invalid User.' };
}
