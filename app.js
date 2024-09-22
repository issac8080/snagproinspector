const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3004;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'issacsunnycvn12a@gmail.com', // Your email address
        pass: 'bfiomnejefbnttwp'                // Your email password or app password
    }
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/booking', (req, res) => {
    res.render('booking');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/about', (req, res) => {
    res.render('about');
});


// Booking form submission
app.post('/booking', (req, res) => {
    const { fullname, phone, email, address, property_type, other, extras, inspection_date, flex_date, message } = req.body;

    // Log the request body for debugging
    console.log(req.body);

    // Check for required fields
    if (!fullname || !phone || !email || !address || !inspection_date || !flex_date) {
        return res.status(400).send('Please fill in all required fields.');
    }

    // Prepare extras
    const extrasList = Array.isArray(req.body['extras[]']) ? req.body['extras[]'].join(', ') : '';

    const query = 'INSERT INTO bookings (fullname, phone, email, address, property_type, other, extras, inspection_date, flex_date, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [fullname, phone, email, address, property_type, other, extrasList, inspection_date, flex_date, message], (err, result) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).send('Error saving data. Please try again later.');
        }

        // Prepare email content
        const mailOptions = {
            from: 'issacsunnycvn12a@gmail.com', // sender address
            to: 'issacsunnycvn12a@gmail.com', // your email address to receive the booking details
            subject: 'New Booking Submission',
            text: `A new booking has been submitted!\n\n` +
                  `Full Name: ${fullname}\n` +
                  `Phone: ${phone}\n` +
                  `Email: ${email}\n` +
                  `Address: ${address}\n` +
                  `Property Type: ${property_type}\n` +
                  `Other: ${other}\n` +
                  `Extras: ${extrasList}\n` +
                  `Inspection Date: ${inspection_date}\n` +
                  `Flexible Date: ${flex_date}\n` +
                  `Message: ${message}\n`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
                return res.status(500).send('Error sending email. Please try again later.');
            }
            res.send('Booking successful! You will receive a confirmation email.');
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
