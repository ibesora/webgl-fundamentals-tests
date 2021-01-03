import { loop } from 'utils/main';
import { createShader, createProgram } from 'utils/shaders'

const vertexShader = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
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
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0
  ]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  return { program, positionAttribLocation, positionBuffer }

}

const draw = (gl, glData) => {
  const { program, positionAttribLocation, positionBuffer } = glData

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program)
  gl.enableVertexAttribArray(positionAttribLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

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