import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StudyUniverse3DProps {
  years: number[];
  activeYear?: number;
  onSelectYear?: (year: number) => void;
}

export const StudyUniverse3D: React.FC<StudyUniverse3DProps> = ({ years, activeYear }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x6366f1, 3, 20);
    light1.position.set(6, 6, 6);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x06b6d4, 2, 20);
    light2.position.set(-6, -4, 4);
    scene.add(light2);

    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // Central Sphere (Core Knowledge Hub)
    const coreGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    universeGroup.add(coreMesh);

    // Atmosphere halo
    const haloGeo = new THREE.SphereGeometry(2.35, 24, 24);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    universeGroup.add(haloMesh);

    // 4 Orbit Rings for the 4 Years
    const ringRadii = [3.4, 4.3, 5.2, 6.0];
    const ringColors = [0x6366f1, 0x06b6d4, 0x10b981, 0xf59e0b];
    const satellites: THREE.Mesh[] = [];

    years.forEach((_yr, idx) => {
      const radius = ringRadii[idx] || 3.4 + idx * 0.9;
      const color = ringColors[idx % ringColors.length];

      // Orbit line
      const ringGeo = new THREE.RingGeometry(radius - 0.03, radius + 0.03, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: activeYear === _yr ? 0.9 : 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (idx * 0.12);
      ring.rotation.y = idx * 0.15;
      universeGroup.add(ring);

      // Satellite sphere
      const satGeo = new THREE.SphereGeometry(activeYear === _yr ? 0.38 : 0.25, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: activeYear === _yr ? 0xffffff : color,
        emissive: color,
        emissiveIntensity: activeYear === _yr ? 0.8 : 0.3,
        roughness: 0.2,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = { radius, speed: 0.5 + idx * 0.2, angle: (idx * Math.PI) / 2, tiltX: ring.rotation.x, tiltY: ring.rotation.y };
      satellites.push(sat);
      universeGroup.add(sat);
    });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speed = prefersReducedMotion ? 0.2 : 0.8;

      coreMesh.rotation.y += 0.005 * speed;
      haloMesh.rotation.y -= 0.003 * speed;
      haloMesh.rotation.x += 0.002 * speed;

      satellites.forEach((sat) => {
        const data = sat.userData;
        const currentAngle = data.angle + elapsed * data.speed * 0.6 * speed;
        const x = Math.cos(currentAngle) * data.radius;
        const z = Math.sin(currentAngle) * data.radius;

        // Apply tilt
        sat.position.x = x;
        sat.position.y = Math.sin(currentAngle) * 0.6 * Math.sin(data.tiltX);
        sat.position.z = z;
      });

      universeGroup.rotation.y += 0.002 * speed;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [years, activeYear]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[220px] flex items-center justify-center relative"
      title="4-Year Study Journey Universe"
    />
  );
};
