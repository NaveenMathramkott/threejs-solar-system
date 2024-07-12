import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// initialising the scene, textures
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

//cubeTextureLoader is used for making background like a inside box effect (background not as a plane)
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("/cubeMap/");

//getting canvas from dom and rendering to webGRL
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// should resize with window width and hight (preffered)
renderer.setSize(window.innerWidth, window.innerHeight);

//adding textures for planets
const sunTexture = textureLoader.load("/public/sun-texture.jpeg");
const mercuryTexture = textureLoader.load("/public/mercury-texture.jpeg");
const venusTexture = textureLoader.load("/public/venus-texture.jpeg");
const earthTexture = textureLoader.load("/public/earth-texture.jpeg");
const marsTexture = textureLoader.load("/public/mars-texture.jpeg");
const moonTexture = textureLoader.load("/public/moon-texture.jpeg");

//adding materials for planets
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
];

// adding background with pan effect
const backgroundCubemap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);
scene.background = backgroundCubemap;

// adding sphere Geometry for the planets
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  // scaling planet size
  planetMesh.scale.setScalar(planet.radius);
  //setting planet position from the sun
  planetMesh.position.x = planet.distance;
  return planetMesh;
};

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  //scaling moon size
  moonMesh.scale.setScalar(moon.radius);
  // setting moon position from its parent planet
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetList = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(8);
scene.add(sun);

//initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

//add ambient light and pointLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 300);
scene.add(pointLight);

//initialise the orbit controls
const controls = new OrbitControls(camera, canvas);

// render loop
const renderLoop = () => {
  // looping planetList
  planetList.forEach((planet, index) => {
    // set planet rotation by incrementing with planet array index mapping
    planet.rotation.y += planets[index].speed;
    // by using sin and cos can generate value loop from -1 t0 1 respectively
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance;
    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed;
      moon.position.x =
        Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance;
      moon.position.z =
        Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance;
    });
  });
  requestAnimationFrame(renderLoop);
  controls.update();
  // render the whole scene and camera
  renderer.render(scene, camera);
};
renderLoop();
