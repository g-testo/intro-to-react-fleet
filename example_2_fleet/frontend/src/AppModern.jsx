import { useState, useTransition, useEffect } from "react";
import Vehicle from "./components/Vehicle";
import "./AppModern.css";

const localBackend = "http://localhost:8080";
const remoteBackend = "https://vehicle-nodejs-f86017c3206b.herokuapp.com";

const backendUrl = remoteBackend || localBackend;

function VehicleForm({ onSubmit }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState("active");
  const [licensePlate, setLicensePlate] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      await onSubmit({ make, model, year, status, licensePlate });
      setMake("");
      setModel("");
      setYear(currentYear);
      setStatus("active");
      setLicensePlate("");
    });
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required />

      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required />

      <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <input
        type="text"
        placeholder="License Plate"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        required
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Adding Vehicle..." : "Add Vehicle"}
      </button>

      {isPending && <p className="loading-text">Processing your request...</p>}
    </form>
  );
}

function AppModern() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "/api/vehicles");
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (newVehicle) => {
    await fetch(backendUrl + "/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVehicle),
    });
    fetchVehicles();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>Vehicle Fleet</h1>

      <VehicleForm onSubmit={handleFormSubmit} />

      <div className="vehicle-list">
        {vehicles.map((vehicle) => (
          <Vehicle key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}

export default AppModern;
