import os
import re

for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # The exact string to remove:
            # <p class="footer-location">SAVOIE • ALPES FRANÇAISES</p>
            # with possible whitespace around it
            pattern = re.compile(r'\s*<p class="footer-location">SAVOIE • ALPES FRANÇAISES</p>', re.MULTILINE)
            
            if pattern.search(content):
                new_content = pattern.sub('', content)
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Removed location from {filepath}")
