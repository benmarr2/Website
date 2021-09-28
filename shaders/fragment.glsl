uniform sampler2D marsTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal; 

void main(){

    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    // vec3 below controls the shade of color of the atmosphere. 
    vec3 atmospehere = vec3(0.8, 0.5, 0.2) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmospehere +texture2D(marsTexture, vertexUV).xyz, 1.0);
}