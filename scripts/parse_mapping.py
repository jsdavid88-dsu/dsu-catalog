"""
artbook_mapping.md를 파싱하여 프로젝트별 페이지 범위를 추출하는 스크립트
"""
import re
from typing import Dict, List, Tuple

def parse_artbook_mapping(mapping_file: str) -> Dict[str, List[Dict]]:
    """
    artbook_mapping.md 파일을 파싱하여 프로젝트 정보를 반환

    Returns:
        {
            "2023": [
                {
                    "title": "Snowcchio (스노키오)",
                    "pages": (3, 13),
                    "pdf": "assets/2023_Artbook_Ebook.pdf"
                },
                ...
            ],
            "2024": [...]
        }
    """
    with open(mapping_file, 'r', encoding='utf-8') as f:
        content = f.read()

    result = {}
    current_year = None
    current_pdf = None

    # 패턴: ## 2024 Artbook (2024_Artbook_HQ.pdf)
    year_pattern = re.compile(r'## (\d{4}) Artbook \((.+?\.pdf)\)')
    # 패턴: - **First Love Tooth (첫사랑니)**: Page 33 - 42
    project_pattern = re.compile(r'- \*\*(.+?)\*\*: Page (\d+) - (\d+)')

    for line in content.split('\n'):
        # 연도 및 PDF 파일 파싱
        year_match = year_pattern.match(line)
        if year_match:
            current_year = year_match.group(1)
            pdf_filename = year_match.group(2)
            current_pdf = f"assets/{pdf_filename}"
            if current_year not in result:
                result[current_year] = []
            continue

        # 프로젝트 페이지 범위 파싱
        project_match = project_pattern.match(line)
        if project_match and current_year:
            title = project_match.group(1).strip()
            start_page = int(project_match.group(2))
            end_page = int(project_match.group(3))

            result[current_year].append({
                "title": title,
                "pages": (start_page, end_page),
                "pdf": current_pdf
            })

    return result

if __name__ == "__main__":
    mapping = parse_artbook_mapping("data/artbook_mapping.md")

    print("=== Parsed Artbook Mapping ===")
    for year, projects in mapping.items():
        print(f"\n{year}년:")
        for project in projects:
            print(f"  - {project['title']}: Page {project['pages'][0]} - {project['pages'][1]} ({project['pdf']})")
