# 1a. Create 2GB swap (critical for 1GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
# 1b. Install K3s (no extra flags — this is the fix for the crash)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --write-kubeconfig-mode=644" sh -
# 1c. Set up kubectl
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc
export KUBECONFIG=~/.kube/config
# 1d. Verify — you must see STATUS = Ready before continuing
kubectl get nodes
kubectl get pods -A
# 2a. Create namespace
cat > ~/namespace.yaml << 'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: portfolio
EOF

# 2b. Create Deployment
cat > ~/deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  namespace: portfolio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: portfolio
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
        - name: portfolio
          image: ashishlaheri/ubuntu-portfolio:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "50m"
              memory: "32Mi"
            limits:
              cpu: "200m"
              memory: "64Mi"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
EOF

# 2c. Create Service
cat > ~/service.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: portfolio
  namespace: portfolio
spec:
  type: ClusterIP
  selector:
    app: portfolio
  ports:
    - port: 80
      targetPort: 80
EOF

# 2d. Create Ingress — no hostname, works with plain EC2 IP
cat > ~/ingress.yaml << 'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  namespace: portfolio
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolio
                port:
                  number: 80
EOF

# 2e. Create HPA (scales at 70% CPU, max 5 pods)
cat > ~/hpa.yaml << 'EOF'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portfolio-hpa
  namespace: portfolio
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portfolio
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60
EOF

# 2f. Apply everything
kubectl apply -f ~/namespace.yaml
kubectl apply -f ~/deployment.yaml
kubectl apply -f ~/service.yaml
kubectl apply -f ~/ingress.yaml
kubectl apply -f ~/hpa.yaml
# 2g. Watch pod come up (takes 30-60s for image pull)
kubectl get pods -n portfolio -w
# 2h. Test your site
curl -I http://localhost
# 3a. Create monitoring namespace
cat > ~/mon-namespace.yaml << 'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
EOF

kubectl apply -f ~/mon-namespace.yaml
# 3b. Prometheus RBAC (permissions to scrape the cluster)
cat > ~/prometheus-rbac.yaml << 'EOF'
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: monitoring
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources: [nodes, nodes/proxy, nodes/metrics, services, endpoints, pods, namespaces]
    verbs: [get, list, watch]
  - apiGroups: ["networking.k8s.io"]
    resources: [ingresses]
    verbs: [get, list, watch]
  - nonResourceURLs: ["/metrics", "/metrics/cadvisor"]
    verbs: [get]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: monitoring
EOF

kubectl apply -f ~/prometheus-rbac.yaml
# 3c. Prometheus config (30s scrape interval — saves RAM)
cat > ~/prometheus-config.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 30s
      evaluation_interval: 30s
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9090']
      - job_name: 'kubernetes-nodes'
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
          insecure_skip_verify: true
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        kubernetes_sd_configs:
          - role: node
        relabel_configs:
          - action: labelmap
            regex: __meta_kubernetes_node_label_(.+)
      - job_name: 'kubernetes-cadvisor'
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
          insecure_skip_verify: true
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        kubernetes_sd_configs:
          - role: node
        relabel_configs:
          - action: labelmap
            regex: __meta_kubernetes_node_label_(.+)
          - target_label: __address__
            replacement: kubernetes.default.svc:443
          - source_labels: [__meta_kubernetes_node_name]
            regex: (.+)
            target_label: __metrics_path__
            replacement: /api/v1/nodes/$1/proxy/metrics/cadvisor
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: "true"
          - action: labelmap
            regex: __meta_kubernetes_pod_label_(.+)
          - source_labels: [__meta_kubernetes_namespace]
            action: replace
            target_label: kubernetes_namespace
          - source_labels: [__meta_kubernetes_pod_name]
            action: replace
            target_label: kubernetes_pod_name
EOF

