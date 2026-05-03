import os
import re

# List of emojis and patterns to remove from headings
patterns = [
    r'📺\s*',
    r'🛠️\s*',
    r'👥\s*',
    r'📸\s*',
    r'🏷️\s*',
    r'🤝\s*',
    r'🚴\s*',
    r'🏔️\s*',
    r'🏆\s*',
    r'🎬\s*',
    r'\s*🏔️', # For "Le décor est posé 🏔️"
]

def clean_content(content):
    # Regex to find content inside <h1...>, <h2...>, <h3...>
    def replace_heading(match):
        tag_open = match.group(1)
        text = match.group(2)
        tag_close = match.group(3)
        
        # Remove emojis from text
        for p in patterns:
            text = re.sub(p, '', text)
        
        return f"{tag_open}{text}{tag_close}"

    # Match <h1...>, <h2...>, <h3...> tags and their content
    content = re.sub(r'(<h[123][^>]*>)(.*?)(</h[123]>)', replace_heading, content, flags=re.DOTALL)
    return content

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                print(f"Processing {path}...")
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = clean_content(content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"  Updated {path}")

if __name__ == "__main__":
    # Process projets directory
    process_directory('projets')
    # Process projects.html
    if os.path.exists('projects.html'):
        print("Processing projects.html...")
        with open('projects.html', 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = clean_content(content)
        if new_content != content:
            with open('projects.html', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("  Updated projects.html")
