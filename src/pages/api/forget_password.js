import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { createConnection } from 'mysql2/promise';

const envConfig = {
  db_host: process.env.DB_HOST,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS
};

function generateRandomPassword(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return password;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    const connection = await createConnection({
      host: envConfig.db_host,
      user: envConfig.db_username,
      password: envConfig.db_password,
      database: envConfig.db_name
    });

    try {
      const [rows] = await connection.execute('SELECT * FROM tbuser WHERE Username = ?', [email]);

      if (rows.length > 0) {
        const newPassword = generateRandomPassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // อัปเดตรหัสผ่านในฐานข้อมูล
        await connection.execute('UPDATE tbuser SET Password = ? WHERE Username = ?', [hashedPassword, email]);

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: envConfig.email_user,
            pass: envConfig.email_pass
          }
        });

        const emailContent = `
        ยินดีต้อนรับ! เปลี่ยนรหัสผ่านเสร็จสมบูรณ์แล้วด้วยข้อมูลดังต่อไปนี้:
        
        ชื่อผู้ใช้งาน: ${email}
        รหัสผ่านใหม่คือ: ${newPassword}
        
        คุณสามารถเข้าสู่ระบบได้โดยคลิกที่ลิงค์ด้านล่างนี้:
        
        <a href="http://wandek.moe.go.th/login" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">คลิ้กที่นี่เพื่อเข้าสู่ระบบ</a>
        
        ขอให้มีความสุขในการใช้งานระบบ,
        ทีมงานแผนที่จัดงานวันเด็ก
        `;
  

        const mailOptions = {
          from: envConfig.email_user,
          to: email,
          subject: 'เริ่มต้นรหัสผ่านใหม่ของคุณเรียบร้อยแล้ว',
          text: emailContent
        };

        await transporter.sendMail(mailOptions);

        await connection.end();

        return res.status(200).json({ message: 'Password reset email sent' });
      } else {
        await connection.end();

        return res.status(404).json({ error: 'Email not found' });
      }
    } catch (error) {
      await connection.end();
      console.error('Database or mail error:', error);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
