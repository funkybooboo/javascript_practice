const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

// Sample bug data
const bugs = [
  { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
  { id: 2, description: "Bug 2", project_id: 1, is_resolved: false },
  { id: 3, description: "Bug 3", project_id: 2, is_resolved: false },
  { id: 4, description: "Bug 4", project_id: 3, is_resolved: false }
];

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2) || "No body");
  next();
});

// GET /api/bugs - Return all bugs
app.get("/api/bugs", (req, res) => {
  console.log("[GET] /api/bugs - Fetching all bugs");
  res.status(200).json(bugs);
  console.log(`[${new Date().toISOString()}] Response: 200 OK`);
});

// POST /api/bugs - Create a new bug
app.post("/api/bugs", (req, res) => {
  console.log("[POST] /api/bugs - Creating a new bug");

  if (!req.body.description || !req.body.project_id) {
    console.error("❌ Missing required fields: description or project_id");
    return res.status(400).json({ error: "Missing required fields: description or project_id" });
  }

  const bug = {
    id: Date.now(),
    is_resolved: false,
    ...req.body
  };

  bugs.push(bug);
  console.log("✅ New Bug Created:", bug);

  res.status(201).json(bug);
  console.log(`[${new Date().toISOString()}] Response: 201 Created`);
});

// PATCH /api/bugs/:id - Update a bug's properties
app.patch("/api/bugs/:id", (req, res) => {
  const bugId = parseInt(req.params.id);
  console.log(`[PATCH] /api/bugs/${bugId} - Updating bug`);

  const bug = bugs.find(bug => bug.id === bugId);
  if (!bug) {
    console.error(`[${new Date().toISOString()}] ❌ Error: Bug not found`);
    return res.status(404).json({ error: "Bug not found" });
  }

  // Log updates only if fields exist
  if ("is_resolved" in req.body) {
    console.log(`Updating is_resolved: ${bug.is_resolved} → ${req.body.is_resolved}`);
    bug.is_resolved = req.body.is_resolved;
  }
  if ("description" in req.body) {
    console.log(`Updating description: "${bug.description}" → "${req.body.description}"`);
    bug.description = req.body.description;
  }
  if ("project_id" in req.body) {
    console.log(`Updating project_id: ${bug.project_id} → ${req.body.project_id}`);
    bug.project_id = req.body.project_id;
  }

  console.log("✅ Updated Bug:", bug);

  res.status(200).json(bug);
  console.log(`[${new Date().toISOString()}] Response: 200 OK`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Server Error:`, err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] 🚀 Server started on port ${PORT}.`);
});
