const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

// Sample bug data using "is_resolved" (instead of "resolved")
const bugs = [
  { id: 1, description: "Bug 1", project_id: 1, is_resolved: true },
  { id: 2, description: "Bug 2", project_id: 1, is_resolved: false },
  { id: 3, description: "Bug 3", project_id: 2, is_resolved: false },
  { id: 4, description: "Bug 4", project_id: 3, is_resolved: false }
];

// GET /api/bugs - Return all bugs
app.get("/api/bugs", (req, res) => {
  res.json(bugs);
});

// POST /api/bugs - Create a new bug
app.post("/api/bugs", (req, res) => {
  // Expecting "project_id" and "description" in the request body.
  const bug = {
    id: Date.now(),
    is_resolved: false,
    ...req.body
  };
  bugs.push(bug);
  res.json(bug);
});

// PATCH /api/bugs/:id - Update a bug's properties
app.patch("/api/bugs/:id", (req, res) => {
  const bugId = parseInt(req.params.id);
  const bug = bugs.find(bug => bug.id === bugId);
  if (!bug) {
    return res.status(404).json({ error: "Bug not found" });
  }

  // Update bug properties if provided
  if ("is_resolved" in req.body) {
    bug.is_resolved = req.body.is_resolved;
  }
  if ("description" in req.body) {
    bug.description = req.body.description;
  }
  if ("project_id" in req.body) {
    bug.project_id = req.body.project_id;
  }

  res.json(bug);
});

const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
  console.log(`Node server started on port ${PORT}.`);
});
