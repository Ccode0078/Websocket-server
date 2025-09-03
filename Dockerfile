# ---------- 1) Build the React app ----------
FROM node:18-alpine AS webbuild
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---------- 2) Build the Spring Boot app (Maven + Java 17) ----------
FROM maven:3.9.9-eclipse-temurin-17 AS mvnbuild
WORKDIR /backend
COPY backend/pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
COPY backend/src ./src
COPY --from=webbuild /frontend/build ./src/main/resources/static
RUN mvn -B -DskipTests package

# ---------- 3) Runtime image ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=mvnbuild /backend/target/*.jar app.jar
ENV JAVA_OPTS=""
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
