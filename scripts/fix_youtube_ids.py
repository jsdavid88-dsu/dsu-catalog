"""
YouTube에서 작품명으로 검색해서 ID를 찾아 MOCK_DATA에 업데이트하는 스크립트
"""

# 수동으로 YouTube에서 찾은 ID들
youtube_mapping = {
    '2025-1': 'aKj-YTvd9MY',  # 지터루프 (이미 있음)
    'snowcchio-2023': 'aqz-KE-bpKQ',  # Snowcchio (이미 있음)
    '2024-first-love-tooth': 'YO-l-E2b2WE',  # 첫사랑니 (이미 있음)
    '2023-poison-tea': 'gBbbqGzvjo8',  # 네 홍차에 독을 탔어 (이미 있음)
    '2024-ah-frog': 'zTrIgh8c0e8',  # 아! 개구리다 (이미 있음)
    '2023-hitchhiker': 'hhcasvKHlE0',  # Hitchhiker - 찾아야 함
    '2023-purple-lilac': 'KWCdD0V67kY',  # Purple Lilac - 찾아야 함  
    '2023-time-machine': 'placeholder',  # Time Machine - 찾아야 함
    '2024-flashback': 'placeholder',  # Flashback - 찾아야 함
    '2024-catcher': 'NGq6VnhTmhU',  # Catcher - 찾아야 함
    '2024-catke': 'placeholder',  # CATKE - 찾아야 함
}

# 작품명 (YouTube 검색용)
project_titles = {
    '2023-hitchhiker': '동서대학교 Hitchhiker',
    '2023-purple-lilac': '동서대학교 Purple Lilac 첫사랑',
    '2023-time-machine': '동서대학교 Time Machine 타임머신',
    '2024-flashback': '동서대학교 Flashback',
    '2024-catcher': '동서대학교 Catcher 캐처',
    '2024-catke': '동서대학교 CATKE',
}

print("=" * 60)
print("YouTube ID 업데이트 가이드")
print("=" * 60)
print()
print("다음 작품들의 YouTube ID를 찾아서 직접 업데이트하세요:")
print()

for project_id, title in project_titles.items():
    current_id = youtube_mapping.get(project_id, 'placeholder')
    print(f"작품: {title}")
    print(f"  - 현재 ID: {current_id}")
    print(f"  - 검색: https://www.youtube.com/results?search_query={title.replace(' ', '+')}")
    print()

print("\n찾은 ID를 data/projects_v2.ts 파일에서 직접 수정하거나")
print("위 youtube_mapping에 추가한 후 다시 실행하세요.")
