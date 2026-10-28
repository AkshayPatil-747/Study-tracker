import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hourglass3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const lightTop = new THREE.PointLight(0xf59e0b, 2.5, 15);
    lightTop.position.set(2, 4, 3);
    scene.add(lightTop);

    const lightBottom = new THREE.PointLight(0x6366f1, 2, 15);
    lightBottom.position.set(-2, -4, 3);
    scene.add(lightBottom);

    const group = new THREE.Group();
    scene.add(group);

    // Caps (Top and Bottom brass plates)
    const capGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    });

    const topPlate = new THREE.Mesh(capGeo, brassMat);
    topPlate.position.y = 2.1;
    group.add(topPlate);

    const bottomPlate = new THREE.Mesh(capGeo, brassMat);
    bottomPlate.position.y = -2.1;
    group.add(bottomPlate);

    // Support pillars
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.2, 16);
    const pillarAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    pillarAngles.forEach((angle) => {
      const pillar = new THREE.Mesh(pillarGeo, brassMat);
      pillar.position.set(Math.cos(angle) * 1.35, 0, Math.sin(angle) * 1.35);
      group.add(pillar);
    });

    // Glass bulb: top cone, neck, bottom cone
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5,
    });

    const topBulbGeo = new THREE.ConeGeometry(1.3, 1.8, 32, 1, true);
    const topBulb = new THREE.Mesh(topBulbGeo, glassMat);
    topBulb.rotation.x = Math.PI;
    topBulb.position.y = 1.0;
    group.add(topBulb);

    const bottomBulbGeo = new THREE.ConeGeometry(1.3, 1.8, 32, 1, true);
    const bottomBulb = new THREE.Mesh(bottomBulbGeo, glassMat);
    bottomBulb.position.y = -1.0;
    group.add(bottomBulb);

    // Sand Particles falling stream
    const particleCount = 60;
    const sandPositions = new Float32Array(particleCount * 3);
    const sandSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      sandPositions[i * 3] = (Math.random() - 0.5) * 0.15;
      sandPositions[i * 3 + 1] = Math.random() * 2.2 - 1.1; // stream around center
      sandPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      sandSpeeds[i] = 0.04 + Math.random() * 0.03;
    }

    const sandGeo = new THREE.BufferGeometry();
    sandGeo.setAttribute('position', new THREE.BufferAttribute(sandPositions, 3));
    const sandMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    const sandParticles = new THREE.Points(sandGeo, sandMat);
    group.add(sandParticles);

    // Glowing sand pool at the bottom
    const sandPoolGeo = new THREE.ConeGeometry(1.1, 0.8, 24);
    const sandPoolMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.8,
    });
    const sandPool = new THREE.Mesh(sandPoolGeo, sandPoolMat);
    sandPool.position.y = -1.6;
    group.add(sandPool);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speed = prefersReducedMotion ? 0.3 : 1;

      group.rotation.y = elapsed * 0.35 * speed;
      group.position.y = Math.sin(elapsed * 1.5 * speed) * 0.12;

      // Animate falling sand
      const pos = sandGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] -= sandSpeeds[i] * speed;
        if (pos[i * 3 + 1] < -1.4) {
          pos[i * 3 + 1] = 0.8 + Math.random() * 0.4;
          pos[i * 3] = (Math.random() - 0.5) * 0.2;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
        }
      }
      sandGeo.attributes.position.needsUpdate = true;

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
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[200px] flex items-center justify-center relative"
      title="3D Clock & Study Timeglass"
    />
  );
};
