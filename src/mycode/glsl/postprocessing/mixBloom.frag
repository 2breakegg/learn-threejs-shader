precision highp float;
precision highp int;

uniform sampler2D tDiffuse;
uniform sampler2D tDiffuse2;

varying vec2 vUv;
float luminance(vec3 color){
    return 0.2125 * color.r + 0.7154 * color.g + 0.0721 * color.b;
}
void main() {
    vec4 tex1 = texture2D(tDiffuse, vUv);
    vec4 tex2 = texture2D(tDiffuse2, vUv);
    // vec3 col = mix(tex1.rgb, tex2.rgb, luminance(tex2));
    // tex2 = luminance(tex2) > 1.01 ? vec4(1.,0.,0.,1.) : tex2;
    vec3 col = tex1.rgb + tex2.rgb ;
    col = (luminance(col) > 1.) ? (col / luminance(col)) : col;
    gl_FragColor = vec4(col,1.);
    // gl_FragColor = tex1;
}