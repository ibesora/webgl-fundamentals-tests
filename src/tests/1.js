import { loop } from 'utils/main';

const initGL = () => {}
const draw = (gl) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

loop(initGL, draw);