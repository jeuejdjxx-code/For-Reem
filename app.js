(function () {
    let isMouseMoving = false;
    let mouseTimeout = null;
    let hoveredMesh = null;

    const container = document.getElementById('canvas-container');
    const tooltip = document.getElementById('tooltip');

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.15, 8.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2(-999, -999);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));

    const keyLight = new THREE.DirectionalLight(0xfffaed, 0.45);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.25);
    fillLight.position.set(-5, -3, 6);
    scene.add(fillLight);

    function makeGreenBodyTex() {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 1664;
        const ctx = c.getContext('2d');

        const bg = ctx.createLinearGradient(0, 0, 1024, 1664);
        bg.addColorStop(0.0, '#38a834');
        bg.addColorStop(0.35, '#2e962b');
        bg.addColorStop(0.70, '#247c20');
        bg.addColorStop(1.0, '#2a8726');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 1024, 1664);

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.075)';
        ctx.beginPath();
        ctx.moveTo(0, 140);
        ctx.lineTo(1024, 490);
        ctx.lineTo(1024, 780);
        ctx.lineTo(0, 430);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.065)';
        ctx.beginPath();
        ctx.moveTo(0, 560);
        ctx.lineTo(1024, 910);
        ctx.lineTo(1024, 1260);
        ctx.lineTo(0, 910);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
        ctx.beginPath();
        ctx.moveTo(0, 1040);
        ctx.lineTo(1024, 1390);
        ctx.lineTo(1024, 1664);
        ctx.lineTo(260, 1664);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
        for (let y = 0; y < 1664; y += 8) {
            for (let x = (y % 16 === 0 ? 0 : 4); x < 1024; x += 8) {
                ctx.fillRect(x, y, 2.5, 2.5);
            }
        }

        const chipX = 160, chipY = 150, chipW = 704, chipH = 720, chipR = 85;
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.40)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.roundRect(chipX - 6, chipY - 6, chipW + 12, chipH + 12, chipR + 6);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(chipX - 1, chipY - 1, chipW + 2, chipH + 2, chipR + 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        const arcX = 512, arcY = 1200, arcR = 250;
        const dotCount = 26;
        for (let i = 0; i < dotCount; i++) {
            const angle = Math.PI * 0.96 + (i / (dotCount - 1)) * (Math.PI * 0.88);
            const dx = arcX + Math.cos(angle) * arcR;
            const dy = arcY - Math.sin(angle) * (arcR * 0.58);
            const r = 3 + (i / dotCount) * 5;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + (i / dotCount) * 0.52})`;
            ctx.beginPath();
            ctx.arc(dx, dy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.textAlign = 'center';

        ctx.font = '800 48px "Outfit", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('LM741CN', 512, 1295);

        ctx.font = '800 66px "Outfit", Arial, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('OP - AMP', 512, 1375);

        ctx.font = '700 34px "Courier New", monospace';
        ctx.fillStyle = '#ffe272';
        ctx.fillText('Av = Vout / Vin', 512, 1435);

        ctx.font = '600 20px Arial, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
        ctx.fillText('OPERATIONAL AMPLIFIER • REAL SILICON HARDWARE', 512, 1490);
        ctx.restore();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, 1014, 1654);

        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 16;
        return tex;
    }

    function makeGoldPadTex() {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 1040;
        const ctx = c.getContext('2d');
        const W = 1024, H = 1040, R = 110;

        ctx.beginPath();
        ctx.roundRect(0, 0, W, H, R);
        ctx.clip();

        const goldGrad = ctx.createLinearGradient(0, 0, W, H);
        goldGrad.addColorStop(0.00, '#f9e8a8');
        goldGrad.addColorStop(0.20, '#e5be56');
        goldGrad.addColorStop(0.50, '#d6a735');
        goldGrad.addColorStop(0.75, '#eaaf38');
        goldGrad.addColorStop(0.90, '#ca9828');
        goldGrad.addColorStop(1.00, '#e2be52');
        ctx.fillStyle = goldGrad;
        ctx.fillRect(0, 0, W, H);

        for (let y = 0; y < H; y += 4) {
            const h = 1.5;
            const a = 0.02 + Math.random() * 0.06;
            ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
            ctx.fillRect(0, y, W, h);
        }

        const rad = ctx.createRadialGradient(W * 0.46, H * 0.38, 30, W * 0.46, H * 0.38, 520);
        rad.addColorStop(0.0, 'rgba(255, 252, 220, 0.35)');
        rad.addColorStop(0.6, 'rgba(255, 238, 160, 0.12)');
        rad.addColorStop(1.0, 'rgba(0, 0, 0, 0.08)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, W, H);

        function drawGroove(x1, y1, x2, y2) {
            ctx.save();
            ctx.strokeStyle = '#1a1306';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.strokeStyle = '#080602';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(255, 255, 215, 0.38)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x1 + 6, y1 + 6);
            ctx.lineTo(x2 + 6, y2 + 6);
            ctx.stroke();
            ctx.restore();
        }

        drawGroove(0, 290, W, 290);
        drawGroove(0, 730, 765, 730);

        drawGroove(255, 0, 255, 290);
        drawGroove(512, 0, 512, 290);
        drawGroove(768, 0, 768, 290);

        drawGroove(255, 730, 255, H);
        drawGroove(512, 730, 512, H);
        drawGroove(768, 730, 768, H);

        ctx.strokeStyle = 'rgba(85, 60, 15, 0.65)';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.roundRect(6, 6, W - 12, H - 12, R - 6);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 248, 195, 0.45)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.roundRect(12, 12, W - 24, H - 24, R - 12);
        ctx.stroke();

        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 16;
        return tex;
    }

    const simGroup = new THREE.Group();
    simGroup.scale.set(0.68, 0.68, 0.68);
    scene.add(simGroup);

    const CW = 3.3;
    const CD = 5.36;
    const CT = 0.10;
    const CR = 0.26;
    const N  = 0.78;

    const halfW = CW / 2;
    const halfD = CD / 2;

    const simShape = new THREE.Shape();
    simShape.moveTo(-halfW + CR, halfD);
    simShape.lineTo(halfW - CR, halfD);
    simShape.quadraticCurveTo(halfW, halfD, halfW, halfD - CR);
    simShape.lineTo(halfW, -halfD + CR);
    simShape.quadraticCurveTo(halfW, -halfD, halfW - CR, -halfD);
    simShape.lineTo(-halfW + N, -halfD);
    simShape.lineTo(-halfW, -halfD + N);
    simShape.lineTo(-halfW, halfD - CR);
    simShape.quadraticCurveTo(-halfW, halfD, -halfW + CR, halfD);

    const cardGeo = new THREE.ExtrudeGeometry(simShape, {
        depth: CT,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02
    });

    const cPos = cardGeo.attributes.position;
    const cUv  = cardGeo.attributes.uv;
    for (let i = 0; i < cUv.count; i++) {
        const x = cPos.getX(i);
        const y = cPos.getY(i);
        cUv.setXY(i, (x + halfW) / CW, (y + halfD) / CD);
    }
    cUv.needsUpdate = true;

    const greenMat = new THREE.MeshBasicMaterial({
        map: makeGreenBodyTex()
    });

    const cardMesh = new THREE.Mesh(cardGeo, greenMat);
    cardMesh.position.set(0, 0, -CT / 2);
    simGroup.add(cardMesh);

    const padW = 2.26;
    const padH = 2.32;
    const padR = 0.28;
    const padY = 0.88;

    const halfPW = padW / 2;
    const halfPH = padH / 2;

    const goldShape = new THREE.Shape();
    goldShape.moveTo(-halfPW + padR, halfPH);
    goldShape.lineTo(halfPW - padR, halfPH);
    goldShape.quadraticCurveTo(halfPW, halfPH, halfPW, halfPH - padR);
    goldShape.lineTo(halfPW, -halfPH + padR);
    goldShape.quadraticCurveTo(halfPW, -halfPH, halfPW - padR, -halfPH);
    goldShape.lineTo(-halfPW + padR, -halfPH);
    goldShape.quadraticCurveTo(-halfPW, -halfPH, -halfPW, -halfPH + padR);
    goldShape.lineTo(-halfPW, halfPH - padR);
    goldShape.quadraticCurveTo(-halfPW, halfPH, -halfPW + padR, halfPH);

    const goldGeo = new THREE.ExtrudeGeometry(goldShape, {
        depth: 0.018,
        bevelEnabled: true,
        bevelSize: 0.012,
        bevelThickness: 0.012,
        bevelSegments: 3
    });

    const gPos = goldGeo.attributes.position;
    const gUv  = goldGeo.attributes.uv;
    for (let i = 0; i < gUv.count; i++) {
        const x = gPos.getX(i);
        const y = gPos.getY(i);
        gUv.setXY(i, (x + halfPW) / padW, (y + halfPH) / padH);
    }
    gUv.needsUpdate = true;

    const goldMat = new THREE.MeshBasicMaterial({
        map: makeGoldPadTex()
    });

    const goldMesh = new THREE.Mesh(goldGeo, goldMat);
    goldMesh.position.set(0, padY, CT / 2 + 0.002);
    simGroup.add(goldMesh);

    const hitboxes = [];
    const markersList = [];

    const goldPinCoords = [
        [0,      padY],
        [-0.73,  padY + 0.60],
        [-0.25,  padY + 0.60],
        [ 0.25,  padY + 0.60],
        [ 0.73,  padY + 0.60],
        [-0.73,  padY - 0.60],
        [-0.25,  padY - 0.60],
        [ 0.25,  padY - 0.60],
        [ 0.73,  padY - 0.60],
    ];

    const bodyPinCoords = [
        [-1.25,  padY + 0.15],
        [ 1.25,  padY + 0.15],
        [-1.25,  padY - 0.70],
        [ 1.25,  padY - 0.70],
        [-1.05, -0.75],
        [ 1.05, -0.75],
        [ 0.00, -1.35],
        [ 0.00, -2.15],
    ];

    const allPositions = [...goldPinCoords, ...bodyPinCoords];
    const markerZ = CT / 2 + 0.024;

    NODES_DATA.forEach((node, idx) => {
        if (idx >= allPositions.length) return;
        const [px, py] = allPositions[idx];
        const isGoldPin = idx < 9;
        const pinColor = isGoldPin ? 0xd4af37 : 0xffffff;

        const dot = new THREE.Mesh(
            new THREE.CircleGeometry(0.045, 20),
            new THREE.MeshBasicMaterial({
                color: pinColor,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: isGoldPin ? 0.75 : 0.85
            })
        );
        dot.position.set(px, py, markerZ);
        simGroup.add(dot);

        markersList.push({ dot, pinColor });

        const hit = new THREE.Mesh(
            new THREE.BoxGeometry(0.48, 0.48, 0.25),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        hit.position.set(px, py, markerZ);
        hit.userData = { nodeData: node, markerIndex: idx };
        simGroup.add(hit);
        hitboxes.push(hit);
    });

    const starCount = 900;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const r = 25 + Math.random() * 55;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(Math.random() * 2 - 1);
        starPositions[i * 3]     = r * Math.sin(ph) * Math.cos(th);
        starPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        starPositions[i * 3 + 2] = r * Math.cos(ph);

        const lum = 0.45 + Math.random() * 0.5;
        starColors[i * 3]     = lum * 0.88;
        starColors[i * 3 + 1] = lum * 0.94;
        starColors[i * 3 + 2] = lum;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.65,
        vertexColors: true,
        transparent: true,
        opacity: 0.60
    });
    scene.add(new THREE.Points(starGeo, starMat));

    let targetRotX = 0.12, targetRotY = -0.18;
    let currentRotX = 0.12, currentRotY = -0.18;

    window.addEventListener('pointermove', e => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        mouseVec.set(nx, ny);

        targetRotY = nx * 0.65;
        targetRotX = 0.12 - ny * 0.45;
        targetRotX = Math.max(-0.45, Math.min(0.55, targetRotX));

        isMouseMoving = true;
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => { isMouseMoving = false; }, 120);
    });

    function updateRaycast() {
        raycaster.setFromCamera(mouseVec, camera);
        const hits = raycaster.intersectObjects(hitboxes, false);

        if (hits.length > 0) {
            const hit = hits[0].object;
            const data = hit.userData.nodeData;
            const idx = hit.userData.markerIndex;

            if (hoveredMesh !== hit) {
                if (hoveredMesh) {
                    const prevIdx = hoveredMesh.userData.markerIndex;
                    const prevM = markersList[prevIdx];
                    if (prevM) {
                        prevM.dot.scale.set(1, 1, 1);
                        prevM.dot.material.opacity = (prevIdx < 9) ? 0.75 : 0.85;
                    }
                }

                hoveredMesh = hit;

                const curM = markersList[idx];
                if (curM) {
                    curM.dot.scale.set(1.4, 1.4, 1.4);
                    curM.dot.material.opacity = 1.0;
                }

                tooltip.innerHTML = `
                    <div class="tooltip-badge">${data.section || ''}</div>
                    <div class="tooltip-title">${data.titleEn} • ${data.titleAr}</div>
                    <div class="tooltip-divider"></div>
                    <div class="tooltip-en" dir="ltr">${data.contentEn}</div>
                    <div class="tooltip-ar" dir="rtl">${data.contentAr}</div>
                `;
                tooltip.classList.add('visible');
            }

            let lx = ((mouseVec.x + 1) / 2) * window.innerWidth + 20;
            let ty = ((-mouseVec.y + 1) / 2) * window.innerHeight + 14;
            if (lx + 330 > window.innerWidth) lx -= 350;
            if (ty + 180 > window.innerHeight) ty -= 200;
            tooltip.style.left = lx + 'px';
            tooltip.style.top  = ty + 'px';

        } else {
            if (hoveredMesh) {
                const prevIdx = hoveredMesh.userData.markerIndex;
                const prevM = markersList[prevIdx];
                if (prevM) {
                    prevM.dot.scale.set(1, 1, 1);
                    prevM.dot.material.opacity = (prevIdx < 9) ? 0.75 : 0.85;
                }
                hoveredMesh = null;
                tooltip.classList.remove('visible');
            }
        }
    }

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        if (!hoveredMesh && isMouseMoving) {
            currentRotX += (targetRotX - currentRotX) * 0.07;
            currentRotY += (targetRotY - currentRotY) * 0.07;
        }
        simGroup.rotation.x = currentRotX;
        simGroup.rotation.y = currentRotY;

        simGroup.position.y = Math.sin(t * 1.1) * 0.04;

        updateRaycast();
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
