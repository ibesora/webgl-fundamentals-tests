const resizeGL = (context) => {
  const devicePixelRatio = window.devicePixelRatio;
  const displayWidth = Math.floor(context.canvas.clientWidth * devicePixelRatio)
  const displayHeight = Math.floor(context.canvas.clientHeight * devicePixelRatio)

  if (context.canvas.width  !== displayWidth ||
    context.canvas.height !== displayHeight) {

    context.canvas.width  = displayWidth
    context.canvas.height = displayHeight
  }

  context.viewport(0, 0, context.canvas.width, context.canvas.height)
}

export const loop = (initGL, drawScene) => {

  const canvas = document.querySelector("#screen");
  const glContext = canvas.getContext("webgl");
  if (!glContext) {
    throw('No webgl context');
  }

  initGL(glContext)

  const renderLoop = () => {
    resizeGL(glContext)
    drawScene(glContext)
    requestAnimationFrame(renderLoop)
  }

  requestAnimationFrame(renderLoop)

}
