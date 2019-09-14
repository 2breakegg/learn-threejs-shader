// #define coding 1;
#ifdef coding
    precision mediump float;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    attribute vec3 position;
    attribute vec2 uv;
#endif

uniform sampler2D tDiffuse;
uniform vec4 _MainTex_TexelSize;
uniform float _BlurSize;

varying vec4 vPos;
varying vec2 vUv[5];

void main(){
    vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position = vPos;

    vUv[0] = uv;
    vUv[1] = uv + _MainTex_TexelSize.xy * 1. * _BlurSize;
    vUv[2] = uv - _MainTex_TexelSize.xy * 1. * _BlurSize;
    vUv[3] = uv + _MainTex_TexelSize.xy * 2. * _BlurSize;
    vUv[4] = uv - _MainTex_TexelSize.xy * 2. * _BlurSize;
}