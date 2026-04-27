# Build claw-code from source, ship a slim runtime image.
# Upstream: https://github.com/ultraworkers/claw-code

FROM rust:bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        libssl-dev \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

ARG CLAW_REPO=https://github.com/ultraworkers/claw-code
ARG CLAW_REF=main

RUN git clone "${CLAW_REPO}" /src/claw-code \
    && git -C /src/claw-code checkout "${CLAW_REF}"

WORKDIR /src/claw-code/rust
RUN cargo build --release --workspace

# ---

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        libssl3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /src/claw-code/rust/target/release/claw /usr/local/bin/claw

WORKDIR /workspace
