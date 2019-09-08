//==vertex
{
    //vertex
    attribute float itime;

    varying vec4 col;
    void main() {
        col=vec4(1.,1.,1.,1.);
        vec3 pos = position;

        float ang = 3.14159 * 2. /360. * itime;
        mat2 rot = mat2(vec2(cos(ang),-sin(ang)),vec2(sin(ang),cos(ang)));
        pos= vec3(pos.xy*rot, pos.z);

        vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );

        //gl_PointSize = 1. * ( 300.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition ;

        // 设置颜色
        col=vec4(pos.x+0.5,-pos.x+0.5,0.,1.);
    }

    //vertex end
}

//==fragment
{
    //fragment
    varying vec4 col;
    void main() {
        vec2 uv = gl_PointCoord;
        gl_FragColor = col; //vec4(1.,0.5,1., 1.0);
    }
    //fragment end
}
