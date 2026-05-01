"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Size it to the container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Create globe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Wireframe material to look like grid lines
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xE8963A, // Amber
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    // Solid dark inner sphere
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x1A1612, // Charcoal
    });
    const innerSphere = new THREE.Mesh(geometry, innerMaterial);
    // slightly smaller to prevent z-fighting
    innerSphere.scale.set(0.99, 0.99, 0.99); 

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    scene.add(innerSphere);

    // Add some random dots (cities)
    const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xE8963A });
    
    const dotsArray: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const phi = Math.acos(-1 + (2 * i) / 20);
      const theta = Math.sqrt(20 * Math.PI) * phi;
      
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      dot.position.x = 2.0 * Math.cos(theta) * Math.sin(phi);
      dot.position.y = 2.0 * Math.sin(theta) * Math.sin(phi);
      dot.position.z = 2.0 * Math.cos(phi);
      sphere.add(dot);
      dotsArray.push(dot);
    }

    const flightGroup = new THREE.Group();
    sphere.add(flightGroup);
    
    const flights: {
      curve: THREE.QuadraticBezierCurve3;
      progress: number;
      speed: number;
      meshes: THREE.Mesh[];
    }[] = [];

    const flightColors = [0xC1440E, 0x7D9E8C, 0x6B8FA8]; // Terracotta, Sage, Dusty Blue
    
    for (let i = 0; i < 15; i++) {
      const color = flightColors[Math.floor(Math.random() * flightColors.length)];
      const lineMaterial = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8, linewidth: 2 });
      
      const idx1 = Math.floor(Math.random() * dotsArray.length);
      let idx2 = Math.floor(Math.random() * dotsArray.length);
      if (idx1 === idx2) idx2 = (idx2 + 1) % dotsArray.length;
      
      const p1 = dotsArray[idx1].position;
      const p2 = dotsArray[idx2].position;
      
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(2.0 + distance * 0.3);
      
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(30);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arc = new THREE.Line(lineGeometry, lineMaterial);
      flightGroup.add(arc);
      
      // Create plane head and trail dots
      const meshes: THREE.Mesh[] = [];
      for(let j = 0; j < 9; j++) {
        const size = j === 0 ? 0.06 : 0.03; // Head is larger
        const meshMat = new THREE.MeshBasicMaterial({ 
          color: j === 0 ? 0xFFFFFF : color, 
          transparent: true, 
          opacity: j === 0 ? 1 : 0.6 * (1 - j/9)
        });
        const meshGeom = new THREE.SphereGeometry(size, 8, 8);
        const mesh = new THREE.Mesh(meshGeom, meshMat);
        flightGroup.add(mesh);
        meshes.push(mesh);
      }
      
      flights.push({
        curve,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.002,
        meshes
      });
    }

    // Pulse data for cities
    const dotsData = dotsArray.map(dot => ({
      mesh: dot,
      offset: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.01
    }));

    camera.position.z = 5;

    // Interaction vars
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Mouse handlers
    const onMouseDown = () => { isDragging = true; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y
        };
        
        sphere.rotation.y += deltaMove.x * 0.01;
        sphere.rotation.x += deltaMove.y * 0.01;
      }
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    // Touch handlers
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      if (e.touches.length > 0) {
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const deltaMove = {
          x: e.touches[0].clientX - previousMousePosition.x,
          y: e.touches[0].clientY - previousMousePosition.y
        };
        
        sphere.rotation.y += deltaMove.x * 0.01;
        sphere.rotation.x += deltaMove.y * 0.01;
        
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => { isDragging = false; };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    domElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (!isDragging) {
        sphere.rotation.y += 0.0014;
        sphere.rotation.x += 0.0007;
      }
      
      // Animate flights
      flights.forEach(flight => {
        flight.progress += flight.speed;
        if (flight.progress > 1) flight.progress = 0;
        
        flight.meshes.forEach((mesh, j) => {
          let p = flight.progress - (j * 0.02);
          if (p < 0) p = 0;
          const pos = flight.curve.getPoint(p);
          mesh.position.copy(pos);
        });
      });

      // Pulse city dots
      dotsData.forEach(d => {
        d.offset += d.speed;
        const scale = 1 + 0.4 * Math.sin(d.offset);
        d.mesh.scale.set(scale, scale, scale);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      
      if (mountRef.current && domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(domElement);
      }
      
      geometry.dispose();
      material.dispose();
      innerMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
  );
}
