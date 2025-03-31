import { useState, useEffect, FormEvent } from "react";
import "./App.css";

// Define Vehicle type
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: "active" | "inactive" | "maintenance";
  licensePlate: string;
  driver?: {
    id: string;
    name: string;
    licenseNumber: string;
    phone: string;
  } | null;
}

const localBackend = "http://localhost:8080";
const remoteBackend = "https://vehicle-nodejs-f86017c3206b.herokuapp.com";

const backendUrl = remoteBackend || localBackend;

const App = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newMake, setNewMake] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [newStatus, setNewStatus] = useState<"active" | "inactive" | "maintenance">("active");
  const [newLicensePlate, setNewLicensePlate] = useState<string>("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendUrl + "/api/vehicles");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data: Vehicle[] = await response.json();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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
    } catch (err: any) {
      setError(err.message);
    }
  };

  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 20 }, (_, i) => currentYear - i);

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

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as "active" | "inactive" | "maintenance")}
        >
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
          <div className="vehicle-card" key={vehicle.id}>
            <h2>
              {vehicle.make} {vehicle.model}
            </h2>
            <p>
              <strong>Year:</strong> {vehicle.year}
            </p>
            <p>
              <strong>Status:</strong> {vehicle.status}
            </p>
            <p>
              <strong>License Plate:</strong> {vehicle.licensePlate}
            </p>
            {vehicle.driver && (
              <p>
                <strong>Driver:</strong> {vehicle.driver.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
