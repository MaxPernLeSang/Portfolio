import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('davinci-canvas');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // Transparent rendering
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const container = canvas.parentElement;
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    // Adjusted camera back to see the model better
    camera.position.set(0, 0, 150);
    
    // Ambient light + directional light for shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(100, 200, 50);
    scene.add(dirLight);

    // FBX LOADER
    const loader = new FBXLoader();
    loader.load(
        'assets/scrolly/DaVinci.fbx',
        (object) => {
            // Find bounding box to normalize scale regardless of how it was exported
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            
            // Center the pivot
            object.position.x += (object.position.x - center.x);
            object.position.y += (object.position.y - center.y);
            object.position.z += (object.position.z - center.z);
            
            // Normalize scale — target max axis = 40 units (smaller, cleaner)
            const maxAxis = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
            object.scale.multiplyScalar(40 / maxAxis);

            // Starting state: arrive from top
            object.position.y = 80; 
            object.rotation.y = 0;
            
            scene.add(object);

            // Wire GSAP ScrollTrigger to the 3D Object
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                // Phase 1 Drop: Drops while the section is starting to be pinned
                gsap.to(object.position, {
                    y: -5,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#innovation',
                        start: 'top top',
                        end: '+=100%',  // Drop completes after 100vh scroll
                        scrub: 1
                    }
                });
                
                gsap.to(object.rotation, {
                    y: -Math.PI, // -180° — rotates the other way, shows the opposite side
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '#innovation',
                        start: 'top top',
                        end: '+=100%',  // Rotation completes in same window
                        scrub: 1
                    }
                });
            }
        },
        (xhr) => { console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); },
        (error) => { console.error('FBXLoader error:', error); }
    );

    // RENDER LOOP
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // RESIZE HANDLING
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
