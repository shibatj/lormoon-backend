import { verify } from 'jsonwebtoken';
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const envConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {

      const { existing, randomPassword  } = await retrieve_data(email);
      
      if (existing) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const emailContent = `
      ยินดีต้อนรับ! การลงทะเบียนของคุณเสร็จสมบูรณ์แล้วด้วยข้อมูลดังต่อไปนี้:
      
      ชื่อผู้ใช้งาน: ${email}
      รหัสผ่าน: ${randomPassword}
      
      คุณสามารถเข้าสู่ระบบได้โดยคลิกที่ลิงค์ด้านล่างนี้:
      
      <a href="http://wandek.moe.go.th/login" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">คลิ้กที่นี่เพื่อเข้าสู่ระบบ</a>
      
      ขอให้มีความสุขในการใช้งานระบบ,
      ทีมงานแผนที่จัดงานวันเด็ก
      `;

      // ส่งอีเมล์หลังจากเพิ่มผู้ใช้งานสำเร็จ
      await sendEmail(email, emailContent);


      const ret={ email: email,status: 'OK'}

      return res.status(200).json(ret);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

function generateRandomPassword(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
}


async function retrieve_data(email) {
  const connection = await createConnection({
    host: envConfig.db_host,
    user: envConfig.db_username,
    password: envConfig.db_password,
    database: envConfig.db_name
  });

  try {

      // ตรวจสอบว่ามีอีเมล์นี้ในฐานข้อมูลหรือยัง
      const [existingUser] = await connection.execute('SELECT * FROM tbuser WHERE Username = ?', [email]);

      if (existingUser.length > 0) {
        // อีเมล์นี้มีในฐานข้อมูลแล้ว
        return { existing: true };
      }

      const randomPassword = generateRandomPassword();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);


      // สร้างคำสั่ง SQL สำหรับเพิ่มผู้ใช้
      const sql = `
        INSERT INTO tbuser (Username, Password, DepartmentID, FullName, Role, CreateDT, UpdateDT)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW());
      `;
      await connection.execute(sql, [
        email, 
        hashedPassword, 
        'DEP-002', 
        '-', 
        'User'
      ]);


      return { email, randomPassword, existing: false };


    // สามารถเพิ่มโค้ดสำหรับ 'update' และ 'delete' ได้ตามความจำเป็น

  } finally {
    await connection.end();
  }
}

async function sendEmail(recipientEmail, message) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: envConfig.email_user,
      pass: envConfig.email_pass
    }
  });

  let mailOptions = {
    from: envConfig.email_user,
    to: recipientEmail,
    subject: 'ยินดีต้อนรับ! การลงทะเบียนของคุณเสร็จสมบูรณ์แล้ว',
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
