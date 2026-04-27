# Ephemeral Node test runner with the `claw` binary baked in.
# Built and torn down per `run.sh` invocation; we don't want a Node toolchain
# on the host. The claw binary is copied from the locally-built claw-code
# image so we don't pay another cargo --release.
#
# Zero npm dependencies — tests run on Node's built-in test runner (`node --test`)
# against ESM sources, so there's no `npm install` layer to bust.

FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Reuse the binary the lab already builds for the agent client.
COPY --from=claw-code:local /usr/local/bin/claw /usr/local/bin/claw

WORKDIR /test

COPY package.json  ./
COPY lib           ./lib
COPY __tests__     ./__tests__
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

RUN mkdir -p /workspace

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "--test", "--test-concurrency=1", "--test-reporter=spec"]
