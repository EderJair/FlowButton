// src/assets/icons/XIcon.jsx
import * as React from "react";

const XIcon = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white" // <--- Aquí se fuerza el color blanco
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.21-.775-3.67 5.068H1.36l7.542-9.2L2 2.25h8.541L14.5 10.27l3.744-8.02zM12.87 19.395l-1.634-2.264-7.542 7.542 1.634 2.264 7.542-7.542z" />
  </svg>
);

export default XIcon;