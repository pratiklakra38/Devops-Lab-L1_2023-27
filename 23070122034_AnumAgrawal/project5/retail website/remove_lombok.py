import os
import re

lombok_annotations = ["@Data", "@Builder", "@NoArgsConstructor", "@AllArgsConstructor", "@Getter", "@Setter"]
lombok_imports = ["import lombok.AllArgsConstructor;", "import lombok.Builder;", "import lombok.Data;", "import lombok.NoArgsConstructor;", "import lombok.Getter;", "import lombok.Setter;"]

def get_fields(content):
    fields = []
    # Match basic field declarations like: private String name; or private Integer qty = 0;
    # Ignoring annotations above them.
    lines = content.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('private '):
            # Example: private String username;
            # Example: @Builder.Default private Integer points = 0;
            parts = line.split()
            if 'private' in parts:
                idx = parts.index('private')
                if len(parts) > idx + 2:
                    type_name = parts[idx + 1]
                    field_name = parts[idx + 2].replace(';', '')
                    if '=' in field_name:
                        field_name = field_name.split('=')[0]
                    fields.append((type_name, field_name))
    return fields

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if not any(ann in content for ann in lombok_annotations):
        return

    print(f"Processing {filepath}")
    
    # Remove imports
    for imp in lombok_imports:
        content = content.replace(imp + "\n", "")
        content = content.replace(imp, "")

    # Remove annotations
    for ann in lombok_annotations:
        content = re.sub(ann + r'\s*\n?', '', content)
    
    # Remove @Builder.Default
    content = content.replace("@Builder.Default\n", "")
    content = content.replace("@Builder.Default", "")

    fields = get_fields(content)

    # Generate Getters and Setters
    methods = "\n"
    
    # Generate Default Constructor
    class_name = re.search(r'public class (\w+)', content).group(1)
    methods += f"    public {class_name}() {{}}\n\n"

    for t, n in fields:
        cap_n = n[0].upper() + n[1:]
        methods += f"    public {t} get{cap_n}() {{\n        return {n};\n    }}\n\n"
        methods += f"    public void set{cap_n}({t} {n}) {{\n        this.{n} = {n};\n    }}\n\n"

    # Insert methods before the last closing brace
    last_brace = content.rfind('}')
    if last_brace != -1:
        content = content[:last_brace] + methods + content[last_brace:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('src/main/java'):
    for file in files:
        if file.endswith('.java'):
            process_file(os.path.join(root, file))
