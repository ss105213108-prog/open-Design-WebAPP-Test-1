/**
 * Aegis Industrial AI Dashboard
 * Unified Application Controller & Routing System
 */

const AppState = {
    currentView: null,
    timers: [],
    
    // Three.js instances (For 3D Reactor Simulation)
    threeRenderer: null,
    threeAnimationFrameId: null,
    threeCamera: null,
    threeScene: null,
    threeCoreGroup: null,
    threeInnerCoreMat: null,
    threeInnerCore: null,
    threeRings: [],

    // Mission Control States
    retriesCount: 0,
    isNormalMode: true,
    
    // System Health States
    isCoolingActive: true,
    nodesData: []
};

// Utility function to clear active timers to avoid memory leak
function clearAllTimers() {
    AppState.timers.forEach(timer => clearInterval(timer));
    AppState.timers = [];
}

// Utility function to register a timer
function registerTimer(intervalId) {
    AppState.timers.push(intervalId);
}

// Clean up Three.js WebGL context
function destroyThreeJs() {
    if (AppState.threeAnimationFrameId) {
        cancelAnimationFrame(AppState.threeAnimationFrameId);
        AppState.threeAnimationFrameId = null;
    }
    if (AppState.threeRenderer) {
        AppState.threeRenderer.dispose();
        const canvasContainer = document.getElementById('animation-container');
        if (canvasContainer) {
            canvasContainer.innerHTML = '';
        }
        AppState.threeRenderer = null;
        AppState.threeCamera = null;
        AppState.threeScene = null;
        AppState.threeCoreGroup = null;
        AppState.threeInnerCoreMat = null;
        AppState.threeInnerCore = null;
        AppState.threeRings = [];
    }
}

// Navigation Controller
function initNavigation() {
    const sidebar = document.getElementById('sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const navLinks = document.querySelectorAll('#nav-links a');

    // Toggle Mobile Sidebar
    function toggleMobileSidebar() {
        sidebar.classList.toggle('-translate-x-full');
        sidebarBackdrop.classList.toggle('hidden');
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', toggleMobileSidebar);
    }

    // Highlight active link in sidebar and handle clicks
    window.addEventListener('hashchange', handleRouting);
    
    function handleRouting() {
        const hash = window.location.hash || '#mission-control';
        const viewName = hash.substring(1);
        
        // Hide sidebar on mobile after navigating
        if (!sidebar.classList.contains('-translate-x-full')) {
            toggleMobileSidebar();
        }

        // Update Nav Link Highlights
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.className = "flex items-center gap-md p-sm rounded bg-primary-container text-on-primary-container font-bold shadow-[0_0_8px_rgba(0,229,255,0.3)] font-label-caps text-label-caps border-r-4 border-primary transition-all";
            } else {
                link.className = "flex items-center gap-md p-sm rounded text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface transition-all font-label-caps text-label-caps";
            }
        });

        // Switch View
        switchView(viewName);
    }

    // Initial Routing trigger
    handleRouting();
}

// Global UI Interactivity (Emergency Stop & Overlays)
function initGlobalActions() {
    const btnEmergencyStop = document.getElementById('btn-emergency-stop');
    const emergencyModal = document.getElementById('emergency-modal');
    const btnEmergencyReset = document.getElementById('btn-emergency-reset');
    const alertModal = document.getElementById('alert-modal');
    const btnAuthOp = document.getElementById('btn-auth-op');
    const btnOverrideOp = document.getElementById('btn-override-op');

    // Emergency Stop
    if (btnEmergencyStop) {
        btnEmergencyStop.addEventListener('click', () => {
            if (emergencyModal) emergencyModal.classList.remove('hidden');
            clearAllTimers();
            destroyThreeJs();
        });
    }

    if (btnEmergencyReset) {
        btnEmergencyReset.addEventListener('click', () => {
            if (emergencyModal) emergencyModal.classList.add('hidden');
            window.location.hash = '#mission-control';
            switchView('mission-control');
        });
    }

    // Manual Override Modal
    if (btnAuthOp) {
        btnAuthOp.addEventListener('click', () => {
            alertModal.classList.add('hidden');
            addMissionControlLog("SYS", "操作員已驗證操作（授權）。核心安全基準恢復中...");
        });
    }

    if (btnOverrideOp) {
        btnOverrideOp.addEventListener('click', () => {
            alertModal.classList.add('hidden');
            addMissionControlLog("SYS", "操作員已覆蓋反應爐序列限制。監控中...");
        });
    }
}

