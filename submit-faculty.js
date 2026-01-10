const nodemailer = require('nodemailer');
const { appendToSheet } = require('./sheets');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const registrationId = `FAC-${Date.now().toString().slice(-6)}`;
        
        // Validate required fields
        if (!data.fullName || !data.phone || !data.email || !data.designation) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        // Create email content
        const adminEmailContent = `
            NEW FACULTY APPLICATION
            ========================
            
            Submission Time: ${new Date().toLocaleString()}
            
            Contact Information:
            --------------------
            Full Name: ${data.fullName}
            Phone: ${data.phone}
            Email: ${data.email}
            Designation: ${data.designation}
            Experience: ${data.experience || 'Not specified'} years
            
            Availability:
            -------------
            Available Days: ${data.availableDays || 'Not specified'}
            
            Additional Comments:
            --------------------
            ${data.comments || 'No comments provided'}
            
            ========================
            Application submitted via Spell-BE Website
        `;
        
        // Send email to admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Faculty Application: ${data.fullName}`,
            text: adminEmailContent,
            html: createFacultyEmailHTML(data)
        });
        
        // Send confirmation to faculty
        await sendEmail({
            to: data.email,
            subject: 'Spell-BE Faculty Application Received',
            text: createFacultyConfirmationText(data, registrationId),
            html: createFacultyConfirmationHTML(data, registrationId)
        });

        // Try to append to Google Sheet (if configured)
        try {
            if (process.env.SHEET_ID) {
                await appendToSheet(process.env.SHEET_ID, 'Faculty!A:Z', [
                    new Date().toISOString(),
                    registrationId,
                    data.fullName,
                    data.phone,
                    data.email,
                    data.designation,
                    data.experience || '',
                    data.availableDays || '',
                    data.comments || ''
                ]);
            }
        } catch (err) {
            console.error('Error appending to sheet:', err);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: `Application submitted successfully! Registration ID: ${registrationId}. Check your email for confirmation.` 
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to submit application. Please try again later.' 
            })
        };
    }
};

function createFacultyEmailHTML(data) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .section { margin-bottom: 20px; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; color: #2c3e50; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Faculty Application</h1>
                    <p>Submitted: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="content">
                    <div class="section">
                        <h2>Contact Information</h2>
                        <div class="field">
                            <span class="label">Full Name:</span> ${data.fullName}
                        </div>
                        <div class="field">
                            <span class="label">Phone:</span> ${data.phone}
                        </div>
                        <div class="field">
                            <span class="label">Email:</span> ${data.email}
                        </div>
                        <div class="field">
                            <span class="label">Designation:</span> ${data.designation}
                        </div>
                        <div class="field">
                            <span class="label">Experience:</span> ${data.experience || 'Not specified'} years
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Availability</h2>
                        <div class="field">
                            <span class="label">Available Days:</span> ${data.availableDays || 'Not specified'}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Additional Comments</h2>
                        <p>${data.comments || 'No comments provided'}</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Application submitted via Spell-BE Website</p>
                    <p>If you have a Google Sheet configured, this submission will be saved automatically.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function createFacultyConfirmationText(data, registrationId) {
    return `Dear ${data.fullName},

Thank you for your interest in joining Spell-BE as faculty!

We have received your application with the following details:

Full Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}
Designation: ${data.designation}
Experience: ${data.experience || 'Not specified'} years
Available Days: ${data.availableDays || 'Not specified'}
Registration ID: ${registrationId}

Our team will review your application and contact you within 3-5 business days.

You can also download our Faculty Guide from: [Your Guide Link]

For any queries, please contact us at: info@spellbe.org

Best regards,
The Spell-BE Team`;
}

function createFacultyConfirmationHTML(data, registrationId) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3498db; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
                .section { margin-bottom: 25px; }
                .field { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                .label { font-weight: bold; color: #2c3e50; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
                .button { display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Application Received!</h1>
                    <p>Thank you for joining Spell-BE</p>
                </div>
                
                <div class="content">
                    <div class="section">
                        <h2>Application Details</h2>
                        <div class="field">
                            <span class="label">Full Name:</span> ${data.fullName}
                        </div>
                        <div class="field">
                            <span class="label">Phone:</span> ${data.phone}
                        </div>
                        <div class="field">
                            <span class="label">Email:</span> ${data.email}
                        </div>
                        <div class="field">
                            <span class="label">Designation:</span> ${data.designation}
                        </div>
                        <div class="field">
                            <span class="label">Experience:</span> ${data.experience || 'Not specified'} years
                        </div>
                        <div class="field">
                            <span class="label">Available Days:</span> ${data.availableDays || 'Not specified'}
                        </div>
                        <div class="field" style="background:#e8f5e9;border-left:4px solid #2e7d32;padding:12px;">
                            <strong>Registration ID:</strong> ${registrationId}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>What Happens Next?</h2>
                        <p>Our team will review your application and contact you within 3-5 business days.</p>
                        <p>You'll receive:</p>
                        <ul>
                            <li>Faculty orientation details</li>
                            <li>Competition schedule</li>
                            <li>Resource materials</li>
                            <li>Guidelines and training schedule</li>
                        </ul>
                        
                        <a href="#" class="button">Download Faculty Guide</a>
                    </div>
                    
                    <div class="section">
                        <h2>Need Help?</h2>
                        <p>Email: info@spellbe.org</p>
                        <p>Phone: +91-XXXXXXXXXX</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Best regards,<br><strong>The Spell-BE Team</strong></p>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

async function sendEmail({ to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    
    await transporter.sendMail({
        from: `"Spell-BE" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    });
}