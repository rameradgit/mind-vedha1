// SVASTHA - TWILIO EMERGENCY CALL API
// Deploy this as a serverless function (Vercel, Netlify, or Node.js backend)

const twilio = require('twilio');

// Environment variables (set in your deployment platform)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// API Handler for Emergency Calls
const emergencyCallHandler = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { to, userName, userEmail, timestamp } = req.body;
    
    // Validate input
    if (!to || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate TwiML for voice message
    const twiml = `
      <Response>
        <Say voice="alice" language="en-IN">
          This is an emergency call from Svastha application.
          The user ${userName} is in an emergency situation and needs immediate support.
          User email: ${userEmail}.
          This call was initiated at ${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.
          Please respond immediately.
        </Say>
        <Pause length="2"/>
        <Say voice="alice" language="en-IN">
          This is an automated emergency alert. Thank you.
        </Say>
      </Response>
    `;
    
    // Make Twilio call
    const call = await client.calls.create({
      twiml: twiml,
      to: to,
      from: TWILIO_PHONE_NUMBER,
      statusCallback: `${process.env.API_URL || ''}/api/call-status`,
      statusCallbackEvent: ['initiated', 'answered', 'completed']
    });
    
    console.log(`✅ Emergency call placed: ${call.sid}`);
    console.log(`   To: ${to}`);
    console.log(`   User: ${userName}`);
    console.log(`   Timestamp: ${timestamp}`);
    
    // Log to database (add your database code here)
    // await saveEmergencyEvent({ callSid: call.sid, userName, userEmail, to, timestamp });
    
    // Send email notification
    await sendEmailNotification({
      userName,
      userEmail,
      to,
      callSid: call.sid,
      timestamp
    });
    
    return res.status(200).json({
      success: true,
      message: 'Emergency call initiated successfully',
      callSid: call.sid,
      status: call.status
    });
    
  } catch (error) {
    console.error('❌ Twilio API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to place emergency call',
      details: error.message
    });
  }
};

// Send email notification function
async function sendEmailNotification({ userName, userEmail, to, callSid, timestamp }) {
  // Use your email service (SendGrid, Nodemailer, etc.)
  // Example with SendGrid:
  
  const emailData = {
    to: 'mindcarefuture2025@gmail.com',
    from: 'noreply@svastha.com',
    subject: '🚨 EMERGENCY CALL INITIATED - Svastha Alert',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 8px; border-left: 6px solid #DC2626;">
          <h1 style="color: #DC2626; margin: 0 0 20px 0;">🚨 EMERGENCY CALL ALERT</h1>
          
          <div style="background: #FEE2E2; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #991B1B; font-weight: bold;">Immediate attention required</p>
          </div>
          
          <h3 style="color: #1a1a1a;">Emergency Call Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">User Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">User Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Called Number:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${to}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Call SID:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${callSid}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Timestamp:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: #EFF6FF; border-radius: 6px;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">Recommended Actions:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li>Counselor should answer the call immediately</li>
              <li>Follow up via WhatsApp if call not answered</li>
              <li>Log all interactions in CRM system</li>
              <li>Escalate to mental health professional if needed</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; text-align: center; padding: 15px; background: #F3F4F6; border-radius: 6px;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">This is an automated alert from Svastha Emergency System</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log('📧 Email notification queued:', emailData.to);
  
  // Implement actual email sending here
  // Example: await sendgrid.send(emailData);
}

// Call status webhook handler (export separately if needed)
const handleCallStatus = async (req, res) => {
  const { CallSid, CallStatus, To, From } = req.body;
  
  console.log(`📞 Call Status Update:`);
  console.log(`   SID: ${CallSid}`);
  console.log(`   Status: ${CallStatus}`);
  console.log(`   To: ${To}`);
  console.log(`   From: ${From}`);
  
  // Update database with call status
  // await updateCallStatus({ CallSid, CallStatus });
  
  return res.status(200).send('OK');
};

// Export handlers
module.exports = {
  emergencyCallHandler,
  handleCallStatus
};
