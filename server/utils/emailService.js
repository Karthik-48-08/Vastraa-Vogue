const nodemailer = require('nodemailer');

const createTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    console.log('🔧 Creating Gmail transporter for:', emailUser);

    if (!emailUser || !emailPassword) {
        throw new Error('Missing email configuration: EMAIL_USER or EMAIL_PASSWORD is not set');
    }

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPassword
        },
        debug: true,
        logger: true
    });

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('SMTP verification timed out'));
        }, 10000);

        transporter.verify((error) => {
            clearTimeout(timeout);
            if (error) {
                console.error('❌ Gmail SMTP verification failed:', error);
                reject(error);
            } else {
                console.log('✅ Gmail SMTP is ready to send messages');
                resolve(transporter);
            }
        });
    });
};

const sendOTP = async (email, otp) => {
    try {
        console.log('🔄 Starting OTP email send to:', email);
        
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: {
                name: 'Vastraa Vogue',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset OTP - Vastraa Vogue',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #333; margin: 0;">Vastraa Vogue</h2>
                        <p style="color: #666; margin: 5px 0;">Password Reset</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 10px;">
                        <div style="background: white; padding: 30px; border-radius: 8px;">
                            <p style="font-size: 16px; color: #444; text-align: center;">Your OTP for password reset is:</p>
                            <div style="text-align: center; margin: 25px 0;">
                                <div style="display: inline-block; background: #f8f9fa; padding: 15px 30px; border-radius: 10px; border: 2px dashed #667eea;">
                                    <h1 style="margin: 0; color: #1a73e8; letter-spacing: 8px; font-size: 36px; font-weight: bold;">${otp}</h1>
                                </div>
                            </div>
                            <p style="font-size: 14px; color: #666; text-align: center;">
                                This OTP is valid for <strong>5 minutes</strong> only.
                            </p>
                            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 25px;">
                                If you didn't request this password reset, please ignore this email.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            This is an automated email. Please do not reply.
                        </p>
                    </div>
                </div>
            `,
            text: `Your Vastraa Vogue password reset OTP is: ${otp}. This OTP is valid for 5 minutes.`
        };

        console.log('📤 Sending email via Gmail...');
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('✅ Response:', info.response);
        
        return true;
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        
        // Detailed error information
        if (error.code === 'EAUTH') {
            console.error('🔐 Authentication failed. Please check:');
            console.error('   1. Gmail address is correct');
            console.error('   2. App Password is correct (16 characters)');
            console.error('   3. 2-factor authentication is enabled');
            console.error('   4. App Password is generated for "Mail"');
        } else if (error.code === 'ESOCKET') {
            console.error('🌐 Network connection failed. Check internet connection.');
        }
        
        throw error;
    }
};

// Test function
const testGmail = async (testEmail) => {
    try {
        console.log('🧪 Testing Gmail configuration...');
        await sendOTP(testEmail, '123456');
        return { success: true, message: 'Gmail test successful' };
    } catch (error) {
        return { 
            success: false, 
            message: 'Gmail test failed', 
            error: error.message,
            code: error.code 
        };
    }
};

module.exports = { sendOTP, testGmail };