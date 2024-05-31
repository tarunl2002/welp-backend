const express = require('express');
const twilio = require('twilio');
require('dotenv').config();
const app = express();
const port = 3000;
const bodyParser = require('body-parser')


// const randomLocation = require('random-location');
// app.get('/random-location', (req, res) => {
//     const bbox = {
//         latitude: 40.477399, // Approximate latitude of New York City
//         longitude: -74.25909, // Approximate longitude of New York City
//         radius: 50000, // 50 kilometers radius around New York City
//     };

//     const randomPoint = randomLocation.randomCirclePoint(bbox);

//     res.json(randomPoint);
//     console.log(randomPoint);
// });
app.use(bodyParser.json());

let heartRate = null;

// POST endpoint to add heart rate data
app.post('/api/heartrate', (req, res) => {
    console.log('Received POST request:', req.body);
    const { heart_rate } = req.body;

    if (!heart_rate) {
        console.log('Missing heart_rate field');
        return res.status(400).json({ error: 'Missing heart_rate field' });
    }

    heartRate = { heart_rate };
    console.log('Heart rate data added:', heartRate);
    return res.status(201).json({ message: 'Heart rate data added successfully' });
});

// GET endpoint to retrieve heart rate data
app.get('/api/heartrate', (req, res) => {
    if (!heartRate) {
        return res.status(404).json({ error: 'Heart rate data not found' });
    }

    return res.status(200).json(heartRate);
});
const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const twilioClient = twilio(accountSid, authToken);

// POST endpoint to send an SMS message
app.post('/api/send-sms', (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Missing phone number or message' });
    }

    twilioClient.messages
        .create({
            body: message,
            from: process.env.PHONE, // Your Twilio phone number
            to: phoneNumber
        })
        .then(() => {
            return res.status(200).json({ message: 'SMS sent successfully' });
        })
        .catch(err => {
            console.error('Error sending SMS:', err);
            return res.status(500).json({ error: 'Failed to send SMS' });
        });
});

let walletData = {};
app.post('/wallet', (req, res) => {
    const { wallet_id, rate, no_of_credits, name } = req.body;
  
    if (!wallet_id || rate === undefined || no_of_credits === undefined || !name) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    walletData = {
      wallet_id,
    name,
      rate,
      no_of_credits
    };
  
    res.json({ message: 'Wallet information added successfully' });
  });

  app.get('/wallet', (req,res) => {
    const walletInfo = walletData;
    res.json(walletData);
  })
  
  // Endpoint to handle GET requests for retrieving wallet information
  app.get('/wallet/:wallet_id', (req, res) => {
    const { wallet_id } = req.params;
    const walletInfo = walletData[wallet_id];
  
    if (!walletInfo) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
  
    res.json(walletInfo);
  });


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
