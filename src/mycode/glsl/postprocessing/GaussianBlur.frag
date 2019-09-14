precision highp float;
precision highp int;

// uniform sampler2D _MainTex;
uniform sampler2D tDiffuse;
uniform vec4 _MainTex_TexelSize;
uniform float _BlurSize;

varying vec4 vPos;
varying vec2 vUv[5];

struct v2f{
    vec4 pos;
    vec2 uv[9];
};


void main() {

    float weight[3];
    weight[0] = 0.4026; weight[1] = 0.2442; weight[2] = 0.0545;

    vec3 sum = texture2D(tDiffuse, vUv[0]).rgb * weight[0];

    for (int it = 1; it < 3; it++){
        sum += vec3(texture2D(tDiffuse, vUv[it*2-1]).rgb * weight[it]);
        sum += vec3(texture2D(tDiffuse, vUv[it*2]).rgb * weight[it]);
    }

    gl_FragColor = vec4(sum, 1.);
    // gl_FragColor = withEdgeColor;    
    // gl_FragColor = onlyEdgeColor;
    // gl_FragColor = texture2D(tDiffuse, vUv[4]);
}