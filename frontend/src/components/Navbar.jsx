import { Link } from "react-router-dom";

function Navbar() {

  const role =
    localStorage.getItem("role");

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#0f172a",
        borderBottom: "1px solid #334155",
      }}
    >
      {/* Left Side */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          🏥 Healthcare AI
        </Link>

        {/* Admin Menu */}

        {role === "admin" && (
          <>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/patients"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              👨‍⚕️ Patients
            </Link>

            <Link
              to="/analytics"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              📈 Analytics
            </Link>

            <Link
              to="/ai-chat"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              🧠 AI Assistant
            </Link>
          </>
        )}

        {/* Doctor Menu */}

        {role === "doctor" && (
          <>
            <Link
              to="/"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/patients"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              👨‍⚕️ Patients
            </Link>

            <Link
              to="/appointments"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              📅 Appointments
            </Link>

            <Link
              to="/ai-chat"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              🧠 AI Assistant
            </Link>
          </>
        )}
      </div>

      {/* Right Side */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#065f46",
            color: "white",
            padding: "8px 15px",
            borderRadius: "999px",
          }}
        >
          🟢 System Online
        </div>

        <div
          style={{
            background: "#1e293b",
            color: "white",
            padding: "8px 15px",
            borderRadius: "999px",
          }}
        >
          {role === "admin"
            ? "👨‍💼 Admin"
            : "👨‍⚕️ Doctor"}
        </div>

        <button
          onClick={() => {

            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "role"
            );

            window.location.href =
              "/login";
          }}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;