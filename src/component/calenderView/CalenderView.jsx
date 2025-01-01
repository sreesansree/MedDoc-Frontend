// components/CalendarView.js
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import axios from "axios";
import api from "../../api/renderApi.js";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/api/users/user-appointments");
        const formattedAppointments = response.data.map((appointment) => {
          // Combine date and time using moment
          const startDateTime = moment(
            `${appointment.date} ${appointment.startTime}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();
          const endDateTime = moment(
            `${appointment.date} ${appointment.endTime}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();

          return {
            title: `Consultation with Dr. ${appointment.doctor.name}`,
            start: startDateTime,
            end: endDateTime,
            allDay: false,
          };
        });
        console.log(formattedAppointments,"Formatted Appointments");
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">My Calendar</h2>
      <div className="bg-white shadow-md p-4 rounded-lg">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          defaultView="week"
          views={["month", "week", "day"]}
          selectable
          popup
          onSelectEvent={(event) => alert(event.title)}
        />
      </div>
    </div>
  );
};

export default CalendarView;
