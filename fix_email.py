import os
import re

TARGET = 'a[href="mailto:maxime.perigny.50@gmail.com"]'
OLD_TAG = re.compile(
    r'<a\s+href="mailto:maxime\.perigny\.50@gmail\.com"\s+class="footer-email-block">(.*?)</a>',
    re.DOTALL
)
NEW_TAG = '<button type="button" class="footer-email-block">\n                    MAXIME.PERIGNY.50@GMAIL.COM\n                </button>'

count = 0
for root, _, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if 'footer-email-block' in content:
                new_content = OLD_TAG.sub(NEW_TAG, content)
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    count += 1
                    print(f"Updated: {filepath}")

print(f"\nDone: {count} files updated")
