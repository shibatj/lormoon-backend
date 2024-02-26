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

    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret) // เปลี่ยน 'your-secret-key' เป็นคีย์ลับของคุณ

      const data = await retrieve_data(mode, user_data)
      
      //console.log("response data->",data)

      return res.status(200).json(data)
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
  })
  
  try
  {

    let sql="";
    if (mode=='add')
    {

      try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user_data.Password, salt)
        
        const sql = `INSERT INTO tbuser (Username,Password,DepartmentID,FullName,Role,CreateDT,UpdateDT)VALUES(?,?,?,?,?,NOW(),NOW());`
        await connection.execute(sql,[user_data.Username, hashedPassword, user_data.DepartmentID, user_data.FullName, user_data.Role]);
      
        const [rows] = await connection.execute(
          `
          SELECT  A.UserID as id,A.UserID,A.Username,A.DepartmentID,B.DepartmentName,A.FullName
          ,A.Role,A.CreateDT,A.UpdateDT 
          FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID
          WHERE A.Username=?
          `,
          [user_data.Username]
        )
      
        return rows
      } catch (error) {
        console.error('Error in bcrypt:', error)

        return []
      }

    }
    else if (mode=='update')
    {
      if (user_data.Password==null || user_data.Password=='')
      {
        //no update password
        const sql = `
          UPDATE tbuser SET DepartmentID=?, FullName=?, Role=?, UpdateDT=NOW() WHERE Username=?`
        await connection.execute(sql,[user_data.DepartmentID, user_data.FullName, user_data.Role,user_data.Username]);

        const [rows] = await connection.execute(
          `
          SELECT  A.UserID as id,A.UserID,A.Username,A.DepartmentID,B.DepartmentName,A.FullName
          ,A.Role,A.CreateDT,A.UpdateDT 
          FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID
          WHERE A.Username=?
          `,
          [user_data.Username]
        )
      
        return rows

      }
      else{
        //update with password.
        try {
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(user_data.Password, salt)
          
          const sql = `
          UPDATE tbuser SET DepartmentID=?, FullName=?, Role=?, Password=?, UpdateDT=NOW() WHERE Username=?`
          await connection.execute(sql,[user_data.DepartmentID, user_data.FullName, user_data.Role, hashedPassword 
            ,user_data.Username]);
              
          return []
        } catch (error) {
          console.error('Error in bcrypt:', error)
    
          return []
        }
        
        return []
      }
    }
    else if (mode=='delete')
    {
      connection.execute('DELETE  FROM tbuser WHERE Username=?',[user_data.Username]);
      
      return []
    }

  }
  finally {
    // Ensure the connection is closed.
    await connection.end();
  }

}
