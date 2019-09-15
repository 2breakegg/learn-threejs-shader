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



float luminance(vec4 color){
    return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}

vec4 liu(vec4 color){
    float a = luminance(color) > 0.01 ? 1. : 0.;
    return a > 0. ? color : vec4(0.);
}

void main() {

    float weight[3];
    weight[0] = 0.4026; weight[1] = 0.2442; weight[2] = 0.0545;

    float num = weight[0];
    vec3 sum = texture2D(tDiffuse, vUv[0]).rgb * weight[0];

    for (int it = 1; it < 3; it++){
        vec4 col = texture2D(tDiffuse, vUv[it*2-1]);
        vec4 col2 = liu(col);
        sum += col2.rgb * weight[it];
        num += col2.a > 0. ? weight[it] : 0.;
        
        col = texture2D(tDiffuse, vUv[it*2]);
        col2 = liu(col);
        sum += col2.rgb * weight[it];
        num += col2.a > 0. ? weight[it] : 0.;
        //sum += vec3(texture2D(tDiffuse, vUv[it*2]).rgb * weight[it]);
    }

    gl_FragColor =  vec4(sum / num, 1.);

    // vec4 col = texture2D(tDiffuse, vUv[0]);
    // gl_FragColor = col;

    // gl_FragColor = vec4(1.);
    // gl_FragColor = withEdgeColor;    
    // gl_FragColor = onlyEdgeColor;
    // gl_FragColor = texture2D(tDiffuse, vUv[4]);
}