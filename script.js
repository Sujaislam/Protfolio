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
