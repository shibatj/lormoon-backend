import { createConnection } from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

      let totalExpense = 0;
      let totalGenerateCost = 0;

      // Query for total expense
      const [expenseRows] = await connection.execute('SELECT SUM(UnitCharge*5.5) AS TotalExpense FROM tbaccount_credit');
      totalExpense = expenseRows[0].TotalExpense || 0;

      // Query for total generate cost
      const [generateRows] = await connection.execute('SELECT SUM(GenerateCost) AS TotalGenerateCost FROM tbaccount_debit');
      totalGenerateCost = generateRows[0].TotalGenerateCost || 0;

      await connection.end();

      res.status(200).json({ TotalExpense: totalExpense, TotalGenerateCost: totalGenerateCost });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
