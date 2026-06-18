import { useState } from "react";
import api from "../services/api";

export default function Appointments() {

  const [appointments, setAppointments] =
    useState([]);

  const [doctorName, setDoctorName] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");
    

  const addAppointment = () => {

    const newAppointment = {
      doctor: doctorName,
      date,
      time
    };

    setAppointments([
      ...appointments,
      newAppointment
    ]);

    setDoctorName("");
    setDate("");
    setTime("");
  };

  useEffect(()=>{

api.get(
"/appointments/1"
)
.then(res=>
setAppointments(
res.data
)
);

},[]);

  return (
    <div
      style={{
        padding:"30px"
      }}
    >

      <h1>
        📅 Appointment Management
      </h1>

      <div
        style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"15px",
          marginTop:"20px"
        }}
      >

        <h2>
          Schedule Appointment
        </h2>

        <input
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e)=>
            setDoctorName(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e)=>
            setDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="time"
          value={time}
          onChange={(e)=>
            setTime(
              e.target.value
            )
          }
        />

        <br /><br />

        <button
          onClick={addAppointment}
        >
          Add Appointment
        </button>

      </div>

      <div
        style={{
          marginTop:"30px"
        }}
      >
        <h2>
          Upcoming Appointments
        </h2>

        <table
          style={{
            width:"100%"
          }}
        >
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>

            {
              appointments.map(
                (
                  item,
                  index
                ) => (
                  <tr key={index}>
                    <td>
                      {item.doctor}
                    </td>

                    <td>
                      {item.date}
                    </td>

                    <td>
                      {item.time}
                    </td>
                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}