# Deploy backend to the public internet

After deploying the Dental Clinic backend API, your Appsmith frontend (e.g. https://jmoney.appsmith.com) can call it via the public URL.

---

## Option 1: Render (recommended, free tier)

[Render](https://render.com) offers a free tier for web services, suitable for demos and frontend integration.

### Steps

1. **Sign up / log in**  
   Go to [https://render.com](https://render.com) and log in with GitHub.

2. **Deploy from GitHub**  
   - In the dashboard click **New** → **Web Service**.  
   - Connect GitHub and select the **MIE350_DentalCilinic_WebApplication** repository.  
   - If Render detects `render.yaml`, it will suggest applying the Blueprint; click **Apply**.  
   - If not, configure manually:
     - **Name**: `dental-clinic-api` (or any name)
     - **Region**: e.g. Singapore
     - **Root Directory**: leave empty
     - **Runtime**: **Docker**
     - **Dockerfile Path**: `backend/Dockerfile`
     - **Docker Context**: `backend`
     - **Instance Type**: Free

3. **Create and deploy**  
   Click **Create Web Service** and wait for the build and deploy (about 3–5 minutes).

4. **Get the public URL**  
   After deployment you’ll see a URL like:  
   `https://dental-clinic-api-xxxx.onrender.com`  
   This is your **API base URL**.

5. **Use it in Appsmith**  
   In your Appsmith API / datasource, set Base URL to:  
   `https://dental-clinic-api-xxxx.onrender.com`  
   Keep paths as `/api/...` (e.g. `/api/auth/login`, `/api/patients`).

**Note:** Free instances spin down after ~15 minutes of no traffic; the first request after that may take a short time to wake up.

---

## Option 2: Railway

[Railway](https://railway.app) also supports Docker.

1. Log in at [railway.app](https://railway.app) with GitHub.  
2. **New Project** → **Deploy from GitHub repo**, select this repo.  
3. In project settings:
   - **Root Directory**: `backend`
   - **Build**: Dockerfile
   - **Start Command**: leave empty (image runs `java -jar app.jar`)
4. In **Variables** you can add `PORT=8080` (Railway often injects it automatically).  
5. Under **Settings** → **Networking**, create a **Public URL** and use it as the API base URL in Appsmith; paths remain `/api/...`.

---

## Option 3: Local tunnel (ngrok)

For local testing without deploying to the cloud, use [ngrok](https://ngrok.com) to expose port 8080.

1. Install [ngrok](https://ngrok.com/download).  
2. Start the backend locally:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
3. In another terminal:
   ```bash
   ngrok http 8080
   ```
4. Use the shown URL (e.g. `https://xxxx.ngrok-free.app`) as the Base URL in Appsmith.  
5. The URL stops working when you stop the backend or ngrok.

---

## CORS and frontend

The backend allows these origins for `/api/**`:

- `https://jmoney.appsmith.com`
- `https://app.appsmith.com`
- Plus local dev origins (e.g. localhost:5173)

To allow another frontend domain, add it to `allowedOrigins` in `backend/src/main/java/com/dentalclinic/WebConfig.java` and redeploy.

---

## Data

The app uses an **in-memory H2 database**. Data is not persisted; after each restart (including Render spin-up), it is reset from `data.sql`. Test accounts:

- `receptionist` / `dental123`
- `dentist` / `dental456`
- `admin` / `dental789`

For persistent storage, you can switch to a hosted database (e.g. PostgreSQL on Render/Railway) and update `application.properties` and dependencies.
