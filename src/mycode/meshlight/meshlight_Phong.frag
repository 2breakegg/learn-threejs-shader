precision highp float;
precision highp int;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};
struct Camera {
    vec3 position;
};

uniform DirectionalLight directionalLight;
uniform Camera camera;
uniform vec3 color;
uniform vec3 ambient;
uniform vec3 intensity;

varying vec3 _normal;
varying vec3 _position;

void main(){
    float intensity = 0.6;
    // 光的角度
    vec3 lightDir = normalize(directionalLight.direction);

    vec3 diffuse = vec3(color*directionalLight.color*max(0.,dot(lightDir,_normal))) * intensity;

    vec3 reflectDir = normalize(reflect(-lightDir,_normal));
    vec3 viewDir = normalize(camera.position - _position);
    vec3 specular = color * pow(clamp(dot(reflectDir,viewDir),0.,1.),6.);

    vec3 ambient_color = ambient * color;
    vec3 color = ambient_color + diffuse + specular;
    gl_FragColor = vec4(color,1.);
}

