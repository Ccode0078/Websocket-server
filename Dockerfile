# -------- 1) Build the React app (frontend/chat-client) --------
FROM node:18-alpine AS webbuild
WORKDIR /frontend
COPY frontend/chat-client/package*.json ./
RUN npm ci
COPY frontend/chat-client/ ./
RUN npm run build

# -------- 2) Build the Spring Boot app in backend/server --------
FROM maven:3.9.9-eclipse-temurin-17 AS mvnbuild
WORKDIR /app

# cache deps
COPY backend/server/pom.xml ./pom.xml
RUN mvn -B -q -DskipTests dependency:go-offline

# copy sources + inject React build into Spring static
COPY backend/server/src ./src
COPY --from=webbuild /frontend/build ./src/main/resources/static

# package the fat jar
RUN mvn -B -DskipTests package

# -------- 3) Runtime image --------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=mvnbuild /app/target/*.jar app.jar
ENV JAVA_OPTS=""
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]


