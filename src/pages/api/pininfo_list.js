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

  // ตรวจสอบ HTTP Method
  if (req.method === 'POST') {
    const { token, criteria } = req.body;

    //console.log("list pin",criteria)

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    try {
      await verify(token, envConfig.secret);
      const data = await retrieve_data(criteria);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error)

      return res.status(401).json({ error: 'Invalid token' });
    }
  } else if (req.method === 'OPTIONS') {
    // ตอบกลับเพื่อการ pre-flight request
    return res.status(200).end();
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}


async function retrieve_data(criteria) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    let sql = 'SELECT * FROM tbpininfo';
    const params = [];

    let sql_where=''

    if (criteria.UserID) {
      if (sql_where=='')
        sql_where += ' WHERE';
      else
        sql_where += ' AND';

      sql_where += ' UserID = ?';
      params.push(criteria.UserID);
    } 

    if (criteria.PinID) {

      if (sql_where=='')
        sql_where += ' WHERE';
      else
        sql_where += ' AND';

        sql_where += ' PinID = ?';
      params.push(criteria.PinID);
    }
    
    if (criteria.PinName) {
      if (sql_where === '') {
        sql_where += ' WHERE';
      } else {
        sql_where += ' AND';
      }
    
      sql_where += ' PinName LIKE ?';
      params.push(`%${criteria.PinName}%`); // เพิ่ม % ทั้งสองด้านของค่า PinName
    }

    if (criteria.Province) {
      if (sql_where === '') {
        sql_where += ' WHERE';
      } else {
        sql_where += ' AND';
      }
    
      sql_where += ' Province LIKE ?';
      params.push(`%${criteria.Province}%`); // เพิ่ม % ทั้งสองด้านของค่า PinName
    }

    if (criteria.ContactPerson) {
      if (sql_where === '') {
        sql_where += ' WHERE';
      } else {
        sql_where += ' AND';
      }
    
      sql_where += ' ContactPerson LIKE ?';
      params.push(`%${criteria.ContactPerson}%`); // เพิ่ม % ทั้งสองด้านของค่า PinName
    }

    if (criteria.DepartmentID!='all')
    {
      if (sql_where=='')
        sql_where += ' WHERE';
      else
        sql_where += ' AND';

      sql_where += ' UserID IN (SELECT UserID FROM tbuser WHERE DepartmentID = ?)';
      params.push(criteria.DepartmentID);
    }

    const [rows] = await connection.execute(sql+sql_where, params);

    //console.log("count pins",rows.length)
    
    return rows;
  } finally {
    await connection.end();
  }
}
