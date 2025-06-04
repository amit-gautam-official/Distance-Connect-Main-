##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client - remove if not using Prisma

COPY prisma ./

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder

ARG DATABASE_URL
ARG NODE_ENV
ARG NEXT_PUBLIC_BASE_URL
ARG APP_BASE_URL
ARG GOOGLE_SERVICE_ACCOUNT_EMAIL
ARG GOOGLE_PRIVATE_KEY
ARG ABLY_API_KEY
ARG GCP_PROJECT_ID
ARG GCP_CLIENT_EMAIL
ARG GCP_CHAT_IMAGE_BUCKET_NAME
ARG GCP_PRIVATE_KEY
ARG UPSTASH_REDIS_REST_URL
ARG UPSTASH_REDIS_REST_TOKEN
ARG SKIP_ENV_VALIDATION
ARG CF_DELIVERY_ACCESS_TOKEN
ARG CF_SPACE_ID
ARG EMAIL_HOST
# ARG EMAIL_PORT
ARG EMAIL_USER
ARG EMAIL_PASSWORD
ARG EMAIL_FROM
ARG SUPPORT_EMAIL
ARG NEXT_PUBLIC_GEMINI_API_KEY
ARG AUTH_SECRET
ARG AUTH_GOOGLE_CLIENT_SECRET
ARG AUTH_GOOGLE_CLIENT_ID
ARG AUTH_URL
ARG RAZORPAY_KEY_ID
# ARG RAZORPAY_KEY_SECRET
# ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
# ARG RAZORPAY_WEBHOOK_SECRET


# ENV RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID
# ENV RAZORPAY_KEY_SECRET=$RAZORPAY_KEY_SECRET


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN \
    if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
    elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### RUNNER

FROM --platform=linux/amd64 gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["server.js"]