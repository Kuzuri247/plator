export interface DitherShaderOptions {
  ditherType: number; // 0: Bayer 2x2, 1: Bayer 4x4, 2: Bayer 8x8, 3: Random
  pixelSize: number;
  colorSteps: number;
  colorFront: [number, number, number]; // RGB normalized [0, 1]
  colorBack: [number, number, number];  // RGB normalized [0, 1]
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = vec2(a_texCoord.x, 1.0 - a_texCoord.y); // Flip Y for WebGL canvas
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform float u_pxSize;
  uniform int u_ditherType;
  uniform float u_colorSteps;
  uniform vec3 u_colorFront;
  uniform vec3 u_colorBack;

  // Bayer matrices
  float bayer2(vec2 uv) {
    int x = int(mod(uv.x, 2.0));
    int y = int(mod(uv.y, 2.0));
    if (x == 0 && y == 0) return 0.0 / 4.0;
    if (x == 1 && y == 1) return 1.0 / 4.0;
    if (x == 1 && y == 0) return 2.0 / 4.0;
    return 3.0 / 4.0;
  }

  float bayer4(vec2 uv) {
    vec2 bayerUv = floor(mod(uv, 4.0));
    float b2 = bayer2(floor(bayerUv / 2.0));
    float b1 = bayer2(mod(bayerUv, 2.0));
    return b2 + b1 / 4.0;
  }

  float bayer8(vec2 uv) {
    vec2 bayerUv = floor(mod(uv, 8.0));
    float b4 = bayer4(floor(bayerUv / 2.0));
    float b1 = bayer2(mod(bayerUv, 2.0));
    return b4 + b1 / 16.0;
  }

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 gridUv = floor(v_texCoord * u_resolution / u_pxSize) * u_pxSize / u_resolution;
    vec4 color = texture2D(u_image, gridUv);
    
    // Convert to grayscale luminance
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    float threshold = 0.5;
    vec2 pixelPos = floor(v_texCoord * u_resolution / u_pxSize);

    if (u_ditherType == 0) {
      threshold = bayer2(pixelPos);
    } else if (u_ditherType == 1) {
      threshold = bayer4(pixelPos);
    } else if (u_ditherType == 2) {
      threshold = bayer8(pixelPos);
    } else if (u_ditherType == 3) {
      threshold = rand(pixelPos);
    }

    // Quantize with color steps
    float steps = max(u_colorSteps, 2.0);
    float lum = luminance + (threshold - 0.5) / steps;
    float quantLum = clamp(floor(lum * (steps - 1.0) + 0.5) / (steps - 1.0), 0.0, 1.0);
    
    vec3 finalColor = mix(u_colorBack, u_colorFront, quantLum);
    gl_FragColor = vec4(finalColor, color.a);
  }
`;

export function applyDitherToCanvas(
  sourceCanvas: HTMLCanvasElement | HTMLImageElement,
  options: DitherShaderOptions
): HTMLCanvasElement {
  const outputCanvas = document.createElement("canvas");
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  outputCanvas.width = width;
  outputCanvas.height = height;

  const gl = outputCanvas.getContext("webgl");
  if (!gl) return outputCanvas;

  // Compile Shaders
  const createShader = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
  if (!vertShader || !fragShader) return outputCanvas;

  const program = gl.createProgram();
  if (!program) return outputCanvas;

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Setup Geometry (Full Quad)
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const posLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLocation);
  gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
    gl.STATIC_DRAW
  );

  const texLocation = gl.getAttribLocation(program, "a_texCoord");
  gl.enableVertexAttribArray(texLocation);
  gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);

  // Upload Input Texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);

  // Uniforms
  gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), width, height);
  gl.uniform1f(gl.getUniformLocation(program, "u_pxSize"), options.pixelSize);
  gl.uniform1i(gl.getUniformLocation(program, "u_ditherType"), options.ditherType);
  gl.uniform1f(gl.getUniformLocation(program, "u_colorSteps"), options.colorSteps);
  gl.uniform3fv(gl.getUniformLocation(program, "u_colorFront"), options.colorFront);
  gl.uniform3fv(gl.getUniformLocation(program, "u_colorBack"), options.colorBack);

  // Render Pass
  gl.viewport(0, 0, width, height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  return outputCanvas;
}
