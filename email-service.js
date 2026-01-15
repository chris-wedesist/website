require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);
  
app.use(express.json());

const transporter = nodemailer.createTransporter({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: 'trustmuhammadimedical@gmail.com', // Your email
      pass: 'fxjqiyaquedqyyjj'  // Your email password or app password
    }
});

app.post("/api/send-email", async (req, res) => {
    const { email, username, shelterName, plan } = req.body;
    
    try {
      if (!email || !username) {
        return res.status(400).json({ error: "Email and username are required." });
      }
  
      // Email template for DESIST
      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DESIST!</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background-color: #ffffff;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3b82f6;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 8px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 16px;
            }
            .welcome-message {
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 600;
            }
            .content {
              margin-bottom: 30px;
            }
            .account-details {
              background-color: #f3f4f6;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .account-details h3 {
              margin-top: 0;
              color: #1f2937;
              font-size: 18px;
            }
            .account-details ul {
              margin: 0;
              padding-left: 20px;
            }
            .account-details li {
              margin-bottom: 8px;
            }
            .button {
              display: inline-block;
              background-color: #3b82f6;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
              border-radius: 8px;
              border: none;
              font-size: 16px;
            }
            .button:hover {
              background-color: #2563eb;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .features ul {
              padding-left: 20px;
            }
            .features li {
              margin-bottom: 10px;
            }
            .highlight {
              background-color: #fef3c7;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">DESIST!</div>
              <div class="subtitle">Community Protection</div>
            </div>
            
            <div class="welcome-message">
              Welcome to DESIST!
            </div>
            
            <div class="content">
              <p>Dear <strong>${username}</strong>,</p>
              
              <p>Welcome to DESIST! We're excited to have you join our community dedicated to protecting rights and creating safer spaces for everyone.</p>
              
              <div class="account-details">
                <h3>Your Account Details:</h3>
                <ul>
                  <li><strong>Name:</strong> ${username}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Community:</strong> DESIST Community</li>
                  <li><strong>Status:</strong> Pending Email Confirmation</li>
                </ul>
              </div>
              
              <div class="highlight">
                <strong>🔐 Security Notice:</strong> Please confirm your email address to activate your account and access all DESIST features.
              </div>
              
              <p>With your DESIST account, you'll be able to:</p>
              <div class="features">
                <ul>
                  <li>Report incidents and stay informed about community safety</li>
                  <li>Access legal resources and support</li>
                  <li>Connect with community members and campaigns</li>
                  <li>Use stealth mode for enhanced privacy protection</li>
                  <li>Participate in community forums and events</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?email=${encodeURIComponent(email)}&confirmed=true" class="button">
                  Confirm Email & Activate Account
                </a>
              </div>
              
              <p>If you have any questions or need assistance, our support team is here to help. We're committed to supporting you in creating a safer community.</p>
              
              <p>Thank you for joining DESIST. Together, we can make a difference.</p>
            </div>
            
            <div class="footer">
              <p>© 2025 DESIST!. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      const mailOptions = {
        from: `"DESIST!" <${process.env.EMAIL_USER || 'trustmuhammadimedical@gmail.com'}>`,
        to: email,
        subject: `Welcome to DESIST!, ${username}! 🛡️`,
        html: emailHTML
      };
  
      await transporter.sendMail(mailOptions);
      
      res.json({ 
        success: true, 
        message: "Confirmation email sent successfully." 
      });
      
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      res.status(500).json({ error: "Failed to send confirmation email." });
    }
  });

const PORT = process.env.PORT || 8100;
app.listen(PORT, () => {
  console.log(`DESIST Email service running on port ${PORT}`);
});
