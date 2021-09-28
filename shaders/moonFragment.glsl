uniform sampler2D moonTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal; 

void main(){

    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    // vec3 below controls the shade of color of the atmosphere. 
    vec3 atmospehere = vec3(1, 1, 1) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmospehere +texture2D(moonTexture, vertexUV).xyz, 1.0);
}