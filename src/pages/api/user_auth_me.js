import { verify } from 'jsonwebtoken'
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
  if (req.method === 'GET') {
    const token = req.headers.authorization

    console.log('authen me api -> ', token)

    if (!token) {
      return res.status(401).json({ error: 'Missing token' })
    }

    try {
      const decoded = await verify(token, envConfig.secret)
      const userId = decoded.userId
      if (userId == undefined) {
        console.log('userid is undefined')

        return res.status(401).json({ error: { error: 'Invalid User' } })
      }

      res.status(200).json(generateReturnData(userId))

      } catch (error) {
      console.log('error occured from auth me', error)

      return res.status(401).json({ error: 'Missing token' })
    }
  }

  //return res.status(200).json({})
}

function generateReturnData(AccountID)
{

  // Construct userData
  const userData = {
    UserID: AccountID,
    Username: 'CurrentUsername',
    Role: 'User',
    FullName: 'ล้อหมุนอีวีชาร์จเจอร์',
    DepartmentID: 'DEP-002',
    DepartmentName: 'User'
  };

  // Construct the response object
  let obj = { userData };

  return obj;
}

