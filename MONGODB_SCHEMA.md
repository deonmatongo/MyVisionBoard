# MongoDB Database Schema Documentation

This document describes the MongoDB database structure for the Vision Board application.

## Database: `visionboard`

### Collections

---

## 1. `visionprogress`

Stores overall vision progress metrics and quarterly progress tracking.

### Schema
```javascript
{
  _id: ObjectId,
  current_revenue: Number,           // Current total revenue
  monthly_revenue: Number,           // Monthly recurring revenue
  active_clients: Number,            // Number of active clients
  retainer_clients: Number,          // Number of retainer clients
  completed_projects: Number,        // Total completed projects
  quarter_progress: {                // Quarterly progress tracking
    Q1: [Boolean],                   // Array of completed tasks for Q1
    Q2: [Boolean],                   // Array of completed tasks for Q2
    Q3: [Boolean],                   // Array of completed tasks for Q3
    Q4: [Boolean]                    // Array of completed tasks for Q4
  },
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all vision progress records:**
```javascript
db.visionprogress.find({}).sort({ created_at: -1 })
```

**Find the most recent vision progress:**
```javascript
db.visionprogress.find({}).sort({ created_at: -1 }).limit(1)
```

**Update vision progress:**
```javascript
db.visionprogress.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      current_revenue: 50000,
      monthly_revenue: 10000,
      active_clients: 5,
      updated_at: new Date()
    }
  }
)
```

**Update quarterly progress:**
```javascript
db.visionprogress.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      "quarter_progress.Q1": [true, false, true, false],
      updated_at: new Date()
    }
  }
)
```

**Create new vision progress:**
```javascript
db.visionprogress.insertOne({
  current_revenue: 0,
  monthly_revenue: 0,
  active_clients: 0,
  retainer_clients: 0,
  completed_projects: 0,
  quarter_progress: {
    Q1: [],
    Q2: [],
    Q3: [],
    Q4: []
  },
  created_at: new Date(),
  updated_at: new Date()
})
```

---

## 2. `ongoingprojects`

Stores information about ongoing projects.

### Schema
```javascript
{
  _id: ObjectId,
  project_name: String,              // Name of the project
  client: String,                    // Client name
  description: String,               // Project description
  start_date: Date,                  // Project start date
  deadline: Date,                    // Project deadline
  project_value: Number,             // Project value in dollars
  status: String,                    // Planning, In Progress, Review, Completed, On Hold
  color: String,                     // Hex color code for UI
  progress_percentage: Number,       // Progress percentage (0-100)
  stages: [{                         // Project stages
    name: String,                    // Stage name
    completed: Boolean,              // Whether stage is completed
    notes: String                    // Stage notes
  }],
  tasks: [{                          // Project tasks
    task: String,                    // Task description
    completed: Boolean,              // Whether task is completed
    due_date: Date                   // Task due date
  }],
  notes: String,                     // Project notes
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all ongoing projects (sorted by creation date):**
```javascript
db.ongoingprojects.find({}).sort({ created_at: -1 })
```

**Find a specific project by ID:**
```javascript
db.ongoingprojects.findOne({ _id: ObjectId("...") })
```

**Find active projects (not completed):**
```javascript
db.ongoingprojects.find({ status: { $ne: "Completed" } })
```

**Create a new ongoing project:**
```javascript
db.ongoingprojects.insertOne({
  project_name: "Website Redesign",
  client: "Acme Corp",
  description: "Complete website redesign",
  start_date: new Date("2024-01-01"),
  deadline: new Date("2024-03-01"),
  project_value: 5000,
  status: "Planning",
  color: "#3b82f6",
  progress_percentage: 0,
  stages: [
    { name: "Discovery & Planning", completed: false, notes: "" },
    { name: "Design", completed: false, notes: "" },
    { name: "Development", completed: false, notes: "" },
    { name: "Testing", completed: false, notes: "" },
    { name: "Deployment", completed: false, notes: "" }
  ],
  tasks: [],
  notes: "",
  created_at: new Date(),
  updated_at: new Date()
})
```

**Update an ongoing project:**
```javascript
db.ongoingprojects.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      progress_percentage: 50,
      status: "In Progress",
      updated_at: new Date()
    }
  }
)
```

**Update project stages:**
```javascript
db.ongoingprojects.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      stages: [
        { name: "Discovery & Planning", completed: true, notes: "Done" },
        { name: "Design", completed: true, notes: "Done" },
        { name: "Development", completed: false, notes: "" },
        { name: "Testing", completed: false, notes: "" },
        { name: "Deployment", completed: false, notes: "" }
      ],
      updated_at: new Date()
    }
  }
)
```

**Delete an ongoing project:**
```javascript
db.ongoingprojects.deleteOne({ _id: ObjectId("...") })
```

---

## 3. `calendarevents`

Stores calendar events and appointments.

### Schema
```javascript
{
  _id: ObjectId,
  title: String,                     // Event title
  date: Date,                        // Event date
  start_time: String,                // Start time (HH:mm format)
  end_time: String,                  // End time (HH:mm format)
  category: String,                  // Client Work, Sales, Learning, Marketing, Admin, Meeting, Personal
  description: String,               // Event description
  completed: Boolean,                // Whether event is completed
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all calendar events (sorted by date):**
```javascript
db.calendarevents.find({}).sort({ date: -1 })
```

**Find events for a specific date:**
```javascript
db.calendarevents.find({
  date: {
    $gte: ISODate("2024-01-15T00:00:00Z"),
    $lt: ISODate("2024-01-16T00:00:00Z")
  }
})
```

**Find upcoming events:**
```javascript
db.calendarevents.find({
  date: { $gte: new Date() },
  completed: false
}).sort({ date: 1 })
```

**Create a new calendar event:**
```javascript
db.calendarevents.insertOne({
  title: "Client Meeting",
  date: new Date("2024-01-15"),
  start_time: "10:00",
  end_time: "11:00",
  category: "Client Work",
  description: "Discussion about project requirements",
  completed: false,
  created_at: new Date(),
  updated_at: new Date()
})
```

**Update event completion status:**
```javascript
db.calendarevents.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      completed: true,
      updated_at: new Date()
    }
  }
)
```

**Delete a calendar event:**
```javascript
db.calendarevents.deleteOne({ _id: ObjectId("...") })
```

---

## 4. `expenses`

Stores expense records and financial tracking.

### Schema
```javascript
{
  _id: ObjectId,
  description: String,               // Expense description
  amount: Number,                    // Expense amount in dollars
  category: String,                  // Software & Tools, Marketing & Ads, Education & Training, Hardware & Equipment, Hosting & Infrastructure, Subscriptions, Freelancers & Contractors, Office & Supplies, Other
  date: Date,                        // Expense date
  recurring: Boolean,                // Whether expense is recurring
  notes: String,                     // Additional notes
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all expenses (sorted by date):**
```javascript
db.expenses.find({}).sort({ date: -1 })
```

**Find expenses for a specific month:**
```javascript
db.expenses.find({
  date: {
    $gte: ISODate("2024-01-01T00:00:00Z"),
    $lt: ISODate("2024-02-01T00:00:00Z")
  }
})
```

**Find recurring expenses:**
```javascript
db.expenses.find({ recurring: true })
```

**Calculate total expenses:**
```javascript
db.expenses.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" }
    }
  }
])
```

**Calculate expenses by category:**
```javascript
db.expenses.aggregate([
  {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } }
])
```

**Create a new expense:**
```javascript
db.expenses.insertOne({
  description: "Adobe Creative Cloud",
  amount: 52.99,
  category: "Software & Tools",
  date: new Date("2024-01-15"),
  recurring: true,
  notes: "Monthly subscription",
  created_at: new Date(),
  updated_at: new Date()
})
```

**Delete an expense:**
```javascript
db.expenses.deleteOne({ _id: ObjectId("...") })
```

---

## 5. `learningitems`

Stores learning and development goals.

### Schema
```javascript
{
  _id: ObjectId,
  title: String,                     // Learning goal title
  description: String,               // Goal description
  category: String,                  // Technical Skills, Business & Marketing, Design, Personal Development, Industry Knowledge
  status: String,                    // Not Started, In Progress, Completed, On Hold
  progress_percentage: Number,       // Progress percentage (0-100)
  start_date: Date,                  // Start date
  target_date: Date,                 // Target completion date
  priority: String,                  // Low, Medium, High
  notes: String,                     // Progress notes
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all learning items (sorted by creation date):**
```javascript
db.learningitems.find({}).sort({ created_at: -1 })
```

**Find learning items by status:**
```javascript
db.learningitems.find({ status: "In Progress" })
```

**Find high priority learning items:**
```javascript
db.learningitems.find({ priority: "High" })
```

**Create a new learning item:**
```javascript
db.learningitems.insertOne({
  title: "React Advanced Patterns",
  description: "Learn advanced React patterns and hooks",
  category: "Technical Skills",
  status: "Not Started",
  progress_percentage: 0,
  start_date: new Date("2024-01-01"),
  target_date: new Date("2024-03-01"),
  priority: "Medium",
  notes: "",
  created_at: new Date(),
  updated_at: new Date()
})
```

**Update learning item progress:**
```javascript
db.learningitems.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      progress_percentage: 75,
      status: "In Progress",
      updated_at: new Date()
    }
  }
)
```

**Delete a learning item:**
```javascript
db.learningitems.deleteOne({ _id: ObjectId("...") })
```

---

## 6. `projectpipeline`

Stores sales pipeline projects and opportunities.

### Schema
```javascript
{
  _id: ObjectId,
  project_name: String,              // Project name
  client: String,                    // Client name
  stage: String,                     // Lead, Proposal, Negotiation, Closed-Won, Closed-Lost
  estimated_value: Number,           // Estimated project value
  expected_close_date: Date,         // Expected close date
  notes: String,                     // Project notes
  contact_email: String,             // Contact email
  last_contact_date: Date,           // Last contact date
  created_at: Date,
  updated_at: Date
}
```

### MongoDB Queries

**Find all pipeline projects (sorted by creation date):**
```javascript
db.projectpipeline.find({}).sort({ created_at: -1 })
```

**Find projects by stage:**
```javascript
db.projectpipeline.find({ stage: "Proposal" })
```

**Find active pipeline (excluding closed):**
```javascript
db.projectpipeline.find({
  stage: { $nin: ["Closed-Won", "Closed-Lost"] }
})
```

**Calculate pipeline value:**
```javascript
db.projectpipeline.aggregate([
  {
    $match: {
      stage: { $nin: ["Closed-Won", "Closed-Lost"] }
    }
  },
  {
    $group: {
      _id: null,
      totalValue: { $sum: "$estimated_value" }
    }
  }
])
```

**Find won projects:**
```javascript
db.projectpipeline.find({ stage: "Closed-Won" })
```

**Create a new pipeline project:**
```javascript
db.projectpipeline.insertOne({
  project_name: "Website Redesign",
  client: "Acme Corp",
  stage: "Lead",
  estimated_value: 10000,
  expected_close_date: new Date("2024-02-01"),
  notes: "Initial inquiry",
  contact_email: "contact@acmecorp.com",
  last_contact_date: new Date("2024-01-15"),
  created_at: new Date(),
  updated_at: new Date()
})
```

**Update pipeline project stage:**
```javascript
db.projectpipeline.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      stage: "Closed-Won",
      updated_at: new Date()
    }
  }
)
```

**Delete a pipeline project:**
```javascript
db.projectpipeline.deleteOne({ _id: ObjectId("...") })
```

---

## Indexes

### Recommended Indexes

**visionprogress:**
```javascript
db.visionprogress.createIndex({ created_at: -1 })
```

**ongoingprojects:**
```javascript
db.ongoingprojects.createIndex({ created_at: -1 })
db.ongoingprojects.createIndex({ status: 1 })
db.ongoingprojects.createIndex({ client: 1 })
```

**calendarevents:**
```javascript
db.calendarevents.createIndex({ date: -1 })
db.calendarevents.createIndex({ completed: 1 })
db.calendarevents.createIndex({ category: 1 })
```

**expenses:**
```javascript
db.expenses.createIndex({ date: -1 })
db.expenses.createIndex({ category: 1 })
db.expenses.createIndex({ recurring: 1 })
```

**learningitems:**
```javascript
db.learningitems.createIndex({ created_at: -1 })
db.learningitems.createIndex({ status: 1 })
db.learningitems.createIndex({ priority: 1 })
```

**projectpipeline:**
```javascript
db.projectpipeline.createIndex({ created_at: -1 })
db.projectpipeline.createIndex({ stage: 1 })
db.projectpipeline.createIndex({ client: 1 })
```

---

## Notes

- All collections use `_id` as the primary key (MongoDB default)
- All collections include `created_at` and `updated_at` timestamps
- Date fields should be stored as BSON Date objects
- Number fields for currency should be stored as Numbers (consider using Decimal128 for financial precision in production)
- Arrays in stages and tasks maintain order
