# Grocery App — Full-Stack Skeleton

This is a production-friendly skeleton for a monorepo with:
- **Backend**: Java 21 + Spring Boot 3 microservices (Eureka + Gateway)
- **Frontend**: Next.js 14 + Tailwind
- **Deploy**: Vercel (single repo)

## Deploy (Vercel)
1. Push this repo to GitHub.
2. Import to Vercel.
3. Set env var on Vercel for frontend:
   - `NEXT_PUBLIC_API_URL=/api`
4. Vercel will:
   - Build and serve the **frontend**
   - Build a Docker image for **api-gateway** at `/api/*`

> NOTE: Other microservices are stubbed (skeleton only). We'll add real logic next.

## Local (optional, later)
Use `backend/docker-compose.yml` after service code is added.
