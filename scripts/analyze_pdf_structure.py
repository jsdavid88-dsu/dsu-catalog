"""
PDF 전체 구조 분석 및 작품 목록 추출
"""
import sys
import io

# UTF-8 인코딩 강제 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import fitz  # PyMuPDF
import re
from collections import defaultdict

def analyze_pdf_structure(pdf_path, year):
    """
    PDF의 전체 구조를 분석하여 작품 목록 추출
    """
    print(f"\n{'='*70}")
    print(f"PDF 분석: {pdf_path}")
    print(f"{'='*70}")

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    print(f"총 페이지 수: {total_pages}")

    # 각 페이지의 텍스트와 제목 패턴 분석
    projects = []
    current_project = None

    for page_num in range(total_pages):
        page = doc[page_num]
        text = page.get_text()

        # 대형 텍스트 블록 찾기 (제목일 가능성)
        blocks = page.get_text("dict")["blocks"]

        # 페이지 요약
        text_preview = text.strip()[:300].replace('\n', ' ')

        # 이미지 수
        images = page.get_images()

        print(f"\n--- Page {page_num + 1} ---")
        print(f"이미지 수: {len(images)}")
        print(f"텍스트 미리보기: {text_preview[:150]}...")

        # 작품 제목 패턴 찾기
        # 일반적으로 큰 폰트 사이즈나 특정 위치에 있음
        large_texts = []
        for block in blocks:
            if block['type'] == 0:  # text block
                for line in block.get('lines', []):
                    for span in line.get('spans', []):
                        size = span.get('size', 0)
                        text_content = span.get('text', '').strip()
                        if size > 15 and len(text_content) > 2:  # 큰 폰트
                            large_texts.append({
                                'text': text_content,
                                'size': size,
                                'page': page_num + 1
                            })

        if large_texts:
            print(f"큰 텍스트 발견: {large_texts[:3]}")

    doc.close()

    print(f"\n{'='*70}")
    print(f"분석 완료!")
    print(f"{'='*70}")

def find_project_boundaries(pdf_path):
    """
    페이지 전환점을 찾아서 작품 경계 추정
    """
    doc = fitz.open(pdf_path)

    print(f"\n🔍 작품 경계 추정 (페이지 레이아웃 변화 기준)")
    print("="*70)

    prev_layout = None
    boundaries = []

    for page_num in range(len(doc)):
        page = doc[page_num]

        # 페이지 특성 분석
        images = page.get_images()
        text_length = len(page.get_text().strip())

        layout_signature = (len(images), text_length > 100)

        # 레이아웃 변화 감지
        if prev_layout and layout_signature != prev_layout:
            boundaries.append(page_num + 1)
            print(f"📌 경계 감지: Page {page_num + 1}")

        prev_layout = layout_signature

    doc.close()
    return boundaries

if __name__ == "__main__":
    pdfs = [
        ("assets/2023_Artbook_Ebook.pdf", 2023),
        ("assets/2024_Artbook_HQ.pdf", 2024)
    ]

    for pdf_path, year in pdfs:
        analyze_pdf_structure(pdf_path, year)
        boundaries = find_project_boundaries(pdf_path)

        print(f"\n추정된 작품 경계 페이지: {boundaries}")
        print("\n")
