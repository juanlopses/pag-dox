const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// API proxy endpoint
app.get('/api/reniec', async (req, res) => {
  const dni = req.query.dni;
  if (!/^\d{8}$/.test(dni)) {
    return res.status(400).json({ error: 'DNI debe ser un número de 8 dígitos' });
  }

  try {
    const response = await axios.get(`https://daku.lat/api/reniec?dni=${dni}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching API:', error.message);
    res.status(500).json({ error: 'Error al consultar la API' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
