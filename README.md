# Herbarium
A self-hosted recipe website, where you can share your recipes. Ease of use with tools to edit and add recipes.

**Build With**  
NextJS, TypeScript, React, Tailwind, PostgreSQL and better-auth.

### ✨ Features
- Overview for new recipes
- Sort by categories
- Search for recipes
- Add and edit recipes
- Backup and restore recipes
- Authentication and authorization

### ⚙️ Environment Variables

| Name                      | Notes                                                                                |
|---------------------------|--------------------------------------------------------------------------------------|
| POSTGRES_HOST_PROD        | Default to `herbarium_database`, the host for the postgres database for production    |
| POSTGRES_HOST_DEV         | Default to `herbarium_database`, the host for the postgres database for development   |
| POSTGRES_PORT             | Default to `5432`, the port for the postgres database                                |
| POSTGRES_USER             | Default to `herbarium`, the username for the postgres database                           |
| POSTGRES_PASSWORD         | Password for the postgres database user                                              |
| POSTGRES_DB               | Default to `herbarium`, the name for the postgres database                            |

| Name                      | Notes                                                                                |
|---------------------------|--------------------------------------------------------------------------------------|
| AUTH_SECRET               | The secret for the auth service                                                      |
| AUTH_URL                  | URL for the auth service, default `http://localhost:8080`                            |
| AUTH_TELEMETRY            | To enable telemetry for auth, default `false`                                        |
| AUTH_EMAIL                | Email for authentication                                                             |
| AUTH_PASSWORD             | Password for authentication                                                          |
| AUTH_NAME                 | Name for authentication                                                              |

### 🐳 Install with Docker
To start the containers run:

~~~
docker-compose up --build -d
~~~

For the auth credentials, run `npm run seed`

Then go to the cashed site: [http://localhost:8080](http://localhost:8080) or your configured domain.

### ℹ️ Information
Change `/public/robots.txt` based on your use case

To change the text for the website, rename the `textDemo.json` to `text.json` in the `/public` directory, then edit the `text.json` file to your liking.

For the hero section image, replace the `/public/images/heroSection.webp` file with your own image.