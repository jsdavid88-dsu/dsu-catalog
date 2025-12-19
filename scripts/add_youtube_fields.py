import re

# Read the file
with open('data/projects_v2.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the missing fields before each youtubeId
replacement = '''trailerYoutubeId: "",
        fullYoutubeId: "",
        youtubeId:'''

content = content.replace('youtubeId:', replacement)

# Write back
with open('data/projects_v2.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Added trailerYoutubeId and fullYoutubeId fields to all projects')
