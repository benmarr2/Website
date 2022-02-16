import './style.css';
import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

import moonVertexShader from './shaders/moonVertex.glsl'
import moonFragmentShader from './shaders/moonFragment.glsl'


const scene = new THREE.Scene();
let moons = []

//CAMERA 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

function moveCamera() {
  const t = document.body.getBoundingClientRect().top -1200;
  camera.position.z = t * -0.009;
  camera.position.x = t * 0.007;
  camera.rotation.y = t * 0.0001;
}

document.body.onscroll = moveCamera;
moveCamera();

//RENDERER 

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#scene'),
  antialias: (true)
});

renderer.render(scene, camera);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
})

//LIGHTS

const ambientLight = new THREE.AmbientLight({color: 0xffffff});
scene.add( ambientLight);

// STARS
// TODO --- REPLACE WITH PARTICLE SYSTEM --- 

function addStar(){
  const starGeometry = new THREE.OctahedronGeometry(0.1, 0);
  const starMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, wireframe:true});
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(150));

  star.position.set(x, y, z);
  scene.add(star)
}
Array(500).fill().forEach(addStar)



//MARS

const mars = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 16), new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    marsTexture: {
      value: new THREE.TextureLoader().load('./images/mars.jpg')
    }
  }
}));
scene.add(mars);

let marsAtmosphere = new THREE.Mesh(new THREE.SphereGeometry(5, 50, 16), new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
}));

marsAtmosphere.scale.set(1.07, 1.07, 1.07)
scene.add(marsAtmosphere);
mars.depthTest = false;
marsAtmosphere.renderOrder = 1

//MOONS

function createMoon(radius, orbit, speed){
  const moon = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 16), new THREE.ShaderMaterial({
    vertexShader: moonVertexShader,
    fragmentShader: moonFragmentShader,
    uniforms: {
      moonTexture: {
        value: new THREE.TextureLoader().load('./images/moon.jpg')
      }
    },
  }));

  moon.userData.orbit = orbit;
  moon.userData.speed = speed; 
  moons.push(moon);
  scene.add(moon)
  moon.depthTest = false;
  moon.renderOrder = 0;
  
}

createMoon(1, 10, 5);
createMoon(0.5, 20, 5)

function animate(){

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  let timestamp = Date.now() * 0.0001;
  moons.forEach(function(moon) {
    let orbit = moon.userData.orbit;
    let speed = moon.userData.speed;
    moon.position.x = Math.cos(timestamp * speed) * orbit;
    moon.position.z = Math.sin(timestamp * speed) * orbit;
    moon.rotation.y += 0.01
    moon.rotation.x  += 0.01  
  });
  mars.rotation.y += 0.002;

}

animate();


