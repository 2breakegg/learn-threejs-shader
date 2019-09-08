precision highp float;
precision highp int;

uniform float _Brightness;
uniform float _Saturation;
uniform float _Contrast;

uniform sampler2D tDiffuse;

varying vec2 vUv;

vec3 setBrightness(vec4 tex){
    return tex.rgb * _Brightness;
}
vec3 setSaturation(vec4 tex, vec3 color){
    float luminance = 0.2125 * tex.r + 0.7154 * tex.g + 0.0721 * tex.b;
    vec3 luminanceColor = vec3(luminance);
    return mix(luminanceColor, color, _Saturation);
}
vec3 setContrast(vec3 color){
    return mix(vec3(.5), color, _Contrast);
}

void main() {

    vec4 tex = texture2D( tDiffuse, vUv );

    vec3 color = setBrightness(tex);
    color = setSaturation(tex, color);
    color = setContrast(color);

    gl_FragColor = vec4(  color , tex.a );

}