// src/assets/icons/GoogleCalendarIcon.jsx
import * as React from "react";

const GoogleCalendarIcon = (props) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Calendar base */}
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      fill="currentColor"
      opacity="0.9"
    />
    
    {/* Calendar header */}
    <rect
      x="3"
      y="4"
      width="18"
      height="4"
      rx="2"
      fill="currentColor"
    />
    
    {/* Calendar rings/holes */}
    <rect
      x="7"
      y="2"
      width="1"
      height="4"
      rx="0.5"
      fill="currentColor"
      opacity="0.7"
    />
    <rect
      x="16"
      y="2"
      width="1"
      height="4"
      rx="0.5"
      fill="currentColor"
      opacity="0.7"
    />
    
    {/* Calendar grid lines */}
    <line x1="6" y1="10" x2="18" y2="10" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <line x1="6" y1="14" x2="18" y2="14" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <line x1="6" y1="16" x2="18" y2="16" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    
    <line x1="9" y1="8" x2="9" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <line x1="12" y1="8" x2="12" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    <line x1="15" y1="8" x2="15" y2="18" stroke="white" strokeWidth="0.5" opacity="0.3"/>
    
    {/* Date number */}
    <text
      x="12"
      y="15"
      textAnchor="middle"
      fill="white"
      fontSize="6"
      fontWeight="bold"
      opacity="0.8"
    >
      15
    </text>
    
    {/* Small event dots */}
    <circle cx="7.5" cy="11" r="0.8" fill="#4285f4" opacity="0.8"/>
    <circle cx="16.5" cy="13" r="0.8" fill="#ea4335" opacity="0.8"/>
    <circle cx="10.5" cy="17" r="0.8" fill="#34a853" opacity="0.8"/>
  </svg>
);

export default GoogleCalendarIcon;