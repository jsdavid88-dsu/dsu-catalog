"""
OCR 텍스트 확인 스크립트
"""
import sys
import io
import json
from pathlib import Path

# UTF-8 인코딩 강제 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def show_project_text(project_path):
    """프로젝트의 OCR 텍스트 표시"""
    json_path = project_path / "ocr_text.backup.json"

    if not json_path.exists():
        print(f"파일 없음: {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"\n{'='*80}")
    print(f"프로젝트: {data['title']}")
    print(f"연도: {data['year']}")
    print(f"페이지 수: {len(data['ocr_results'])}")
    print(f"{'='*80}\n")

    for page_name in sorted(data['ocr_results'].keys()):
        page_data = data['ocr_results'][page_name]
        full_text = page_data.get('full_text', '')

        print(f"\n--- {page_name} ---")
        print(full_text)
        print()

if __name__ == "__main__":
    # 첫 번째 프로젝트 표시
    project_path = Path("public/assets/projects/2023/snowcchio")
    show_project_text(project_path)
