import { loop } from 'utils/main';
import { createShader, createProgram } from 'utils/shaders'

const vertexShader = `
  attribute vec4 a_position;
  attribute vec4 a_color;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = a_position;
    vColor = a_color;
  }
`

const fragmentShader = `
  precision mediump float;
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`

const numTriangles = 100

const initGL = (gl) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = createProgram(gl, vertex, frag)

  const positionAttribLocation = gl.getAttribLocation(program, "a_position")
  const colorAttribLocation = gl.getAttribLocation(program, "a_color")
  
  const positions = []
  const colors = []
  for (let i=0; i<numTriangles; ++i) {
    
    const origin = [Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0]
    const width = Math.random()
    const height = Math.random()
    positions.push(origin[0])
    positions.push(origin[1])
    positions.push(origin[0] + width)
    positions.push(origin[1])
    positions.push(origin[0])
    positions.push(origin[1] + height)
    const color = [Math.random(), Math.random(), Math.random()]
    colors.push(color[0])
    colors.push(color[1])
    colors.push(color[2])
    colors.push(1.0)
    colors.push(color[0])
    colors.push(color[1])
    colors.push(color[2])
    colors.push(1.0)
    colors.push(color[0])
    colors.push(color[1])
    colors.push(color[2])
    colors.push(1.0)
  }

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return { program, positionAttribLocation, colorAttribLocation, positionBuffer, colorBuffer }

}

const draw = (gl, glData) => {
  const { program, positionAttribLocation, colorAttribLocation, positionBuffer, colorBuffer } = glData

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program)

  const componentsPerVertex = 2
  const componentsPerColor = 4
  const componentType = gl.FLOAT
  const normalize = false
  const attribStride = 0
  const attribOffset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(
    positionAttribLocation, componentsPerVertex, componentType, normalize, attribStride, attribOffset)
  gl.enableVertexAttribArray(positionAttribLocation)

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(
    colorAttribLocation, componentsPerColor, componentType, normalize, attribStride, attribOffset)
  gl.enableVertexAttribArray(colorAttribLocation)

  const primitiveType = gl.TRIANGLES
  const arrayOffset = 0
  const arrayCount = 3 * numTriangles;
  gl.drawArrays(primitiveType, arrayOffset, arrayCount);
  
}

loop(initGL, draw);