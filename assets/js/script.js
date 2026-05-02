document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Animation ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 800); // fade out after 800ms
    }

    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.opacity = '1';
            // Use requestAnimationFrame for smoother following
            requestAnimationFrame(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        }
    });

    // --- Scroll Progress ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }
    });

    // --- Typewriter Effect for Main Heading ---
    const mainHeading = document.querySelector('.hero h1:not(.gradient-text)');
    if (mainHeading) {
        const text = mainHeading.innerText;
        mainHeading.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            // preserve spaces
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.classList.add('typewriter-char');
            span.style.animationDelay = `${index * 0.05}s`;
            mainHeading.appendChild(span);
        });
    }

    // --- Staggered Letter Animations on Scroll for Section Titles ---
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.innerText;
                entry.target.innerHTML = '';
                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.innerHTML = char === ' ' ? '&nbsp;' : char;
                    span.classList.add('typewriter-char');
                    span.style.animationDelay = `${index * 0.05}s`;
                    entry.target.appendChild(span);
                });
            }
        });
    });
    sectionTitles.forEach(title => titleObserver.observe(title));

    // --- Scroll Trigger Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .stat-item, .project-card, .timeline-content').forEach((el, index) => {
        el.classList.add('hidden-scroll');
        // Staggered reveal
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(el);
    });

    // --- Parallax Depth Layers ---
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        const heroText = document.querySelector('.hero-text');
        const heroImg = document.querySelector('.glow-wrap');
        
        if(heroText) heroText.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        if(heroImg) heroImg.style.transform = `translate(${-x}px, ${-y}px)`;
    });

    // --- Magnetic Buttons & Ripple Effect ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = `translate(0px, 0px)`;
        });

        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);
            setTimeout(() => { ripples.remove() }, 1000);
        });
    });

    // --- 3D Card Tilts on Hover ---
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            // Enhanced with bloom glow dynamically following mouse
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // --- Enhanced Particle System on Canvas ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = (Math.random() - 0.5) * 1;
                this.radius = Math.random() * 2 + 0.5;
                this.baseColor = 'rgba(0, 240, 255, 0.5)';
            }
            
            update() {
                // Interactive repel
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.vx -= forceDirectionX * force * 0.5;
                        this.vy -= forceDirectionY * force * 0.5;
                    }
                }

                // Friction to stabilize repel bursts
                this.vx *= 0.99;
                this.vy *= 0.99;

                // Restoring natural speed if it gets too slow
                if(Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
                if(Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;

                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.baseColor;
                ctx.fill();
            }
        }
        
        // Initialize particles
        const particleCount = Math.min(window.innerWidth / 12, 120);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // Bloom effect with distance factored in
                        ctx.strokeStyle = `rgba(112, 0, 255, ${0.5 * (1 - dist/120)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // --- LeetCode Dynamic Stats ---
    const leetcodeCount = document.getElementById('leetcode-count');
    const leetcodeCountProjects = document.getElementById('leetcode-count-projects');
    if (leetcodeCount || leetcodeCountProjects) {
        fetch('https://leetcode-api-faisalshohag.vercel.app/mr-satya02')
            .then(res => res.json())
            .then(data => {
                if (data.totalSolved) {
                    if (leetcodeCount) leetcodeCount.innerText = data.totalSolved + '+';
                    if (leetcodeCountProjects) leetcodeCountProjects.innerText = data.totalSolved;
                }
            })
            .catch(err => console.error('Failed to fetch LeetCode stats:', err));
    }

    // --- Set Active Nav Link ---
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });

    // Optional: Enhanced Skill Tag Interactions
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mousemove', (e) => {
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            tag.style.setProperty('--mouse-x', `${x}px`);
            tag.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
