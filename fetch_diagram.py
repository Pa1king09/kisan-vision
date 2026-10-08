import base64
import json
import urllib.request
import os

mermaid_code = """
graph TD
    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:white;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:white;
    classDef ml fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:white;
    classDef db fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:white;

    subgraph Presentation_Layer
        UI["User Browser"]
        React["React Frontend"]
    end

    subgraph Application_Layer
        Node["Node.js / Express Backend"]
        Auth["Auth & JWT"]
        AgroModules["Agronomic Modules"]
    end

    subgraph ML_Data_Layer
        Flask["Flask ML Microservice"]
        XGB["XGBoost Model"]
        SHAP["SHAP Explainer"]
        Mapper["Soil Input Mapper"]
        Mongo[("MongoDB")]
    end

    UI -->|"User Inputs"| React
    React -->|"HTTP POST"| Node
    Node --> Auth
    Node --> AgroModules
    Node -->|"Save History"| Mongo
    Node -->|"/predict"| Flask
    Flask --> Mapper
    Mapper --> XGB
    XGB --> SHAP
    SHAP -->|"Crop + SHAP Values"| Flask
    Flask -->|"Returns JSON"| Node
    Node -->|"Final Response"| React
    React -->|"Renders Dashboard"| UI

    class UI,React client;
    class Node,Auth,AgroModules backend;
    class Flask,XGB,SHAP,Mapper ml;
    class Mongo db;
"""

state = {
    "code": mermaid_code.strip(),
    "mermaid": {"theme": "default"}
}

json_state = json.dumps(state)
base64_state = base64.b64encode(json_state.encode('utf-8')).decode('utf-8')

url = f"https://mermaid.ink/img/{base64_state}"
output_file = "c:\\Users\\akash\\Downloads\\CROPVISION-AI-main\\CROPVISION-AI-main\\architecture_diagram.jpg"

try:
    print(f"Fetching from {url} ...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response, open(output_file, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print(f"Successfully saved to {output_file}")
except Exception as e:
    print(f"Error: {e}")
