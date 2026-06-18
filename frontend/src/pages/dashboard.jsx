import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import RiskChart from "../components/RiskChart";
import DiseaseChart from "../components/DiseaseChart";
import GenderChart from "../components/GenderChart";
import AgeGroupChart from "../components/AgeGroupChart";

function Dashboard() {
  const [riskData, setRiskData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);

  const [stats, setStats] = useState({});
  const [highRisk, setHighRisk] = useState({});
  const [diseaseCount, setDiseaseCount] = useState({});

  const [topPatients, setTopPatients] = useState([]);
  const [criticalPatients, setCriticalPatients] = useState([]);

  const [notifications, setNotifications] = useState({});
  const [criticalDetails, setCriticalDetails] = useState([]);
  const [summary, setSummary] = useState({});

  const [time,setTime] = useState(new Date());

const [aiInsights,setAiInsights] =
useState({});
  
  

  useEffect(()=>{

  api.get("/dashboard-summary")
  .then(res =>
    setSummary(res.data)
  );

  const interval =
    setInterval(() => {

      api.get("/notifications")
      .then(res =>
        setNotifications(res.data)
      );

    },30000);

  return () => {
    clearInterval(interval);
  };

},[]);

useEffect(() => {

  const clock = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => {
    clearInterval(clock);
  };

}, []);

useEffect(() => {
    api.get("/risk-summary")
      .then((res) => setRiskData(res.data))
      .catch(console.error);

    api.get("/disease-distribution")
      .then((res) => setDiseaseData(res.data))
      .catch(console.error);

    api.get("/gender-distribution")
      .then((res) => setGenderData(res.data))
      .catch(console.error);

    api.get("/age-groups")
      .then((res) => setAgeGroups(res.data))
      .catch(console.error);

    api.get("/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);

    api.get("/high-risk-count")
      .then((res) => setHighRisk(res.data))
      .catch(console.error);

    api.get("/disease-count")
      .then((res) => setDiseaseCount(res.data))
      .catch(console.error);

    api.get("/top-risk-patients")
      .then((res) => setTopPatients(res.data))
      .catch(console.error);

    api.get("/critical-patients")
      .then((res) => setCriticalPatients(res.data))
      .catch(console.error);

    api.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch(console.error);

    api.get("/critical-patient-details")
      .then((res) => setCriticalDetails(res.data))
      .catch(console.error);

    useEffect(() => {

  const clock =
    setInterval(() => {
      setTime(new Date());
    },1000);

  return () => {
    clearInterval(clock);
  };

},[]);

api.get("/ai-insights")
.then(res=>
setAiInsights(
res.data
)
);

  }, []);

  return (

    <div
  style={{
    minHeight: "100vh",
    padding: "30px",
    maxWidth: "1600px",
    margin: "0 auto",
    background:
      "linear-gradient(135deg,#020617,#0f172a,#111827)",
    color: "white",
  }}
>
      <h1
  style={{
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "35px",
    textAlign: "center",
    background:
      "linear-gradient(90deg,#60a5fa,#06b6d4,#34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
        🏥 Healthcare Analytics Dashboard
      </h1>
      <h3>

Welcome,

{
localStorage.getItem(
"role"
)==="admin"
?
"Administrator"
:
"Doctor"
}

</h3>
<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"15px",
marginBottom:"20px"
}}
>
<h2>
🧠 AI Insights
</h2>
<div
style={{
marginBottom:"25px"
}}
>
<input
placeholder="🔍 Search Patient Name, Disease, ID..."
style={{
width:"100%",
padding:"15px",
borderRadius:"12px",
border:"none",
fontSize:"16px"
}}
/>
</div>

<p>
Prediction:
{
aiInsights.prediction
}
</p>

<p>
Confidence:
{
aiInsights.confidence
}
</p>

<p>
Forecast:
{
aiInsights.risk_forecast
}
</p>

</div>
      <div
  style={{
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      background: "#065f46",
      padding: "10px 20px",
      borderRadius: "999px",
    }}
  >
    🟢 System Online
  </div>

  <div
    style={{
      background: "#1e293b",
      padding: "10px 20px",
      borderRadius: "999px",
    }}
  >
    📡 AI Monitoring Active
  </div>

  <div
    style={{
      background: "#1e293b",
      padding: "10px 20px",
      borderRadius: "999px",
    }}
  >
    🏥 Healthcare Analytics
  </div>
</div>

<div
style={{
background:"#1e293b",
padding:"10px 20px",
borderRadius:"999px"
}}
>
🕒
{
time.toLocaleTimeString()
}
</div>

<div
style={{
background:"#1e293b",
padding:"25px",
borderRadius:"15px",
marginBottom:"25px"
}}
>

<h2>
📋 Executive Summary
</h2>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px",
marginTop:"20px"
}}
>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>
📈 Monthly Growth
</h3>

<p>
+12.4%
</p>
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>
🧠 AI Accuracy
</h3>

<p>
94%
</p>
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
<h3>
🏥 Active Monitoring
</h3>

<p>
363 Patients
</p>
</div>

</div>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap:"15px"
}}
>

