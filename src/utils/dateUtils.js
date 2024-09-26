export const formatTime = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

// Function to format date to "dd/MM/yyyy"
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
