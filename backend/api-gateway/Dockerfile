# ===== Build stage =====
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy backend parent and all modules (for dependency resolution)
COPY ../pom.xml ./
COPY ../service-registry/pom.xml ./service-registry/pom.xml
COPY ../api-gateway/pom.xml ./api-gateway/pom.xml
COPY ../auth-service/pom.xml ./auth-service/pom.xml
COPY ../user-service/pom.xml ./user-service/pom.xml
COPY ../product-service/pom.xml ./product-service/pom.xml
COPY ../cart-service/pom.xml ./cart-service/pom.xml
COPY ../order-service/pom.xml ./order-service/pom.xml
COPY ../admin-service/pom.xml ./admin-service/pom.xml
COPY ../search-service/pom.xml ./search-service/pom.xml
COPY ../store-service/pom.xml ./store-service/pom.xml

# Copy source for gateway only (faster build)
COPY ./src ./api-gateway/src

# Package only the gateway (also builds dependencies if needed)
RUN mvn -B -f ./pom.xml -pl api-gateway -am clean package -DskipTests

# ===== Run stage =====
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS=""
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