<div>
<h3>
🏥 Total Patients
</h3>

<p>
{
stats.total_patients || 0
}
</p>
</div>

<div>
<h3>
⚠ High Risk
</h3>

<p>
{
highRisk.high_risk_patients || 0
}
</p>
</div>

<div>
<h3>
🚨 Critical
</h3>

<p>
{
notifications.critical || 0
}
</p>
</div>

<div>
<h3>
🧠 AI Forecast
</h3>

<p>
32 Predicted Cases
</p>
</div>

</div>

</div>

      {/* KPI Cards */}

      <div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px"
}}
>
<h2>
🏥 Platform Status
</h2>

<p>
Status:
{
summary.status || "Loading..."
}
</p>

<p>
Patients:
{
summary.patients || 0
}
</p>

<p>
Critical:
{
summary.critical || 0
}
</p>

</div>

      <div
style={{
background:"#065f46",
padding:"20px",
borderRadius:"12px",
marginTop:"20px"
}}
>
<h2>
System Health
</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"15px",
marginTop:"20px"
}}
>

<div
style={{
background:"#065f46",
padding:"15px",
borderRadius:"10px"
}}
>
🟢 Database
Online
</div>

<div
style={{
background:"#065f46",
padding:"15px",
borderRadius:"10px"
}}
>
🟢 AI Engine
Active
</div>

<div
style={{
background:"#065f46",
padding:"15px",
borderRadius:"10px"
}}
>
🟢 APIs
Healthy
</div>

</div>

<p>
Database:
🟢 Connected
</p>

<p>
AI Engine:
🟢 Active
</p>

<p>
Analytics:
🟢 Running
</p>
</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <div
  style={{
    background: "#0f172a",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}
>
  <h3>Total Patients</h3>
  <h1>{stats.total_patients}</h1>
</div>

        <div
          style={{
            background: "#0f172a",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}

          onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}

        >
          <h3>High Risk Patients</h3>
          <h1>{highRisk.high_risk_patients || 0}</h1>
        </div>

        <div
          style={{
            background: "#0f172a",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}

          onMouseEnter={(e) => {
    e.currentTarget.style.transform =
      "translateY(-5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "translateY(0px)";
  }}

        >
          <h3>Diseases</h3>
          <h1>{diseaseCount.total_diseases || 0}</h1>
        </div>

        <div
          style={{
            background:
  "linear-gradient(135deg,#991b1b,#dc2626)",
boxShadow:
  "0 8px 30px rgba(220,38,38,0.35)",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <h3>Critical Patients</h3>
          <h1>{notifications.critical || 0}</h1>
        </div>
      </div>

      <br />

      <Link to="/patients">
        <button
  style={{
    padding: "14px 28px",
    borderRadius: "12px",
    cursor: "pointer",
    border: "none",
    color: "white",
    fontWeight: "600",
    background:
      "linear-gradient(90deg,#2563eb,#06b6d4)",
    boxShadow:
      "0 6px 20px rgba(37,99,235,0.35)",
  }}
>
          View Patients
        </button>

         <div
style={{
display:"flex",
gap:"15px",
marginTop:"20px",
flexWrap:"wrap"
}}
>

<a
href="http://127.0.0.1:8000/export-patients"
target="_blank"
rel="noreferrer"
>
<button>
📄 Export Patients
</button>
</a>

<a
href="http://127.0.0.1:8000/export-high-risk"
target="_blank"
rel="noreferrer"
>
<button>
🚨 Export High Risk
</button>
</a>

<button>
📑 Export PDF
</button>

</div>

        <div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"15px",
marginTop:"25px"
}}
>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
📄 Export Reports
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
📅 Manage Appointments
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
🧠 AI Forecast
</div>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px"
}}
>
⚙ System Settings
</div>

