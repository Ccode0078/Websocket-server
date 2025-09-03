# -------- 1) Build the React app (frontend/chat-client) --------
FROM node:18-alpine AS webbuild
WORKDIR /frontend
# copy only package files first for better caching
COPY frontend/chat-client/package*.json ./
RUN npm ci
# now copy the rest and build
COPY frontend/chat-client/ .
RUN npm run build

# -------- 2) Build the Spring Boot app at repo root (Java 17 + Maven) --------
FROM maven:3.9.9-eclipse-temurin-17 AS mvnbuild
WORKDIR /app
# cache deps
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
# copy sources + inject React build into Spring static
COPY src ./src
COPY --from=webbuild /frontend/build ./src/main/resources/static
# package the fat jar
RUN mvn -B -DskipTests package

# -------- 3) Runtime image --------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# if the wildcard ever fails, replace with the exact jar name you see in logs
COPY --from=mvnbuild /app/target/*.jar app.jar
ENV JAVA_OPTS=""
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
