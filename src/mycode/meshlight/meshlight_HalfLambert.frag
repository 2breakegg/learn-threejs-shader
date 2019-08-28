precision highp float;
precision highp int;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

uniform DirectionalLight directionalLight;
uniform vec3 color;
uniform vec3 ambient;

varying vec3 _normal;

void main(){
    vec3 dir = normalize(directionalLight.direction);
    vec3 diffuse = vec3(color*directionalLight.color*(dot(dir,_normal)*0.5+0.5));
    vec3 ambient_color = ambient * color;
    vec3 color = ambient_color + diffuse;
    gl_FragColor = vec4(color,1.);
}