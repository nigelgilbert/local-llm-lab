# Ephemeral Node test runner with the `claw` binary baked in.
# Built and torn down per `run.sh` invocation; we don't want a Node toolchain
# on the host. The claw binary is copied from the locally-built claw-code
# image so we don't pay another cargo --release.

FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Reuse the binary the lab already builds for the agent client.
COPY --from=claw-code:local /usr/local/bin/claw /usr/local/bin/claw

WORKDIR /test

COPY package.json jest.config.js ./
RUN npm install

COPY lib       ./lib
COPY __tests__ ./__tests__

RUN mkdir -p /workspace

CMD ["npx", "jest", "--config=jest.config.js"]
