# Sports API Architecture Implementation

This document outlines the implementation of a scalable and highly available architecture for a **Sports API** using AWS services and containerization. The architecture includes API Gateway, ECS Service, Elastic Load Balancer (ALB), and integration with the **Sportdata.io API**.

![ECS drawio](https://github.com/user-attachments/assets/f851f988-288a-4063-8893-f920c7e5d49b)

---

## Architecture Overview

The system consists of the following components:

1. **Client/User**:  
   Users interact with the system through a web client, sending requests to the Sports API.

2. **API Gateway**:  
   Serves as the entry point for client requests, providing a unified and secure access layer.

3. **Application Load Balancer (ALB)**:  
   Distributes incoming traffic across multiple ECS tasks running the Sports API container service.

4. **ECS (Elastic Container Service)**:  
   Hosts the Sports API as a Dockerized container, scaling tasks based on demand.

5. **Sports API Container Service**:  
   The containerized Node.js application interacts with the **Sportdata.io API** to fetch game data.

6. **Sportdata.io API**:  
   Third-party API providing detailed sports data.

---

## Implementation Steps

### 1. Node.js Sports API Development
- **Developed a Node.js Application**:  
  The API fetches NBA game data from Sportdata.io for a specified date.  
  - **Endpoint**: `https://api.sportsdata.io/v3/nba/scores/json/GamesByDateFinal/{date}`  
  - **Tools Used**: Express.js, Axios, dotenv.  
  - **Environment Variables**: API keys are stored securely in a `.env` file.

- **Dockerized the Application**:  
  Created a `Dockerfile` to containerize the application.  
  Example:
  ```dockerfile
  FROM node:16-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

### 2. API Gateway Configuration
- **Deployed an API Gateway**:  
  - Configured to route client requests to the Application Load Balancer.
  - Enabled throttling and caching for improved performance and security.

### 3. Application Load Balancer (ALB) Setup
- **ALB Configuration**:  
  - Configured ALB to route requests to ECS tasks running the Sports API container.
  - Target group includes all ECS tasks.

### 4. ECS Service Deployment
- **ECS Cluster Creation**:  
  Created an ECS cluster with Fargate launch type for serverless container hosting.

- **Task Definition**:  
  Defined a task for the Sports API container with required resource limits and environment variables.

- **Service Configuration**:  
  Configured ECS Service to:
  - Auto-scale tasks based on CPU and memory usage.
  - Maintain high availability.

### 5. Environment Variable Management
- **AWS Secrets Manager**:  
  Used to securely manage and retrieve API keys for the Sports API.

### 6. Monitoring and Logging
- **CloudWatch Integration**:  
  Configured logging for ECS tasks and ALB to monitor API usage and errors.

---

## Deployment Instructions

### Step 1: Build and Push Docker Image
```bash
docker build -t sports-api .
docker tag sports-api:latest <AWS_ECR_URI>/sports-api:latest
docker push <AWS_ECR_URI>/sports-api:latest
```

### Step 2: Deploy ECS Service
1. Create an ECS cluster.
2. Define a task in ECS with the Docker image and environment variables.
3. Create an ECS service linked to the ALB target group.

### Step 3: Set Up API Gateway
1. Configure routes to forward traffic to the ALB.
2. Deploy the API Gateway.

---

## Example Usage

### API Request
**Endpoint**:  
```
https://<API_GATEWAY_URL>/games/2023-12-25
```

**Response**:  
```json
[
  {
    "GameID": 12345,
    "HomeTeam": "Lakers",
    "AwayTeam": "Warriors",
    "DateTime": "2023-12-25T20:00:00"
  },
  ...
]
```

---

## Challenges and Solutions

1. **Load Balancing**:  
   Solution: Used ALB to distribute traffic evenly across ECS tasks.

2. **Scaling**:  
   Solution: Enabled auto-scaling on ECS to handle peak traffic loads.

3. **Secure API Keys**:  
   Solution: Managed sensitive keys using AWS Secrets Manager.

4. **Third-Party API Rate Limiting**:  
   Solution: Implemented caching at the API Gateway level.

---

## Conclusion

This architecture ensures a scalable, secure, and high-performance deployment of the Sports API. It leverages AWS services and containerization best practices to provide a reliable solution for sports data integration.

--- 
