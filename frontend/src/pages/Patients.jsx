import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/patients")
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredPatients =
patients.filter(
(patient)=>

patient.name
.toLowerCase()
.includes(
search.toLowerCase()
)

||

patient.disease
.toLowerCase()
.includes(
search.toLowerCase()
)

||

patient.risk_level
.toLowerCase()
.includes(
search.toLowerCase()
)
);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>👨‍⚕️ Patients List</h1>

      <input
        type="text"
        placeholder="🔍 Search Patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      />

      {filteredPatients.length === 0 ? (
        <div
          style={{
            marginTop: "20px",
            color: "#ef4444",
            fontWeight: "bold",
          }}
        >
          ❌ No patients found
        </div>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Age</th>
    <th>Gender</th>
    <th>Disease</th>
    <th>Risk Score</th>
    <th>Risk Level</th>
  </tr>
</thead>

          <tbody>
  {filteredPatients.map((patient) => (
    <tr
      key={patient.patient_id}
      onClick={() =>
        navigate(`/patient/${patient.patient_id}`)
      }
      style={{
        cursor: "pointer",
      }}
    >
      <td>{patient.patient_id}</td>
      <td>{patient.name}</td>
      <td>{patient.age}</td>
      <td>{patient.gender}</td>
      <td>{patient.disease}</td>
      <td>{patient.risk_score}</td>

      <td>
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "6px",
            color: "white",
            backgroundColor:
              patient.risk_level === "Critical Risk"
                ? "#ef4444"
                : patient.risk_level === "High Risk"
                ? "#f97316"
                : patient.risk_level === "Medium Risk"
                ? "#f59e0b"
                : "#22c55e",
          }}
        >
          {patient.risk_level}
        </span>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      )}
    </div>
  );
}

export default Patients;