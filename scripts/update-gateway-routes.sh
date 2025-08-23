#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
GW_DIR="$ROOT/backend/api-gateway/src/main/resources"
mkdir -p "$GW_DIR"

ROUTES_YAML=""
for dir in "$ROOT"/backend/*-service ; do
  [ -d "$dir" ] || continue
  svc="$(basename "$dir")"
  ROUTES_YAML+="        - id: ${svc}\n"
  ROUTES_YAML+="          uri: lb://${svc}\n"
  ROUTES_YAML+="          predicates:\n"
  ROUTES_YAML+="            - Path=/${svc}/**, /${svc}/health\n"
  ROUTES_YAML+="          filters:\n"
  ROUTES_YAML+="            - StripPrefix=0\n"
done

cat > "$GW_DIR/application.yml" <<EOF
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      default-filters:
        - RemoveResponseHeader=Server
      routes:
$(printf "%b" "${ROUTES_YAML}")
eureka:
  client:
    service-url:
      defaultZone: \${EUREKA_SERVER_URL:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: health,info
EOF

echo "Updated gateway routes."
