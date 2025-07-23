const express = require("express");
const cors = require("cors");
const supabase = require("./supabaseClient");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Upload report (only if not already uploaded)
app.post("/api/upload", async (req, res) => {
  const { user_id, name, age, report_url } = req.body;

  // Check if already uploaded
  const { data: existing, error: findError } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user_id);

  if (findError) return res.status(500).json({ error: findError.message });
  if (existing.length > 0) return res.status(400).json({ error: "Report already submitted" });

  // Insert new report
  const { data, error } = await supabase.from("reports").insert([
    { user_id, name, age, report_url }
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Report uploaded", data });
});

// Get current user's report
app.get("/api/my-report/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin get all reports
app.get("/api/all-reports", async (req, res) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
