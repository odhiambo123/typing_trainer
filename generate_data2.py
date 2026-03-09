import json

def compile_data():
    # Mode A: Kubernetes Commands
    verbs = ["kubectl get", "kubectl describe", "kubectl logs", "kubectl apply -f"]
    targets = ["pods", "deployments", "services", "nodes", "configmaps"]
    flags = ["-A", "-o yaml", "--watch", "-n kube-system"]
    k8s_list = [f"{v} {t} {f}" for v in verbs for t in targets for f in flags]

    # Mode B: Regular English Practice
    english_list = [
        "The quick brown fox jumps over the lazy dog.",
        "Precision measurement is the foundation of hardware engineering.",
        "Successful lab technicians prioritize safety and accuracy.",
        "Computational science bridges the gap between math and logic.",
        "Standard operating procedures ensure consistent results in the lab."
    ]

    output = {
        "k8s": k8s_list,
        "regular": english_list
    }

    with open('practice_data.json', 'w') as f:
        json.dump(output, f, indent=4)
    print("Generated dual-mode practice data.")

if __name__ == "__main__":
    compile_data()