kubectl apply -f ~/prometheus-config.yaml
# 3d. Prometheus Deployment + PVC + Service
cat > ~/prometheus.yaml << 'EOF'
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-pvc
  namespace: monitoring
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      securityContext:
        runAsUser: 65534
        runAsGroup: 65534
        fsGroup: 65534
      containers:
        - name: prometheus
          image: prom/prometheus:v2.51.2
          args:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus"
            - "--storage.tsdb.retention.time=24h"
            - "--storage.tsdb.retention.size=800MB"
            - "--web.enable-lifecycle"
          ports:
            - containerPort: 9090
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "400m"
              memory: "256Mi"
          volumeMounts:
            - name: config
              mountPath: /etc/prometheus
            - name: data
              mountPath: /prometheus
          livenessProbe:
            httpGet:
              path: /-/healthy
              port: 9090
            initialDelaySeconds: 30
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /-/ready
              port: 9090
            initialDelaySeconds: 15
            periodSeconds: 10
      volumes:
        - name: config
          configMap:
            name: prometheus-config
        - name: data
          persistentVolumeClaim:
            claimName: prometheus-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
spec:
  type: ClusterIP
  selector:
    app: prometheus
  ports:
    - port: 9090
      targetPort: 9090
EOF

kubectl apply -f ~/prometheus.yaml
# 3e. Grafana — exposed on port 3000 (NodePort, no tunnel needed)
cat > ~/grafana.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus.monitoring.svc.cluster.local:9090
        isDefault: true
        editable: false
        jsonData:
          timeInterval: "30s"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      securityContext:
        runAsUser: 472
        runAsGroup: 472
        fsGroup: 472
      containers:
        - name: grafana
          image: grafana/grafana:10.4.2
          ports:
            - containerPort: 3000
          env:
            - name: GF_SECURITY_ADMIN_USER
              value: "admin"
            - name: GF_SECURITY_ADMIN_PASSWORD
              value: "Admin@1234"
            - name: GF_ANALYTICS_REPORTING_ENABLED
              value: "false"
            - name: GF_ANALYTICS_CHECK_FOR_UPDATES
              value: "false"
            - name: GF_INSTALL_PLUGINS
              value: ""
            - name: GF_USERS_ALLOW_SIGN_UP
              value: "false"
            - name: GF_PATHS_PROVISIONING
              value: "/etc/grafana/provisioning"
          resources:
            requests:
              cpu: "50m"
              memory: "80Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          volumeMounts:
            - name: datasources
              mountPath: /etc/grafana/provisioning/datasources
      volumes:
        - name: datasources
          configMap:
            name: grafana-datasources
            items:
              - key: datasources.yaml
                path: datasources.yaml
      livenessProbe:
        httpGet:
          path: /api/health
          port: 3000
        initialDelaySeconds: 30
        periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 3000
EOF

kubectl apply -f ~/grafana.yaml
# 3f. Watch monitoring pods (allow 3-5 min for image pulls)
kubectl get pods -n monitoring -w
kubectl get pods
kubectl get pods -monitoring
kubectl get pods -n monitoring
# Check all pods are healthy
kubectl get pods -A
# Check your portfolio site is live
curl -I http://localhost
# Check HPA is reading CPU metrics (not <unknown>)
kubectl get hpa -n portfolio
cat > ~/grafana.yaml << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: monitoring
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus.monitoring.svc.cluster.local:9090
        isDefault: true
        editable: false
        jsonData:
          timeInterval: "30s"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      securityContext:
        runAsUser: 472
        runAsGroup: 472
        fsGroup: 472
      containers:
        - name: grafana
          image: grafana/grafana:10.4.2
          ports:
            - containerPort: 3000
          env:
            - name: GF_SECURITY_ADMIN_USER
              value: "admin"
            - name: GF_SECURITY_ADMIN_PASSWORD
              value: "Admin@1234"
            - name: GF_ANALYTICS_REPORTING_ENABLED
              value: "false"
            - name: GF_ANALYTICS_CHECK_FOR_UPDATES
              value: "false"
            - name: GF_INSTALL_PLUGINS
              value: ""
            - name: GF_USERS_ALLOW_SIGN_UP
              value: "false"
            - name: GF_PATHS_PROVISIONING
              value: "/etc/grafana/provisioning"
          resources:
            requests:
              cpu: "50m"
              memory: "80Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          volumeMounts:
            - name: datasources
              mountPath: /etc/grafana/provisioning/datasources
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 20
      volumes:
        - name: datasources
          configMap:
            name: grafana-datasources
            items:
              - key: datasources.yaml
                path: datasources.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 3000
