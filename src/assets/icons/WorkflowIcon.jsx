// src/assets/icons/WorkflowIcon.jsx

import * as React from "react";

const WorkflowIcon = (props) => (
  <svg
    width="1000px"
    height="1000px"
    viewBox="0 0 24 24"
    fill="none" // Mantenemos fill="none" ya que el icono es de contorno
    xmlns="http://www.w3.org/2000/svg"
    {...props} // Permite pasarle clases de Tailwind y otras props
  >
    {/* Cambia stroke="#000000" a stroke="currentColor" */}
    <path
      d="M9.99994 15.9999H16.9999M16.9999 15.9999L13.9999 12.9999M16.9999 15.9999L13.9999 19M10.9999 7.99994H20.9999M20.9999 7.99994L18 5M20.9999 7.99994L18 10.9999M4 16H4.01M5 8H5.01M8 8H8.01M7 16H7.01"
      stroke="currentColor" // <-- ¡IMPORTANTE: Cambiado a currentColor!
      strokeWidth="2" // Usamos camelCase para stroke-width
      strokeLinecap="round" // Usamos camelCase para stroke-linecap
      strokeLinejoin="round" // Usamos camelCase para stroke-linejoin
    />
  </svg>
);

export default WorkflowIcon;