import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a real SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

/**
 * Send verification email to user
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 * @returns {Promise} - Email sending result
 */
export const sendVerificationEmail = async (to, name, token) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationLink = `${frontendUrl}/verify-email/${token}`;
    
    console.log(`📧 Sending verification email to: ${to}`);
    console.log(`🔗 Verification link: ${verificationLink}`);
    
    const mailOptions = {
      from: `"VeggeTech" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email Address - VeggeTech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4f46e5;">Welcome to VeggeTech!</h2>
          </div>
          
          <p>Hello ${name},</p>
          
          <p>Thank you for registering with VeggeTech. To complete your registration and verify your email address, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4f46e5;">${verificationLink}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <p>If you did not create an account with VeggeTech, please ignore this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} VeggeTech. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to ${to}. Message ID: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${to}:`, error);
    throw error;
  }
};

/**
 * Send password reset email to user
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @returns {Promise} - Email sending result
 */
export const sendPasswordResetEmail = async (to, name, token) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${token}`;
    
    console.log(`📧 Sending password reset email to: ${to}`);
    console.log(`🔗 Reset link: ${resetLink}`);
    
    const mailOptions = {
      from: `"VeggeTech" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your Password - VeggeTech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4f46e5;">Password Reset Request</h2>
          </div>
          
          <p>Hello ${name},</p>
          
          <p>We received a request to reset your password for your VeggeTech account. To reset your password, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4f46e5;">${resetLink}</p>
          
          <p>This password reset link will expire in 1 hour.</p>
          
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} VeggeTech. All rights reserved.</p>
          </div>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent successfully to ${to}. Message ID: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${to}:`, error);
    throw error;
  }
};