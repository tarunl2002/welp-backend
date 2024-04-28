const express = require('express');
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

    return res.status(200).json({ heart_rate: heartRate });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
