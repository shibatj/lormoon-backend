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
    const { token, tokens } = req.body // tokens คือ array of tokens ที่ส่งมา

    //console.log(tokens)

    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      // Verify the JWT token
      const decoded = await verify(token, envConfig.secret)

      // Save the tokens to the database
      const result = await saveTokens(tokens)

      return res.status(200).json(result)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}

async function saveTokens(tokens) {
    const connection = await createConnection({
      host: envConfig.db_host,
      user: envConfig.db_username,
      password: envConfig.db_password,
      database: envConfig.db_name
    })
    
    try {
      let results = [];
      for (const token of tokens) {
        // ตรวจสอบก่อนว่า token.code มีอยู่ในฐานข้อมูลแล้วหรือไม่
        const [existing] = await connection.execute(`SELECT GenerateID FROM tbgenerate WHERE GenerateCode = ?`, [token.code]);
        
        if (existing.length === 0) { // ถ้าไม่มี token.code ในฐานข้อมูล, ทำการ insert
          const sql = `INSERT INTO tbgenerate (GenerateCode, GenerateDate, GenerateCost) VALUES (?, NOW(), ?);`
          const [result] = await connection.execute(sql, [token.code, token.cost]);
          results.push(result);
        } else {
          // ถ้ามี token.code อยู่แล้ว, ข้ามไปยัง token ถัดไป
          console.log(`Token with code ${token.code} already exists, skipping...`);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error:', error);
      
      return [];
    } finally {
      // Ensure the connection is closed.
      await connection.end();
    }
  }
  