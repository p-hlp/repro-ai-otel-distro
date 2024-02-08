# AppInsights SDK / Azure OTel Distro Repro

Reproduces the issue mentioned in [#2266](https://github.com/microsoft/ApplicationInsights-JS/issues/2266).

1. Create `.env` files in `frontend` & `backend`. Copy from `.env.template` and add connection strings of the AI resources.
2. Start mongo container with `docker compose up -d`.
3. Install dependencies at `/frontend` and `/backend` with `yarn`.
4. Start applications at `/frontend` and `/backend` with `yarn dev`.
