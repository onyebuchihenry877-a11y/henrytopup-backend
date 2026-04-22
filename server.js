const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const PEYFLEX_BASE = "https://client.peyflex.com.ng/api/";
const PEYFLEX_API_KEY = "2df091ced571afc97e893d5e93ce393f11121eb8";

app.post('/api/deliver', async (req, res) => {
  const { service, amount, identifier, provider } = req.body;

  const payload = {
    service: service,
    amount: parseFloat(amount),
    phone: (service === 'airtime' || service === 'data') ? identifier : undefined,
    smartcard: service === 'cable' ? identifier : undefined,
    meter: service === 'electricity' ? identifier : undefined,
    network: provider,
    disco: provider
  };

  try {
    const response = await fetch(`${PEYFLEX_BASE}purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PEYFLEX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delivery failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
