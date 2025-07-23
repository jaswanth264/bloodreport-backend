import express from 'express';
import cors from 'cors';
import { supabase } from '../superClient.js';

// Vercel function API handler for Express:
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Blood Report API is running');
});

// POST: submit report
app.post('/submit', async (req, res) => {
  const { name, age, reportUrl, email } = req.body;
  const { data, error } = await supabase
    .from('reports')
    .insert([{ name, age, report_url: reportUrl, email }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Report submitted', data });
});

// GET: user report by email
app.get('/report/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// GET: admin - all reports
app.get('/all-reports', async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Instead of app.listen(), export as Vercel handler:
export default app;
