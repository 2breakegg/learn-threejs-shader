precision highp float;
precision highp int;

uniform sampler2D tDiffuse;
uniform float _Threshold;

varying vec4 vPos;
varying vec2 vUv;

float luminance(vec4 color){
    return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}

void main() {
    vec4 col = texture2D(tDiffuse, vUv);
    col = luminance(col) > _Threshold ? col : vec4(0.);
    gl_FragColor = col;
}