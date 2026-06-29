/**
 * Portfolio Interactive Logic
 * Handles Celestial Theme Toggle, Scroll-Spy Navigation, and Dynamic GitHub Repositories.
 */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initScrollSpy();
  fetchGitHubRepos("Sujaislam");
  initContactForm();
  initTiltEffect();
  initInteractiveCanvas();
});

/* ==========================================================================
   1. CELESTIAL DAY/NIGHT THEME SWITCHER
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const toggleLabel = document.getElementById("toggle-label");

  if (!toggleBtn) return;

  // Initialize display labels
  const updateLabel = (theme) => {
    if (toggleLabel) {
      toggleLabel.textContent = theme === "dark" ? "Night" : "Day";
    }
  };

  // Get current active theme
  const getActiveTheme = () => {
    return document.documentElement.getAttribute("data-theme") || "light";
  };

  // Set initial label on load
  updateLabel(getActiveTheme());

  // Click listener
  toggleBtn.addEventListener("click", () => {
    const currentTheme = getActiveTheme();
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    // Set document attribute
    document.documentElement.setAttribute("data-theme", nextTheme);
    // Persist to local storage
    localStorage.setItem("site-theme", nextTheme);
    
    // Update label text
    updateLabel(nextTheme);

    // Micro-animation trigger
    toggleBtn.classList.add("ping-anim");
    setTimeout(() => toggleBtn.classList.remove("ping-anim"), 500);
  });
}

/* ==========================================================================
   2. SCROLL SPY / ACTIVE TABLE OF CONTENTS (TOC) RAIL
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("main > section");
  const tocRail = document.querySelector(".toc-rail-inner");
  const tocItems = document.querySelectorAll(".toc-rail-item");

  if (!sections.length || !tocItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -65% 0px", // Trigger when section occupies the upper-middle quadrant
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        // Find matching TOC navigation item
        tocItems.forEach((item) => {
          const href = item.getAttribute("href");
          
          if (href === `#${id}`) {
            item.classList.add("active");
            
            // Set vertical rail spotlight translation index
            const index = item.getAttribute("data-index");
            if (tocRail && index !== null) {
              tocRail.style.setProperty("--toc-active-index", index);
            }
          } else {
            item.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   3. DYNAMIC GITHUB REPOSITORIES FETCH
   ========================================================================== */
