//==vertex
{
    //vertex
    varying vec4 col;
    void main() {
        col=vec4(1.,1.,1.,1.);
        vec3 pos = position;
        if(max(pos.x,0.) == 0. ){
            col=vec4(0.,1.,0.,1.);
        }else{
            col=vec4(1.,0.,0.,1.);
        }
        float ang = 3.14159 * 2. * 0.125;
        mat2 rot = mat2(vec2(cos(ang),-sin(ang)),vec2(sin(ang),cos(ang)));
        vec4 mvPosition = modelViewMatrix * vec4( pos.xy*rot, pos.z , 1.0 );

        gl_Position = projectionMatrix * mvPosition ;
    }
    //vertex end
}

//==fragment
{
    //fragment
    varying vec4 col;
    void main() {
        vec2 uv = gl_PointCoord;
        gl_FragColor =col; //vec4(1.,0.5,1., 1.0);
    }
    //fragment end
}
