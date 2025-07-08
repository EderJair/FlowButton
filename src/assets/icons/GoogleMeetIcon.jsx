// src/assets/icons/GoogleMeetIcon.jsx
import * as React from "react";

const GoogleMeetIcon = (props) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Main video screen */}
    <rect
      x="2"
      y="6"
      width="14"
      height="10"
      rx="2"
      fill="currentColor"
      opacity="0.9"
    />
    
    {/* Camera/recording part */}
    <path
      d="M16 9.5l4.5-2.25a1 1 0 0 1 1.5.87v8.76a1 1 0 0 1-1.5.87L16 14.5v-5z"
      fill="currentColor"
      opacity="0.7"
    />
    
    {/* Inner screen */}
    <rect
      x="4"
      y="8"
      width="10"
      height="6"
      rx="1"
      fill="white"
      opacity="0.2"
    />
    
    {/* Meet dots pattern */}
    <circle cx="6" cy="10" r="0.8" fill="white" opacity="0.6"/>
    <circle cx="8.5" cy="10" r="0.8" fill="white" opacity="0.6"/>
    <circle cx="11" cy="10" r="0.8" fill="white" opacity="0.6"/>
    
    {/* Bottom indicator */}
    <rect
      x="7"
      y="18"
      width="10"
      height="2"
      rx="1"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
);

export default GoogleMeetIcon;