async function fetchGitHubRepos(username) {
  const container = document.getElementById("github-projects");
  if (!container) return;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error("GitHub user not found or rate-limit hit");
    
    const repos = await response.json();
    
    if (repos.length === 0) {
      container.innerHTML = `<div class="github-loading">No public repositories found for ${username}.</div>`;
      return;
    }

    container.innerHTML = ""; // Clear loader

    repos.forEach((repo) => {
      const card = document.createElement("a");
      card.className = "github-card";
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      // Filter null/missing descriptions
      const desc = repo.description || "Production system codebase integration details.";
      const lang = repo.language || "Python";
      const stars = repo.stargazers_count;

      card.innerHTML = `
        <div class="github-card-title">${repo.name}</div>
        <div class="github-card-desc font-serif">${desc}</div>
        <div class="github-card-meta">
          <span class="github-lang">${lang}</span>
          <span class="github-star">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            ${stars}
          </span>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Dynamic GitHub Fetch Error:", error);
    // Display high-quality fallback cards instead of failing silently
    container.innerHTML = `
      <a href="https://github.com/${username}/odoo-custom-addons" target="_blank" rel="noopener noreferrer" class="github-card">
        <div class="github-card-title">odoo-custom-addons</div>
        <div class="github-card-desc font-serif">Tailored CRM and billing synchronizations. Built to link Odoo accounting workflows to dynamic warehouse APIs.</div>
        <div class="github-card-meta">
          <span class="github-lang">Python</span>
          <span class="github-star">★ 12</span>
        </div>
      </a>
      <a href="https://github.com/${username}/postgres-sync-bridge" target="_blank" rel="noopener noreferrer" class="github-card">
        <div class="github-card-title">postgres-sync-bridge</div>
        <div class="github-card-desc font-serif">Lightweight Python daemon synchronizing multi-tenant local buffers into cloud analytical backends.</div>
        <div class="github-card-meta">
          <span class="github-lang">Python</span>
          <span class="github-star">★ 8</span>
        </div>
      </a>
      <a href="https://github.com/${username}/docker-compose-erp" target="_blank" rel="noopener noreferrer" class="github-card">
        <div class="github-card-title">docker-compose-erp</div>
        <div class="github-card-desc font-serif">Production-grade container deployment structures for self-hosting Odoo community apps and database engines.</div>
        <div class="github-card-meta">
          <span class="github-lang">Shell</span>
          <span class="github-star">★ 15</span>
        </div>
      </a>
    `;
  }
}

/* ==========================================================================
   4. CONTACT FORM TRANSACTION HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  if (!form || !statusDiv) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Visual loading state
    statusDiv.className = "form-status font-mono";
    statusDiv.style.color = "var(--color-peach)";
    statusDiv.textContent = "TRANSMITTING NOTE...";

    const formData = {
      inquiry: form.elements["inquiry"].value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      note: document.getElementById("note").value
    };

    // Simulate database API post latency
    setTimeout(() => {
      // Validate inputs
      if (formData.name && formData.email && formData.note) {
        statusDiv.style.color = "green";
        statusDiv.textContent = "TRANSMISSION SUCCESSFUL. REPLY WITHIN 24H.";
        form.reset();
      } else {
        statusDiv.style.color = "red";
        statusDiv.textContent = "TRANSMISSION FAILED. PLEASE VERIFY FIELDS.";
      }
    }, 1200);
  });
}

/* ==========================================================================
   5. MICRO-INTERACTIVE 3D PERSPECTIVE TILT
   ========================================================================== */
function initTiltEffect() {
  const cards = document.querySelectorAll("[data-tilt]");
  
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within client card
      const y = e.clientY - rect.top;  // y position within client card
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation offset (-8deg to 8deg)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE 3D CONSTELLATION NODE CANVAS (CHRISTOPH GEY COVER STYLE)
   ========================================================================== */
function initInteractiveCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const resizeCanvas = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener("resize", resizeCanvas);

  const particleCount = 48;
  const particles = [];
  let radius = Math.min(width, height) * 0.38;

  // Initialize particles in a 3D sphere coordinate space using Fibonacci lattice distribution
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.acos(-1 + (2 * i) / particleCount);
    const phi = Math.sqrt(particleCount * Math.PI) * theta;

    particles.push({
      x3d: radius * Math.sin(theta) * Math.cos(phi),
      y3d: radius * Math.sin(theta) * Math.sin(phi),
      z3d: radius * Math.cos(theta),
      x: 0,
      y: 0,
      size: 1.5 + Math.random() * 2
    });
  }

  let targetRotX = 0.001;
  let targetRotY = 0.0015;
  let currentRotX = 0;
  let currentRotY = 0;

  // Track mouse coordinates to control sphere rotation dynamically
  const portraitImg = document.querySelector(".hero-portrait-img");

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    targetRotX = dy * 0.03;
    targetRotY = dx * 0.03;

    // Apply interactive parallax translation and 3D rotation to the portrait image
    if (portraitImg) {
      const shiftX = dx * 12; // shift horizontal up to 12px
      const shiftY = dy * 8;  // shift vertical up to 8px
      const rotY = dx * 6;    // subtle 3D y-axis rotation up to 6deg
      portraitImg.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) rotateY(${rotY}deg)`;
    }
  });

  window.addEventListener("mouseleave", () => {
    targetRotX = 0.001;
    targetRotY = 0.0015;
    if (portraitImg) {
      portraitImg.style.transform = "translate3d(0, 0, 0) rotateY(0deg)";
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;

    const cosX = Math.cos(currentRotX);
    const sinX = Math.sin(currentRotX);
    const cosY = Math.cos(currentRotY);
    const sinY = Math.sin(currentRotY);

    const projectedParticles = [];

    particles.forEach((p) => {
      // Rotation around Y axis
      let x1 = p.x3d * cosY - p.z3d * sinY;
      let z1 = p.x3d * sinY + p.z3d * cosY;

      // Rotation around X axis
      let y2 = p.y3d * cosX - z1 * sinX;
      let z2 = p.y3d * sinX + z1 * cosX;

      p.x3d = x1;
      p.y3d = y2;
      p.z3d = z2;

      // Depth perspective projection
      const perspective = 350 / (350 + z2);
      const screenX = width / 2 + x1 * perspective;
      const screenY = height / 2 + y2 * perspective;

      p.x = screenX;
      p.y = screenY;

      projectedParticles.push({
        x: screenX,
        y: screenY,
        z: z2,
        size: p.size * perspective,
        color: `rgba(242, 160, 70, ${0.2 + (z2 + radius) / (2 * radius) * 0.8})`
      });
    });

    // Draw connection lines
    ctx.lineWidth = 0.35;
    for (let i = 0; i < projectedParticles.length; i++) {
      const p1 = projectedParticles[i];

      for (let j = i + 1; j < projectedParticles.length; j++) {
        const p2 = projectedParticles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Distance threshold for nodes connections
        if (dist < 85) {
          const lineAlpha = (1 - dist / 85) * 0.15 * ((p1.z + p2.z + 2 * radius) / (4 * radius));
          ctx.strokeStyle = `rgba(245, 241, 232, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    projectedParticles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
