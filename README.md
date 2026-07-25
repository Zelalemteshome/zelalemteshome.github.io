# Zelalem Teshome Wale — Academic Portfolio

A static, single-page portfolio for Dr. Zelalem Teshome Wale, Associate
Professor of Mathematics at Addis Ababa University. Built with plain HTML,
CSS, and JavaScript — no build tools, no frameworks, no Node.js required.

## Structure

```
portfolio/
├── index.html          # all page content and section markup
├── css/
│   └── style.css        # design tokens, layout, and section styles
├── js/
│   └── script.js         # nav, scroll reveal, publication search, lattice diagram
├── assets/
│   └── img/
│       └── profile.jpg   # portrait
└── README.md
```

## Running locally

No build step is needed. Either:

- Open `index.html` directly in a browser, or
- Serve it locally for a closer-to-production feel:
  ```bash
  cd portfolio
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `zelalem-portfolio`).
2. Push the contents of this folder to the repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. GitHub will publish the site at:
   `https://<your-username>.github.io/<your-repo>/`
   (this can take a minute or two on first deploy).

Alternatively, you can also host it as a **user/organization page** by naming
the repository `<your-username>.github.io`, in which case the site will be
published at `https://<your-username>.github.io/`.

## Editing content

Everything is in `index.html`, organized by section: About, Research
Interests, Experience, Academic Leadership & Service, Publications,
Recognition & Development, and Contact. Publication entries live inside
`#pubListing`, grouped by `<div class="pub-year-group" data-year="...">`
blocks — add a new entry by copying an existing `.pub-item` block.

Colors, type, and spacing are all controlled by CSS custom properties at the
top of `css/style.css` under `:root`, so palette or font changes only need to
happen in one place.

## Credits

Portrait and biographical details sourced from the provided CV. Fonts:
Newsreader, Inter, and JetBrains Mono (Google Fonts, loaded via CDN in
`style.css`).
