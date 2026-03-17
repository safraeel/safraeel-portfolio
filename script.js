'use strict';

// AUDIO CONTEXT MANAGER
const UI_Audio = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playTick() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    playWhoosh() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    },
    playKeystroke() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.02);
    }
};

// INITIALIZATION
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
} else {
    initPreloader();
}

function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloader-counter');
    const bar = document.getElementById('preloader-bar');
    const btn = document.getElementById('preloader-btn');
    const statusTxt = document.getElementById('preloader-status');

    // If the page doesn't include a preloader, start the app immediately
    if (!preloader || !btn) {
        try { bootApp(); } catch (e) { console.warn('bootApp failed', e); }
        return;
    }
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        
        counter.innerText = progress.toString().padStart(3, '0');
        bar.style.width = `${progress}%`;
        
        if (progress > 30) statusTxt.innerText = "DECRYPTING ASSETS_";
        if (progress > 70) statusTxt.innerText = "COMPILING MODULES_";
        
        if (progress === 100) {
            clearInterval(interval);
            statusTxt.innerText = "SYSTEM_READY";
            btn.classList.remove('opacity-0', 'pointer-events-none');
            btn.classList.add('opacity-100', 'pointer-events-auto');
            // Accessibility: announce ready state
            if (statusTxt) {
                statusTxt.setAttribute('role', 'status');
                statusTxt.setAttribute('aria-live', 'polite');
            }

            // Auto-start the site after a short delay if user doesn't click
            setTimeout(() => {
                if (preloader && preloader.style.display !== 'none') {
                    try {
                        UI_Audio.init();
                        UI_Audio.playWhoosh();
                    } catch (e) { /* ignore audio errors */ }
                    preloader.classList.add('opacity-0');
                    document.body.classList.remove('overflow-hidden');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        if (typeof bootApp === 'function') bootApp();
                    }, 700);
                }
            }, 1200);
        }
    }, 40);

    btn.addEventListener('click', () => {
        UI_Audio.init();
        UI_Audio.playWhoosh();
        
        preloader.classList.add('opacity-0');
        document.body.classList.remove('overflow-hidden');
        
        setTimeout(() => {
            preloader.style.display = 'none';
            // start main app after preloader
            if (typeof bootApp === 'function') bootApp();
        }, 1000);
    });
}

function bootApp() {
    initLenis();
    initAnchorNavigation();
    initScrollEffects();
    initMobileMenu();
    initProjectFilters();
    init3DCards();
    initContactForm();
    initActivityLog();
    initMinimalCursor();
    initCMD_K();
    initTerminal();
}

function initLenis() {
    if (typeof Lenis === 'undefined') {
        // Lenis CDN not available — skip smooth scroll gracefully
        return;
    }

    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // expose lenis for other modules (anchor navigation)
        try { window.__lenis = lenis; } catch (e) { /* ignore */ }

        function raf(time) {
            if (lenis && typeof lenis.raf === 'function') lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('Lenis init failed:', e);
    }
}

function initAnchorNavigation() {
    // Handle internal hash links and smooth-scroll using Lenis when available
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const id = href.slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            // If Lenis is running, use it for smooth scroll
            if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
                try {
                    window.__lenis.scrollTo(target, { offset: 0 });
                } catch (err) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            // update focus for accessibility
            setTimeout(() => {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }, 600);
        });
    });
}
function initScrollEffects() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('bg-zinc-950/80', 'backdrop-blur-md', 'border-b', 'border-zinc-800', 'shadow-lg');
            nav.classList.remove('border-b-0');
        } else {
            nav.classList.remove('bg-zinc-950/80', 'backdrop-blur-md', 'border-b', 'border-zinc-800', 'shadow-lg');
            nav.classList.add('border-b-0');
        }
    });
}

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    if(!mobileBtn) return;
    function toggleMenu() {
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
    }

    mobileBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) toggleMenu();
        });
    });
}

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(UI_Audio) UI_Audio.playTick();
            filterBtns.forEach(b => {
                b.classList.remove('bg-zinc-100', 'text-zinc-950');
                b.classList.add('bg-zinc-900', 'text-zinc-400');
            });
            const target = e.target;
            target.classList.remove('bg-zinc-900', 'text-zinc-400');
            target.classList.add('bg-zinc-100', 'text-zinc-950');

            const filter = target.getAttribute('data-filter');

            projects.forEach(project => {
                project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filter === 'all' || project.getAttribute('data-category') === filter) {
                        project.style.display = 'block';
                        void project.offsetWidth;
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    } else {
                        project.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

function init3DCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max tilt angle
            const maxTilt = 12;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            if(UI_Audio) UI_Audio.playTick();
        });
    });
}

