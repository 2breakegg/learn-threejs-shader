precision highp float;
precision highp int;

// uniform sampler2D _MainTex;
uniform vec4 _MainTex_TexelSize;
uniform float _EdgeOnly;
uniform vec3 _EdgeColor;
uniform vec3 _BackgroundColor;

uniform sampler2D tDiffuse;

varying vec4 vPos;
varying vec2 vUv[9];

struct v2f{
    vec4 pos;
    vec2 uv[9];
};

float luminance(vec4 color){
    return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}

float Sobel(vec4 pos, vec2 uv[9]){
    // const float Gx[9] = float[9](-1., -2., -1., 0.,  0.,  0., 1.,  2.,  1.);
    // const float Gy[9] = float[9](  -1.,  0.,  1.,-2.,  0.,  2.,-1.,  0.,  1.    );
    float Gx[9];
    Gx[0]=-1.; Gx[1]=-2.; Gx[2]=-1.;
    Gx[3]= 0.; Gx[4]= 0.; Gx[5]= 0.;
    Gx[6]= 1.; Gx[7]= 2.; Gx[8]= 1.;

    float Gy[9];
    Gy[0]=-1.; Gy[1]= 0.; Gy[2]= 1.;
    Gy[3]=-2.; Gy[4]= 0.; Gy[5]= 2.;
    Gy[6]=-1.; Gy[7]= 0.; Gy[8]= 1.;

    float texColor;
    float edgeX = 0.;
    float edgeY = 0.;
    for(int it = 0; it < 9; it++){
        texColor = luminance(texture2D(tDiffuse, uv[it]));
        edgeX += texColor * Gx[it];
        edgeY += texColor * Gy[it];
    }
    float edge = 1. - abs(edgeX) - abs(edgeY);

    return edge;
}

void main() {

    float edge = Sobel(vPos, vUv);

    vec4 withEdgeColor = mix(vec4(_EdgeColor,1.), texture2D(tDiffuse, vUv[4]), edge);
    vec4 onlyEdgeColor = mix(vec4(_EdgeColor,1.), vec4(_BackgroundColor,1.), edge);

    gl_FragColor = mix(withEdgeColor, onlyEdgeColor, _EdgeOnly);
    // gl_FragColor = withEdgeColor;
    // gl_FragColor = onlyEdgeColor;
    // gl_FragColor = texture2D(tDiffuse, vUv[4]);
}