// Swapping Main Views
function switchView(viewName) {
    const viewContainer = document.getElementById('view-container');
    const headerContext = document.getElementById('header-context-actions');
    const template = document.getElementById(`tpl-${viewName}`);

    if (!template) {
        console.error(`Template tpl-${viewName} not found.`);
        return;
    }

    // Cleanup active view components
    clearAllTimers();
    destroyThreeJs();
    AppState.currentView = viewName;
    headerContext.innerHTML = ''; // Reset contextual buttons

    // Inject template HTML
    const clone = template.content.cloneNode(true);
    viewContainer.innerHTML = '';
    viewContainer.appendChild(clone);

    // Run specific view initializer
    if (initView[viewName]) {
        initView[viewName]();
    }
}

// Helper to append log to the list (Mission Control)
function addMissionControlLog(type, message, colorClass = "text-on-surface") {
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const logEntry = document.createElement('div');
    logEntry.className = "flex gap-md border-b border-outline-variant/10 pb-sm animate-pulse";
    logEntry.innerHTML = `
        <span class="text-on-surface-variant">[${time}]</span>
        <span class="${colorClass === 'text-error' ? 'text-error' : 'text-primary'}">${type}</span>
        <span class="${colorClass}">${message}</span>
    `;
    logContainer.prepend(logEntry);
    
    // Limit log count
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// ==========================================
//          VIEW INITIALIZERS OBJECT
// ==========================================

const initView = {
    
    // 1. Mission Control
    'mission-control': function() {
        const headerContext = document.getElementById('header-context-actions');
        
        // Context Navigation
        headerContext.innerHTML = `
            <button class="text-primary border-b-2 border-primary pb-1 font-body-md text-body-md hover:text-primary transition-all" id="nav-normal">正常模式</button>
            <button class="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200" id="nav-ai">AI Intercept</button>
            <button class="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200" id="nav-risk">高風險警報</button>
        `;

        const btnNormal = document.getElementById('nav-normal');
        const btnAI = document.getElementById('nav-ai');
        const btnRisk = document.getElementById('nav-risk');
        const aiToast = document.getElementById('ai-toast');
        const successToast = document.getElementById('success-toast');
        const alertModal = document.getElementById('alert-modal');
        const retriesCountEl = document.getElementById('retries-count');
        const notifBadge = document.getElementById('notif-badge');
        const globalStatusDot = document.getElementById('global-status-dot');
        const globalStatusText = document.getElementById('global-status-text');

        function setActiveContextNav(activeBtn) {
            [btnNormal, btnAI, btnRisk].forEach(btn => {
                btn.className = "text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200";
            });
            activeBtn.className = "text-primary border-b-2 border-primary pb-1 font-body-md text-body-md";
        }

        btnNormal.addEventListener('click', () => {
            setActiveContextNav(btnNormal);
            globalStatusDot.className = "status-dot bg-secondary-container";
            globalStatusText.innerText = "警戒模式已啟動";
            globalStatusText.className = "font-data-sm text-data-sm text-secondary-container";
            AppState.retriesCount = 0;
            if (retriesCountEl) retriesCountEl.innerText = "0";
            if (notifBadge) notifBadge.classList.add('hidden');
            
            // Remove error backgrounds
            document.querySelectorAll('#card-1, #card-2, #card-3, #card-4').forEach(el => el.classList.remove('bg-error/10'));
            addMissionControlLog("SYS", "系統已恢復至基準正常監控狀態。");
        });

        btnAI.addEventListener('click', () => {
            setActiveContextNav(btnAI);
            if (notifBadge) notifBadge.classList.remove('hidden');
            
            if (aiToast) aiToast.style.transform = 'translateX(0)';
            addMissionControlLog("ERR", "嚴重異常：神經連結偵測到 AI 幻覺！", "text-error");
            document.querySelectorAll('#card-1, #card-2, #card-3, #card-4').forEach(el => el.classList.add('bg-error/10'));
            
            setTimeout(() => {
                if (aiToast) aiToast.style.transform = 'translateX(120%)';
                if (successToast) successToast.style.transform = 'translateX(0)';
                AppState.retriesCount++;
                if (retriesCountEl) retriesCountEl.innerText = AppState.retriesCount;
                
                addMissionControlLog("SEC", "已啟動 Aegis 自動抑制，威脅已完全消除。", "text-primary");
                
                setTimeout(() => {
                    if (successToast) successToast.style.transform = 'translateX(120%)';
                    document.querySelectorAll('#card-1, #card-2, #card-3, #card-4').forEach(el => el.classList.remove('bg-error/10'));
                }, 3000);
            }, 1500);
        });

        btnRisk.addEventListener('click', () => {
            setActiveContextNav(btnRisk);
            if (alertModal) alertModal.classList.remove('hidden');
            addMissionControlLog("WRN", "請求操作員介入：反應爐核心溫度序列異常 (區域 7-G)。", "text-tertiary-container");
        });

        // Initialize 3D Reactor Simulation (Three.js)
        const container = document.getElementById('animation-container');
        if (container) {
            const width = container.clientWidth || 800;
            const height = container.clientHeight || 400;

            AppState.threeScene = new THREE.Scene();
            AppState.threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            AppState.threeCamera.position.z = 5;

            AppState.threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            AppState.threeRenderer.setSize(width, height);
            AppState.threeRenderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(AppState.threeRenderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0x404040, 2);
            AppState.threeScene.add(ambientLight);
            const pointLight = new THREE.PointLight(0x00e5ff, 5, 50);
            pointLight.position.set(5, 5, 5);
            AppState.threeScene.add(pointLight);

            // Core Group
            AppState.threeCoreGroup = new THREE.Group();

            // Inner Core (Glowing Sphere)
            const innerCoreGeo = new THREE.SphereGeometry(1, 32, 32);
            AppState.threeInnerCoreMat = new THREE.MeshPhongMaterial({
                color: 0x00e5ff,
                emissive: 0x00e5ff,
                emissiveIntensity: 0.5,
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });
            AppState.threeInnerCore = new THREE.Mesh(innerCoreGeo, AppState.threeInnerCoreMat);
            AppState.threeCoreGroup.add(AppState.threeInnerCore);

            // Outer Orbiting Rings
            const ringGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
            const ringMat = new THREE.MeshPhongMaterial({ color: 0x37393d });

            const r1 = new THREE.Mesh(ringGeo, ringMat);
            const r2 = new THREE.Mesh(ringGeo, ringMat);
            r2.rotation.x = Math.PI / 2;
            const r3 = new THREE.Mesh(ringGeo, ringMat);
            r3.rotation.y = Math.PI / 2;

            AppState.threeRings.push(r1, r2, r3);
            AppState.threeCoreGroup.add(r1, r2, r3);

            // Structural Cylinders
            const supportGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
            const supportMat = new THREE.MeshPhongMaterial({ color: 0x1a1c1f });
            for (let i = 0; i < 4; i++) {
                const support = new THREE.Mesh(supportGeo, supportMat);
                const angle = (i / 4) * Math.PI * 2;
                support.position.x = Math.cos(angle) * 1.8;
                support.position.z = Math.sin(angle) * 1.8;
                AppState.threeCoreGroup.add(support);
            }

            AppState.threeScene.add(AppState.threeCoreGroup);

            // Animation Loop
            let time = 0;
            const animateReactor = function() {
                AppState.threeAnimationFrameId = requestAnimationFrame(animateReactor);
                time += 0.01;

                if (AppState.threeCoreGroup) {
                    AppState.threeCoreGroup.rotation.y += 0.005;
                }
                if (AppState.threeRings.length === 3) {
                    AppState.threeRings[0].rotation.z += 0.01;
                    AppState.threeRings[1].rotation.y += 0.01;
                    AppState.threeRings[2].rotation.x += 0.01;
                }

                // Heartbeat pulse core glow
                if (AppState.threeInnerCore && AppState.threeInnerCoreMat) {
                    const pulse = 1 + Math.sin(time * 2.5) * 0.08;
                    AppState.threeInnerCore.scale.set(pulse, pulse, pulse);
                    AppState.threeInnerCoreMat.emissiveIntensity = 0.5 + Math.sin(time * 2.5) * 0.25;
                }

                if (AppState.threeRenderer && AppState.threeScene && AppState.threeCamera) {
                    AppState.threeRenderer.render(AppState.threeScene, AppState.threeCamera);
                }
            };
            animateReactor();

            // Resize Observer
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const w = entry.contentRect.width;
                    const h = entry.contentRect.height || 400;
                    if (AppState.threeCamera && AppState.threeRenderer) {
                        AppState.threeCamera.aspect = w / h;
                        AppState.threeCamera.updateProjectionMatrix();
                        AppState.threeRenderer.setSize(w, h);
                    }
                }
            });
            resizeObserver.observe(container);
        }

        // Live Telemetry Fluctuation Updates
        const mcInterval = setInterval(() => {
            const val1 = document.getElementById('val-1');
            const val3 = document.getElementById('val-3');
            if (val1) val1.innerText = (104.2 + (Math.random() * 0.6 - 0.3)).toFixed(1);
            if (val3) val3.innerText = (99.8 + (Math.random() * 0.2 - 0.1)).toFixed(1);
        }, 2000);
        registerTimer(mcInterval);
    },

    // 2. Remote Telemetry
    'telemetry': function() {
        const headerContext = document.getElementById('header-context-actions');
        headerContext.innerHTML = `
            <button class="text-primary-container border border-primary-container px-md py-xs rounded font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 glow-active" id="btn-reset-telemetry">重設遙測基準</button>
        `;

        const btnReset = document.getElementById('btn-reset-telemetry');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                alert("遙測監控數據基準點已重設。已向控制系統同步。");
            });
        }

        // Handle Checkbox interaction to fade out specific trend lines in the SVG chart
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const paths = document.querySelectorAll('svg path[stroke]');
        
        checkboxes.forEach((cb, index) => {
            cb.addEventListener('change', () => {
                // Approximate mapping: 
                // index 0 -> PRS-01 (Path index 2, 4)
                // index 1 -> PRS-02 (Not plotted, static)
                // index 2 -> TMP-Core (Path index 1, 3)
                // index 3 -> FLW-Coolant (Path index 0)
                if (index === 0 && paths[2] && paths[4]) {
                    paths[2].style.opacity = cb.checked ? "1" : "0.1";
                    paths[4].style.opacity = cb.checked ? "1" : "0.1";
                } else if (index === 2 && paths[1] && paths[3]) {
                    paths[1].style.opacity = cb.checked ? "1" : "0.1";
                    paths[3].style.opacity = cb.checked ? "1" : "0.1";
                } else if (index === 3 && paths[0]) {
                    paths[0].style.opacity = cb.checked ? "1" : "0.1";
                }
            });
        });

        // Telemetry Fluctuation Updates
        const telInterval = setInterval(() => {
            const gaugeEl = document.getElementById('gauge-valve-pressure');
            if (gaugeEl) {
                const newVal = (87.4 + (Math.random() * 1.2 - 0.6)).toFixed(1);
                gaugeEl.innerHTML = `${newVal}<span class="text-body-md text-outline">%</span>`;
            }
        }, 1500);
        registerTimer(telInterval);
    },

    // 3. System Health
    'system-health': function() {
        const headerContext = document.getElementById('header-context-actions');
        headerContext.innerHTML = `
            <button class="text-primary-container border border-primary-container px-md py-xs rounded font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 glow-active" id="btn-toggle-cooling">主動冷卻: 開啟</button>
        `;

        const btnToggleCooling = document.getElementById('btn-toggle-cooling');
        if (btnToggleCooling) {
            btnToggleCooling.addEventListener('click', () => {
                AppState.isCoolingActive = !AppState.isCoolingActive;
                btnToggleCooling.innerText = AppState.isCoolingActive ? "主動冷卻: 開啟" : "主動冷卻: 關閉";
                if (!AppState.isCoolingActive) {
                    btnToggleCooling.className = "text-error border border-error px-md py-xs rounded font-label-caps text-label-caps hover:bg-error-container hover:text-on-error-container transition-all active:scale-95 shadow-error";
                    alert("⚠️ 警報：主動冷卻系統已停用！請注意節點溫度上升。");
                } else {
                    btnToggleCooling.className = "text-primary-container border border-primary-container px-md py-xs rounded font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 glow-active";
                }
            });
        }

        // Setup 32 Node Data
        const gridContainer = document.getElementById('hardware-grid');
        if (gridContainer) {
            gridContainer.innerHTML = '';
            
            // Random statuses
            const nodeStatuses = [
                'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 
                'warning', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'critical', 'healthy',
                'healthy', 'healthy', 'warning', 'healthy', 'healthy', 'healthy', 'healthy', 'healthy',
                'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'warning', 'healthy', 'healthy'
            ];

            nodeStatuses.forEach((status, i) => {
                let colorClass = 'bg-surface border-outline-variant text-on-surface-variant';
                let indicator = 'bg-primary-container shadow-[0_0_5px_#00e5ff]';
                
                if (status === 'warning') {
                    colorClass = 'bg-surface border-tertiary-container text-tertiary-container shadow-[0_0_10px_rgba(255,199,121,0.1)]';
                    indicator = 'bg-tertiary-container shadow-[0_0_8px_#ffc779] node-pulse';
                } else if (status === 'critical') {
                    colorClass = 'bg-surface border-error text-error shadow-[0_0_15px_rgba(255,180,171,0.2)]';
                    indicator = 'bg-error shadow-[0_0_10px_#ffb4ab] node-pulse';
                }

                const row = String.fromCharCode(65 + Math.floor(i / 4));
                const col = String((i % 4) + 1).padStart(2, '0');
                const id = `${row}-${col}`;

                const nodeDiv = document.createElement('div');
                nodeDiv.className = `relative group aspect-square border ${colorClass} rounded flex flex-col items-center justify-center cursor-crosshair hover:bg-surface-container-high transition-colors`;
                nodeDiv.innerHTML = `
                    <div class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${indicator}"></div>
                    <span class="font-data-sm text-data-sm opacity-50 group-hover:opacity-100 transition-opacity">N${i+1}</span>
                    <span class="font-label-caps text-[10px] mt-1 opacity-30 group-hover:opacity-100 hidden sm:block">${id}</span>
                    
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-surface-container-highest border border-outline-variant rounded p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                        <div class="font-label-caps text-label-caps text-on-surface mb-2 border-b border-outline-variant pb-1">節點 ${id} 詳情</div>
                        <div class="flex justify-between font-data-sm text-data-sm">
                            <span class="text-on-surface-variant">CPU:</span> 
                            <span class="node-cpu-val ${status==='critical'?'text-error':'text-primary-container'}">${status==='critical'?'98%':Math.floor(Math.random()*40+20)+'%'}</span>
                        </div>
                        <div class="flex justify-between font-data-sm text-data-sm">
                            <span class="text-on-surface-variant">溫度:</span> 
                            <span class="node-temp-val ${status==='warning'?'text-tertiary-container':(status==='critical'?'text-error':'text-primary-container')}">${status==='critical'?'92C':(status==='warning'?'78C':Math.floor(Math.random()*15+45)+'C')}</span>
                        </div>
                    </div>
                `;
                gridContainer.appendChild(nodeDiv);
            });
        }

        // Fluctuate CPU & Temperature on the tooltips dynamically
        const shInterval = setInterval(() => {
            const cpuVals = document.querySelectorAll('.node-cpu-val');
            const tempVals = document.querySelectorAll('.node-temp-val');
            cpuVals.forEach(el => {
                if (el.textContent !== '98%') {
                    el.textContent = Math.floor(Math.random() * 30 + 20) + '%';
                }
            });
            tempVals.forEach(el => {
                if (el.textContent !== '92C' && el.textContent !== '78C') {
                    // Cooling status changes ambient base
                    const baseTemp = AppState.isCoolingActive ? 40 : 62;
                    el.textContent = Math.floor(Math.random() * 10 + baseTemp) + 'C';
                }
            });
        }, 2000);
        registerTimer(shInterval);
    },

    // 4. Event Log
    'event-log': function() {
        const headerContext = document.getElementById('header-context-actions');
        headerContext.innerHTML = `
            <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-label-caps text-label-caps" id="btn-clear-logs"><span class="material-symbols-outlined text-[18px]">delete</span>清除控制台</button>
            <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs font-label-caps text-label-caps" id="btn-export-logs"><span class="material-symbols-outlined text-[18px]">download</span>匯出 CSV</button>
        `;

        const logsBody = document.getElementById('terminal-logs-body');
        const totalLogsEl = document.getElementById('total-logs-count');
        const filterErr = document.getElementById('filter-err');
        const filterWrn = document.getElementById('filter-wrn');
        const filterInf = document.getElementById('filter-inf');

        let totalLogs = 4209;

        // Context buttons listeners
        document.getElementById('btn-clear-logs').addEventListener('click', () => {
            if (logsBody) logsBody.innerHTML = '';
            totalLogs = 0;
            if (totalLogsEl) totalLogsEl.textContent = '0';
        });

        document.getElementById('btn-export-logs').addEventListener('click', () => {
            alert("正在生成日誌備份報告。CSV 格式檔案下載已發送。");
        });

        // Filter Logic
        function applyFilters() {
            const rows = logsBody.querySelectorAll('.log-row');
            rows.forEach(row => {
                const level = row.getAttribute('data-level');
                if (level === 'ERR' && !filterErr.checked) {
                    row.classList.add('hidden');
                } else if (level === 'WRN' && !filterWrn.checked) {
                    row.classList.add('hidden');
                } else if (level === 'INF' && !filterInf.checked) {
                    row.classList.add('hidden');
                } else {
                    row.classList.remove('hidden');
                }
            });
        }

        [filterErr, filterWrn, filterInf].forEach(cb => {
            if (cb) cb.addEventListener('change', applyFilters);
        });

        // Base log generator helper
        function appendSyslog(level, source, message) {
            if (!logsBody) return;
            
            const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const row = document.createElement('div');
            
            let bgClass = "border-outline-variant/10 hover:bg-surface-container-highest";
            let tagClass = "bg-surface-variant text-on-surface-variant";
            
            if (level === 'ERR') {
                bgClass = "border-error/20 bg-error-container/10 hover:bg-error-container/20";
                tagClass = "bg-error text-on-error font-bold glow-error";
            } else if (level === 'WRN') {
                bgClass = "border-tertiary-container/20 bg-tertiary-container/5 hover:bg-tertiary-container/15";
                tagClass = "bg-tertiary-container text-on-tertiary-container font-bold";
            }

            row.className = `grid grid-cols-[140px_80px_120px_1fr_100px] gap-sm px-sm py-xs border ${bgClass} rounded-xs items-center transition-colors log-row`;
            row.setAttribute('data-level', level);
            row.innerHTML = `
                <div class="text-on-surface-variant font-mono">${time}</div>
                <div><span class="px-xs py-0.5 rounded-sm text-[10px] inline-block font-mono text-center w-10">${level}</span></div>
                <div class="text-on-surface truncate font-mono">${source}</div>
                <div class="text-on-surface-variant truncate font-mono">${message}</div>
                <div class="text-right">
                    <button class="text-primary hover:text-primary-container transition-colors"><span class="material-symbols-outlined text-[18px]">terminal</span></button>
                </div>
            `;
            
            // Highlight the tag
            row.querySelector('span').className += " " + tagClass;

            logsBody.prepend(row);
            totalLogs++;
            if (totalLogsEl) totalLogsEl.textContent = totalLogs.toLocaleString();

            // Cap logs list
            while (logsBody.children.length > 100) {
                logsBody.removeChild(logsBody.lastChild);
            }

            applyFilters();
        }

        // Prepopulate with some fake logs
        appendSyslog('INF', 'System_Boot', '加載控制室儀表板配置文件...');
        appendSyslog('WRN', 'Cooling_Unit', '冷卻閥 A-02 響應延遲 80ms。已重試。');
        appendSyslog('ERR', 'Turbine_Core', '反應爐渦輪感測器震動超出上限，發送介入警告。');

        // Dynamic feed simulator
        const sourceNames = ['Reactor_Core', 'Aegis_Shield', 'Network_Port', 'API_Gateway', 'Sensor_Unit_B', 'AI_Suppressor'];
        const messages = {
            'INF': ['數據流封包同步正常。', '已完成資料庫定時檢查點。', '安全金鑰已成功展延。', '操作員進入連線控制台。'],
            'WRN': ['檢測到網絡封包抖動 (12ms)。', '輔助冷卻水流偏低 (84%)。', '溫度梯度感測器數據略微漂移。'],
            'ERR': ['嚴重：反應爐控制迴路丟包率超出 3%！', '連線超時：無法讀取輔助閥門 PRS-02。', '硬體核心安全防護盾偵測到外部重寫嘗試。']
        };

        const elInterval = setInterval(() => {
            const rand = Math.random();
            let level = 'INF';
            if (rand > 0.85) level = 'ERR';
            else if (rand > 0.65) level = 'WRN';

            const source = sourceNames[Math.floor(Math.random() * sourceNames.length)];
            const list = messages[level];
            const msg = list[Math.floor(Math.random() * list.length)];

            appendSyslog(level, source, msg);
        }, 3000);
        registerTimer(elInterval);
    },

    // 5. Network Topology
    'network-topology': function() {
        const headerContext = document.getElementById('header-context-actions');
        headerContext.innerHTML = `
            <button class="text-primary-container border border-primary-container px-md py-xs rounded font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 glow-active" id="btn-refresh-net">重新整理網路</button>
        `;

        const btnRefresh = document.getElementById('btn-refresh-net');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                alert("拓撲網路狀態重整中...連線節點狀態nominal。");
            });
        }

        // Draw Interactive Network Topology (SVG)
        const svg = document.getElementById('topology-svg');
        if (svg) {
            svg.innerHTML = '';
            
            const width = svg.clientWidth || 800;
            const height = svg.clientHeight || 500;
            
            const cx = width / 2;
            const cy = height / 2;

            const nodes = [
                { id: 'core', type: 'core', x: cx, y: cy, name: '核心引擎', status: '正常', speed: '128.4 Gbps' },
                { id: 'h1', type: 'peripheral', x: cx - 180, y: cy - 100, name: 'N-Sector-A', status: '正常', speed: '2.4 Gbps' },
                { id: 'h2', type: 'peripheral', x: cx + 180, y: cy - 80, name: 'N-Sector-B', status: '正常', speed: '1.8 Gbps' },
                { id: 'h3', type: 'alert', x: cx + 100, y: cy + 140, name: 'C-Hub-Delta', status: '延遲過高', speed: '450 Mbps' },
                { id: 'h4', type: 'peripheral', x: cx - 200, y: cy + 100, name: 'P-Sensor-01', status: '降級', speed: '900 Mbps' },
                { id: 's1', type: 'peripheral', x: cx - 250, y: cy - 160, name: 'Aux-1', status: '正常', speed: '1.0 Gbps' },
                { id: 's2', type: 'peripheral', x: cx + 250, y: cy - 160, name: 'Aux-2', status: '正常', speed: '1.0 Gbps' }
            ];

            const links = [
                { source: 'core', target: 'h1', state: 'active' },
                { source: 'core', target: 'h2', state: 'active' },
                { source: 'core', target: 'h3', state: 'critical' },
                { source: 'core', target: 'h4', state: 'degraded' },
                { source: 'h1', target: 's1', state: 'active' },
                { source: 'h2', target: 's2', state: 'active' }
            ];

            const nodeMap = new Map(nodes.map(n => [n.id, n]));

            // Draw Links
            links.forEach(link => {
                const s = nodeMap.get(link.source);
                const t = nodeMap.get(link.target);
                if (!s || !t) return;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', s.x);
                line.setAttribute('y1', s.y);
                line.setAttribute('x2', t.x);
                line.setAttribute('y2', t.y);
                
                if (link.state === 'active') line.classList.add('link-active');
                if (link.state === 'degraded') line.classList.add('link-degraded');
                if (link.state === 'critical') line.classList.add('link-critical');
                
                svg.appendChild(line);
            });

            // Create Tooltip Overlay inside SVG Container
            const container = document.getElementById('topology-container');
            let tooltip = document.getElementById('node-tooltip-overlay');
            
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'node-tooltip-overlay';
                tooltip.className = "absolute hidden bg-surface-container border border-outline-variant rounded p-sm shadow-lg pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full mb-2";
                container.appendChild(tooltip);
            }

            // Draw Nodes
            nodes.forEach(node => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
                g.style.cursor = 'pointer';

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', 0);
                circle.setAttribute('cy', 0);
                circle.classList.add(`node-${node.type}`);

                // Labels
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', node.type === 'core' ? 20 : 15);
                text.setAttribute('y', 4);
                text.setAttribute('font-family', 'JetBrains Mono');
                text.setAttribute('font-size', node.type === 'core' ? '12px' : '10px');
                text.setAttribute('font-weight', node.type === 'core' ? 'bold' : 'normal');
                text.setAttribute('fill', node.type === 'core' ? '#00e5ff' : '#bac9cc');
                text.textContent = node.name;

                g.appendChild(circle);
                g.appendChild(text);
                svg.appendChild(g);

                // Interactions
                g.addEventListener('mouseenter', () => {
                    tooltip.style.left = `${node.x}px`;
                    tooltip.style.top = `${node.y - 12}px`;
                    tooltip.classList.remove('hidden');

                    let statusColor = "text-secondary-container";
                    let titleColor = "text-primary-container";
                    if (node.status === '延遲過高') {
                        statusColor = "text-error font-bold";
                        titleColor = "text-error";
                    } else if (node.status === '降級') {
                        statusColor = "text-tertiary-container";
                        titleColor = "text-tertiary-container";
                    }

                    tooltip.innerHTML = `
                        <div class="font-label-caps text-label-caps ${titleColor} mb-xs font-bold">${node.name}</div>
                        <div class="flex justify-between gap-xl font-data-sm text-data-sm text-on-surface">
                            <span class="text-on-surface-variant">狀態:</span>
                            <span class="${statusColor}">${node.status}</span>
                        </div>
                        <div class="flex justify-between gap-xl font-data-sm text-data-sm text-on-surface">
                            <span class="text-on-surface-variant">速度:</span>
                            <span>${node.speed}</span>
                        </div>
                    `;
                });

                g.addEventListener('mouseleave', () => {
                    tooltip.classList.add('hidden');
                });
            });
        }

        // Live statistics fluctuations
        const netInterval = setInterval(() => {
            const pl = document.getElementById('packet-loss-counter');
            const tp = document.getElementById('throughput-counter');
            if (pl) {
                let current = parseFloat(pl.textContent);
                pl.textContent = Math.max(0.1, (current + (Math.random() * 0.4 - 0.2))).toFixed(1);
            }
            if (tp) {
                let current = parseFloat(tp.textContent);
                tp.textContent = (current + (Math.random() * 2 - 1)).toFixed(1);
            }
        }, 2000);
        registerTimer(netInterval);
    }
};

// Application Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGlobalActions();
});
