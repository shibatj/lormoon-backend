import { createConnection } from 'mysql2/promise';
import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'

const envConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const tokenURL = req.body.tokenURL;
  console.log("input", tokenURL);

  if (!tokenURL || !tokenURL.includes('=')) {
    return res.status(400).json({ error: 'Bad Request: Token is missing or in the wrong format' });
  }
  
  const token = tokenURL.split('=')[1];
  
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {
    // Check if the token already exists in the tbaccount_debit table
    const [existingDebitRows] = await connection.execute('SELECT AccountID FROM tbaccount_debit WHERE GenerateCode = ?', [token]);
    if (existingDebitRows.length > 0) {
      // Token found in tbaccount_debit table, return the existing AccountID
      return res.status(200).json( generateReturnData(existingDebitRows[0].AccountID));
    }
    
    // Check if the token exists in the tbgenerate table and retrieve GenerateCost
    const [generateRows] = await connection.execute('SELECT GenerateCost FROM tbgenerate WHERE GenerateCode = ?', [token]);
    if (generateRows.length === 0) {
      // Token not found in tbgenerate table
      return res.status(404).json({ error: 'Token not found in tbgenerate table' });
    }

    const generateCost = generateRows[0].GenerateCost;

    // Insert new account in tbaccount table
    const [accountResult] = await connection.execute('INSERT INTO tbaccount (Balance) VALUES (?)', [generateCost]);
    const newAccountID = accountResult.insertId;

    // Insert into tbaccount_debit table with token, newAccountID, and generateCost
    await connection.execute('INSERT INTO tbaccount_debit (GenerateCode, AccountID, GenerateCost, DebitDT) VALUES (?, ?, ?, NOW())', [token, newAccountID, generateCost]);

    // Return the new AccountID
    return res.status(200).json(generateReturnData(newAccountID));
  } catch (error) {
    console.error('Database operation failed:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await connection.end();
  }
}

function generateReturnData(AccountID)
{
  // Create an accessToken using AccountID
  const accessToken = sign({ userId: AccountID }, envConfig.secret, {
    expiresIn: '1h'
  });

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
  let obj = { accessToken, userData };

  return obj;
}