function initContactForm() {
    // 4. Accessible Modal
    const modalBtnOpen = document.querySelectorAll('.modal-open-btn');
    const modalCloseBtn = document.querySelectorAll('.modal-close-btn');
    const backdrop = document.querySelector('.modal-backdrop');
    const modalContainer = document.getElementById('contact-modal');
    const modalPanel = document.querySelector('.modal-panel');
    let previousActiveElement;

    function openModal() {
        previousActiveElement = document.activeElement;
        modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            modalPanel.classList.remove('opacity-0', 'scale-95');
            modalPanel.classList.add('opacity-100', 'scale-100');
        }, 10);

        setTimeout(() => {
            const firstInput = document.getElementById('name');
            if(firstInput) firstInput.focus();
        }, 300);

        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', handleEscape);
    }

    function closeModal() {
        backdrop.classList.add('opacity-0');
        modalPanel.classList.remove('opacity-100', 'scale-100');
        modalPanel.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            modalContainer.classList.add('hidden');
            document.body.style.overflow = '';
            if(previousActiveElement) previousActiveElement.focus();
        }, 300);

        document.removeEventListener('keydown', trapFocus);
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') closeModal();
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusableElements = modalContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    modalBtnOpen.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    modalCloseBtn.forEach(btn => btn.addEventListener('click', closeModal));
    if(backdrop) backdrop.addEventListener('click', closeModal);

    // 5. Secure Form Handling
    const form = document.getElementById('hire-form');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');

    function sanitizeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formError.classList.add('hidden');
        formSuccess.classList.add('hidden');

        const name = sanitizeHTML(document.getElementById('name').value.trim());
        const email = sanitizeHTML(document.getElementById('email').value.trim());
        const details = sanitizeHTML(document.getElementById('details').value.trim());

        if (!name || !email || !details) {
            formError.textContent = 'All fields are strictly required.';
            formError.classList.remove('hidden');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            formError.textContent = 'Invalid email structure detected.';
            formError.classList.remove('hidden');
            return;
        }

        submitText.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        setTimeout(() => {
            submitSpinner.classList.add('hidden');
            submitText.classList.remove('hidden');
            form.reset();
            formSuccess.classList.remove('hidden');
            
            setTimeout(() => {
                closeModal();
                formSuccess.classList.add('hidden');
            }, 2000);
        }, 1500);
    });

}

function initActivityLog() {
    // 6. Live API Heartbeats
    
    // --- GITHUB HEARTBEAT ---
    async function fetchGitHubPulse() {
        const username = 'bilisatu'; // Based on project URLs
        const repoEl = document.getElementById('github-repo');
        const commitEl = document.getElementById('github-commit-msg');
        const timeEl = document.getElementById('github-time');
        
        try {
            // Using public events API
            const res = await fetch(`https://api.github.com/users/${username}/events/public`);
            if (!res.ok) throw new Error('Network response was not ok');
            const events = await res.json();
            
            // Find the most recent PushEvent
            const pushEvent = events.find(event => event.type === 'PushEvent');
            
            if (pushEvent && pushEvent.payload && pushEvent.payload.commits.length > 0) {
                const latestCommit = pushEvent.payload.commits[pushEvent.payload.commits.length - 1];
                const repoName = pushEvent.repo.name.replace(`${username}/`, '');
                
                // Calculate time ago
                const commitDate = new Date(pushEvent.created_at);
                const now = new Date();
                const diffTime = Math.abs(now - commitDate);
                const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                let timeString = diffHours === 0 ? 'Just now' : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                if(diffHours > 24) {
                    const diffDays = Math.floor(diffHours / 24);
                    timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                }

                // Update UI safely
                repoEl.textContent = sanitizeHTML(repoName);
                commitEl.textContent = sanitizeHTML(latestCommit.message.split('\\n')[0]);
                timeEl.textContent = timeString;
            } else {
                repoEl.textContent = 'safraeel-portfolio';
                commitEl.textContent = 'Refactored to premium UI architecture';
                timeEl.textContent = 'Recently';
            }
        } catch (error) {
            console.error('GitHub API error:', error);
            // Fallback graceful degradation UI
            repoEl.textContent = 'safraeel-portfolio';
            commitEl.textContent = 'Shipped major performance updates';
            timeEl.textContent = 'Recently';
        }
    }

    // --- SPOTIFY HEARTBEAT SIMULATION ---
    // Note: A real Spotify integration requires an OAuth backend. 
    // This is a front-end simulation showing how the UI acts when connected to a realtime listener API.
    function simulateSpotifyPulse() {
        const trackEl = document.getElementById('spotify-track');
        const artistEl = document.getElementById('spotify-artist');
        
        // Let's pretend the API returns this array of current vibes
        const vibes = [
            { track: "Starboy", artist: "The Weeknd" },
            { track: "Midnight City", artist: "M83" },
            { track: "Nightcall", artist: "Kavinsky" },
            { track: "Blinding Lights", artist: "The Weeknd" }
        ];
        
        // Randomly pick one to simulate real-time API return
        const currentVibe = vibes[Math.floor(Math.random() * vibes.length)];
        
        if (trackEl && artistEl) {
            trackEl.textContent = currentVibe.track;
            artistEl.textContent = currentVibe.artist;
        }
    }

    // Initialize Heartbeats
    setTimeout(() => {
        fetchGitHubPulse();
        simulateSpotifyPulse();
        
        // Poll Spotify every 3 mins to feel alive
        setInterval(simulateSpotifyPulse, 180000);
    }, 1000); // slight delay so the page load animations finish first

}