</div>
      </Link>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            background: "rgba(30,41,59,0.85)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(255,255,255,0.08)",
boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Risk Summary</h2>
          <RiskChart data={riskData} />
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Disease Distribution</h2>
          <DiseaseChart data={diseaseData} />
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Gender Distribution</h2>
          <GenderChart data={genderData} />
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>Age Groups</h2>
          <AgeGroupChart data={ageGroups} />
        </div>
      </div>

      <div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"12px",
marginTop:"30px"
}}
>

<h2>
📈 AI Risk Forecast
</h2>

<p>
Current Forecast:
32 Patients may become High Risk
within 30 Days
</p>

<p>
Confidence:
94%
</p>

<p>
Recommended Action:
Increase monitoring frequency
</p>

</div>

<div
style={{
background:"#0f172a",
padding:"20px",
borderRadius:"12px",
marginTop:"30px"
}}
>

<h2>
🧠 AI Recommendation Center
</h2>

<div
style={{
background:"#1e293b",
padding:"20px",
borderRadius:"12px",
marginTop:"20px"
}}
>

<h2>
📊 Risk Forecast
</h2>

<p>
Current High Risk:
363
</p>

<p>
Predicted Next Month:
401
</p>

<p>
Growth:
+10.4%
</p>

</div>

<ul>

<li>
Monitor Diabetic Patients
</li>

<li>
Schedule Follow-Up Visits
</li>

<li>
Increase BP Monitoring
</li>

<li>
Review Critical Cases Daily
</li>

</ul>

</div>

      {/* Notification Center */}

      <div
        style={{
          background:
  "linear-gradient(135deg,#7f1d1d,#dc2626)",
boxShadow:
  "0 10px 30px rgba(220,38,38,0.35)",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "40px",
        }}
      >
        <h2
style={{
animation:
"pulse 1.5s infinite"
}}
>
🚨 Notification Center
</h2>

<style>
{`
@keyframes pulse{
0%{
opacity:1;
}
50%{
opacity:.5;
}
100%{
opacity:1;
}
}
`}
</style>

        <p>🔴 Critical Patients: {notifications.critical || 0}</p>

        <p>🟠 High Risk Patients: {notifications.high || 0}</p>
      </div>

      {/* Critical Patient Details */}

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "25px",
        }}
      >
        <h2>🚨 Critical Patient Details</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Disease</th>
              <th>Risk Score</th>
            </tr>
          </thead>

          <tbody>
            {criticalDetails.map((p) => (
              <tr key={p.patient_id}>
                <td>{p.name}</td>
                <td>{p.disease}</td>
                <td>{p.Risk_Score || p.risk_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Critical Alerts */}

      <div style={{ marginTop: "40px" }}>
        <h2>🚨 Critical Patient Alerts</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "15px",
          }}
        >
          {criticalPatients.map((p) => (
            <div
              key={p.patient_id}
              style={{
                background: "#991b1b",
                padding: "15px",
                borderRadius: "12px",
              }}
            >
              <h4>Patient #{p.patient_id}</h4>
              <p>Disease: {p.disease}</p>
              <p>Risk Score: {p.risk_score}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div
style={{
textAlign:"center",
marginTop:"60px",
opacity:.7
}}
>
<hr/>

<p>
Healthcare Data Pipeline
&
AI Diagnosis Assistant
</p>

<p>
Enterprise Analytics
v1.0
</p>
</div>


      {/* Top Patients */}

      <div style={{ marginTop: "40px" }}>
        <h2>🏆 Top 5 High Risk Patients</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Disease</th>
              <th>Risk Score</th>
            </tr>
          </thead>

          <tbody>
            {topPatients.map((p) => (
              <tr key={p.patient_id}>
                <td>{p.name}</td>
                <td>{p.disease}</td>
                <td>{p.risk_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
style={{
textAlign:"center",
marginTop:"60px",
opacity:.8
}}
>

<hr/>

<h3>
Healthcare Predictive Analytics Platform
</h3>

<p>
AI Diagnosis Assistant
v2.0 Enterprise Edition
</p>

<p>
Built with React,
FastAPI,
Machine Learning
&
Healthcare Analytics
</p>

</div>
</div>

  );
}

export default Dashboard;