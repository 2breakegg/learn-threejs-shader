precision highp float;
precision highp int;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

uniform DirectionalLight directionalLight;
uniform vec3 color;

varying vec3 _normal;

void main(){
    vec3 dir = normalize(directionalLight.direction);
    vec3 diffuse = vec3(color*dot(dir,_normal)*directionalLight.color);
    gl_FragColor = vec4(diffuse,1.);
}