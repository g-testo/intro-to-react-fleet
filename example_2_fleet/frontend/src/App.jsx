import { useState, useEffect } from "react";
import Vehicle from "./components/Vehicle";
import "./App.css";

const localBackend = "http://localhost:8080";
const remoteBackend = "https://vehicle-nodejs-f86017c3206b.herokuapp.com";

const backendUrl = remoteBackend || localBackend;

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMake, setNewMake] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newStatus, setNewStatus] = useState("active");
  const [newLicensePlate, setNewLicensePlate] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "/api/vehicles");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendUrl + "/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          make: newMake,
          model: newModel,
          year: newYear,
          status: newStatus,
          licensePlate: newLicensePlate,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      setNewMake("");
      setNewModel("");
      setNewYear(new Date().getFullYear());
      setNewStatus("active");
      setNewLicensePlate("");
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>Vehicle Fleet</h1>

      <form className="create-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Make" value={newMake} onChange={(e) => setNewMake(e.target.value)} required />
        <input
          type="text"
          placeholder="Model"
          value={newModel}
          onChange={(e) => setNewModel(e.target.value)}
          required
        />

        <select value={newYear} onChange={(e) => setNewYear(Number(e.target.value))}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input
          type="text"
          placeholder="License Plate"
          value={newLicensePlate}
          onChange={(e) => setNewLicensePlate(e.target.value)}
          required
        />

        <button type="submit">Add Vehicle</button>
      </form>

      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <Vehicle key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}

export default App;
