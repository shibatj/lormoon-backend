import { verify } from 'jsonwebtoken'
import { createConnection } from 'mysql2/promise'

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
    const { token, mode, user_data } = req.body

    //console.log('user_mgmt incoming', token, mode, user_data)

    //console.log('user_mgmt incoming', token, mode, user_data)

    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret) // เปลี่ยน 'your-secret-key' เป็นคีย์ลับของคุณ

      const ret= await retrieve_data(mode, user_data)

      return res.status(200).json(ret)

    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}


async function retrieve_data(mode, user_data) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    if (mode === 'add') {
      // สมมติว่า user_data มีข้อมูลที่จำเป็นทั้งหมด
      const sql = `
        INSERT INTO tbpininfo (UserID, PinName, PinPicture, ContactPerson, ContactTel, Latitude, Longitude, Activity, PlaceAddress, Province, OfficeName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await connection.execute(sql, [
        user_data.UserID, 
        user_data.PinName, 
        '', 
        user_data.ContactPerson, 
        user_data.ContactTel, 
        user_data.Latitude, 
        user_data.Longitude, 
        user_data.Activity,
        user_data.PlaceAddress,
        user_data.Province,
        user_data.OfficeName
      ]);

      // ดึงข้อมูลที่เพิ่มล่าสุด
      const [rows] = await connection.execute(
        'SELECT * FROM tbpininfo WHERE PinID = LAST_INSERT_ID();'
      );
      
      return rows;
    }
    else if (mode === 'update') {
      const sql = `
        UPDATE tbpininfo 
        SET 
          UserID = ?, 
          PinName = ?, 
          PinPicture = ?, 
          ContactPerson = ?, 
          ContactTel = ?, 
          Latitude = ?, 
          Longitude = ?, 
          Activity = ? ,
          PlaceAddress = ?,
          Province = ?,
          OfficeName = ?
        WHERE PinID = ?;
      `;
      await connection.execute(sql, [
        user_data.UserID, 
        user_data.PinName, 
        user_data.PinPicture, 
        user_data.ContactPerson, 
        user_data.ContactTel, 
        user_data.Latitude, 
        user_data.Longitude, 
        user_data.Activity,
        user_data.PlaceAddress,
        user_data.Province,
        user_data.OfficeName,
        user_data.PinID
      ]);
    
      const [updatedRows] = await connection.execute(
        'SELECT * FROM tbpininfo WHERE PinID = ?;',
        [user_data.PinID]
      );
    
      return updatedRows;
    }
    else if (mode === 'delete') {
      const sql = 'DELETE FROM tbpininfo WHERE PinID = ?;';
      await connection.execute(sql, [user_data.PinID]);
    
      return { message: 'Pin deleted successfully' };
    }

    // ... ตัวอย่างสำหรับ mode 'update' และ 'delete' ...

    return null

  } finally {
    await connection.end();
  }
}
