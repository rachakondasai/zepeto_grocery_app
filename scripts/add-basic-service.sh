#!/usr/bin/env bash
# Usage: ./add-basic-service.sh <service-name> <port>
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <service-name> <port>"
  exit 1
fi

SVC="$1"
PORT="$2"
ROOT="${ROOT:-.}"

SVC_DIR="$ROOT/backend/$SVC"
PKG_NAME="com.grocery.${SVC//-}"
PKG_DIR="$SVC_DIR/src/main/java/${PKG_NAME//.//}"
RES_DIR="$SVC_DIR/src/main/resources"

mkdir -p "$PKG_DIR" "$RES_DIR"

# Build CamelCase class name using awk (portable)
CLASS_NAME="$(echo "$SVC" | awk -F'-' '{for(i=1;i<=NF;i++){printf toupper(substr($i,1,1)) substr($i,2)}}')Application"

cat > "$SVC_DIR/pom.xml" <<EOF
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.grocery</groupId>
    <artifactId>grocery-backend</artifactId>
    <version>1.0.0</version>
  </parent>
  <artifactId>$SVC</artifactId>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
EOF

cat > "$RES_DIR/application.yml" <<EOF
server:
  port: $PORT

spring:
  application:
    name: $SVC

eureka:
  client:
    service-url:
      defaultZone: \${EUREKA_SERVER_URL:http://localhost:8761/eureka}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
EOF

cat > "$PKG_DIR/${CLASS_NAME}.java" <<EOF
package $PKG_NAME;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ${CLASS_NAME} {
    public static void main(String[] args) {
        SpringApplication.run(${CLASS_NAME}.class, args);
    }
}

@RestController
@RequestMapping("/$SVC")
class BasicController {
    @GetMapping("/health")
    public String health() { return "ok"; }

    @GetMapping("/info")
    public String info() { return "$SVC:ready"; }
}
EOF

"$PWD/$(dirname "$0")/update-gateway-routes.sh" "$ROOT" || true

echo "$SVC written."
