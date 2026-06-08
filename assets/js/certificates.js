// Javascript specifically designed for Certificates Showcase Page

document.addEventListener('DOMContentLoaded', () => {
    // --- Certificates Data Repository ---
    // Easily extensible: Add new certificates to this list and they will immediately render.
    const certificates = [
        {
            id: 'neo4j',
            title: 'Neo4j Certified Professional',
            issuer: 'Neo4j GraphAcademy',
            date: 'June 2026',
            category: 'database',
            image: 'assets/images/cert_neo4j.png',
            description: 'Acquired core competencies in graph data modeling, node-relationship traversal, and complex Cypher query optimization. Validated understanding of relational-to-graph transitions, performance indexing, and traversing highly interconnected datasets in millisecond runtimes.',
            skills: ['Neo4j', 'Graph Databases', 'Cypher Query Language', 'Data Modeling', 'NoSQL'],
            verifyUrl: 'https://graphacademy.neo4j.com/c/11c24862-7743-4ef7-a66d-fa67519e6f16/',
            brandClass: 'brand-neo4j',
            badgeText: 'Database'
        },
        {
            id: 'cognitive-ml',
            title: 'Machine Learning Basics',
            issuer: 'Cognitive Class',
            date: 'June 2026',
            category: 'cs',
            image: 'assets/images/machine_learning_basics.png',
            description: 'Acquired foundational knowledge of machine learning algorithms, supervised vs. unsupervised learning models, regression analysis, classification, and clustering techniques. Practiced implementing models using Python and data science libraries to analyze real-world datasets.',
            skills: ['Machine Learning', 'Python', 'Supervised Learning', 'Algorithms', 'Data Analysis'],
            verifyUrl: 'https://cognitiveclass.ai/certificates/6bf02bbf-788e-40ae-adfe-348aef578e34',
            brandClass: 'brand-cognitive',
            badgeText: 'Machine Learning'
        },
        {
            id: 'gcp',
            title: 'Google Cloud Platform Associate Cloud Foundations',
            issuer: 'Google Cloud (via Coursera)',
            date: 'April 2025',
            category: 'cloud',
            image: 'assets/images/cert_gcp.png',
            description: 'Demonstrated proficiency in building, deploying, and maintaining highly-available cloud infrastructure on Google Cloud. Acquired robust hands-on skills in configuring Identity & Access Management (IAM), Compute Engine virtualization, Google Kubernetes Engine (GKE) containerization, serverless Cloud Run, and big-data BigQuery analytics pipelines.',
            skills: ['Google Cloud Platform', 'Cloud Run', 'IAM Architecture', 'Compute Engine', 'Kubernetes GKE', 'BigQuery'],
            verifyUrl: 'https://coursera.org/verify/professional-cert/google-cloud-engineer', // Example URL
            brandClass: 'brand-gcp',
            badgeText: 'Cloud',
            status: 'on-hold'
        },
        {
            id: 'cs50',
            title: 'CS50x: Introduction to Computer Science',
            issuer: 'Harvard University (via edX)',
            date: 'December 2024',
            category: 'cs',
            image: 'assets/images/cert_cs50.png',
            description: 'Harvard University\'s flagship introduction to the intellectual enterprises of computer science and the art of programming. Mastered fundamental concepts including resource management, memory allocations, low-level pointers in C, dynamic programming, web systems, database design with SQL, and advanced algorithmic thinking.',
            skills: ['C Programming', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Flask'],
            verifyUrl: 'https://certificates.cs50.io/6806b57a-825b-4eef-b9ad-d147a2687ff6.pdf',
            brandClass: 'brand-cs50',
            badgeText: 'Computer Science'
        }
    ];

    const certsGrid = document.getElementById('certs-grid');
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // --- Render Cards ---
    function renderCertificates(items) {
        certsGrid.innerHTML = '';

        if (items.length === 0) {
            certsGrid.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <h3>No Certificates Found</h3>
                    <p>We couldn't find any certificates matching your criteria. Try adjusting your search query or filter tags!</p>
                </div>
            `;
            return;
        }

        items.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = `glass-card project-card cert-card ${cert.brandClass} hidden-scroll`;
            card.dataset.id = cert.id;
            card.dataset.category = cert.category;
            card.style.transitionDelay = `${(index % 3) * 0.1}s`;

            const skillsHtml = cert.skills.map(s => `<span>${s}</span>`).join('');

            card.innerHTML = `
                <div class="cert-card-inner">
                    <div class="cert-img-container">
                        <span class="cert-badge">${cert.badgeText}</span>
                        ${cert.status === 'on-hold' ? '<div class="cert-on-hold-overlay"><span>On Hold</span></div>' : ''}
                        <div class="cert-overlay-glow"></div>
                        <img src="${cert.image}" alt="${cert.title}" class="cert-thumbnail" style="${cert.status === 'on-hold' ? 'filter: blur(4px) grayscale(50%); opacity: 0.55;' : ''}">
                    </div>
                    <div class="cert-details">
                        <span class="cert-issuer">${cert.issuer}</span>
                        <h3>${cert.title}</h3>
                        <p class="cert-card-date">${cert.date}</p>
                        <div class="cert-skills">
                            ${skillsHtml}
                        </div>
                    </div>
                </div>
            `;

            // Add click event for modal popup
            card.addEventListener('click', () => openModal(cert));

            certsGrid.appendChild(card);

            // Hook up 3D Hover Tilt Effect immediately
            setupCardTilt(card);
        });

        // Trigger intersection observer reveal
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                    }
                });
            }, { threshold: 0.05 });

            document.querySelectorAll('.cert-card').forEach(el => observer.observe(el));
        }, 50);
    }

    // --- Search & Filter Logic ---
    let activeCategory = 'all';
    let searchQuery = '';

    function applySearchAndFilter() {
        const filtered = certificates.filter(cert => {
            const matchesCategory = activeCategory === 'all' || cert.category === activeCategory;

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                cert.title.toLowerCase().includes(searchLower) ||
                cert.issuer.toLowerCase().includes(searchLower) ||
                cert.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
                cert.description.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
        });

        renderCertificates(filtered);
    }

    // Filter Buttons Click
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.filter;
            applySearchAndFilter();
        });
    });

    // Search Input Event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applySearchAndFilter();
        });
    }

    // --- Modal Credential Popup Box Logic ---
    function openModal(cert) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;

        const skillsHtml = cert.skills.map(s => `<span>${s}</span>`).join('');

        const actionButton = cert.status === 'on-hold'
            ? `
                <button class="btn modal-verify-btn" style="background: rgba(255, 255, 255, 0.03); border: 1px dashed var(--glass-border); color: var(--text-muted); cursor: not-allowed; width: 100%; justify-content: center;" disabled>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    Certificate On Hold (Pending Upload)
                </button>
            `
            : `
                <a href="${cert.verifyUrl}" target="_blank" class="btn btn-primary modal-verify-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    Verify Official Credential
                </a>
            `;

        modalContainer.innerHTML = `
            <button class="modal-close-btn" id="modal-close" aria-label="Close modal">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="modal-content-grid">
                <div class="modal-visual-side">
                    <div class="modal-image-wrap">
                        <img src="${cert.image}" alt="${cert.title} Full View" style="${cert.status === 'on-hold' ? 'filter: blur(8px) grayscale(80%); opacity: 0.5;' : ''}">
                    </div>
                </div>
                <div class="modal-info-side">
                    <div class="modal-info-header">
                        <span class="modal-info-issuer">${cert.issuer}</span>
                        <h2>${cert.title}</h2>
                        <div class="modal-meta-row">
                            <div class="modal-meta-item">Issued: <strong>${cert.date}</strong></div>
                        </div>
                        <div class="modal-divider"></div>
                        <p class="modal-description">${cert.description}</p>
                    </div>
                    
                    <div>
                        <h4 class="modal-skills-title">Skills Validated</h4>
                        <div class="modal-skills-list">
                            ${skillsHtml}
                        </div>
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;

        // Toggle Active classes to trigger animations
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scroll leak

        // Attach close event listeners
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Modal click-outside logic
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 3D Card Hover Tilt Effect ---
    // Specifically tailored for dynamic certificate cards
    function setupCardTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Adjust maximum tilt rotation degrees
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    }

    // --- Bootstrapper ---
    renderCertificates(certificates);
});
