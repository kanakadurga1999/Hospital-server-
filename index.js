const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// READ (GET) 
app.get('/hospitals', (req, res) => {
  const data = readData();
  res.json(data.hospitals);
});

// READ (GET) -  hospital by name
app.get('/hospitals/:name', (req, res) => {
  const data = readData();
  const hospital = data.hospitals.find((h) => h.name === req.params.name);
  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).send('Hospital not found');
  }
});

// CREATE (POST) - Add a new hospital 
app.post('/hospitals', (req, res) => {
  const data = readData();
  const newHospital = req.body;
  data.hospitals.push(newHospital);
  writeData(data);
  res.json(newHospital);
});

// UPDATE (PUT) - Update
app.put('/hospitals/:name', (req, res) => {
  const data = readData();
  const hospital = data.hospitals.find((h) => h.name === req.params.name);
  if (hospital) {
    hospital.patientCount = req.body.patientCount;
    hospital.location = req.body.location;
    writeData(data);
    res.json(hospital);
  } else {
    res.status(404).send('Hospital not found');
  }
});

// DELETE - Delete a hospital
app.delete('/hospitals/:name', (req, res) => {
  const data = readData();
  const index = data.hospitals.findIndex((h) => h.name === req.params.name);
  if (index !== -1) {
    const deletedHospital = data.hospitals.splice(index, 1)[0];
    writeData(data);
    res.json(deletedHospital);
  } else {
    res.status(404).send('Hospital not found');
  }
});


const readData = () => {
  try {
    const data = JSON.parse(fs.readFileSync('hospitals.json', 'utf8'));
    return data;
  } catch (err) {
    return { hospitals: [] };
  }
};

const writeData = (data) => {
  fs.writeFileSync('hospitals.json', JSON.stringify(data, null, 2));
};

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });