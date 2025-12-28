// Dynamic year
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// 3D background using Three.js
let scene, camera, renderer, particleField;
const canvas = document.getElementById("bg-canvas");

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 18;

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles geometry
    const particlesCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 0] = (Math.random() - 0.5) * 60;
        positions[i3 + 1] = (Math.random() - 0.5) * 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 40;

        const color = new THREE.Color();
        const r = 0.1 + Math.random() * 0.2;
        const g = 0.5 + Math.random() * 0.5;
        const b = 0.8 + Math.random() * 0.2;
        color.setRGB(r, g, b);

        colors[i3 + 0] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particleField = new THREE.Points(geometry, material);
    scene.add(particleField);

    // Soft gradient plane behind content
    const planeGeo = new THREE.PlaneGeometry(80, 80, 1, 1);
    const planeMat = new THREE.MeshBasicMaterial({
        color: 0x020617,
        transparent: true,
        opacity: 0.9
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.z = -10;
    scene.add(plane);

    window.addEventListener("resize", onWindowResize);
    window.addEventListener("mousemove", onMouseMove);
}

let mouseX = 0;
let mouseY = 0;

function onMouseMove(event) {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    mouseX = x * 0.7;
    mouseY = y * 0.4;
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const t = Date.now() * 0.00006;

    if (particleField) {
        particleField.rotation.y = t * 2.2;
        particleField.rotation.x = Math.sin(t * 1.3) * 0.2;
        particleField.position.y = Math.sin(t * 2.0) * 0.4;
    }

    if (camera) {
        camera.position.x += (mouseX * 12 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 8 - camera.position.y) * 0.04;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Initialize when Three.js is ready
window.addEventListener("load", () => {
    if (typeof THREE !== "undefined" && canvas) {
        initScene();
        animate();
    }
});
