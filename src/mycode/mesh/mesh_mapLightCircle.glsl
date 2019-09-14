//==vertex
{
    //vertex
    attribute float itime;

    varying vec4 col;
    varying vec4 objPos;
    varying vec4 modelPos;
    varying vec4 mvPos;
    varying float time;

    void main() {
        time=itime;
        col=vec4(1.,1.,1.,1.);
        vec4 pos = vec4(position,1.); // 顶点相对于物体原地的坐标

        vec4 mvPosition = modelViewMatrix * vec4( pos ); // 世界坐标系 坐标???

        // gl_Position = projectionMatrix * mvPosition ;
        gl_Position = projectionMatrix * mvPosition ;

        modelPos = modelMatrix * pos;

        objPos = pos;
        mvPos = mvPosition;
        
        // 设置颜色
        col=vec4(pos.x*0.2+0.1,-pos.x*0.2+0.1,0.,1.);
    }

    //vertex end
}

//==fragment
{
    //fragment
    varying vec4 col;
    varying vec4 objPos;
    varying vec4 mvPos;
    varying float time;
    varying vec4 modelPos;


    float circle(float l1, float l2,vec2 uv){
        //l1 外圈半径, l2内圈半径
        float dis = 1.;  // 圆环的间距
        float l = length(uv); // 当前像素离中心点的距离... 就当是半径吧
        l1 = mod(l1,dis); // 取余数,画多个圈
        l2 = mod(l2,dis);
        l = mod(l,dis);

        float ll1 = max(l1,l2) == l1 ? l1 : l1+dis; // 因为取余 外圈l1可能会小于内圈l2, 这么写是为了保证外圈大于内圈
                      				                   
                                                                       				                   
        // wave = max((wave-maxRange ),-(wave-(maxRange - width) ));
        // float ll1 = max((ll1-dis ),-(ll1-(dis - width) )); // 不知道啥玩意...

        float ll2 = l2;
        l = max(l,l2) == l ? l : l+dis; // 和ll1同理...
        // float c1 = smoothstep(ll1, ll1-0.1, l); // 画出外圆 , 其实我这么写有点多余
        // float c2 = smoothstep(ll2, ll2-0.1, l); // 画出内圆
        
        float c1 = step(l,ll1); // 这么写也行 , 代替上面两行...
        float c2 = step(l,ll2); // 
        
        return c1-c2; // 外圆 - 内圈 = 圆环 
    }

    void main() {
        // vec2 uv = vec2(mvPos.xy);
        vec2 uv = vec2(modelPos.xz);
        

        float t = time/45.; 
        // float t = 45.5; 

        vec3 col1 = objPos.xyz*0.3;
        float c = circle(.2+t,0.+t,uv);

        vec3 col2 = vec3(c,c,c);

        gl_FragColor =vec4(col2*col1+col1, 1.0);
        // gl_FragColor = vec4(t,t,t,1.);
        // gl_FragColor = col; //vec4(1.,0.5,1., 1.0);
    }
    //fragment end
}
