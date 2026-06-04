"use client";
import { useState } from "react";

export default function OTPInput({ length = 6, onChange }) {
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    onChange(newOtp.join(""));

    // Auto focus next
    if (value && index < length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          className="w-12 h-12 text-center border rounded-xl text-lg font-bold"
        />
      ))}
    </div>
  );
}