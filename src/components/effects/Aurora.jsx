// src/components/Aurora/Aurora.jsx

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

import './Aurora.css'; // Asegúrate de que este CSS se cree en el siguiente paso

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export default function Aurora(props) {
  const {
    colorStops = ["#5227FF", "#7cff67", "#5227FF"], // Colores por defecto (puedes cambiarlos)
    amplitude = 1.0,
    blend = 1,
    speed = 2.5 // Añadido 'speed' a los props, ya que se usa en el update
  } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true, // Habilitar canal alfa para transparencia
      premultipliedAlpha: true, // Para blending correcto
      antialias: true // Suaviza los bordes
    });
    const gl = renderer.gl; // Obtener el contexto WebGL
    gl.clearColor(0, 0, 0, 0); // Fondo transparente
    gl.enable(gl.BLEND); // Habilitar blending
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // Función de blending para transparencia
    gl.canvas.style.backgroundColor = 'transparent'; // Asegura que el canvas sea transparente

    let program;

    // Función para manejar el redimensionado del canvas
    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height); // Ajusta el tamaño del renderizador
      if (program) {
        program.uniforms.uResolution.value = [width, height]; // Actualiza la resolución en el shader
      }
    }
    window.addEventListener("resize", resize); // Escucha eventos de redimensionado

    // Geometría: un simple triángulo que cubre el viewport
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv; // No necesitamos UVs para este shader simple
    }

    // Convertir los colores hexadecimales a formato RGB para el shader
    const colorStopsArray = (props.colorStops || colorStops).map((hex) => { // Usar props.colorStops si existe
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    // Programa: combina los shaders y los uniformes
    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 }, // Tiempo para animación
        uAmplitude: { value: props.amplitude ?? amplitude }, // Amplitud del efecto
        uColorStops: { value: colorStopsArray }, // Array de colores
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] }, // Resolución de la pantalla
        uBlend: { value: props.blend ?? blend } // Control de mezcla
      }
    });

    // Malla: une la geometría y el programa
    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas); // Añade el canvas al DOM

    let animateId = 0;
    // Bucle de animación
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed: currentSpeed = 1.0 } = propsRef.current; // Usar 'currentSpeed' para evitar conflicto con 'speed' en props
      program.uniforms.uTime.value = time * currentSpeed * 0.1; // Actualiza el tiempo
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? amplitude;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh }); // Renderiza la escena
    };
    animateId = requestAnimationFrame(update); // Inicia el bucle

    resize(); // Llama a resize inicialmente para establecer el tamaño

    // Función de limpieza al desmontar el componente
    return () => {
      cancelAnimationFrame(animateId); // Cancela el bucle de animación
      window.removeEventListener("resize", resize); // Elimina el listener de redimensionado
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas); // Elimina el canvas del DOM
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext(); // Libera el contexto WebGL
    };
    // Desactivamos la advertencia de eslint porque 'amplitude' y 'blend' están en el array de dependencias
    // pero los valores por defecto no cambian y no causan re-renderizados innecesarios.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, colorStops, speed]); // Asegúrate de incluir todos los props que pueden cambiar

  // El div que servirá como contenedor para el canvas de OGL
  return <div ref={ctnDom} className="aurora-container" />;
}