function initMinimalCursor() {
    // 7. Minimal Dot Cursor (Aesthetic, Simple, No Stroke)
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursorDot = document.createElement('div');
        cursorDot.className = 'fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none mix-blend-difference transition-transform duration-150 ease-out'; cursorDot.style.zIndex = '9999';
        // do not hide the native cursor globally — keep native pointer interactions intact
        
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let isHovering = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Update position instantly 
            cursorDot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0) scale(${isHovering ? 2.5 : 1})`;
        });

        // Hover Effects for interactable elements
        const interactables = document.querySelectorAll('a, button, .project-card, input, textarea');

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovering = true;
                cursorDot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0) scale(2.5)`;
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                cursorDot.style.transform = `translate3d(${mouseX - 6}px, ${mouseY - 6}px, 0) scale(1)`;
            });
        });
    }
}

// (header particles removed)

function initCMD_K() {
    // 8. God Mode CMD+K Palette
    const cmdkPalette = document.getElementById('cmdk-palette');
    const cmdkBackdrop = document.getElementById('cmdk-backdrop');
    const cmdkBody = document.getElementById('cmdk-body');
    const cmdkInput = document.getElementById('cmdk-input');
    const cmdkHint = document.getElementById('cmdk-hint');
    const cmdkItems = document.querySelectorAll('.cmdk-item');
    let isCmdkOpen = false;

    function openCmdk() {
        if(isCmdkOpen) return;
        isCmdkOpen = true;
        cmdkPalette.classList.remove('hidden');
        cmdkPalette.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Setup initial focus state for items reset
        cmdkItems.forEach(i => i.classList.remove('bg-brand-accent/20', 'text-white'));
        if(cmdkItems.length > 0) cmdkItems[0].classList.add('bg-brand-accent/20', 'text-white');
        
        setTimeout(() => {
            cmdkBackdrop.classList.remove('opacity-0');
            cmdkBody.classList.remove('opacity-0', 'scale-95');
            cmdkBody.classList.add('opacity-100', 'scale-100');
            cmdkInput.value = '';
            cmdkInput.focus();
        }, 10);
    }

    function closeCmdk() {
        if(!isCmdkOpen) return;
        isCmdkOpen = false;
        
        cmdkBackdrop.classList.add('opacity-0');
        cmdkBody.classList.remove('opacity-100', 'scale-100');
        cmdkBody.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            cmdkPalette.classList.add('hidden');
            cmdkPalette.classList.remove('flex');
            document.body.style.overflow = '';
        }, 200);
    }

    // Keyboard trigger (CMD+K or CTRL+K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            isCmdkOpen ? closeCmdk() : openCmdk();
        }
        if (e.key === 'Escape' && isCmdkOpen) {
            e.preventDefault();
            closeCmdk();
        }
    });

    if (cmdkHint) {
        cmdkHint.addEventListener('click', openCmdk);
    }
    if (cmdkBackdrop) {
        cmdkBackdrop.addEventListener('click', closeCmdk);
    }

    // Arrow key navigation inside palette
    let currentCmdkIndex = 0;
    if(cmdkInput) {
        cmdkInput.addEventListener('keydown', (e) => {
            const visibleItems = Array.from(cmdkItems).filter(item => item.style.display !== 'none');
            if(visibleItems.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentCmdkIndex = (currentCmdkIndex + 1) % visibleItems.length;
                updateCmdkSelection(visibleItems);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentCmdkIndex = (currentCmdkIndex - 1 + visibleItems.length) % visibleItems.length;
                updateCmdkSelection(visibleItems);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if(visibleItems[currentCmdkIndex]) visibleItems[currentCmdkIndex].click();
            }
        });
        
        // Search filtering
        cmdkInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            let hasVisible = false;
            
            cmdkItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if(text.includes(term)) {
                    item.style.display = 'flex';
                    hasVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // hide group headers if no items visible under them (simplified check)
            const visibleFirst = Array.from(cmdkItems).find(i => i.style.display !== 'none');
            if(visibleFirst) {
                currentCmdkIndex = 0;
                updateCmdkSelection(Array.from(cmdkItems).filter(i => i.style.display !== 'none'));
            }
        });
    }

    function updateCmdkSelection(items) {
        items.forEach((item, idx) => {
            if(idx === currentCmdkIndex) {
                item.classList.add('bg-brand-accent/20', 'text-white');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('bg-brand-accent/20', 'text-white');
            }
        });
    }

    // Action handling
    cmdkItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const visibleItems = Array.from(cmdkItems).filter(i => i.style.display !== 'none');
            currentCmdkIndex = visibleItems.indexOf(item);
            updateCmdkSelection(visibleItems);
        });

        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            if (action === 'scroll') {
                const target = document.querySelector(item.getAttribute('data-target'));
                if (target) {
                    closeCmdk();
                    setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 200);
                }
            } else if (action === 'modal') {
                closeCmdk();
                setTimeout(openModal, 200);
            } else if (action === 'link') {
                window.open(item.getAttribute('data-url'), '_blank');
                closeCmdk();
            } else if (action === 'terminal') {
                closeCmdk();
                setTimeout(() => window.openTerminal(), 200);
            }
        });
    });

}

