"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Footprints, Maximize, MousePointer2 } from "lucide-react";
import * as THREE from "three";
import styles from "./KhamisFirstPersonTour.module.css";

type TourStatus = "loading" | "ready" | "error";
type MoveKey = "forward" | "back" | "left" | "right";

const AREA_LABELS = {
  entrance: "نقطة الانطلاق",
  corridor: "الممر الرئيسي",
  end: "باب نهاية الممر",
};

function areaForPosition(_x: number, z: number) {
  if (z > 1.2) return AREA_LABELS.entrance;
  if (z < -11) return AREA_LABELS.end;
  return AREA_LABELS.corridor;
}

export function KhamisFirstPersonTour() {
  const mountRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const movementRef = useRef<Record<MoveKey, boolean>>({
    forward: false,
    back: false,
    left: false,
    right: false,
  });
  const [status, setStatus] = useState<TourStatus>("loading");
  const [started, setStarted] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [area, setArea] = useState(AREA_LABELS.entrance);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frameId = 0;
    let yaw = 0;
    let pitch = 0;
    let elapsed = 0;
    let lastArea = AREA_LABELS.entrance;
    let lookPointer: number | null = null;
    let previousPointerX = 0;
    let previousPointerY = 0;
    const pressed = new Set<string>();
    const clock = new THREE.Clock();
    const colliders: Array<{ minX: number; maxX: number; minZ: number; maxZ: number }> = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe9f0f0);
    scene.fog = new THREE.Fog(0xe8eeee, 19, 34);

    const camera = new THREE.PerspectiveCamera(68, 1, 0.08, 80);
    camera.rotation.order = "YXZ";
    camera.position.set(-0.25, 1.68, 4.25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = styles.canvas;
    renderer.domElement.setAttribute("aria-label", "جولة ثلاثية الأبعاد داخل فرع سعودي دنت بخميس مشيط");
    renderer.domElement.tabIndex = 0;
    mount.appendChild(renderer.domElement);

    const surfaceTextureLoader = new THREE.TextureLoader();
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const floorTexture = surfaceTextureLoader.load("/assets/branches/khamis-mushait/textures/corridor-floor-photo.webp");
    floorTexture.colorSpace = THREE.SRGBColorSpace;
    floorTexture.anisotropy = maxAnisotropy;
    const blackMarbleTexture = surfaceTextureLoader.load("/assets/branches/khamis-mushait/textures/black-marble-photo.webp");
    blackMarbleTexture.colorSpace = THREE.SRGBColorSpace;
    blackMarbleTexture.wrapS = blackMarbleTexture.wrapT = THREE.RepeatWrapping;
    blackMarbleTexture.repeat.set(5, 1.5);
    blackMarbleTexture.anisotropy = maxAnisotropy;

    const white = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.7 });
    const warmWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, map: floorTexture, roughness: 0.3, metalness: 0.02 });
    const blackMarble = new THREE.MeshStandardMaterial({ color: 0xffffff, map: blackMarbleTexture, roughness: 0.34, metalness: 0.06 });
    const charcoal = new THREE.MeshStandardMaterial({ color: 0x0a1012, roughness: 0.42 });
    const tealGlow = new THREE.MeshStandardMaterial({ color: 0xaaffff, emissive: 0x53ffff, emissiveIntensity: 2.2 });
    const aluminum = new THREE.MeshStandardMaterial({ color: 0xc8d0d0, roughness: 0.22, metalness: 0.72 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xc6f7f5, transparent: true, opacity: 0.24, roughness: 0.06, transmission: 0.56, metalness: 0.02 });
    const leafGreen = new THREE.MeshStandardMaterial({ color: 0x315b3d, roughness: 0.82 });
    const terracotta = new THREE.MeshStandardMaterial({ color: 0x87604b, roughness: 0.9 });

    const addBox = (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number,
      depth: number,
      material: THREE.Material,
      solid = false,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      if (solid) {
        colliders.push({
          minX: x - width / 2,
          maxX: x + width / 2,
          minZ: z - depth / 2,
          maxZ: z + depth / 2,
        });
      }
      return mesh;
    };

    const addWall = (x: number, z: number, width: number, depth: number, material = white) =>
      addBox(x, 1.6, z, width, 3.2, depth, material, true);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 20), warmWhite);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -4.7;
    floor.receiveShadow = true;
    scene.add(floor);

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 20), white);
    ceiling.position.set(0, 3.2, -4.7);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // هذه القطعة فقط: جدار البداية، بابان جانبيان، الممر، وباب النهاية.
    addWall(0, 5.25, 8.2, 0.22);
    addWall(-4.1, 4.38, 0.22, 1.75);
    addWall(4.1, 4.38, 0.22, 1.75, blackMarble);
    addWall(-4.1, -6.78, 0.22, 15.35);
    addWall(4.1, -6.78, 0.25, 15.35, blackMarble);

    const addSideDoor = (side: -1 | 1) => {
      const x = side * 4.08;
      const z = 2.15;
      addBox(x, 2.92, z, 0.18, 0.22, 2.72, charcoal);
      addBox(x, 1.42, z - 1.3, 0.18, 2.82, 0.16, charcoal);
      addBox(x, 1.42, z + 1.3, 0.18, 2.82, 0.16, charcoal);
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.055, 2.55, 1.2), glass);
      leaf.position.set(side * 4.02, 1.39, z + 0.63);
      leaf.rotation.y = side * 0.98;
      leaf.castShadow = true;
      scene.add(leaf);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 12), aluminum);
      handle.position.set(side * 3.73, 1.42, z + 0.1);
      scene.add(handle);

      // Shallow sealed vestibule: visible and walkable, but does not invent a room beyond the photo.
      addBox(side * 4.78, -0.035, z, 1.4, 0.07, 2.65, warmWhite);
      addWall(side * 5.48, z, 0.18, 2.72);
      addWall(side * 4.78, z - 1.37, 1.55, 0.18);
      addWall(side * 4.78, z + 1.37, 1.55, 0.18);
      addBox(side * 4.78, 3.16, z, 1.55, 0.08, 2.72, white);
    };
    addSideDoor(-1);
    addSideDoor(1);

    // White three-dimensional wall panels on the left, matching the foreground treatment.
    const addFacetedPanel = (zStart: number, rows: number) => {
      const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xf2f2ed, roughness: 0.74, flatShading: true });
      const cell = 0.78;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          const y0 = 0.06 + column * cell;
          const y1 = Math.min(y0 + cell, 3.16);
          const z0 = zStart - row * cell;
          const z1 = z0 - cell;
          const centerY = (y0 + y1) / 2;
          const centerZ = (z0 + z1) / 2;
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.Float32BufferAttribute([
            -4.02, y0, z0, -4.02, y1, z0, -3.9, centerY, centerZ,
            -4.02, y1, z0, -4.02, y1, z1, -3.9, centerY, centerZ,
            -4.02, y1, z1, -4.02, y0, z1, -3.9, centerY, centerZ,
            -4.02, y0, z1, -4.02, y0, z0, -3.9, centerY, centerZ,
          ], 3));
          geometry.computeVertexNormals();
          const panel = new THREE.Mesh(geometry, panelMaterial);
          panel.receiveShadow = true;
          scene.add(panel);
        }
      }
    };
    addFacetedPanel(5.1, 2);
    addFacetedPanel(0.72, 5);

    // Black marble panel seams on the right.
    for (let z = 0.15; z > -12.8; z -= 2.35) {
      addBox(3.955, 1.6, z, 0.025, 3.08, 0.018, charcoal);
    }
    addBox(3.94, 1.6, -5.7, 0.025, 0.025, 13.8, charcoal);

    const addPlant = (x: number, z: number, scale = 1) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.29 * scale, 0.48 * scale, 18), terracotta);
      pot.position.set(x, 0.24 * scale, z);
      pot.castShadow = true;
      scene.add(pot);
      for (let index = 0; index < 9; index += 1) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.13 * scale, 0.82 * scale, 8), leafGreen);
        const angle = (index / 9) * Math.PI * 2;
        leaf.position.set(x + Math.cos(angle) * 0.15 * scale, 0.75 * scale + (index % 3) * 0.12, z + Math.sin(angle) * 0.15 * scale);
        leaf.rotation.z = Math.cos(angle) * 0.45;
        leaf.rotation.x = Math.sin(angle) * 0.45;
        leaf.castShadow = true;
        scene.add(leaf);
      }
    };
    addPlant(-4.75, 2.75, 0.9);
    addPlant(-4.75, 1.25, 0.82);

    // Advertisement display with existing, approved doctor portraits from the platform.
    const adCanvas = document.createElement("canvas");
    adCanvas.width = 640;
    adCanvas.height = 1000;
    const adContext = adCanvas.getContext("2d");
    const drawAdBase = () => {
      if (!adContext) return;
      const gradient = adContext.createLinearGradient(0, 0, 0, adCanvas.height);
      gradient.addColorStop(0, "#053d48");
      gradient.addColorStop(1, "#007f86");
      adContext.fillStyle = gradient;
      adContext.fillRect(0, 0, adCanvas.width, adCanvas.height);
      adContext.direction = "rtl";
      adContext.textAlign = "center";
      adContext.fillStyle = "#c8ffff";
      adContext.font = "600 36px sans-serif";
      adContext.fillText("سعودي دنت", 320, 70);
      adContext.fillStyle = "#ffffff";
      adContext.font = "700 62px sans-serif";
      adContext.fillText("ابتسامتك تبدأ هنا", 320, 164);
      adContext.fillStyle = "#74e5e5";
      adContext.fillRect(220, 910, 200, 5);
      adContext.font = "500 28px sans-serif";
      adContext.fillText("نخبة من أطباء الأسنان", 320, 962);
    };
    drawAdBase();
    const adTexture = new THREE.CanvasTexture(adCanvas);
    adTexture.colorSpace = THREE.SRGBColorSpace;
    const portraitPaths = [
      "/media/doctors/ahmed-alshahrani.jpg",
      "/media/doctors/mohammed-althabit.jpg",
      "/media/doctors/maryam-abdulmohsen.jpg",
    ];
    portraitPaths.forEach((path, index) => {
      const image = new Image();
      image.onload = () => {
        if (!adContext || disposed) return;
        const width = 176;
        const height = 500;
        const x = 44 + index * 188;
        const sourceRatio = image.width / image.height;
        const targetRatio = width / height;
        const sourceWidth = sourceRatio > targetRatio ? image.height * targetRatio : image.width;
        const sourceHeight = sourceRatio > targetRatio ? image.height : image.width / targetRatio;
        const sourceX = (image.width - sourceWidth) / 2;
        const sourceY = Math.max(0, (image.height - sourceHeight) * 0.18);
        adContext.save();
        adContext.beginPath();
        adContext.roundRect(x, 245, width, height, 16);
        adContext.clip();
        adContext.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, 245, width, height);
        adContext.restore();
        adTexture.needsUpdate = true;
      };
      image.src = path;
    });
    addBox(-3.96, 1.48, -1.45, 0.15, 2.35, 1.52, charcoal, true);
    const adScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 2.12), new THREE.MeshBasicMaterial({ map: adTexture }));
    adScreen.position.set(-3.865, 1.5, -1.45);
    adScreen.rotation.y = Math.PI / 2;
    scene.add(adScreen);

    // Hanging clinic-number sign.
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 1024;
    signCanvas.height = 470;
    const signContext = signCanvas.getContext("2d");
    if (signContext) {
      signContext.fillStyle = "#d8d7d4";
      signContext.fillRect(0, 0, 1024, 470);
      signContext.fillStyle = "#4b4d4f";
      signContext.fillRect(0, 218, 1024, 18);
      signContext.direction = "rtl";
      signContext.textAlign = "center";
      signContext.fillStyle = "#25292b";
      signContext.font = "600 54px sans-serif";
      signContext.fillText("من عيادة ١٣ إلى ٢١    ←", 512, 140);
      signContext.fillText("→    من عيادة ١ إلى ١٢", 512, 365);
      signContext.strokeStyle = "#96999a";
      signContext.lineWidth = 12;
      signContext.strokeRect(6, 6, 1012, 458);
    }
    const signTexture = new THREE.CanvasTexture(signCanvas);
    signTexture.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.75, 1.25),
      new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.62, side: THREE.DoubleSide }),
    );
    sign.position.set(0.05, 2.38, -3.25);
    scene.add(sign);
    addBox(-0.92, 2.88, -3.25, 0.025, 0.75, 0.025, aluminum);
    addBox(0.92, 2.88, -3.25, 0.025, 0.75, 0.025, aluminum);

    // Saudi Dent illuminated logo over the dark marble.
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/branding/intro/SaudiDent_MASTER_transparent_4K.png", (texture) => {
      if (disposed) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(2.45, 0.92),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, color: 0xaaffff }),
      );
      logo.position.set(3.935, 1.72, -4.8);
      logo.rotation.y = -Math.PI / 2;
      scene.add(logo);
      const logoLight = new THREE.PointLight(0x19f4f1, 5.5, 4.6, 2);
      logoLight.position.set(3.15, 1.75, -4.8);
      scene.add(logoLight);
    });

    // Closed end door — no geometry continues behind it in this stage.
    addWall(-2.75, -14.55, 2.7, 0.24, blackMarble);
    addWall(2.75, -14.55, 2.7, 0.24, blackMarble);
    addBox(0, 3.02, -14.46, 2.9, 0.34, 0.2, charcoal);
    addBox(-1.42, 1.5, -14.46, 0.16, 3.0, 0.2, charcoal);
    addBox(1.42, 1.5, -14.46, 0.16, 3.0, 0.2, charcoal);
    addBox(-0.7, 1.45, -14.42, 1.35, 2.75, 0.08, glass, true);
    addBox(0.7, 1.45, -14.42, 1.35, 2.75, 0.08, glass, true);
    addBox(-0.12, 1.35, -14.34, 0.035, 0.8, 0.035, aluminum);
    addBox(0.12, 1.35, -14.34, 0.035, 0.8, 0.035, aluminum);
    const exitLight = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.24, 0.06), new THREE.MeshBasicMaterial({ color: 0x32d38a }));
    exitLight.position.set(0, 2.95, -14.3);
    scene.add(exitLight);

    // Continuous cove lighting and recessed ceiling spots from the photograph.
    addBox(-3.48, 3.12, -4.7, 0.12, 0.06, 19.2, tealGlow);
    addBox(3.48, 3.12, -4.7, 0.12, 0.06, 19.2, tealGlow);
    for (let z = 3.25; z > -13.8; z -= 2.4) {
      [-1.55, 1.55].forEach((x) => {
        const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 24), tealGlow);
        fixture.position.set(x, 3.17, z);
        scene.add(fixture);
      });
    }

    // Ceiling air-conditioning grille at the first viewpoint.
    addBox(0, 3.155, 2.55, 0.95, 0.035, 0.65, aluminum);
    for (let index = -3; index <= 3; index += 1) {
      addBox(index * 0.11, 3.13, 2.55, 0.035, 0.025, 0.5, charcoal);
    }

    const hemisphere = new THREE.HemisphereLight(0xe8fbff, 0x878078, 2.15);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-2.5, 8, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -7;
    sun.shadow.camera.right = 7;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -17;
    scene.add(sun);
    [3.2, -1, -5.4, -9.8, -13].forEach((z) => {
      const light = new THREE.PointLight(0xedffff, 9.5, 7, 2);
      light.position.set(0, 2.82, z);
      scene.add(light);
    });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const isBlocked = (x: number, z: number) => {
      const radius = 0.43;
      return colliders.some((box) =>
        x > box.minX - radius &&
        x < box.maxX + radius &&
        z > box.minZ - radius &&
        z < box.maxZ + radius,
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(event.code)) {
        event.preventDefault();
        pressed.add(event.code);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => pressed.delete(event.code);
    const onPointerLockChange = () => setPointerLocked(document.pointerLockElement === renderer.domElement);
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== renderer.domElement) return;
      yaw -= event.movementX * 0.00215;
      pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.00185, -1.15, 1.15);
    };
    const onCanvasClick = () => {
      if (startedRef.current && !window.matchMedia("(pointer: coarse)").matches) renderer.domElement.requestPointerLock();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.clientX < window.innerWidth * 0.42) return;
      lookPointer = event.pointerId;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (lookPointer !== event.pointerId) return;
      const dx = event.clientX - previousPointerX;
      const dy = event.clientY - previousPointerY;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      yaw -= dx * 0.005;
      pitch = THREE.MathUtils.clamp(pitch - dy * 0.004, -1.05, 1.05);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (lookPointer === event.pointerId) lookPointer = null;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onCanvasClick);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    resize();
    setTouchMode(window.matchMedia("(pointer: coarse)").matches);
    setStatus("ready");

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;

      const move = movementRef.current;
      const forwardInput = Number(pressed.has("KeyW") || pressed.has("ArrowUp") || move.forward) - Number(pressed.has("KeyS") || pressed.has("ArrowDown") || move.back);
      const rightInput = Number(pressed.has("KeyD") || pressed.has("ArrowRight") || move.right) - Number(pressed.has("KeyA") || pressed.has("ArrowLeft") || move.left);
      const length = Math.hypot(forwardInput, rightInput) || 1;
      const speed = pressed.has("ShiftLeft") || pressed.has("ShiftRight") ? 5.1 : 3.35;
      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);
      const dx = ((forwardX * forwardInput + rightX * rightInput) / length) * speed * delta;
      const dz = ((forwardZ * forwardInput + rightZ * rightInput) / length) * speed * delta;
      const isMoving = Math.abs(forwardInput) + Math.abs(rightInput) > 0;

      if (!isBlocked(camera.position.x + dx, camera.position.z)) camera.position.x += dx;
      if (!isBlocked(camera.position.x, camera.position.z + dz)) camera.position.z += dz;
      camera.position.y = 1.68 + (isMoving ? Math.sin(elapsed * 10.5) * 0.018 : 0);
      camera.rotation.set(pitch, yaw, 0);

      const nextArea = areaForPosition(camera.position.x, camera.position.z);
      if (nextArea !== lastArea) {
        lastArea = nextArea;
        setArea(nextArea);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("click", onCanvasClick);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const startTour = () => {
    startedRef.current = true;
    setStarted(true);
    window.setTimeout(() => {
      const canvas = mountRef.current?.querySelector("canvas");
      if (canvas && !window.matchMedia("(pointer: coarse)").matches) canvas.requestPointerLock();
    }, 0);
  };

  const beginMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const key = event.currentTarget.dataset.move as MoveKey;
    event.currentTarget.setPointerCapture(event.pointerId);
    movementRef.current[key] = true;
  };

  const endMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const key = event.currentTarget.dataset.move as MoveKey;
    movementRef.current[key] = false;
  };

  return (
    <main className={styles.shell} dir="rtl">
      <div ref={mountRef} className={styles.viewport} />

      <header className={styles.topbar}>
        <Link href="/" className={styles.backLink} aria-label="العودة إلى منصة سعودي دنت">
          <ArrowLeft aria-hidden="true" />
          <span>المنصة</span>
        </Link>
        <div className={styles.brandBlock}>
          <span>جولة خميس مشيط</span>
          <strong>{area}</strong>
        </div>
        <div className={styles.prototypeBadge}>نموذج أولي</div>
      </header>

      {started && <span className={styles.crosshair} aria-hidden="true" />}

      {status === "loading" && (
        <div className={styles.loading} role="status">
          <span />
          <p>نبني المكان…</p>
        </div>
      )}

      {status === "error" && (
        <div className={styles.error} role="alert">تعذر تشغيل العرض ثلاثي الأبعاد على هذا الجهاز.</div>
      )}

      {!started && status === "ready" && (
        <section className={styles.intro} aria-labelledby="tour-title">
          <p className={styles.kicker}>SAUDI DENT / KHAMIS MUSHait</p>
          <h1 id="tour-title">ادخل الفرع<br />وامشِ بنفسك</h1>
          <p className={styles.introCopy}>
            القطعة الأولى مبنية من الصورة المرسلة فقط: نقطة الانطلاق، البابان الجانبيان، الممر وباب نهايته. لم نضف أي مساحة غير ظاهرة.
          </p>
          <button type="button" className={styles.startButton} onClick={startTour}>
            <span>ابدأ الجولة</span>
            <Footprints aria-hidden="true" />
          </button>
          <div className={styles.controlLegend}>
            {touchMode ? (
              <>
                <span><MousePointer2 aria-hidden="true" /> اسحب يمين الشاشة للنظر</span>
                <span><strong>▲ ◀ ▼ ▶</strong> للمشي</span>
              </>
            ) : (
              <>
                <span><MousePointer2 aria-hidden="true" /> الماوس للنظر</span>
                <span><strong>WASD</strong> للمشي</span>
                <span><strong>Shift</strong> للإسراع</span>
              </>
            )}
          </div>
        </section>
      )}

      {started && !touchMode && !pointerLocked && (
        <button type="button" className={styles.resume} onClick={startTour}>
          <Maximize aria-hidden="true" />
          اضغط للمتابعة
        </button>
      )}

      {started && (
        <div className={styles.bottomHud}>
          <div className={styles.statusLine}>
            <span className={styles.statusDot} />
            حركة حرة داخل النموذج
          </div>
          {!touchMode && <p>اضغط ESC لتحرير المؤشر</p>}
        </div>
      )}

      {started && touchMode && (
        <>
          <div className={styles.touchLookHint}>اسحب هنا للنظر</div>
          <div className={styles.movePad} aria-label="أزرار الحركة">
            <button type="button" className={styles.forward} data-move="forward" aria-label="تحرك للأمام" onPointerDown={beginMove} onPointerUp={endMove} onPointerCancel={endMove} onPointerLeave={endMove}>▲</button>
            <button type="button" className={styles.left} data-move="left" aria-label="تحرك لليسار" onPointerDown={beginMove} onPointerUp={endMove} onPointerCancel={endMove} onPointerLeave={endMove}>◀</button>
            <button type="button" className={styles.back} data-move="back" aria-label="تحرك للخلف" onPointerDown={beginMove} onPointerUp={endMove} onPointerCancel={endMove} onPointerLeave={endMove}>▼</button>
            <button type="button" className={styles.right} data-move="right" aria-label="تحرك لليمين" onPointerDown={beginMove} onPointerUp={endMove} onPointerCancel={endMove} onPointerLeave={endMove}>▶</button>
          </div>
        </>
      )}
    </main>
  );
}
