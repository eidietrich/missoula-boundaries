
// See https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
export function detectWebGLsupport(){
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return (gl && gl instanceof WebGLRenderingContext);
}

