// src/assets/icons/NotificationBellIcon.jsx

import * as React from "react";

const NotificationBellIcon = (props) => (
  <svg
    width="800px"
    height="800px"
    viewBox="-1.5 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink" // camelCase para xmlns:xlink
    {...props}
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Dribbble-Light-Preview" transform="translate(-301.000000, -720.000000)" fill="currentColor"> {/* <-- fill="currentColor" aquí */}
        <g id="icons" transform="translate(56.000000, 160.000000)">
          {/* El path ya tenía fill="#000000", lo cambiamos a fill="currentColor" */}
          <path
            d="M257.75,574 L249.25,574 L249.25,568 C249.25,565.334 251.375,564 253.498937,564 L253.501063,564 C255.625,564 257.75,565.334 257.75,568 L257.75,574 Z M254.5625,577 C254.5625,577.552 254.0865,578 253.5,578 C252.9135,578 252.4375,577.552 252.4375,577 L252.4375,576 L254.5625,576 L254.5625,577 Z M259.875,574 L259.875,568 C259.875,564.447 257.359,562.475 254.5625,562.079 L254.5625,560 L252.4375,560 L252.4375,562.079 C249.641,562.475 247.125,564.447 247.125,568 L247.125,574 L245,574 L245,576 L250.3125,576 L250.3125,577 C250.3125,578.657 251.739437,580 253.5,580 C255.260563,580 256.6875,578.657 256.6875,577 L256.6875,576 L262,576 L262,574 L259.875,574 Z"
            id="notification_bell-[#1394]"
            fill="currentColor" // <-- ¡IMPORTANTE: Cambiado a currentColor!
          />
        </g>
      </g>
    </g>
  </svg>
);

export default NotificationBellIcon;