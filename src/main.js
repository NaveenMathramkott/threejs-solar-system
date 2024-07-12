import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// adding solar system planets
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMeterial = new THREE.MeshBasicMaterial({
  color: 0xfff700,
});
const sun = new THREE.Mesh(sphereGeometry, sunMeterial);
sun.scale.setScalar(8);
scene.add(sun);

const earthMaterial = new THREE.MeshBasicMaterial({
  color: "blue",
});
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.scale.setScalar(2);
earth.position.x = 10;
scene.add(earth);

const moonMaterial = new THREE.MeshBasicMaterial({
  color: "gray",
});
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.5);
moon.position.x = 2;
earth.add(moon);
//end of planets

//initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

const controls = new OrbitControls(camera, canvas);

//initialise the clock

const clock = new THREE.Clock();

// render loop
const renderLoop = () => {
  const elapsedTime = clock.getElapsedTime();
  console.log(elapsedTime);
  earth.rotation.y += 0.05;
  earth.position.x = Math.sin(elapsedTime) * 16;
  earth.position.z = Math.cos(elapsedTime) * 16;

  requestAnimationFrame(renderLoop);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
};
renderLoop();
