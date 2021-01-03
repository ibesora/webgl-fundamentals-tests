import { loop } from 'utils/main';
import { createShader, createProgram } from 'utils/shaders'

const vertexShader = `
  attribute vec2 a_position; // Position in pixels
  uniform vec2 u_resolution;

  void main() {
    vec2 clipSpaceCoords = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpaceCoords, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }
`

const initGL = (gl) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = createProgram(gl, vertex, frag)

  const positionAttribLocation = gl.getAttribLocation(program, "a_position")
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const positionBuffer = gl.createBuffer()

  return { program, positionAttribLocation, resolutionUniformLocation, positionBuffer }

}

const draw = (gl, glData) => {
  const { program, positionAttribLocation, resolutionUniformLocation, positionBuffer } = glData

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const halfWidth = gl.canvas.width / 2
  const halfHeight = gl.canvas.height / 2
  const centerCoord = [halfWidth, halfHeight]

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  const positions = [
    centerCoord[0], centerCoord[1],
    centerCoord[0] + halfWidth, centerCoord[1],
    centerCoord[0], centerCoord[1] + halfHeight
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  gl.useProgram(program)
  gl.enableVertexAttribArray(positionAttribLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const componentsPerVertex = 2
  const componentType = gl.FLOAT
  const normalize = false
  const attribStride = 0
  const attribOffset = 0
  gl.vertexAttribPointer(
    positionAttribLocation, componentsPerVertex, componentType, normalize, attribStride, attribOffset)

  const primitiveType = gl.TRIANGLES
  const arrayOffset = 0
  const arrayCount = 3;
  gl.drawArrays(primitiveType, arrayOffset, arrayCount);
  
}

loop(initGL, draw);