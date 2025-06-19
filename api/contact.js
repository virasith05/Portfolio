const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: `<h3>New Contact Form Submission</h3>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `<h3>Thank you for reaching out!</h3>
             <p>Dear ${name},</p>
             <p>I have received your message and will get back to you as soon as possible.</p>
             <p>Best regards,<br>Virasith Maddula</p>`
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}; 