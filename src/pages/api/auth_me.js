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

    //console.log('authen me api -> ', token)

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
      const user = await getUserInfo(userId)

      //console.log(user)
      if (user) {
        let obj = { userData: { ...user, Password: undefined } }

        //console.log(obj)
        res.status(200).json(obj)
      } else {
        //console.log('usernot found', user)

        return res.status(401).json({ error: { error: 'Invalid User' } })
      }
    } catch (error) {
      console.log('error occured from auth me', error)

      return res.status(401).json({ error: 'Missing token' })
    }
  }

  //return res.status(200).json({})
}

async function getUserInfo(userID) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  })

  //console.log('query userID', userID)

  try {

    const [rows] = await connection.execute(`SELECT A.*,B.DepartmentName FROM tbuser A INNER JOIN tbdepartment B ON A.DepartmentID=B.DepartmentID 
    WHERE A.UserID = ?`, [userID])

    if (rows.length > 0) {

      //console.log('user', user)
      return {UserID:rows[0].UserID,Username:rows[0].Username,Password:undefined,Role:rows[0].Role,FullName:rows[0].FullName
        ,DepartmentID:rows[0].DepartmentID,DepartmentName:rows[0].DepartmentName}
    }
    else
    {
      const [rows] = await connection.execute(`SELECT A.*,B.DepartmentName FROM tbProjectHeader A INNER JOIN tbDepartment B ON A.DepartmentID=B.DepartmentID 
      WHERE A.ProjectCode = ? AND A.RevisionNo=1`, [userID])

      if (rows.length>0)
      {
        return {UserID:userID,Username:userID,Password:undefined,Role:'Reporter',FullName:'Reporter: '+rows[0].Title
          ,DepartmentID:rows[0].DepartmentID,DepartmentName:rows[0].DepartmentName}    
      }
    }
  }
  finally {
    // Ensure the connection is closed.
    await connection.end();
  }

  return null
}
