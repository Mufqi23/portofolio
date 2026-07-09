

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  const canvas = document.getElementById('nature-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf5f0ea, 0.004); 

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.0);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffe8cc, 1.8);
  sunLight.position.set(5, 15, 10);
  scene.add(sunLight);

  const warmLight = new THREE.PointLight(0xC4956A, 4, 60);
  warmLight.position.set(6, 12, 5);
  scene.add(warmLight);

  const mochaLight = new THREE.PointLight(0x8B5E3C, 3.5, 50);
  mochaLight.position.set(-8, -6, 4);
  scene.add(mochaLight);

  const caramelFill = new THREE.PointLight(0xA67B5B, 2.5, 45);
  caramelFill.position.set(0, 0, 8);
  scene.add(caramelFill);

  const starCount = 4000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorsList = [
    new THREE.Color(0x8B5E3C), // Rich Coffee
    new THREE.Color(0xA67B5B), // Warm Caramel
    new THREE.Color(0xC4956A), // Golden Latte
    new THREE.Color(0x7C5E4A), // Dark Mocha
    new THREE.Color(0xB8704A), // Burnt Sienna
    new THREE.Color(0xD4A574)  // Light Toffee
  ];

  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 55;
    starPos[i+1] = (Math.random() - 0.5) * 240 - 55;
    starPos[i+2] = (Math.random() - 0.5) * 35 - 4;

    const color = colorsList[Math.floor(Math.random() * colorsList.length)];
    starColors[i] = color.r;
    starColors[i+1] = color.g;
    starColors[i+2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const starfield = new THREE.Points(starGeo, starMaterial);
  scene.add(starfield);


  const cameraZPoints = [
    { pct: 0.0, z: 14 },  // Hero (standard)
    { pct: 0.15, z: 11 }, // About (closer look at crystals)
    { pct: 0.3, z: 15 },  // Education (zooms back out for tree landscape)
    { pct: 0.45, z: 8.5 },// Skills (immersive view inside nodes)
    { pct: 0.6, z: 14 },  // Projects (standard overview)
    { pct: 0.75, z: 10 }, // Data (zooms inside data wireframe)
    { pct: 0.9, z: 13 },  // Contact (medium portrait)
    { pct: 1.0, z: 16 }   // Footer (wide overview)
  ];

  function getCameraZ(pct) {
    for (let i = 0; i < cameraZPoints.length - 1; i++) {
      const p1 = cameraZPoints[i];
      const p2 = cameraZPoints[i+1];
      if (pct >= p1.pct && pct <= p2.pct) {
        const segPct = (pct - p1.pct) / (p2.pct - p1.pct);
        const ease = (1 - Math.cos(segPct * Math.PI)) / 2; // Cosine smooth interpolation
        return p1.z + (p2.z - p1.z) * ease;
      }
    }
    return cameraZPoints[cameraZPoints.length - 1].z;
  }

  const objects3D = [];

  const crystalGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xD4A574,
    transparent: true,
    opacity: 0.85,
    roughness: 0.08,
    metalness: 0.15,
    transmission: 0.6,
    ior: 1.5,
    thickness: 1.8,
    specularIntensity: 1.0,
    clearcoat: 1.0
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xC4956A,
    roughness: 0.12,
    metalness: 0.95,
    emissive: 0x3d2200,
    emissiveIntensity: 0.15
  });

  const caramelMat = new THREE.MeshPhysicalMaterial({
    color: 0xA67B5B,
    transparent: true,
    opacity: 0.88,
    roughness: 0.15,
    transmission: 0.35,
    thickness: 1.2,
    emissive: 0x2c1f14,
    emissiveIntensity: 0.1
  });

  const mochaMat = new THREE.MeshPhysicalMaterial({
    color: 0x8B5E3C,
    transparent: true,
    opacity: 0.9,
    roughness: 0.1,
    transmission: 0.3,
    emissive: 0x1a0f05,
    emissiveIntensity: 0.12
  });

  function createGroupAtY(y) {
    const group = new THREE.Group();
    group.position.y = y;
    scene.add(group);
    return group;
  }

  // --- HERO SECTION (Y = 0) --- Large, prominent shapes
  const heroGroup = createGroupAtY(0);
  const heroTorus = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.7, 24, 100), crystalGlassMat);
  heroGroup.add(heroTorus);
  objects3D.push({ mesh: heroTorus, rotX: 0.005, rotY: 0.008, floatSpeed: 0.002, floatAmp: 0.3 });

  // Large secondary torus knot
  const heroKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.8, 0.35, 100, 16), goldMat);
  heroKnot.position.set(-5, 1, -2);
  heroGroup.add(heroKnot);
  objects3D.push({ mesh: heroKnot, rotX: 0.007, rotY: 0.005, floatSpeed: 0.003, floatAmp: 0.25 });

  for (let i = 0; i < 12; i++) {
    const size = 0.4 + Math.random() * 0.7;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 32), new THREE.MeshPhysicalMaterial({
      color: colorsList[i % colorsList.length],
      transparent: true,
      opacity: 0.85,
      transmission: 0.4,
      roughness: 0.1,
      thickness: 1.0,
      emissive: colorsList[i % colorsList.length],
      emissiveIntensity: 0.08
    }));
    sphere.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5);
    heroGroup.add(sphere);
    objects3D.push({ mesh: sphere, rotX: 0.006, rotY: 0.01, floatSpeed: 0.003 + i * 0.001, floatAmp: 0.2 });
  }

  // --- ABOUT SECTION (Y = -15) --- Floating octahedrons with orbit rings
  const aboutGroup = createGroupAtY(-15);
  for (let i = 0; i < 8; i++) {
    const size = 0.7 + Math.random() * 0.7;
    const octa = new THREE.Mesh(new THREE.OctahedronGeometry(size), caramelMat);
    octa.position.set((Math.random() - 0.5) * 13, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5);
    aboutGroup.add(octa);
    objects3D.push({ mesh: octa, rotX: 0.01, rotY: 0.005, floatSpeed: 0.003 + i * 0.001, floatAmp: 0.3 });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(size * 1.6, 0.06, 8, 64), goldMat);
    ring.position.copy(octa.position);
    ring.rotation.x = Math.random() * Math.PI;
    aboutGroup.add(ring);
    objects3D.push({ mesh: ring, rotX: -0.004, rotY: 0.008, floatSpeed: 0.003 + i * 0.001, floatAmp: 0.3 });
  }

  // Big decorative dodecahedron
  const aboutDodeca = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), new THREE.MeshPhysicalMaterial({
    color: 0xC4956A,
    transparent: true,
    opacity: 0.6,
    roughness: 0.15,
    transmission: 0.45,
    wireframe: false
  }));
  aboutDodeca.position.set(4, -1, -2);
  aboutGroup.add(aboutDodeca);
  objects3D.push({ mesh: aboutDodeca, rotX: 0.004, rotY: 0.007, floatSpeed: 0.002, floatAmp: 0.2 });

  // --- EDUCATION SECTION (Y = -30) --- Pyramids and prisms
  const eduGroup = createGroupAtY(-30);
  for (let i = 0; i < 10; i++) {
    const size = 0.6 + Math.random() * 0.7;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(size, size * 2.2, 4), mochaMat);
    cone.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4);
    eduGroup.add(cone);
    objects3D.push({ mesh: cone, rotX: 0.006, rotY: 0.012, floatSpeed: 0.002 + i * 0.001, floatAmp: 0.25 });
  }

  // Big icosahedron centerpiece
  const eduIcosa = new THREE.Mesh(new THREE.IcosahedronGeometry(2.5, 0), crystalGlassMat);
  eduIcosa.position.set(-2, 0, 1);
  eduGroup.add(eduIcosa);
  objects3D.push({ mesh: eduIcosa, rotX: 0.005, rotY: 0.008, floatSpeed: 0.002, floatAmp: 0.2 });

  // --- SKILLS SECTION (Interactive growth node cluster) (Y = -45) ---
  const skillsGroup = createGroupAtY(-45);
  const nodeCount = 22;
  const nodes = [];
  const nodeGeo = new THREE.IcosahedronGeometry(0.4);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x8B5E3C, roughness: 0.1, metalness: 0.95, emissive: 0x3d2200, emissiveIntensity: 0.15 });

  for (let i = 0; i < nodeCount; i++) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5);
    skillsGroup.add(node);
    nodes.push(node);
    objects3D.push({ mesh: node, rotX: 0.005, rotY: 0.005, floatSpeed: 0.003 + i * 0.001, floatAmp: 0.15 });
  }

  // Connecting network lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xA67B5B, transparent: true, opacity: 0.6 });
  const linePositions = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if (dist < 5.0) {
        linePositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
        linePositions.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const nodeNetwork = new THREE.LineSegments(lineGeo, lineMat);
  skillsGroup.add(nodeNetwork);

  // Large torus knot for skills centerpiece
  const skillsKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.0, 0.4, 80, 12, 2, 3), caramelMat);
  skillsGroup.add(skillsKnot);
  objects3D.push({ mesh: skillsKnot, rotX: 0.004, rotY: 0.006, floatSpeed: 0.002, floatAmp: 0.2 });

  // --- PROJECTS SECTION (Floating Island Networks) (Y = -60) ---
  const projGroup = createGroupAtY(-60);
  for (let i = 0; i < 5; i++) {
    const island = new THREE.Group();
    island.position.set((i - 2) * 4.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 0.5, 0.8, 6), new THREE.MeshStandardMaterial({
      color: 0xebe4da,
      roughness: 0.8,
      metalness: 0.1
    }));
    island.add(base);

    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.9), new THREE.MeshPhysicalMaterial({
      color: colorsList[i % colorsList.length],
      transparent: true,
      opacity: 0.85,
      transmission: 0.35,
      roughness: 0.1,
      emissive: colorsList[i % colorsList.length],
      emissiveIntensity: 0.1
    }));
    core.position.y = 1.1;
    island.add(core);

    projGroup.add(island);
    objects3D.push({ mesh: island, rotX: 0.003, rotY: 0.006, floatSpeed: 0.004 + i * 0.002, floatAmp: 0.25 });
  }

  // --- DATA SECTION (Geometric Data wireframe Cluster) (Y = -75) ---
  const dataGroup = createGroupAtY(-75);
  const clusterBox = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 4.5), new THREE.MeshStandardMaterial({
    color: 0x9B7653,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  }));
  dataGroup.add(clusterBox);
  objects3D.push({ mesh: clusterBox, rotX: 0.005, rotY: 0.007, floatSpeed: 0.003, floatAmp: 0.2 });

  // Inner wireframe box rotated
  const clusterBoxInner = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({
    color: 0xC4956A,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  }));
  clusterBoxInner.rotation.set(0.5, 0.5, 0);
  dataGroup.add(clusterBoxInner);
  objects3D.push({ mesh: clusterBoxInner, rotX: -0.007, rotY: 0.009, floatSpeed: 0.003, floatAmp: 0.2 });

  const clusterInner = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 24), new THREE.MeshPhysicalMaterial({
    color: 0xB8704A,
    transparent: true,
    opacity: 0.8,
    transmission: 0.35,
    roughness: 0.15,
    emissive: 0x3d1a00,
    emissiveIntensity: 0.1
  }));
  dataGroup.add(clusterInner);
  objects3D.push({ mesh: clusterInner, rotX: -0.008, rotY: 0.004, floatSpeed: 0.003, floatAmp: 0.2 });

  // Orbiting data spheres
  for (let i = 0; i < 8; i++) {
    const ds = new THREE.Mesh(new THREE.SphereGeometry(0.3 + Math.random() * 0.3, 16, 16), mochaMat);
    ds.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
    dataGroup.add(ds);
    objects3D.push({ mesh: ds, rotX: 0.008, rotY: 0.01, floatSpeed: 0.004 + i * 0.001, floatAmp: 0.2 });
  }

  // --- CONTACT SECTION (Golden Rings and Crystals) (Y = -90) ---
  const contactGroup = createGroupAtY(-90);
  const centralCore = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0), crystalGlassMat);
  contactGroup.add(centralCore);
  objects3D.push({ mesh: centralCore, rotX: 0.012, rotY: 0.012, floatSpeed: 0.002, floatAmp: 0.25 });

  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 + i * 0.7, 0.1, 16, 100), goldMat);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    contactGroup.add(ring);
    objects3D.push({ mesh: ring, rotX: 0.007 * (i + 1), rotY: -0.005 * (i + 1), floatSpeed: 0.002, floatAmp: 0.25 });
  }

  // Floating diamonds around contact
  for (let i = 0; i < 6; i++) {
    const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.5 + Math.random() * 0.4), caramelMat);
    diamond.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
    contactGroup.add(diamond);
    objects3D.push({ mesh: diamond, rotX: 0.01, rotY: 0.008, floatSpeed: 0.004 + i * 0.001, floatAmp: 0.2 });
  }

  // --- FOOTER (Large sphere and orbit rings) (Y = -105) ---
  const footerGroup = createGroupAtY(-105);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(3.5, 48, 48), new THREE.MeshStandardMaterial({
    color: 0xD4A574,
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0x2c1f14,
    emissiveIntensity: 0.08
  }));
  footerGroup.add(moon);
  objects3D.push({ mesh: moon, rotX: 0.002, rotY: 0.003, floatSpeed: 0.001, floatAmp: 0.15 });

  const moonRing = new THREE.Mesh(new THREE.TorusGeometry(5.0, 0.06, 8, 80), goldMat);
  moonRing.rotation.x = Math.PI / 3;
  footerGroup.add(moonRing);
  objects3D.push({ mesh: moonRing, rotX: 0.001, rotY: 0.004, floatSpeed: 0.001, floatAmp: 0.15 });

  const moonRing2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.04, 8, 64), crystalGlassMat);
  moonRing2.rotation.x = Math.PI / 2;
  moonRing2.rotation.z = Math.PI / 6;
  footerGroup.add(moonRing2);
  objects3D.push({ mesh: moonRing2, rotX: -0.002, rotY: 0.003, floatSpeed: 0.001, floatAmp: 0.15 });

  // ------------------------------------------------------------
  // DYNAMIC CLICK CRYSTAL PARTICLE EXPLO (Vibrant & Physic Splashes)
  // ------------------------------------------------------------
  const clickParticles = [];
  const pGeom = new THREE.ConeGeometry(0.12, 0.24, 4);
  const pMat = new THREE.MeshPhysicalMaterial({
    roughness: 0.05,
    metalness: 0.95,
    transparent: true,
    opacity: 0.9
  });

  function triggerParticleExplosion(x, y) {
    const mouseProj = new THREE.Vector3(x, y, 0.5);
    mouseProj.unproject(camera);
    const dir = mouseProj.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const clickPos = camera.position.clone().add(dir.multiplyScalar(distance));

    const randomColor = colorsList[Math.floor(Math.random() * colorsList.length)];

    for (let i = 0; i < 22; i++) {
      const p = new THREE.Mesh(pGeom, pMat.clone());
      p.material.color.copy(randomColor);
      p.position.copy(clickPos);

      // 3D dispersion velocity vector
      p.userData = {
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.18 + 0.06,
          (Math.random() - 0.5) * 0.18
        ),
        rotX: (Math.random() - 0.5) * 0.08,
        rotY: (Math.random() - 0.5) * 0.08,
        life: 1.0,
        decay: 0.012 + Math.random() * 0.015
      };

      scene.add(p);
      clickParticles.push(p);
    }
  }

  // ------------------------------------------------------------
  // DYNAMIC PARALLAX & EVENT VARIABLES
  // ------------------------------------------------------------
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;
  let targetScrollY = 0;

  window.addEventListener('mousemove', function (e) {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', function () {
    targetScrollY = window.scrollY;

    // Apply scroll parallax to HTML text cards (layered depth feel)
    const viewY = window.scrollY;
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      const speed = 0.04;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight / 2 - rect.top) * speed;
        // Parallax translations
        if (el.classList.contains('reveal-left')) {
          el.style.transform = `translateX(${offset * -0.5}px) translateY(${offset * 0.2}px)`;
        } else if (el.classList.contains('reveal-right')) {
          el.style.transform = `translateX(${offset * 0.5}px) translateY(${offset * 0.2}px)`;
        } else {
          el.style.transform = `translateY(${offset * 0.3}px)`;
        }
      }
    });
  });

  window.addEventListener('click', function (e) {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    triggerParticleExplosion(normX, normY);
  });

  // ------------------------------------------------------------
  // MAIN RENDERING LOOP
  // ------------------------------------------------------------
  let frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);
    frameCount++;

    // Easing scroll and mouse coordinates
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;
    scrollY += (targetScrollY - scrollY) * 0.06;

    // Determine Y coordinate based on layout scroll percentage
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = scrollY / (totalHeight || 1);
    const targetCameraY = -scrollPct * 105;

    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    camera.position.x += (mouse.x - camera.position.x) * 0.06;

    // Retrieve Z depth coordinate based on camera path spline mapping
    const targetCameraZ = getCameraZ(scrollPct);
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

    // Move lights inline with camera translation
    warmLight.position.y = camera.position.y + 11;
    mochaLight.position.y = camera.position.y - 6;
    caramelFill.position.y = camera.position.y;

    // Rotate all registered meshes
    objects3D.forEach(function (obj) {
      obj.mesh.rotation.x += obj.rotX;
      obj.mesh.rotation.y += obj.rotY;

      // Floating sine curves displacement
      obj.mesh.position.y += Math.sin(frameCount * obj.floatSpeed) * (obj.floatAmp * 0.01);
    });

    // Update click shockwave particles
    for (let i = clickParticles.length - 1; i >= 0; i--) {
      const p = clickParticles[i];
      p.position.add(p.userData.vel);
      p.rotation.x += p.userData.rotX;
      p.rotation.y += p.userData.rotY;

      p.userData.vel.multiplyScalar(0.97); // Drag calculation
      p.userData.life -= p.userData.decay;
      p.material.opacity = p.userData.life;

      if (p.userData.life <= 0) {
        scene.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        clickParticles.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  // Resize canvas handler
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', function () {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalScroll) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  });

  const cursorLeaf = document.getElementById('cursorLeaf');
  if (cursorLeaf) {
    window.addEventListener('mousemove', function (e) {
      cursorLeaf.style.left = e.clientX + 'px';
      cursorLeaf.style.top = e.clientY + 'px';
      cursorLeaf.style.opacity = '1';
    });
    document.addEventListener('mouseleave', function () {
      cursorLeaf.style.opacity = '0';
    });
  }

  const cursorColors = {
    'home': { bg: 'rgba(139, 94, 60, 0.1)', border: 'rgba(139, 94, 60, 0.3)', shadow: 'rgba(139, 94, 60, 0.12)' },
    'about': { bg: 'rgba(166, 123, 91, 0.1)', border: 'rgba(166, 123, 91, 0.3)', shadow: 'rgba(166, 123, 91, 0.12)' },
    'education': { bg: 'rgba(124, 94, 74, 0.1)', border: 'rgba(124, 94, 74, 0.3)', shadow: 'rgba(124, 94, 74, 0.12)' },
    'skills': { bg: 'rgba(155, 118, 83, 0.1)', border: 'rgba(155, 118, 83, 0.3)', shadow: 'rgba(155, 118, 83, 0.12)' },
    'projects': { bg: 'rgba(196, 149, 106, 0.1)', border: 'rgba(196, 149, 106, 0.3)', shadow: 'rgba(196, 149, 106, 0.12)' },
    'data': { bg: 'rgba(184, 112, 74, 0.1)', border: 'rgba(184, 112, 74, 0.3)', shadow: 'rgba(184, 112, 74, 0.12)' },
    'contact': { bg: 'rgba(212, 165, 116, 0.1)', border: 'rgba(212, 165, 116, 0.3)', shadow: 'rgba(212, 165, 116, 0.12)' }
  };


  document.querySelectorAll('.hover-tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;

      const rotX = (yc - y) / yc * 7; // Max 7 degrees tilt
      const rotY = -(xc - x) / xc * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
      card.style.boxShadow = `0 20px 45px rgba(50, 65, 90, 0.08), 0 0 25px rgba(59, 130, 246, 0.04)`;
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0deg)';
      card.style.boxShadow = '';
    });
  });

  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cv, .pf-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.26}px, ${y * 0.26}px)`;
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });


  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
  });

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      const open = navMobile.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        hamburger.classList.add('open');
        spans[0].style.cssText = 'transform: rotate(45deg) translateY(8px)';
        spans[1].style.cssText = 'opacity: 0';
        spans[2].style.cssText = 'transform: rotate(-45deg) translateY(-8px)';
      } else {
        hamburger.classList.remove('open');
        spans.forEach(function (s) { s.style.cssText = ''; });
      }
    });

    document.querySelectorAll('.nav-mobile a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(function (s) { s.style.cssText = ''; });
      });
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
    revealObserver.observe(el);
  });


  function triggerSkillBars() {
    setTimeout(function () {
      document.querySelectorAll('.sknb-fill, .db-fill, .ccg-fill').forEach(function (el) {
        el.style.width = '0%';
        setTimeout(function () {
          el.style.width = (el.dataset.w || '0') + '%';
        }, 100);
      });
    }, 150);
  }

  const skillSection = document.getElementById('skills');
  const dataSection  = document.getElementById('data');

  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        triggerSkillBars();
      }
    });
  }, { threshold: 0.1 });

  if (skillSection) barObserver.observe(skillSection);
  if (dataSection)  barObserver.observe(dataSection);

  setTimeout(triggerSkillBars, 600);

  const filterBtns = document.querySelectorAll('.pf-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      document.querySelectorAll('[data-cat]').forEach(function (card) {
        const show = (filter === 'all') || (card.dataset.cat === filter);
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const animStyle = document.createElement('style');
  animStyle.textContent = `@keyframes fadeInCard { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`;
  document.head.appendChild(animStyle);

  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          const active = link.getAttribute('href') === '#' + id;
          link.style.color = active ? 'var(--c-primary)' : '';
        });

      
        if (cursorLeaf && cursorColors[id]) {
          cursorLeaf.style.background = cursorColors[id].bg;
          cursorLeaf.style.borderColor = cursorColors[id].border;
          cursorLeaf.style.boxShadow = `0 8px 32px ${cursorColors[id].shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.5)`;
        }
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  function animateNum(el, target, suffix, decimals) {
    const start = 0;
    const duration = 1500;
    let startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Quartic Out
      const val = start + (target - start) * ease;

      el.textContent = decimals ? val.toFixed(decimals) + suffix : Math.floor(val) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.hs-item strong').forEach(function (el) {
        const raw = el.textContent.trim();
        const num = parseFloat(raw);
        if (isNaN(num)) return;
        const suffix = raw.replace(num.toString(), '');
        const decimals = raw.includes('.') ? 2 : 0;
        animateNum(el, num, suffix, decimals);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });

  const heroSec = document.getElementById('home');
  if (heroSec) statsObserver.observe(heroSec);

  /* ============================================================
     STAGGER REVEAL DELAYS
  ============================================================ */
  function applyStagger(selector, delay) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = (i * (delay || 0.08)) + 's';
    });
  }

  applyStagger('.pjn-card', 0.08);
  applyStagger('.aoo-card', 0.06);
  applyStagger('.aottl-item', 0.08);
  applyStagger('.sko-item', 0.05);
  applyStagger('.dcc', 0.06);

});