EOF

kubectl apply -f ~/grafana.yaml
# Watch it come up (takes 1-2 min for image pull)
kubectl get pods -n monitoring -w
curl -s https://checkip.amazonaws.com
kubectl get pods -n monitoring -w
# Delete the broken service and recreate with valid port
kubectl delete service grafana -n monitoring 2>/dev/null; echo "done"
cat > ~/grafana-svc.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30000
EOF

kubectl apply -f ~/grafana-svc.yaml
# Confirm service is created
kubectl get svc -n monitoring
history
kubectl get svc -n monitoring
kubectl get ns
kubectl get pods -n portfolio
kubectl get pods -n kube-system
ls
cat ingress.yaml
cat prometheus.yaml
kubectl get ns
ls
cat deployement.yaml
cat deployment.yaml
kubectl get svc
kubectl get svc -n monitoring
kubectl get svc -n portfolio
sudo apt install tmux
cat > ~/prometheus-nodeport.yaml << 'EOF'
apiVersion: v1
kind: Service
metadata:
  name: prometheus-nodeport
  namespace: monitoring
spec:
  type: NodePort
  selector:
    app: prometheus
  ports:
    - port: 9090
      targetPort: 9090
      nodePort: 30090
EOF

kubectl apply -f ~/prometheus-nodeport.yaml
ls
# Check if Prometheus pod is still alive
kubectl get pods -n monitoring
# Check if Prometheus is actually collecting data
kubectl port-forward svc/prometheus 9090:9090 -n monitoring &
sleep 3
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool | grep -E '"health"|"job"'
# Kill the port-forward after
kill %1
kubectl logs deployment/prometheus -n monitoring --previous | tail -30
# Check disk space on the node
df -h
# Check the PVC
kubectl get pvc -n monitoring
# Step 1 — Delete the Prometheus deployment and PVC (wipes the corrupted WAL)
kubectl delete deployment prometheus -n monitoring
kubectl delete pvc prometheus-pvc -n monitoring
# Step 2 — Wait for PVC to be fully deleted
kubectl get pvc -n monitoring
# Should show: No resources found
kubectl get pvc -n monitoring
cat > ~/prometheus-fixed.yaml << 'EOF'
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-pvc
  namespace: monitoring
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      securityContext:
        runAsUser: 65534
        runAsGroup: 65534
        fsGroup: 65534
      containers:
        - name: prometheus
          image: prom/prometheus:v2.51.2
          args:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus"
            - "--storage.tsdb.retention.time=12h"
            - "--storage.tsdb.retention.size=500MB"
            - "--storage.tsdb.wal-compression"
            - "--web.enable-lifecycle"
          ports:
            - containerPort: 9090
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "400m"
              memory: "256Mi"
          volumeMounts:
            - name: config
              mountPath: /etc/prometheus
            - name: data
              mountPath: /prometheus
          livenessProbe:
            httpGet:
              path: /-/healthy
              port: 9090
            initialDelaySeconds: 90
            periodSeconds: 15
            failureThreshold: 5
          readinessProbe:
            httpGet:
              path: /-/ready
              port: 9090
            initialDelaySeconds: 60
            periodSeconds: 10
      volumes:
        - name: config
          configMap:
            name: prometheus-config
        - name: data
          persistentVolumeClaim:
            claimName: prometheus-pvc
EOF

kubectl apply -f ~/prometheus-fixed.yaml
# Step 4 — Watch it come up (allow 2-3 minutes this time)
kubectl get pods -n monitoring -w
ls
cat grafana.yaml
ls
kubectl get ns
kubectl get pods -n monitoring
kubectl describe pods prometheus-64454d8dcf-kzqc8
kubectl describe pods -n monitoring prometheus-64454d8dcf-kzqc8
kubectl get pods -n monitoring
kubectl get cm
kubectl get ns
kubectl get pods -n portfolio
kubectl get pods -n monitoring
watch -n 0.1 kubectl describe pods -n monitoring prometheus-64454d8dcf-kzqc8
ls
kubectl  get ns
kubectl get pods -n monitoring
kubectl describe pods -n monitoring prometheus-64454d8dcf-kzqc8
