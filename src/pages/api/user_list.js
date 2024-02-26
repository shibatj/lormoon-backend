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
    const { token ,filters} = req.body

    //console.log('user_list incoming', token, filters)
    
    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret) // เปลี่ยน 'your-secret-key' เป็นคีย์ลับของคุณ

      const data = await retrieve_data(filters)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}

async function retrieve_data(filters) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  })

  try
  {

      let sql=''
      let params=[]

      sql=`
      SELECT  A.UserID as id,A.UserID,A.Username,A.DepartmentID,B.DepartmentName,A.FullName,A.Province
      ,A.Role,A.CreateDT,A.UpdateDT 
      FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID
      WHERE 1=1
        `

      if (filters.Username!='')
      {
        sql=sql+' AND A.Username LIKE ?'
        params.push('%'+filters.Username+'%')
      }

      if (filters.FullName!='')
      {
        sql=sql+' AND A.FullName LIKE ?'
        params.push('%'+filters.FullName+'%')
      }

      if (filters.DepartmentID!='all')
      {
        sql=sql+' AND A.DepartmentID = ?'
        params.push(filters.DepartmentID)
      }

      if (filters.Role!='all')
      {
        sql=sql+' AND A.Role = ?'
        params.push(filters.Role)
      }

      //console.log(sql,params)

      try {
        const [rows] = await connection.execute(sql, params);
        
        //console.log(rows)

        return rows
      } catch (error) {
        console.error(error);
      }

    return rows
  }
  finally {
    // Ensure the connection is closed.
    await connection.end();
  }

  return []
}
