# Herbarium
A self-hosted recipe website. Recipes are written in [Cooklang](https://cooklang.org/) and served as a fast, read-only site.

**Built With**  
Rust, Axum, Askama, Tailwind, Varnish

### ✨ Features
- Browse and search recipes
- Sort by categories
- Recipe detail pages with ingredients and instructions
- Automatic recipe sync from a private GitHub repo
- Light/dark theme toggle
- Varnish caching layer

### ⚙️ Environment Variables

| Name                    | Default                | Notes                                                                             |
|-------------------------|------------------------|-----------------------------------------------------------------------------------|
| `GITHUB_DEPLOY_KEY`     | —                      | Base64-encoded SSH deploy key for cloning/pulling the recipes repo (required)     |
| `RECIPES_DIR`           | `/herbarium-recipes`   | Path where the recipes repo is cloned                                             |
| `STATIC_DIR`            | `static`               | Path to static assets directory                                                   |
| `PORT`                  | `3001`                 | Port the server listens on (Varnish listens on 3000 externally)                   |
| `RECIPES_PULL_INTERVAL` | `86400`                | Seconds between `git pull` refreshes of the recipes repo                          |
| `RUST_LOG`              | `herbarium=info`       | Log filter (uses `tracing` env-filter syntax)                                     |

### 🐳 Install with Docker
Add your deploy key and start the containers:

~~~
GITHUB_DEPLOY_KEY=$(base64 -w0 ~/.ssh/your_deploy_key) docker-compose up --build -d
~~~

On first start the entrypoint clones the recipes repo into `RECIPES_DIR`, then pulls every `RECIPES_PULL_INTERVAL` seconds in the background. The site will be available at [http://localhost:3000](http://localhost:3000).

### 📖 Recipes
Recipes are stored as `.cook` files in a private GitHub repo. The container clones it via SSH using `GITHUB_DEPLOY_KEY` and re-pulls on the interval defined by `RECIPES_PULL_INTERVAL`. See the [Cooklang spec](https://cooklang.org/docs/spec/) for the file format.

Cover images and recipe-specific images are read from a subdirectory matching the recipe's filename (without extension).

### ℹ️ Information
Change `static/robots.txt` based on your use case.

For the hero section image, replace `static/images/heroSection.webp` with your own image.
