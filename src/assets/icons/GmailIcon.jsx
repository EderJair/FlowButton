// src/assets/icons/GmailIcon.jsx

import * as React from "react";

const GmailIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 49.4 512 399.42"
    // Puedes quitar width="1em" height="1em" aquí, ya que los controlarás con Tailwind en SpotlightCard
    {...props} // Esto permite pasarle clases (como w-3/4, h-3/4, text-white) desde el componente padre
  >
    <g fill="none" fillRule="evenodd">
      <g fillRule="nonzero">
        {/* Cambia el fill a "currentColor" */}
        <path fill="currentColor" d="M34.91 448.818h81.454V251L0 163.727V413.91c0 19.287 15.622 34.91 34.91 34.91z" />
        {/* Cambia el fill a "currentColor" */}
        <path fill="currentColor" d="M395.636 448.818h81.455c19.287 0 34.909-15.622 34.909-34.909V163.727L395.636 251z" />
        {/* Cambia el fill a "currentColor" */}
        <path fill="currentColor" d="M395.636 99.727V251L512 163.727v-46.545c0-43.142-49.25-67.782-83.782-41.891z" />
      </g>
      {/* Cambia el fill a "currentColor" */}
      <path fill="currentColor" d="M116.364 251V99.727L256 204.455 395.636 99.727V251L256 355.727z" />
      {/* Cambia el fill a "currentColor" */}
      <path fill="currentColor" fillRule="nonzero" d="M0 117.182v46.545L116.364 251V99.727L83.782 75.291C49.25 49.4 0 74.04 0 117.18z" />
    </g>
  </svg>
);

export default GmailIcon;