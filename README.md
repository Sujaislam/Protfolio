# Enterprise Portfolio Website

A highly responsive, premium editorial-style portfolio site modeled after [breedlove.xyz](https://breedlove.xyz/), customized for enterprise systems architects and Odoo consultants.

## Tech Stack
*   **HTML5** for semantic, accessible content and SEO JSON-LD schema integrations.
*   **Vanilla CSS3** featuring custom properties, media breakpoints, dynamic marques, and animated constellation backdrops.
*   **Modern JS (ES6)** managing Day/Night themes, IntersectionObservers, and dynamic GitHub REST API consumers.

---

## Local Verification & Testing

Since this project has no compiled dependencies, you can serve the site locally instantly.

Using Python's built-in server:
```bash
# Run inside this directory
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## Deployment to GitHub Pages (Free Hosting)

GitHub Pages hosts static websites directly from your repository for free. Follow these steps to deploy:

### 1. Initialize Git and Commit Your Code
Run these commands in your project terminal:
```bash
git init
git add .
git commit -m "feat: initial commit of portfolio codebase"
```

### 2. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `portfolio` or `Sujaislam.github.io`).
3. Leave it public. Do not check "Add a README" or ".gitignore".
4. Click **Create repository**.

### 3. Link Local Project and Push
Run the instructions shown in GitHub:
```bash
# Replace with your repository link if you named it differently
git remote add origin https://github.com/Sujaislam/portfolio.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click on **Settings** (tab at the top).
3. Scroll down the left sidebar and click on **Pages**.
4. Under **Build and deployment -> Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and `/ (root)`. Click **Save**.
6. Wait 1-2 minutes. GitHub will display your live portfolio URL (e.g., `https://Sujaislam.github.io/portfolio/`).

---

## Technical Personalizations

### 1. Dynamic GitHub Fetching
To update or change the user repositories fetched, modify line 8 of `script.js`:
```javascript
fetchGitHubRepos("Sujaislam"); // Replace "Sujaislam" with any valid username
```

### 2. Google Search Console Verification
To connect your site to GSC:
1. Fetch your verification tag from Google.
2. Open `index.html` and add the meta tag under the SEO tags in the `<head>` section:
   ```html
   <meta name="google-site-verification" content="YOUR_KEY_HERE" />
   ```
3. Commit and push the changes to GitHub.
