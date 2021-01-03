import { loop } from 'utils/main';
import { createShader, createProgram } from 'utils/shaders'

const vertexShader = `
  attribute vec4 a_position;
  attribute vec2 a_texCoord;

  varying vec2 v_texCoord;

  void main() {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
  }
`

const fragmentShader = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform vec2 u_textureSize;
  uniform float u_kernel[9];
  uniform float u_kernelWeight;
  varying vec2 v_texCoord;

  void main() {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    vec4 colorSum =
      texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;

    gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
  }
`

const image = new Image()

const computeKernelWeight = (kernel) => {
  var weight = kernel.reduce(function(prev, curr) {
      return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

const initGL = (gl) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  const program = createProgram(gl, vertex, frag)
  gl.useProgram(program)
  
  const positionAttribLocation = gl.getAttribLocation(program, "a_position")
  const texCoordAttribLocation = gl.getAttribLocation(program, "a_texCoord")
  const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize")
  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]")
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight")
  
  const positions = [
    -1, 1,
    -1, -1,
    1, -1,
    1, -1,
    1, 1,
    -1, 1
  ]
  const texCoords = [
    0, 0,
    0, 1,
    1, 1,
    1, 1,
    1, 0,
    0, 0
  ]
  const edgeDetectKernel = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
  ]

  const componentsPerVertex = 2
  const componentType = gl.FLOAT
  const normalize = false
  const attribStride = 0
  const attribOffset = 0
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  gl.vertexAttribPointer(
    positionAttribLocation, componentsPerVertex, componentType, normalize, attribStride, attribOffset)
  gl.enableVertexAttribArray(positionAttribLocation)
  
  const texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
  gl.vertexAttribPointer(
    texCoordAttribLocation, componentsPerVertex, componentType, normalize, attribStride, attribOffset)
  gl.enableVertexAttribArray(texCoordAttribLocation)

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture);
   
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
   
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform2f(textureSizeLocation, image.width, image.height);
  gl.uniform1fv(kernelLocation, edgeDetectKernel);
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(edgeDetectKernel));

}

const draw = (gl) => {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const primitiveType = gl.TRIANGLES
  const arrayOffset = 0
  const arrayCount = 6;
  gl.drawArrays(primitiveType, arrayOffset, arrayCount)
  
}

const fetchImage = () => {
  image.crossOrigin = ""
  image.src = 'https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg'
  image.onload = () => {
    loop(initGL, draw);
  }
}

fetchImage()