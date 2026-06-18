import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import RiskTrendChart from "../components/RiskTrendChart";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);

  const [aiDiagnosis, setAiDiagnosis] =
    useState(null);

  const [recommendations,
    setRecommendations] =
    useState([]);

  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] =
    useState("");

  const [appointments,
    setAppointments] =
    useState([]);

  const [doctorName,
    setDoctorName] =
    useState("");

  const [appointmentDate,
    setAppointmentDate] =
    useState("");

  const [appointmentTime,
    setAppointmentTime] =
    useState("");

  const [timeline,
    setTimeline] =
    useState([]);

  const [loadingDiagnosis,
    setLoadingDiagnosis] =
    useState(false);

  useEffect(() => {

  console.log("Notes:", notes);

  api
    .get(`/patient-full/${id}`)
    .then((res) => {
      setPatient(res.data[0]);
    });

  api
    .get(`/notes/${id}`)
    .then((res) => {
      setNotes(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    })
    .catch(() => {
      setNotes([]);
    });

  api
    .get(`/appointments/${id}`)
    .then((res) => {
      setAppointments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    })
    .catch(() => {
      setAppointments([]);
      api
      .get(`/patient-full/${id}`)
      .then((res) => {
        setPatient(res.data[0]);
      });

    api
  .get(`/notes/${id}`)
  .then((res) => {
    setNotes(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  })
      .catch(() => {
        setNotes([]);
      });

    api
      .get(`/appointments/${id}`)
      .then((res) => {
        setAppointments(res.data);
      })
      .catch(() => {
        setAppointments([]);
      });

    api
      .get(`/timeline/${id}`)
      .then((res) => {
        setTimeline(res.data);
      })
      .catch(() => {
        setTimeline([]);
      });
    });

}, [id]);

  const addTimeline = async (
  eventType,
  description
) => {

  try {

    await api.post(
      `/timeline/${id}`,
      {
        event_type:
          eventType,

        description:
          description,
      }
    );

    const res =
      await api.get(
        `/timeline/${id}`
      );

    setTimeline(
      res.data
    );

  } catch (error) {
    console.error(error);
  }
};

const generateDiagnosis =
async () => {

  try {

    setLoadingDiagnosis(
      true
    );

    const response =
      await api.get(
        `/ai-diagnosis/${id}`
      );

    setAiDiagnosis(
      response.data
    );

    const rec =
      await api.get(
        `/recommendations/${id}`
      );

    setRecommendations(
      rec.data
        .recommendations || []
    );

    await addTimeline(
      "AI Diagnosis",
      "AI diagnosis generated"
    );

  } catch (error) {

    console.error(error);

  } finally {

    setLoadingDiagnosis(
      false
    );
  }
};

const saveNote =
async () => {

  if (!newNote.trim())
    return;

  try {

    await api.post(
      `/notes/${id}`,
      {
        note: newNote,
      }
    );

    const res =
      await api.get(
        `/notes/${id}`
      );

    setNotes(
  Array.isArray(res.data)
    ? res.data
    : []
);

    await addTimeline(
      "Doctor Note",
      "Doctor note added"
    );

    setNewNote("");

  } catch (error) {

    console.error(error);

  }
};

const scheduleAppointment =
async () => {

  try {

    await api.post(
      `/appointments/${id}`,
      {
        doctor_name:
          doctorName,

        appointment_date:
          appointmentDate,

        appointment_time:
          appointmentTime,
      }
    );

    const res =
      await api.get(
        `/appointments/${id}`
      );

    setAppointments(
      res.data
    );

    await addTimeline(
      "Appointment",
      `Appointment scheduled with ${doctorName}`
    );

    setDoctorName("");
    setAppointmentDate("");
    setAppointmentTime("");

  } catch (error) {

    console.error(error);

  }
};

if (!patient)
  return <h2>Loading...</h2>;

const bmi =
patient.weight_kg &&
patient.height_cm
? (
    patient.weight_kg /
    ((patient.height_cm / 100) ** 2)
  ).toFixed(1)
: "N/A";

let bmiStatus = "";

if (bmi < 18.5)
  bmiStatus = "Underweight";
else if (bmi < 25)
  bmiStatus = "Normal";
else if (bmi < 30)
  bmiStatus = "Overweight";
else
  bmiStatus = "Obese";

const riskScore =
  patient.risk_score ||
  patient.Risk_Score ||
  0;

const riskLevel =
  patient.risk_level ||
  patient.Risk_Level ||
  "Low";

return (
  <div
    style={{
      padding: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    <h1>🏥 Patient Profile</h1>
    <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  }}
>

<div
style={{
flex:1,
background:"#0f172a",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>Age</h3>
<h1>{patient.age}</h1>
</div>

<div
style={{
flex:1,
background:"#0f172a",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>BMI</h3>
<h1>{bmi}</h1>
</div>

<div
style={{
flex:1,
background:"#0f172a",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>Risk Score</h3>
<h1>{riskScore}</h1>
</div>

</div>

    {/* Basic Info */}

    <div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      fontSize: "42px",
      marginBottom: "10px",
    }}
  >
    🏥 Patient Profile
  </h1>

  <p
    style={{
      color: "#94a3b8",
    }}
  >
    AI Powered Healthcare Analytics
  </p>
</div>

    {/* BMI & Risk */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >

      {
riskScore >= 8 && (
<div
style={{
background:"#991b1b",
padding:"15px",
borderRadius:"12px",
marginBottom:"20px"
}}
>
🚨 Critical Risk Patient

Immediate medical attention recommended.
</div>
)
}

      <h2>📊 Risk Analysis</h2>

      <div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px",
marginTop:"20px"
}}
>
<h2>
📅 Follow Up Tracker
</h2>

<p>
Recommended Follow Up:
</p>

<h3>
Within 7 Days
</h3>

<span
style={{
background:"#f59e0b",
padding:"6px 12px",
borderRadius:"999px"
}}
>
Pending
</span>
</div>

      <p><b>BMI:</b> {bmi}</p>

      <p>
        <b>BMI Status:</b> {bmiStatus}
      </p>

      <p>
        <b>Risk Score:</b> {riskScore}
      </p>

      <p>
  <b>Risk Level:</b>{" "}
  <span
    style={{
      background:
        riskScore >= 8
          ? "#dc2626"
          : riskScore >= 5
          ? "#d97706"
          : "#16a34a",

      color: "white",

      padding: "6px 14px",

      borderRadius: "999px",

      fontWeight: "bold",
    }}
  >
    {riskLevel}
  </span>
</p>
      <div
        style={{
          width: "100%",
          background: "#334155",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: `${riskScore * 10}%`,
            background:
              riskScore >= 8
                ? "#ef4444"
                : riskScore >= 5
                ? "#f59e0b"
                : "#22c55e",
            height: "12px",
          }}
        />
      </div>
    </div>

    {/* Risk Trend */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>📈 Risk Trend Analytics</h2>

      <RiskTrendChart
  patientId={id}
/>
    </div>

    {/* AI Diagnosis */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <button
        onClick={generateDiagnosis}
        style={{
          padding: "12px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow:
"0 5px 15px rgba(37,99,235,.4)"
        }}
      >
        🤖 Generate AI Diagnosis
      </button>

      {loadingDiagnosis && (
        <p style={{ marginTop: "15px" }}>
          Analyzing patient...
        </p>
      )}

      {aiDiagnosis && (
        <div style={{ marginTop: "20px" }}>
          <h2>🤖 AI Diagnosis</h2>

          {aiDiagnosis.diagnosis?.map(
            (item, index) => (
              <div
                key={index}
                style={{
                  background:
  "linear-gradient(135deg,#0f172a,#1e293b)",

border:
  "1px solid #334155",

boxShadow:
  "0 8px 20px rgba(0,0,0,.25)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <h3>{item.disease}</h3>

                <p>
                  Confidence: {item.confidence}%
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>

    <div
style={{
marginTop:"15px"
}}
>
AI Confidence:

<div
style={{
background:"#334155",
height:"12px",
borderRadius:"10px",
marginTop:"8px"
}}
>
<div
style={{
width:"92%",
height:"12px",
borderRadius:"10px",
background:"#22c55e"
}}
/>
</div>
</div>

    {/* Recommendations */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>🤖 AI Recommendations</h2>

      <ul>
        {recommendations.map(
          (item, index) => (
            <li key={index}>
              {item}
            </li>
          )
        )}
      </ul>
    </div>

    {/* Notes */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>🩺 Doctor Notes</h2>

      <textarea
        value={newNote}
        onChange={(e) =>
          setNewNote(e.target.value)
        }
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
        }}
      />

      <button
        onClick={saveNote}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          boxShadow:
"0 5px 15px rgba(37,99,235,.4)"
        }}
      >
        Save Note
        
      </button>

      {Array.isArray(notes) &&
  notes.map((note) => (
    <div
      key={note.id}
      style={{
        marginTop: "10px",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b)",
        border:
          "1px solid #334155",
        boxShadow:
          "0 8px 20px rgba(0,0,0,.25)",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <p>{note.note}</p>
    </div>
  ))}
    </div>

    {/* Appointments */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>📅 Appointment Scheduler</h2>

      <div
  style={{
    background:"#1e293b",
    padding:"20px",
    borderRadius:"12px",
    marginTop:"20px"
  }}
>
  <h2>
    📋 Appointment History
  </h2>

  {appointments.length===0 ? (

    <p>
      No appointments
    </p>

  ) : (

    appointments.map(
      (appointment)=>(
        <div
          key={
            appointment.id
          }
          style={{
            background:"#0f172a",
            padding:"12px",
            borderRadius:"8px",
            marginTop:"10px"
          }}
        >
          <p>
            👨‍⚕️ Doctor:
            {" "}
            {
              appointment.doctor_name
            }
          </p>

          <p>
            📅 Date:
            {" "}
            {
              appointment.appointment_date
            }
          </p>

          <p>
            ⏰ Time:
            {" "}
            {
              appointment.appointment_time
            }
          </p>
        </div>
      )
    )

  )}
</div>

      <input
        placeholder="Doctor Name"
        value={doctorName}
        onChange={(e) =>
          setDoctorName(e.target.value)
        }
      />

      <br /><br />

      <input
        type="date"
        value={appointmentDate}
        onChange={(e) =>
          setAppointmentDate(
            e.target.value
          )
        }
      />

      <br /><br />

      <input
        placeholder="10:30 AM"
        value={appointmentTime}
        onChange={(e) =>
          setAppointmentTime(
            e.target.value
          )
        }
      />

      <br /><br />

      <button
  onClick={scheduleAppointment}
  style={{
    boxShadow:
      "0 5px 15px rgba(37,99,235,.4)",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  Schedule Appointment
</button>
    </div>

    
<a
  href={`http://127.0.0.1:8000/download-report/${id}`}
  target="_blank"
  rel="noreferrer"
  style={{
    textDecoration:"none"
  }}
>
  <button
    style={{
      padding:"12px 20px",
      borderRadius:"10px",
      background:"#059669",
      color:"white",
      border:"none",
      cursor:"pointer"
    }}
  >
    📄 Download PDF Report
  </button>
</a>

    {/* Timeline */}

    <div
      style={{
        background:
  "linear-gradient(135deg,#1e293b,#0f172a)",

border:
  "1px solid #334155",

boxShadow:
  "0 10px 25px rgba(0,0,0,.25)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h2>📋 Patient Timeline</h2>

      {timeline.map((item) => (
        <div
          key={item.id}
          style={{
            background:
  "linear-gradient(135deg,#0f172a,#1e293b)",

border:
  "1px solid #334155",

boxShadow:
  "0 8px 20px rgba(0,0,0,.25)",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          <h4>{item.event_type}</h4>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);
}

export default PatientDetails;