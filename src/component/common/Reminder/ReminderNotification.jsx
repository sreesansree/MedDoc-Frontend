import React from "react";
import { useSelector } from "react-redux";

const ReminderNotification = () => {
  const reminders = useSelector((state) => state.reminders);

  return (
    <div className="notification-menu">
      {reminders.map((reminder, index) => (
        <div key={index} className="reminder-item">
          {reminder.message}
        </div>
      ))}
    </div>
  );
};

export default ReminderNotification;
