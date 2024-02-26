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
  if (req.method === 'POST') {
    const { token } = req.body
    console.log('userprofile incoming', token, req.body)
    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret) // เปลี่ยน 'your-secret-key' เป็นคีย์ลับของคุณ
      const userId = decoded.userId
      const data = await retrieve_data(userId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}

async function retrieve_data(userId) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  })

  try
  {

    const [rows] = await connection.execute(
      `SELECT A.UserID,A.Username,A.FullName,A.DepartmentID , B.DepartmentName, A.CreateDT
    FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID WHERE UserID = ?`,
      [userId]
    )
    if (rows.length > 0) {
      const user = rows[0]

      return user
    }

  }
  finally {
    // Ensure the connection is closed.
    await connection.end();
  }

  return null
}