function initTerminal() {
    // 9. TERMINAL LOGIC
    const terminalTriggerBtn = document.getElementById('terminal-trigger');
    const terminalMode = document.getElementById('terminal-mode');
    const terminalCloseBtn = document.getElementById('terminal-close');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    
    if (terminalMode) {
        // Command history
        let commandHistory = [];
        let historyIndex = -1;
        
        // Commands map
        const commands = {
            'help': `Available commands:
      help       - Show this message
      whoami     - Learn about Safraeel
      projects   - List top tier projects
      contact    - Get communication channels
      clear      - Clear terminal output
      exit       - Exit terminal mode`,
            'whoami': `> safraeel | Senior UI/UX Engineer
    > Specializations: Motion Design, Creative Coding, Front-End Architecture
    > Status: Online. Building the future of the web.`,
            'projects': `[1] Liquid Grid - WebGL experimental layouts
    [2] Neo-Banking Dashboard - FinTech UI kits
    [3] Quantum Typography - Kinetic text engine`,
            'contact': `> Email:   hello@safraeel.studio
    > X:       @safraeel
    > GitHub:  github.com/safraeel`,
            'sudo': `[ERROR] Permission denied: user 'guest' does not have sudo privileges.`,
            'matrix': `[ERROR] Display protocol unavailable in current rendering pipeline.`,
        };

        function appendOutput(text, isCommand = false) {
            const div = document.createElement('div');
            if (isCommand) {
                div.innerHTML = `<span class="text-emerald-500 mr-2">safraeel@root:~$</span><span class="text-white">${text}</span>`;
            } else {
                div.className = 'text-zinc-400 mt-1 mb-3';
                div.innerHTML = text.replace(/\n/g, '<br>');
            }
            terminalOutput.appendChild(div);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        window.openTerminal = function() {
            terminalMode.classList.remove('hidden');
            terminalMode.classList.add('flex');
            document.body.style.overflow = 'hidden';
            document.body.style.cursor = 'default';
            setTimeout(() => terminalInput.focus(), 100);
        };

        window.closeTerminal = function() {
            terminalMode.classList.add('hidden');
            terminalMode.classList.remove('flex');
            document.body.style.overflow = '';
            document.body.style.cursor = 'none';
        };

        if (terminalTriggerBtn) terminalTriggerBtn.addEventListener('click', window.openTerminal);
        if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', window.closeTerminal);

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value.trim();
                if (!val) return;
                
                appendOutput(val, true);
                commandHistory.push(val);
                historyIndex = commandHistory.length;
                terminalInput.value = '';

                const lowerVal = val.toLowerCase();
                if (lowerVal === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (lowerVal === 'exit') {
                    window.closeTerminal();
                } else if (commands[lowerVal]) {
                    appendOutput(commands[lowerVal]);
                } else {
                    appendOutput(`Command not found: ${val}. Type 'help' to see available commands.`);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
        });
        
        // Keep focus on input when clicking anywhere in terminal
        terminalMode.addEventListener('click', () => {
            if (!window.getSelection().toString()) {
                terminalInput.focus();
            }
        });
    }

}
