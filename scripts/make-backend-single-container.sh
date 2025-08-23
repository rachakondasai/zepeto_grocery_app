#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
BACK="$ROOT/backend"
cat > "$BACK/start.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
JAVA=${JAVA:-java}
JAR_DIR="$(cd "$(dirname "$0")" && pwd)"
log(){ echo "[$(date +%H:%M:%S)] $*"; }

$JAVA -jar "$JAR_DIR/service-registry/target/"*.jar &
sleep 4

for mod in auth-service user-service product-service cart-service order-service admin-service search-service store-service ; do
  log "starting $mod"
  EUREKA_SERVER_URL=http://localhost:8761/eureka $JAVA -jar "$JAR_DIR/$mod/target/"*.jar &
  sleep 2
done

log "starting gateway (foreground)"
EUREKA_SERVER_URL=http://localhost:8761/eureka exec $JAVA -jar "$JAR_DIR/api-gateway/target/"*.jar
EOF
chmod +x "$BACK/start.sh"

cat > "$BACK/Dockerfile.allinone" <<'EOF'
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /src
COPY ./pom.xml ./
COPY ./service-registry ./service-registry
COPY ./api-gateway ./api-gateway
COPY ./auth-service ./auth-service
COPY ./user-service ./user-service
COPY ./product-service ./product-service
COPY ./cart-service ./cart-service
COPY ./order-service ./order-service
COPY ./admin-service ./admin-service
COPY ./search-service ./search-service
COPY ./store-service ./store-service
RUN mvn -B -f ./pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app/backend
COPY --from=build /src /app/backend
COPY ./start.sh /app/backend/start.sh
RUN chmod +x /app/backend/start.sh
EXPOSE 8080
ENV JAVA_OPTS=""
CMD ["sh","-c","$JAVA_OPTS /app/backend/start.sh"]
EOF

echo "✅ Created Dockerfile.allinone and start.sh"
