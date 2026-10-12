# Multi-stage Dockerfile for Spring Boot Application on Render
# Stage 1: Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and POM
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Production runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root application user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Render injects PORT dynamically (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar /app/app.jar"]
