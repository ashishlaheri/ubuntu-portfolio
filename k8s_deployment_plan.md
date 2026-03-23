# The Ultimate Portfolio DevOps Playbook

This is the end-to-end blueprint to take your Dockerized Portfolio from your local machine to a fully monitored, production-like Kubernetes cluster on AWS EC2. **This setup includes Prometheus and Grafana, which will dramatically impress technical recruiters.**

*(Assumption: You have already run `docker push yourusername/ubuntu-portfolio:latest` on your local laptop).*

---

## Phase 1: AWS EC2 Provisioning & Basics
Kubernetes is hungry for RAM. Do not use a `t2.micro` (Free Tier) as Prometheus will crash it.
1. **Launch an Instance:** Choose Ubuntu 22.04 on a `t3.medium` or `t3.large`.
2. **Security Groups:** Open the following ports to the public (`0.0.0.0/0`):
   - `22` (SSH - for you)
   - `80` (HTTP - for your portfolio)
   - `443` (HTTPS - optional, if you add an SSL certificate later)
   - `3000` (Grafana Dashboard - so recruiters can see your monitoring!)
3. **SSH into the EC2 Instance** and install Docker, Minikube, and `kubectl`.
   *(I strongly recommend installing `helm` as well—the package manager for Kubernetes).*
4. **Start the Cluster:**
   ```bash
   minikube start --driver=docker --memory=3000 --cpus=2
   ```

## Phase 2: Deploy the Portfolio (The "Classic" App)
Now that your EC2 server has an empty Kubernetes cluster running, we deploy your app from Docker Hub.

1. **Create [deployment.yaml](file:///c:/Users/yoash/Desktop/ubuntu-portfolio%20-%20gemini/k8s/deployment.yaml)** (This tells K8s to download your image and run 2 replicas).
2. **Create [service.yaml](file:///c:/Users/yoash/Desktop/ubuntu-portfolio%20-%20gemini/k8s/service.yaml)** (This is an internal load balancer for those replicas).
3. **Apply the manifests:**
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```
4. **Verify it is running:**
   ```bash
   kubectl get pods
   ```
   *(You should see 2 pods in a "Running" state).*

## Phase 3: The Front Door (Ingress Controller)
Minikube's network is trapped inside your EC2 instance. We need a way to forward the internet's traffic on Port 80 directly to your 2 pods. 

1. **Enable the NGINX Ingress Controller** inside K8s:
   ```bash
   minikube addons enable ingress
   ```
2. **Create [ingress.yaml](file:///c:/Users/yoash/Desktop/ubuntu-portfolio%20-%20gemini/k8s/ingress.yaml)** (This tells the Controller to map all incoming traffic on `/` to your [service.yaml](file:///c:/Users/yoash/Desktop/ubuntu-portfolio%20-%20gemini/k8s/service.yaml)).
3. **Punch the Hole:** Run this command on your EC2 terminal to bridge the gap:
   ```bash
   sudo kubectl port-forward --address 0.0.0.0 svc/portfolio-service 80:80 &
   ```
   *(Now, visiting your EC2 Public IP address will show your Ubuntu Portfolio!)*

## Phase 4: DevOps Flex (Prometheus & Grafana)
This is where you go from "Frontend Developer" to "Full-Stack Engineer with DevOps capabilities." We will install a monitoring stack to track the CPU and RAM usage of your portfolio pods.

1. **Install Helm** (if you haven't already).
2. **Add the Prometheus Community Repository:**
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   ```
3. **Install the entire monitoring stack** with one command:
   ```bash
   helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
   ```
   *(This deploys Prometheus to scrape metrics from your EC2 instance and your Pods, and Grafana to visualize them).*
4. **Expose Grafana to the Public:**
   ```bash
   sudo kubectl port-forward --address 0.0.0.0 -n monitoring svc/monitoring-grafana 3000:80 &
   ```
   *(Now, visiting `http://<EC2-PUBLIC-IP>:3000` will show a beautiful Grafana dashboard. The default login is usually `admin` / `prom-operator`).*

## Phase 5: CI/CD Automation (GitHub Actions)
For the final touch, you set up a `.github/workflows/deploy.yml` pipeline.
When you push code to GitHub:
1. GitHub Actions will run `npm run build` and `docker build`.
2. It pushes the new image to Docker Hub.
3. It securely SSH's into your EC2 instance (using an AWS key stored in GitHub Secrets).
4. It tells your EC2 instance to run: `kubectl rollout restart deployment/portfolio-deployment`.

This ensures your live site always matches your `main` branch with zero downtime!

---

**Next Steps:**
Read through this massive playbook. Whenever you launch your EC2 instance, I can guide you through each of these phases one by one, providing the exact [.yaml](file:///c:/Users/yoash/Desktop/ubuntu-portfolio%20-%20gemini/k8s/service.yaml) code for that specific phase!
