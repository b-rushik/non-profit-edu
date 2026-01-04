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
        const registrationId = `STD-${Date.now().toString().slice(-6)}`;
        
        // Validate required fields
        if (!data.studentName || !data.studentAge || !data.grade || !data.school || 
            !data.parentName || !data.parentEmail || !data.parentPhone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }
        
        // Create email content for admin
        const adminEmailContent = `
            NEW STUDENT REGISTRATION
            =========================
            
            Submission Time: ${new Date().toLocaleString()}
            
            Student Information:
            --------------------
            Student Name: ${data.studentName}
            Age: ${data.studentAge}
            Grade: ${data.grade}
            School: ${data.school}
            
            Previous Experience:
            ${data.previousExperience || 'No previous experience'}
            
            Parent/Guardian Information:
            ----------------------------
            Parent Name: ${data.parentName}
            Parent Email: ${data.parentEmail}
            Parent Phone: ${data.parentPhone}
            
            Address:
            ${data.address || 'Not provided'}
            
            =========================
            Registration submitted via Spell-BE Website
        `;
        
        // Send email to admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Student Registration: ${data.studentName}`,
            text: adminEmailContent,
            html: createStudentEmailHTML(data)
        });
        
        // Send confirmation to parent
        await sendEmail({
            to: data.parentEmail,
            subject: 'Spell-BE Student Registration Confirmation',
            text: createStudentConfirmationText(data, registrationId),
            html: createStudentConfirmationHTML(data, registrationId)
        });
        
        // Try to append to Google Sheet (if configured)
        try {
            if (process.env.SHEET_ID) {
                await appendToSheet(process.env.SHEET_ID, 'Students!A:Z', [
                    new Date().toISOString(),
                    registrationId,
                    data.studentName,
                    data.studentAge,
                    data.grade,
                    data.school,
                    data.previousExperience || '',
                    data.parentName,
                    data.parentEmail,
                    data.parentPhone,
                    data.address || ''
                ]);
            }
        } catch (err) {
            console.error('Error appending to sheet:', err);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: `Registration submitted successfully! Registration ID: ${registrationId}. Check your email for confirmation.` 
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to submit registration. Please try again later.' 
            })
        };
    }
};

function createStudentEmailHTML(data) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                .section { margin-bottom: 20px; }
                .field { margin-bottom: 10px; padding: 8px; background: white; border-left: 4px solid #27ae60; }
                .label { font-weight: bold; color: #2c3e50; }
                .important { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Student Registration</h1>
                    <p>Submitted: ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="content">
                    <div class="section">
                        <h2>Student Information</h2>
                        <div class="field">
                            <span class="label">Student Name:</span> ${data.studentName}
                        </div>
                        <div class="field">
                            <span class="label">Age:</span> ${data.studentAge}
                        </div>
                        <div class="field">
                            <span class="label">Grade/Class:</span> ${data.grade}
                        </div>
                        <div class="field">
                            <span class="label">School:</span> ${data.school}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Previous Experience</h2>
                        <div class="field">
                            ${data.previousExperience || 'No previous competition experience'}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Parent/Guardian Information</h2>
                        <div class="field">
                            <span class="label">Parent Name:</span> ${data.parentName}
                        </div>
                        <div class="field">
                            <span class="label">Parent Email:</span> ${data.parentEmail}
                        </div>
                        <div class="field">
                            <span class="label">Parent Phone:</span> ${data.parentPhone}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2>Address</h2>
                        <div class="field">
                            ${data.address || 'Not provided'}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>Registration</h3>
                        <div class="field" style="background:#e8f5e9;border-left:4px solid #2e7d32;padding:12px;">
                            <strong>Registration ID:</strong> ${registrationId}<br>
                            <small>This submission will be saved securely to your Google Sheet (if configured).</small>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Registration submitted via Spell-BE Website</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function createStudentConfirmationText(data, registrationId) {
    return `Dear ${data.parentName},

Thank you for registering ${data.studentName} for the Spell-BE Competition!

Registration Details:
--------------------
Student Name: ${data.studentName}
Age: ${data.studentAge}
Grade: ${data.grade}
School: ${data.school}
Registration ID: ${registrationId}

What's Next?
------------
1. You'll receive competition schedule within 48 hours
2. Study materials will be emailed 1 week before the competition
3. Competition details and venue information will be shared via email

Important Dates:
----------------
- Registration Deadline: December 31, 2024
- Competition Date: To be announced
- Results Declaration: Within 1 week of competition

Contact Information:
-------------------
For any queries, please contact:
Email: info@spellbe.org
Phone: +91-XXXXXXXXXX

Best regards,
The Spell-BE Team`;
}

function createStudentConfirmationHTML(data, registrationId) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                .content { padding: 30px; }
                .registration-id { background: #e3f2fd; border: 2px dashed #2196f3; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #2196f3; border-radius: 10px; }
                .info-box { background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 5px solid #4caf50; }
                .info-box h3 { margin-top: 0; color: #2c3e50; }
                .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                .detail-item { padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .label { font-weight: bold; color: #555; font-size: 14px; }
                .value { color: #333; font-size: 16px; margin-top: 5px; }
                .timeline { margin: 30px 0; }
                .timeline-item { display: flex; margin-bottom: 20px; }
                .timeline-number { background: #4caf50; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; }
                .timeline-content { flex: 1; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 0; }
                .footer { background: #2c3e50; color: white; padding: 30px; text-align: center; margin-top: 30px; }
                .contact-info { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Registration Confirmed!</h1>
                    <p>${data.studentName} is now registered for Spell-BE Competition</p>
                </div>
                
                <div class="content">
                    <div class="registration-id">
                        Registration ID: ${registrationId}
                    </div>
                    
                    <div class="info-box">
                        <h3>📋 Registration Details</h3>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="label">Student Name</div>
                                <div class="value">${data.studentName}</div>
                            </div>
                            <div class="detail-item">
                                <div class="label">Age</div>
                                <div class="value">${data.studentAge}</div>
                            </div>
                            <div class="detail-item">
                                <div class="label">Grade</div>
                                <div class="value">${data.grade}</div>
                            </div>
                            <div class="detail-item">
                                <div class="label">School</div>
                                <div class="value">${data.school}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="timeline">
                        <h3>📅 What Happens Next?</h3>
                        <div class="timeline-item">
                            <div class="timeline-number">1</div>
                            <div class="timeline-content">
                                <strong>Confirmation Email</strong>
                                <p>You'll receive this email with all details</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-number">2</div>
                            <div class="timeline-content">
                                <strong>Competition Schedule</strong>
                                <p>Will be emailed within 48 hours</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-number">3</div>
                            <div class="timeline-content">
                                <strong>Study Materials</strong>
                                <p>Will be shared 1 week before competition</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-number">4</div>
                            <div class="timeline-content">
                                <strong>Competition Day</strong>
                                <p>Venue details and guidelines will be shared</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-info">
                        <h3>📞 Need Help?</h3>
                        <p><strong>Email:</strong> info@spellbe.org</p>
                        <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                        <p><strong>Website:</strong> https://spellbe.netlify.app</p>
                    </div>
                    
                    <center>
                        <a href="#" class="button">Download Study Materials</a>
                        <br>
                        <a href="#" class="button" style="background: #6c757d;">View Competition Rules</a>
                    </center>
                </div>
                
                <div class="footer">
                    <p><strong>The Spell-BE Team</strong></p>
                    <p style="font-size: 12px; opacity: 0.8;">This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Reuse sendEmail function from submit-faculty.js
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