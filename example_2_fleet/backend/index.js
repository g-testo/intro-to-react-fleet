// vehicles-api.js
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const vehicles = require("./vehicles.json"); // Import the data file

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

// Utility function to create hashed ID
const createVehicleId = (make, model) => {
  return crypto
    .createHash("sha256")
    .update(make + model + Date.now())
    .digest("hex");
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

// GET /api/vehicles - Get all vehicles
app.get("/api/vehicles", (req, res) => {
  res.json(vehicles);
});

// GET /api/vehicles/:id - Get vehicle by ID
app.get("/api/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }
  res.json(vehicle);
});

// POST /api/vehicles - Create a vehicle
app.post("/api/vehicles", (req, res) => {
  const { make, model, year, status, licensePlate } = req.body;

  // Validate required fields
  if (!make || !model || !year || !status || !licensePlate) {
    return res.status(400).json({ error: "Make, model, year, status, and license plate are required" });
  }

  const newVehicle = {
    id: createVehicleId(make, model),
    make,
    model,
    year,
    status,
    licensePlate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  vehicles.unshift(newVehicle);
  res.status(201).json(newVehicle);
});

// PUT /api/vehicles/:id - Update a vehicle
app.put("/api/vehicles/:id", (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const { make, model } = req.body;

  if (!make || !model) {
    return res.status(400).json({ error: "Make and model are required" });
  }

  vehicle.make = make;
  vehicle.model = model;
  vehicle.updatedAt = new Date();

  res.json(vehicle);
});

// DELETE /api/vehicles/:id - Delete a vehicle
app.delete("/api/vehicles/:id", (req, res) => {
  const vehicleIndex = vehicles.findIndex((v) => v.id === req.params.id);
  if (vehicleIndex === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  vehicles.splice(vehicleIndex, 1);
  res.status(204).send();
});

// Global error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Vehicle API running on port ${PORT}`);
});
