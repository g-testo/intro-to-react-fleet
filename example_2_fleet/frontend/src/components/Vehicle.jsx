import "./Vehicle.css";

function Vehicle({ vehicle }) {
  return (
    <div className="vehicle-card">
      <h2>{vehicle.make} {vehicle.model}</h2>
      <p><strong>Year:</strong> {vehicle.year}</p>
      <p><strong>Status:</strong> {vehicle.status}</p>
      <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
      {vehicle.driver && (
        <p><strong>Driver:</strong> {vehicle.driver.name}</p>
      )}
    </div>
  );
}

export default Vehicle;