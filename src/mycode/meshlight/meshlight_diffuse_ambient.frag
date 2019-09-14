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
    float intensity = 0.9;
    vec3 dir = normalize(directionalLight.direction);
    vec3 diffuse = vec3(color*dot(dir,_normal)*directionalLight.color) * intensity;
    diffuse = clamp(diffuse,vec3(0.,0.,0.),vec3(1.,1.,1.)); 
    vec3 ambient_color = ambient * color;
    vec3 color = ambient_color + diffuse;
    gl_FragColor = vec4(color,1.);
}