// src/assets/icons/ShoppingCartIcon.jsx

import * as React from "react";

const ShoppingCartIcon = (props) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 256 173"
    enableBackground="new 0 0 256 173"
    xmlSpace="preserve" // camelCase para xml:space
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink" // camelCase para xmlns:xlink
    {...props}
  >
    {/* Cambiar fill="#000000" a fill="currentColor" */}
    <path
      fill="currentColor"
      d="M128.253,56.864c15.186,0,27.432-12.247,27.432-27.432S143.536,2,128.253,2
        c-15.186,0-27.432,12.247-27.432,27.432C100.918,44.716,113.165,56.864,128.253,56.864z M64.571,136.32h-49.28
        c-15.969,0-16.851-24.395,0.294-24.395H58.3l24.493-36.054c7.25-9.895,15.48-14.598,27.138-14.598h36.544
        c11.659,0,19.888,4.311,27.138,14.598l24.591,36.054h43.01c17.243,0,16.165,24.395,0.588,24.395h-49.28
        c-3.919,0-8.622-1.372-11.365-5.584l-18.811-26.844l-0.098,67.209H94.844l-0.098-67.209l-18.811,26.844
        C73.192,134.85,68.49,136.32,64.571,136.32z"
    />
    <polygon
      fill="currentColor" // <-- Cambiado a currentColor
      points="65,76.8 36,42 7,76.8 24.355,76.8 24.355,100 47.6,100 47.6,76.8"
    />
    <polygon
      fill="currentColor" // <-- Cambiado a currentColor
      points="191,65.2 220,100 249,65.2 231.645,65.2 231.645,42 208.4,42 208.4,65.2"
    />
  </svg>
);

export default ShoppingCartIcon;