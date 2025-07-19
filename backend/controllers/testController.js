import { sendVerificationEmail } from "../utils/emailService.js";

// Test email sending functionality
export const testEmailService = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Send a test email
    await sendVerificationEmail(
      email,
      "Test User",
      "test-verification-token-123456"
    );
    
    return res.status(200).json({ 
      message: "Test email sent successfully! Please check your inbox.",
      sentTo: email
    });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({ 
      message: "Failed to send test email", 
      error: error.message 
    });
  }
};