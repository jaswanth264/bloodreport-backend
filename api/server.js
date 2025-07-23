import express from 'express';
import cors from 'cors';
import { supabase } from '../superClient.js';

<<<<<<< HEAD
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Helper: get user from Auth token
const getUserFromRequest = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return data?.user || null;
};

// 🔁 Root route
=======
// Vercel function API handler for Express:
const app = express();

app.use(cors());
app.use(express.json());

// Root route
>>>>>>> 07fa4f27cec295dad4dbdb457bb3806433f3a5ac
app.get('/', (req, res) => {
  res.send('Blood Report API is running');
});

<<<<<<< HEAD
// 📥 POST /upload-report (1 report per user)
app.post('/upload-report', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { report_url } = req.body;
  if (!report_url) return res.status(400).json({ error: 'Report URL is required.' });

  // Prevent re-upload
  const { data: existing } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id);

  if (existing && existing.length > 0) {
    return res.status(400).json({ error: 'You have already uploaded a report' });
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({ user_id: user.id, report_url });

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Report uploaded', data });
});

// 📄 GET /my-report
app.get('/my-report', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) return res.status(404).json({ error: 'No report found' });
  res.json(data);
});

// 📤 POST /profile (name, age)
app.post('/profile', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, age } = req.body;

  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name,
      age
    });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 🔐 GET /all-reports (admin only)
app.get('/all-reports', async (req, res) => {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*, users(username, name, age, email)');
=======
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
>>>>>>> 07fa4f27cec295dad4dbdb457bb3806433f3a5ac

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

<<<<<<< HEAD
=======
// Instead of app.listen(), export as Vercel handler:
>>>>>>> 07fa4f27cec295dad4dbdb457bb3806433f3a5ac
export default app;
