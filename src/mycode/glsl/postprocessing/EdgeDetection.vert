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
uniform float _EdgeOnly;
uniform vec3 _EdgeColor;
uniform vec3 _BackgroundColor;




varying vec4 vPos;
varying vec2 vUv[9];

void main(){
    vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position = vPos;

    vUv[0] = uv + _MainTex_TexelSize.xy * vec2(-1., -1.);
    vUv[1] = uv + _MainTex_TexelSize.xy * vec2( 0., -1.);
    vUv[2] = uv + _MainTex_TexelSize.xy * vec2( 1., -1.);
    vUv[3] = uv + _MainTex_TexelSize.xy * vec2(-1.,  0.);
    vUv[4] = uv + _MainTex_TexelSize.xy * vec2( 0.,  0.);
    vUv[5] = uv + _MainTex_TexelSize.xy * vec2( 1.,  0.);
    vUv[6] = uv + _MainTex_TexelSize.xy * vec2(-1.,  1.);
    vUv[7] = uv + _MainTex_TexelSize.xy * vec2( 0.,  1.);
    vUv[8] = uv + _MainTex_TexelSize.xy * vec2( 1.,  1.);
}