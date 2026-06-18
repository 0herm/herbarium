<div align="center">

<img src="static/images/logo/logo.svg" alt="Herbarium logo" width="80" height="80" />

<h1>Herbarium</h1>

<p>
  <sub><code>/hərˈbɛːriəm/</code> &nbsp;·&nbsp; <i>her-BAIR-ee-um</i>. A curated collection of pressed, preserved plant specimens kept for reference,<br/>
  just as this keeps your recipes pressed flat and ready to pull out whenever you cook.</sub>
</p>

<p>
  <b>A self-hosted recipe website.</b><br/>
  Your recipes, written in plain <a href="https://cooklang.org/">Cooklang</a> and served as a fast, read-only site.
</p>

<p>
  <img src="https://img.shields.io/badge/Rust-599459?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/Axum-599459?style=flat-square&logoColor=white" alt="Axum" />
  <img src="https://img.shields.io/badge/Askama-599459?style=flat-square&logoColor=white" alt="Askama" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-599459?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Varnish-599459?style=flat-square&logo=varnish&logoColor=white" alt="Varnish" />
  <img src="https://img.shields.io/badge/Docker-599459?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Cooklang-599459?style=flat-square&logoColor=white" alt="Cooklang" />
</p>

</div>

---

### ✨ Features

- **Find a recipe fast.** Browse everything you've got or search straight for the dish you're after, and narrow things down by category when you're only in the mood for, say, dessert.
- **Cook from a clean page.** Every recipe gets its own page laid out with the ingredients, the step-by-step method, and its cover image.
- **Write recipes the simple way.** Recipes are plain Cooklang text files, so they're easy to write, version, and read with no database to wrangle.
- **It keeps itself fresh.** Point it at a private GitHub repo of recipes and it clones them on first boot, then quietly pulls in new changes on whatever interval you set.
- **Easy on the eyes.** Flip between light and dark whenever the kitchen lighting calls for it.
- **Fast by default.** A Varnish caching layer sits out front, so pages load instantly even on a small server.
- **Yours, on your box.** Fully self-hosted. One `docker compose up` and your recipe site is live on your own server.

### ⚙️ Environment Variables

| Name                    | Default                | Notes                                                                             |
|-------------------------|------------------------|-----------------------------------------------------------------------------------|
| `GITHUB_DEPLOY_KEY`     | -                      | Base64-encoded SSH deploy key for cloning/pulling the recipes repo (required)     |
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
