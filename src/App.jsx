import React from "react";
import BookingForm from "src/components/BookingForm";
import Header from "src/components/Header";
import "./app.css";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="wrap relative z-10">
        <Header />
        <BookingForm />
      </div>
    </div>
  );
}

export default App;
