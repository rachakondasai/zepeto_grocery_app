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
