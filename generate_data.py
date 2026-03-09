import json

def compile_data():
    verbs = ["kubectl get", "kubectl describe", "kubectl logs", "kubectl apply -f"]
    targets = ["pods", "deployments", "services", "nodes", "configmaps"]
    flags = ["-A", "-o wide", "--watch", "--all-namespaces"]

    # Generate the flat list
    massive_list = [f"{v} {t} {f}" for v in verbs for t in targets for f in flags]

    output = {
        "metadata": {"total": len(massive_list)},
        "sentences": massive_list
    }

    with open('practice_data.json', 'w') as f:
        json.dump(output, f, indent=4)
    print(f"Restored to flat JSON with {len(massive_list)} commands.")

if __name__ == "__main__":
    compile_data()