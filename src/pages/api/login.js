import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'
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
    const { username, password } = req.body

    //console.log(username,password)

    // ตรวจสอบข้อมูลการเข้าสู่ระบบ
    const user = await validateUser(username, password)
    if (user) {
      const accessToken = sign({ userId: user.UserID }, envConfig.secret, {
        expiresIn: '1h'
      })
      let obj = { accessToken, userData: { ...user, Password: undefined } }

      //console.log(obj)
      res.status(200).json(obj)
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

async function validateUser(username, password) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  })
  try
  {
    const [rows] = await connection.execute(`SELECT A.*,B.DepartmentName FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID 
    WHERE A.Username = ?`, [username])

    if (rows.length > 0) {
      const user = rows[0]

      console.log(user,password,user.Password)

      if (await compare(password, user.Password)) {

        console.log("return user")

        //return user
        return {UserID:rows[0].UserID,Username:username,Password:undefined,Role:rows[0].Role,FullName:rows[0].FullName
          ,DepartmentID:rows[0].DepartmentID,DepartmentName:rows[0].DepartmentName,Province:rows[0].Province,Region:rows[0].Region}
      }
    }
    
    return null

  }
  finally {
    // Ensure the connection is closed.
    await connection.end();
  }

  return null
}
