require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

const IPINFO_API_KEY = process.env.IPINFO_API_KEY;
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

app.get('/api/hello', async (req, res) => {
  const name = req.query.visitor_name || 'Mark';
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


  try {

    console.log(`User IP: ${userIp}`);
    const ipinfoResponse = await axios.get(`https://ipinfo.io/${userIp}?token=${IPINFO_API_KEY}`);
    const location = ipinfoResponse.data.city || 'Unknown Location';
    const loc = ipinfoResponse.data.loc.split(',');



    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${loc[0]}&lon=${loc[1]}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`);
    const temperature = weatherResponse.data.main.temp;


      res.json({
        client_ip: userIp,
        location: location,
        greeting: `Hello, ${name}!, the temperature is ${temperature} degrees Celsius in ${location}`
      });
  } catch (error) {

    console.log(error);
    res.status(500).json({ error: 'An error occured while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
