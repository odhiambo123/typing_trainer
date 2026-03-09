import json

def compile_data():
    # Expanded for LFS158 and CKA Prep
    verbs = ["kubectl get", "kubectl describe", "kubectl logs", "kubectl delete", "kubectl apply -f"]
    targets = ["pods", "deployments", "services", "nodes", "configmaps", "secrets", "namespaces"]
    flags = ["-A", "-o wide", "--watch", "--all-namespaces", "--force --grace-period=0", "-n kube-system"]

    # Generate massive list
    massive_list = [f"{v} {t} {f}" for v in verbs for t in targets for f in flags]

    output = {
        "metadata": {
            "total": len(massive_list),
            "last_updated": "2026-02-17"
        },
        "sentences": massive_list
    }

    with open('practice_data.json', 'w') as f:
        json.dump(output, f, indent=4)
    print(f"Generated {len(massive_list)} high-fidelity Kubernetes commands.")

if __name__ == "__main__":
    compile_data()