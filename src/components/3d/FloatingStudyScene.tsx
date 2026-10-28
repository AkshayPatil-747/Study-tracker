import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FloatingStudyScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.5); // Indigo
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8); // Cyan
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf43f5e, 2, 25); // Rose glow
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // Helper: Create a 3D book
    const createBook = (colorHex: number, scale = 1) => {
      const bookGroup = new THREE.Group();

      // Cover
      const coverGeo = new THREE.BoxGeometry(3 * scale, 4.2 * scale, 0.6 * scale);
      const coverMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.2,
      });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      bookGroup.add(cover);

      // Pages insert
      const pagesGeo = new THREE.BoxGeometry(2.75 * scale, 4.0 * scale, 0.45 * scale);
      const pagesMat = new THREE.MeshStandardMaterial({
        color: 0xfbfbfb,
        roughness: 0.8,
      });
      const pages = new THREE.Mesh(pagesGeo, pagesMat);
      pages.position.x = 0.12 * scale;
      bookGroup.add(pages);

      // Spine stripe gold
      const stripeGeo = new THREE.BoxGeometry(0.15 * scale, 4.22 * scale, 0.62 * scale);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.7,
        roughness: 0.3,
      });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.x = -1.45 * scale;
      bookGroup.add(stripe);

      return bookGroup;
    };

    // Books
    const book1 = createBook(0x4f46e5, 1.1); // Indigo
    book1.position.set(-3.5, 1.8, 0);
    book1.rotation.set(0.4, 0.5, -0.2);
    group.add(book1);

    const book2 = createBook(0x06b6d4, 0.95); // Cyan
    book2.position.set(4, 2.5, -2);
    book2.rotation.set(-0.3, -0.6, 0.3);
    group.add(book2);

    const book3 = createBook(0x8b5cf6, 1.25); // Purple
    book3.position.set(-2, -3.2, 1);
    book3.rotation.set(0.2, 0.8, 0.4);
    group.add(book3);

    const book4 = createBook(0x10b981, 0.85); // Emerald
    book4.position.set(3.8, -2.8, -1);
    book4.rotation.set(-0.5, 0.4, -0.3);
    group.add(book4);

    // Graduation Cap
    const capGroup = new THREE.Group();
    // Cap top diamond
    const capTopGeo = new THREE.BoxGeometry(3.4, 0.15, 3.4);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 });
    const capTop = new THREE.Mesh(capTopGeo, capMat);
    capTop.rotation.y = Math.PI / 4;
    capGroup.add(capTop);

    // Cap base
    const capBaseGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.9, 16);
    const capBase = new THREE.Mesh(capBaseGeo, capMat);
    capBase.position.y = -0.45;
    capGroup.add(capBase);

    // Button & Tassel
    const buttonGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const button = new THREE.Mesh(buttonGeo, goldMat);
    button.position.y = 0.12;
    capGroup.add(button);

    // Tassel line
    const tasselLineGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6);
    const tassel = new THREE.Mesh(tasselLineGeo, goldMat);
    tassel.position.set(0.9, -0.6, 0.9);
    tassel.rotation.z = -0.5;
    capGroup.add(tassel);

    capGroup.position.set(0.5, 0.5, 2);
    capGroup.rotation.set(0.3, -0.2, 0.1);
    group.add(capGroup);

    // Glowing Star Spheres / Knowledge particles
    const particleCount = 45;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      // Glow color palette: purple, cyan, yellow
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 1.0; // Indigo
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.9; // Cyan
      } else {
        colors[i * 3] = 0.96; colors[i * 3 + 1] = 0.62; colors[i * 3 + 2] = 0.04; // Amber
      }
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = -(y / rect.height) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const speed = prefersReducedMotion ? 0.15 : 0.8;

      // Gentle floating motions
      book1.position.y = 1.8 + Math.sin(elapsedTime * speed + 0) * 0.35;
      book1.rotation.y = 0.5 + Math.sin(elapsedTime * speed * 0.7) * 0.1;

      book2.position.y = 2.5 + Math.sin(elapsedTime * speed + 1.5) * 0.4;
      book2.rotation.x = -0.3 + Math.cos(elapsedTime * speed * 0.8) * 0.12;

      book3.position.y = -3.2 + Math.sin(elapsedTime * speed + 3.0) * 0.3;
      book3.rotation.z = 0.4 + Math.sin(elapsedTime * speed * 0.6) * 0.15;

      book4.position.y = -2.8 + Math.sin(elapsedTime * speed + 4.2) * 0.35;

      capGroup.position.y = 0.5 + Math.sin(elapsedTime * speed + 2.0) * 0.45;
      capGroup.rotation.y += 0.003 * speed;

      particles.rotation.y += 0.001 * speed;

      // Mouse Parallax smooth lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      group.rotation.y = targetX * 0.4;
      group.rotation.x = -targetY * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
      className="w-full h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Study Objects Scene"
    />
  );
};
