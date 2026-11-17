import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  X,
  RotateCw,
  Sun,
  Moon,
  Glasses,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Smartphone,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { Room } from '../types';

interface VirtualTourModalProps {
  room: Room;
  onClose: () => void;
  onRequestRoom: (room: Room) => void;
}

interface Hotspot3D {
  id: string;
  theta: number; // azimuth (longitude) in radians
  phi: number; // elevation (latitude) in radians
  title: string;
  desc: string;
  icon: string;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  room,
  onClose,
  onRequestRoom,
}) => {
  // References for DOM mounts
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Tour controls state
  const [isNightMode, setIsNightMode] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot3D | null>(null);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    Array<{ id: string; x: number; y: number; visible: boolean; spot: Hotspot3D }>
  >([]);
  const [compassHeading, setCompassHeading] = useState(0);
  const [fov, setFov] = useState(70);

  // Device Orientation / Gyroscope state
  const [isGyroActive, setIsGyroActive] = useState(false);
  const [gyroSupported, setGyroSupported] = useState(true);
  const [gyroPermissionStatus, setGyroPermissionStatus] = useState<
    'idle' | 'granted' | 'denied' | 'unsupported'
  >('idle');
  const [showGyroPrompt, setShowGyroPrompt] = useState(false);
  const [currentTilt, setCurrentTilt] = useState({ pitch: 0, roll: 0 });

  // References for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cameraGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);

  // Orientation & manual touch tracking refs
  const deviceOrientationRef = useRef<{ alpha: number; beta: number; gamma: number }>({
    alpha: 0,
    beta: 90,
    gamma: 0,
  });
  const screenOrientationAngleRef = useRef(0);
  const manualYawOffsetRef = useRef(0); // Offset for manual swipe during gyro or recalibration

  // Spherical camera rotation coordinates (for manual / non-gyro mode)
  const lonRef = useRef(90);
  const latRef = useRef(0);
  const targetLonRef = useRef(90);
  const targetLatRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);

  // 3D Hotspots in spherical coordinates around the room
  const hotspots: Hotspot3D[] = [
    {
      id: 'bed',
      theta: 0.85,
      phi: 0.15,
      title: 'Comfort Bed & Linen',
      desc: 'Solid mahogany base with single ortho-foam mattress, cotton duvet, and study pillows.',
      icon: '🛏️',
    },
    {
      id: 'desk',
      theta: 2.1,
      phi: 0.1,
      title: 'Ergonomic Study Workspace',
      desc: '200Mbps dedicated fiber Wi-Fi port, dual surge-protected outlets, wide laminated desk and lamp.',
      icon: '💻',
    },
    {
      id: 'window',
      theta: 3.14,
      phi: 0.05,
      title: 'Ventilated Panoramic Window',
      desc: 'Double-glazed soundproof glass with blackout curtains and fresh cross-breeze.',
      icon: '🪟',
    },
    {
      id: 'closet',
      theta: 4.4,
      phi: 0.2,
      title: 'Floor-to-Ceiling Wardrobe',
      desc: 'Individual secure padlock locker, built-in organizers, shoe rack, and full dressing mirror.',
      icon: '🚪',
    },
    {
      id: 'bath',
      theta: 5.4,
      phi: 0.0,
      title: room.amenities.includes('Private bath') ? 'Private En-Suite Bath' : 'Shared Bath Access',
      desc: 'Equipped with stainless bidet, overhead high-pressure shower, and ventilation exhaust.',
      icon: '🚿',
    },
    {
      id: 'aircon',
      theta: 2.3,
      phi: 0.65,
      title: room.amenities.includes('Air-con') ? 'Inverter Air-Conditioner' : 'Oscillating Wall Fan',
      desc: 'Energy-efficient cooling unit with whisper-quiet sleep timer mode.',
      icon: '❄️',
    },
  ];

  // Check device orientation support and detect mobile on mount
  useEffect(() => {
    const isMobileDevice =
      /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

    if (isMobileDevice) {
      setShowGyroPrompt(true);
    }

    const checkSupport = () => {
      if (!window.DeviceOrientationEvent) {
        setGyroSupported(false);
        setGyroPermissionStatus('unsupported');
      }
    };
    checkSupport();

    // Update screen orientation angle on rotate
    const updateScreenOrientation = () => {
      screenOrientationAngleRef.current =
        window.screen?.orientation?.angle ||
        (Number(window.orientation) as number) ||
        0;
    };
    updateScreenOrientation();
    window.addEventListener('orientationchange', updateScreenOrientation);
    window.addEventListener('resize', updateScreenOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateScreenOrientation);
      window.removeEventListener('resize', updateScreenOrientation);
    };
  }, []);

  // Procedural 360 Equirectangular Canvas Generator
  const generateEquirectangularTexture = (isNight: boolean, theme: string) => {
    const width = 2048;
    const height = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const wallColor = isNight ? '#161c24' : '#f4efe6';
    const ceilingColor = isNight ? '#0d1117' : '#faf8f5';
    const floorColor = isNight ? '#2b2118' : '#a07855';

    // Base background (Walls)
    ctx.fillStyle = wallColor;
    ctx.fillRect(0, 0, width, height);

    // Ceiling gradient
    const ceilingGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
    ceilingGrad.addColorStop(0, ceilingColor);
    ceilingGrad.addColorStop(1, wallColor);
    ctx.fillStyle = ceilingGrad;
    ctx.fillRect(0, 0, width, height * 0.35);

    // Ceiling moulding line
    ctx.strokeStyle = isNight ? '#252e3d' : '#ded4c5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.35);
    ctx.lineTo(width, height * 0.35);
    ctx.stroke();

    // Ceiling light / fan fixture at zenith
    ctx.fillStyle = isNight ? '#ffd166' : '#ffffff';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.12, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isNight ? 'rgba(255, 209, 102, 0.25)' : 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.12, 90, 0, Math.PI * 2);
    ctx.fill();

    // Floor gradient & parquet planks
    const floorGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
    floorGrad.addColorStop(0, wallColor);
    floorGrad.addColorStop(0.05, isNight ? '#1c150f' : '#8d6343');
    floorGrad.addColorStop(1, floorColor);
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    // Hardwood floor lines
    ctx.strokeStyle = isNight ? 'rgba(0,0,0,0.35)' : 'rgba(100,60,30,0.25)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, height * 0.65);
      ctx.lineTo(x + 40, height);
      ctx.stroke();
    }

    // Study Rug & Entrance Area
    ctx.fillStyle = isNight ? '#23303d' : '#c9b79c';
    ctx.beginPath();
    ctx.ellipse(width * 0.15, height * 0.78, 140, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Student Bed & Nightstand
    ctx.fillStyle = isNight ? '#1f1610' : '#5c3a21';
    ctx.fillRect(width * 0.18, height * 0.42, 160, 240);
    ctx.fillStyle = isNight ? '#2c3e50' : '#34495e';
    ctx.fillRect(width * 0.16, height * 0.55, 200, 120);
    ctx.fillStyle = isNight ? '#3a4a5b' : '#ecf0f1';
    ctx.beginPath();
    ctx.roundRect(width * 0.17, height * 0.5, 75, 45, 10);
    ctx.roundRect(width * 0.25, height * 0.5, 75, 45, 10);
    ctx.fill();

    // Nightstand with lamp
    ctx.fillStyle = isNight ? '#1f1610' : '#7f5539';
    ctx.fillRect(width * 0.12, height * 0.55, 60, 110);
    ctx.fillStyle = isNight ? '#f59e0b' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(width * 0.138, height * 0.52, 14, 0, Math.PI * 2);
    ctx.fill();

    // Air conditioner unit
    ctx.fillStyle = isNight ? '#242b35' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(width * 0.35, height * 0.25, 160, 50, 6);
    ctx.fill();
    ctx.strokeStyle = isNight ? '#374151' : '#d1d5db';
    ctx.stroke();

    // Study desk surface & legs
    ctx.fillStyle = isNight ? '#2b1e16' : '#8d5b4c';
    ctx.fillRect(width * 0.32, height * 0.56, 240, 22);
    ctx.fillStyle = isNight ? '#111827' : '#374151';
    ctx.fillRect(width * 0.33, height * 0.58, 14, 110);
    ctx.fillRect(width * 0.53, height * 0.58, 14, 110);

    // Open laptop
    ctx.fillStyle = isNight ? '#38bdf8' : '#0284c7';
    ctx.fillRect(width * 0.38, height * 0.49, 50, 32);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(width * 0.375, height * 0.55, 60, 8);

    // Warm study desk lamp
    ctx.strokeStyle = isNight ? '#d97706' : '#e05d26';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.46, height * 0.56);
    ctx.lineTo(width * 0.455, height * 0.47);
    ctx.lineTo(width * 0.43, height * 0.48);
    ctx.stroke();
    ctx.fillStyle = isNight ? '#fbbf24' : '#e05d26';
    ctx.beginPath();
    ctx.arc(width * 0.428, height * 0.48, 14, 0, Math.PI * 2);
    ctx.fill();

    // Bookshelf with books
    ctx.fillStyle = isNight ? '#1f1610' : '#6f4e37';
    ctx.fillRect(width * 0.48, height * 0.38, 120, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(width * 0.49, height * 0.34, 12, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width * 0.505, height * 0.33, 14, 21);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(width * 0.522, height * 0.35, 10, 19);

    // Wall Poster
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(width * 0.28, height * 0.35, 65, 80);
    ctx.fillStyle = '#e05d26';
    ctx.fillRect(width * 0.285, height * 0.355, 59, 74);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText('VRENT', width * 0.295, height * 0.39);

    // Panoramic Sliding Window with View
    const winX = width * 0.6;
    const winY = height * 0.35;
    const winW = 280;
    const winH = 240;

    ctx.fillStyle = isNight ? '#0b0f19' : '#e2e8f0';
    ctx.fillRect(winX, winY, winW, winH);

    if (isNight) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(winX + 12, winY + 12, winW - 24, winH - 24);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(winX + 60, winY + 60, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      for (let bx = winX + 20; bx < winX + winW - 30; bx += 24) {
        ctx.fillRect(bx, winY + winH - 70, 18, 50);
      }
    } else {
      const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      skyGrad.addColorStop(0, '#7dd3fc');
      skyGrad.addColorStop(0.65, '#bae6fd');
      skyGrad.addColorStop(1, '#86efac');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(winX + 12, winY + 12, winW - 24, winH - 24);

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(winX + 70, winY + 65, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(winX + 100, winY + winH - 25, 45, 0, Math.PI * 2);
      ctx.arc(winX + 180, winY + winH - 20, 55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = isNight ? '#1e293b' : '#ffffff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(winX + winW / 2, winY);
    ctx.lineTo(winX + winW / 2, winY + winH);
    ctx.moveTo(winX, winY + winH / 2);
    ctx.lineTo(winX + winW, winY + winH / 2);
    ctx.stroke();

    // Wardrobe & Mirror
    const wardX = width * 0.77;
    ctx.fillStyle = isNight ? '#17110c' : '#7c4a27';
    ctx.fillRect(wardX, height * 0.32, 190, 320);
    ctx.strokeStyle = isNight ? '#0b0805' : '#573319';
    ctx.lineWidth = 4;
    ctx.strokeRect(wardX, height * 0.32, 190, 320);
    ctx.beginPath();
    ctx.moveTo(wardX + 95, height * 0.32);
    ctx.lineTo(wardX + 95, height * 0.64);
    ctx.stroke();
    ctx.fillStyle = isNight ? '#1e293b' : '#e0f2fe';
    ctx.fillRect(wardX + 105, height * 0.36, 75, 230);
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(wardX + 85, height * 0.48, 5, 0, Math.PI * 2);
    ctx.arc(wardX + 105, height * 0.48, 5, 0, Math.PI * 2);
    ctx.fill();

    // En-suite Bathroom Door & Main Entrance
    const doorX = width * 0.9;
    ctx.fillStyle = isNight ? '#1f2937' : '#ffffff';
    ctx.fillRect(doorX, height * 0.36, 120, 270);
    ctx.strokeStyle = isNight ? '#111827' : '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.strokeRect(doorX, height * 0.36, 120, 270);

    return new THREE.CanvasTexture(canvas);
  };

  // Helper function to map Device Orientation (alpha, beta, gamma) + screen orientation to camera quaternion
  const setDeviceOrientationQuaternion = (
    quaternion: THREE.Quaternion,
    alpha: number,
    beta: number,
    gamma: number,
    orient: number
  ) => {
    const degToRad = Math.PI / 180;
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    const _alpha = alpha ? alpha * degToRad : 0;
    const _beta = beta ? beta * degToRad : 0;
    const _gamma = gamma ? gamma * degToRad : 0;
    const _orient = orient ? orient * degToRad : 0;

    euler.set(_beta, _alpha, -_gamma, 'YXZ'); // Camera takes 'YXZ'
    quaternion.setFromEuler(euler);
    quaternion.multiply(q1); // Camera looks out the back of the device
    quaternion.multiply(q0.setFromAxisAngle(zee, -_orient)); // Adjust for device orientation angle
  };

  // Mount Three.js 360 Spherical VR Scene inside dedicated canvasMountRef
  useEffect(() => {
    const canvasContainer = canvasMountRef.current;
    const viewport = viewportRef.current;
    if (!canvasContainer || !viewport) return;

    // 1. Scene, CameraGroup, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    cameraGroupRef.current = cameraGroup;

    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraGroup.add(camera);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Isolate canvas mount: only empty canvasContainer, NEVER touching React sibling nodes!
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(renderer.domElement);

    // 2. 360 Inverted Sphere Geometry
    const sphereGeometry = new THREE.SphereGeometry(500, 64, 40);
    sphereGeometry.scale(-1, 1, 1);

    const texture = generateEquirectangularTexture(isNightMode, room.illustrationTheme);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const sphereMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // 3. Animation loop with smooth damping and orientation integration
    let animationFrameId: number;

    const updateHotspotScreenPositions = () => {
      if (!cameraRef.current || !viewportRef.current) return;

      const halfW = viewportRef.current.clientWidth / 2;
      const halfH = viewportRef.current.clientHeight / 2;

      camera.updateMatrixWorld();

      const screenPositions = hotspots.map((spot) => {
        const radius = 450;
        const x = radius * Math.cos(spot.phi) * Math.sin(spot.theta);
        const y = radius * Math.sin(spot.phi);
        const z = radius * Math.cos(spot.phi) * Math.cos(spot.theta);

        const vector = new THREE.Vector3(x, y, z);
        vector.project(camera);

        const isVisible = vector.z < 1;
        const screenX = vector.x * halfW + halfW;
        const screenY = -vector.y * halfH + halfH;

        return {
          id: spot.id,
          x: screenX,
          y: screenY,
          visible: isVisible,
          spot,
        };
      });

      setHotspotScreenPositions(screenPositions);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isGyroActive) {
        // Physical phone orientation tracking via DeviceOrientation API
        const { alpha, beta, gamma } = deviceOrientationRef.current;
        const orient = screenOrientationAngleRef.current;

        setDeviceOrientationQuaternion(camera.quaternion, alpha, beta, gamma, orient);
        cameraGroup.rotation.y = manualYawOffsetRef.current;
      } else {
        // Standard manual touch / mouse drag controls with damping
        if (autoRotate && !isPointerDownRef.current) {
          targetLonRef.current += 0.08;
        }

        lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
        latRef.current += (targetLatRef.current - latRef.current) * 0.1;

        latRef.current = Math.max(-85, Math.min(85, latRef.current));

        const phi = THREE.MathUtils.degToRad(90 - latRef.current);
        const theta = THREE.MathUtils.degToRad(lonRef.current);

        const lookTarget = new THREE.Vector3(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta)
        );

        camera.rotation.set(0, 0, 0);
        camera.quaternion.set(0, 0, 0, 1);
        cameraGroup.rotation.set(0, 0, 0);
        camera.lookAt(lookTarget);
      }

      // Compute camera forward vector for Compass HUD
      const forwardDir = new THREE.Vector3(0, 0, -1);
      forwardDir.applyQuaternion(camera.quaternion);
      if (cameraGroup.rotation.y !== 0) {
        forwardDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraGroup.rotation.y);
      }
      const heading = Math.round((Math.atan2(forwardDir.x, forwardDir.z) * (180 / Math.PI) + 360) % 360);
      setCompassHeading(heading);

      // Render standard or dual-eye stereoscopic VR
      if (isVRMode) {
        const fullW = viewportRef.current?.clientWidth || width;
        const fullH = viewportRef.current?.clientHeight || height;
        const halfEyeW = fullW / 2;

        renderer.setScissorTest(true);

        // Left Eye
        renderer.setScissor(0, 0, halfEyeW, fullH);
        renderer.setViewport(0, 0, halfEyeW, fullH);
        camera.aspect = halfEyeW / fullH;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);

        // Right Eye
        renderer.setScissor(halfEyeW, 0, halfEyeW, fullH);
        renderer.setViewport(halfEyeW, 0, halfEyeW, fullH);
        camera.aspect = halfEyeW / fullH;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);

        renderer.setScissorTest(false);
      } else {
        renderer.render(scene, camera);
        updateHotspotScreenPositions();
      }
    };

    animate();

    const handleResize = () => {
      if (!viewportRef.current || !renderer || !camera) return;
      const w = viewportRef.current.clientWidth;
      const h = viewportRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvasContainer && canvasContainer.contains(renderer.domElement)) {
        canvasContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      texture.dispose();
    };
  }, [isNightMode, isVRMode, autoRotate, fov, isGyroActive, room.illustrationTheme]);

  // Handle Device Orientation listener
  const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
    if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
      deviceOrientationRef.current = {
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
      };

      setCurrentTilt({
        pitch: Math.round(e.beta),
        roll: Math.round(e.gamma),
      });

      if (!isGyroActive) {
        setIsGyroActive(true);
        setAutoRotate(false);
        setGyroPermissionStatus('granted');
        setShowGyroPrompt(false);
      }
    }
  };

  // Request Gyroscope Permission (required for iOS 13+ Safari & modern browsers)
  const toggleGyroscope = async () => {
    if (isGyroActive) {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation as any);
      setIsGyroActive(false);
      return;
    }

    if (
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          setIsGyroActive(true);
          setAutoRotate(false);
          setGyroPermissionStatus('granted');
          setShowGyroPrompt(false);
        } else {
          setGyroPermissionStatus('denied');
          alert('Motion sensor permission was denied. Please allow motion sensors in your browser settings.');
        }
      } catch (err) {
        console.warn('Error requesting device orientation permission:', err);
        setGyroPermissionStatus('denied');
      }
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation as any);
      setIsGyroActive(true);
      setAutoRotate(false);
      setGyroPermissionStatus('granted');
      setShowGyroPrompt(false);
    } else {
      setGyroSupported(false);
      setGyroPermissionStatus('unsupported');
      alert('Device Orientation sensor is not supported on this browser or hardware.');
    }
  };

  // Recalibrate current forward view
  const handleRecalibrate = () => {
    if (!isGyroActive) return;
    const { alpha } = deviceOrientationRef.current;
    manualYawOffsetRef.current = -alpha * (Math.PI / 180);
  };

  // FOV Zoom Handlers
  const handleZoom = (delta: number) => {
    setFov((prev) => {
      const nextFov = Math.max(35, Math.min(95, prev + delta));
      if (cameraRef.current) {
        cameraRef.current.fov = nextFov;
        cameraRef.current.updateProjectionMatrix();
      }
      return nextFov;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY * 0.04);
  };

  // Pointer event handlers (supports swipe pan even when gyro is active)
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = targetLonRef.current;
    onPointerDownLatRef.current = targetLatRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const factor = fov / 400;

    if (isGyroActive) {
      const deltaX = (e.clientX - onPointerDownPointerXRef.current) * 0.005;
      manualYawOffsetRef.current += deltaX;
      onPointerDownPointerXRef.current = e.clientX;
    } else {
      targetLonRef.current =
        (onPointerDownPointerXRef.current - e.clientX) * factor + onPointerDownLonRef.current;
      targetLatRef.current =
        (e.clientY - onPointerDownPointerYRef.current) * factor + onPointerDownLatRef.current;
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Clean up orientation listener on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation as any);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-stone-950 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col h-[94vh]">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-stone-900/95 border-b border-stone-800 flex items-center justify-between text-white z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e05d26]/20 border border-[#e05d26]/40 flex items-center justify-center text-[#e05d26]">
              <Glasses className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">{room.title}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Spherical 360° / VR
                </span>
              </div>
              <p className="text-[11px] text-stone-400">{room.location}</p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            {/* Mobile Gyro / Device Orientation Button */}
            <button
              onClick={toggleGyroscope}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                isGyroActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title={isGyroActive ? 'Click to disable gyroscope' : 'Enable phone motion sensor control'}
            >
              <Smartphone
                className={`w-3.5 h-3.5 ${isGyroActive ? 'animate-bounce text-white' : 'text-amber-400'}`}
              />
              <span>{isGyroActive ? 'Gyro Tracking ON' : 'Enable Gyro'}</span>
            </button>

            {/* Recalibrate Center (Visible when gyro is active) */}
            {isGyroActive && (
              <button
                onClick={handleRecalibrate}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-stone-700 flex items-center gap-1 cursor-pointer"
                title="Recalibrate forward direction"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Center</span>
              </button>
            )}

            {/* Day / Night Ambient Switcher */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              title="Toggle Day/Night study atmosphere"
            >
              {isNightMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Night</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Day</span>
                </>
              )}
            </button>

            {/* VR Cardboard Goggles Mode */}
            <button
              onClick={() => setIsVRMode(!isVRMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                isVRMode
                  ? 'bg-[#e05d26] text-white border-[#e05d26] shadow-md'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
              }`}
              title="Split-screen for Cardboard / VR Headsets"
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>{isVRMode ? 'Stereo VR' : 'VR Goggles'}</span>
            </button>

            {/* Auto Orbit */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              disabled={isGyroActive}
              className={`p-2 rounded-xl text-xs border cursor-pointer ${
                autoRotate
                  ? 'bg-[#e05d26]/20 text-[#e05d26] border-[#e05d26]/40'
                  : 'bg-stone-800 text-stone-300 border-stone-700'
              } ${isGyroActive ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={isGyroActive ? 'Auto-rotate disabled while gyro is active' : 'Auto orbit'}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate && !isGyroActive ? 'animate-spin' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
              title="Close 360 preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive 360 VR Canvas Viewport */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative flex-1 w-full overflow-hidden bg-black cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {/* Isolated WebGL canvas container - Contains NO React virtual DOM children */}
          <div ref={canvasMountRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Compass & Orientation HUD (Top Left) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-700 text-white text-xs font-mono pointer-events-none shadow-lg">
            <Compass
              className="w-4 h-4 text-[#e05d26]"
              style={{ transform: `rotate(${-compassHeading}deg)` }}
            />
            <span>{compassHeading}°</span>
            <span className="text-[10px] text-amber-300 font-bold">
              {compassHeading >= 315 || compassHeading < 45
                ? 'N'
                : compassHeading < 135
                ? 'E'
                : compassHeading < 225
                ? 'S'
                : 'W'}
            </span>
            {isGyroActive && (
              <span className="border-l border-stone-700 pl-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Pitch: {currentTilt.pitch}°</span>
              </span>
            )}
          </div>

          {/* Zoom Controls (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-700 shadow-lg">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile One-Tap Gyroscope Enable Prompt Banner (Appears on mobile if not active) */}
          {showGyroPrompt && !isGyroActive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm bg-gradient-to-r from-stone-900 to-[#1e2a28] border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-white flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <Smartphone className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-amber-200">Mobile Motion Control</h5>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    Rotate your phone physically to explore the room in 3D.
                  </p>
                </div>
              </div>
              <button
                onClick={toggleGyroscope}
                className="px-3.5 py-2 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shrink-0 shadow-md cursor-pointer"
              >
                Enable
              </button>
            </div>
          )}

          {/* Active Gyro Floating Pill indicator */}
          {isGyroActive && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-stone-900/90 border border-emerald-500/50 rounded-full px-4 py-1.5 text-xs text-emerald-300 flex items-center gap-2 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold">Motion Sensor Active</span>
              <span className="text-stone-400 text-[11px] hidden sm:inline">• Rotate phone in any direction</span>
            </div>
          )}

          {/* 3D Hotspot Screen Overlay Elements (Only in standard mode) */}
          {!isVRMode &&
            hotspotScreenPositions.map(({ id, x, y, visible, spot }) => {
              if (!visible) return null;
              const isActive = activeHotspot?.id === id;

              return (
                <div
                  key={id}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 pointer-events-auto"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(isActive ? null : spot);
                    }}
                    className={`relative p-2 rounded-full cursor-pointer transition transform hover:scale-125 ${
                      isActive
                        ? 'bg-[#e05d26] text-white ring-4 ring-[#e05d26]/40 scale-110'
                        : 'bg-white/95 text-stone-900 shadow-xl hover:bg-white'
                    }`}
                    title={spot.title}
                  >
                    <span className="text-xs">{spot.icon}</span>
                  </button>

                  {/* Hotspot Floating Description Box */}
                  {isActive && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-60 p-3 rounded-2xl bg-stone-900/95 border border-stone-700 text-white shadow-2xl backdrop-blur-md z-30"
                    >
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-800">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <span>{spot.icon}</span>
                          <span>{spot.title}</span>
                        </span>
                        <button
                          onClick={() => setActiveHotspot(null)}
                          className="text-stone-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-relaxed">{spot.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Center divider line in VR mode */}
          {isVRMode && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/30 pointer-events-none z-30 flex items-center justify-center">
              <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full border border-stone-700">
                Center Divider
              </span>
            </div>
          )}

          {/* Drag instruction badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-700 text-stone-300 text-xs font-medium pointer-events-none flex items-center gap-2 shadow-xl whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-[#e05d26]" />
            <span>
              {isGyroActive
                ? 'Physically tilt/turn phone or swipe to adjust orientation'
                : 'Look around 360° horizontally & vertically (Drag / Swipe / Pinch)'}
            </span>
          </div>
        </div>

        {/* Footer info & Room Booking Trigger */}
        <div className="px-5 py-3.5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-white z-20">
          <div className="flex items-center gap-4 text-xs text-stone-400 w-full sm:w-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Monthly Rent
              </span>
              <span className="text-base font-extrabold text-white">
                ₱{room.price.toLocaleString()}
                <span className="text-xs font-normal text-stone-400">/mo</span>
              </span>
            </div>
            <div className="h-7 w-[1px] bg-stone-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Available Slots
              </span>
              <span className="text-xs font-bold text-amber-300">
                {room.slotsAvailable} of {room.totalSlots} Slots Free
              </span>
            </div>
            <div className="h-7 w-[1px] bg-stone-800 hidden md:block" />
            <div className="hidden md:block">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Direct Landlord
              </span>
              <span className="text-xs font-medium text-stone-300">{room.ownerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Exit Tour
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestRoom(room);
              }}
              className="px-5 py-2 rounded-xl bg-[#e05d26] hover:bg-[#c94f1c] text-white text-xs font-bold shadow-md shadow-[#e05d26]/30 cursor-pointer"
            >
              Request Room Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
