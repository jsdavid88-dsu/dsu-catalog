"""
PDF에서 페이지 이미지 추출 및 OCR 텍스트 추출 스크립트
"""
import sys
import io

# UTF-8 인코딩 강제 설정 (Windows cp949 문제 해결)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import fitz  # PyMuPDF
import easyocr
from PIL import Image
import os
import json
import re
from pathlib import Path
from parse_mapping import parse_artbook_mapping

# EasyOCR 초기화 (한국어, 영어)
# 주의: EasyOCR은 일부 언어 조합이 호환되지 않음 (중국어는 영어와만 호환)
print("EasyOCR 초기화 중... (최초 실행시 언어 모델 다운로드)")
reader = easyocr.Reader(['ko', 'en'], gpu=False)
print("EasyOCR 준비 완료!")

def slugify(text):
    """제목을 파일명으로 사용 가능한 형태로 변환"""
    # 괄호 안의 내용 제거
    text = re.sub(r'\([^)]*\)', '', text)
    # 특수문자 제거 및 소문자 변환
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-').lower()

def extract_pages_as_images(pdf_path, start_page, end_page, output_dir, dpi=200):
    """
    PDF에서 지정된 페이지 범위를 이미지로 추출

    Args:
        pdf_path: PDF 파일 경로
        start_page: 시작 페이지 (1-based)
        end_page: 끝 페이지 (1-based, inclusive)
        output_dir: 저장할 디렉토리
        dpi: 해상도 (기본 200)

    Returns:
        추출된 이미지 파일 경로 리스트
    """
    doc = fitz.open(pdf_path)
    image_paths = []

    # 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)

    # 줌 factor 계산 (dpi / 72)
    zoom = dpi / 72
    mat = fitz.Matrix(zoom, zoom)

    for page_num in range(start_page - 1, end_page):
        if page_num >= len(doc):
            print(f"  경고: 페이지 {page_num + 1}은 존재하지 않습니다.")
            break

        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat)

        # 파일명: page_001.png 형식
        filename = f"page_{page_num + 1:03d}.png"
        filepath = os.path.join(output_dir, filename)

        pix.save(filepath)
        image_paths.append(filepath)
        print(f"  ✓ 페이지 {page_num + 1} 추출 완료: {filename}")

    doc.close()
    return image_paths

def optimize_image(image_path, max_width=1920, quality=85):
    """
    이미지 최적화 (리사이징 및 압축)

    Args:
        image_path: 이미지 파일 경로
        max_width: 최대 너비 (기본 1920px)
        quality: JPEG 품질 (기본 85)
    """
    img = Image.open(image_path)

    # 이미 최적 크기 이하면 스킵
    if img.width <= max_width:
        return

    # 비율 유지하며 리사이징
    ratio = max_width / img.width
    new_height = int(img.height * ratio)
    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

    # PNG로 저장 (웹 최적화)
    img.save(image_path, 'PNG', optimize=True)
    print(f"  ✓ 이미지 최적화: {os.path.basename(image_path)}")

def extract_text_from_image(image_path):
    """
    이미지에서 OCR로 텍스트 추출

    Args:
        image_path: 이미지 파일 경로

    Returns:
        추출된 텍스트 딕셔너리 {full_text: str, details: list}
    """
    print(f"  OCR 처리 중: {os.path.basename(image_path)}...")

    # EasyOCR로 텍스트 추출 (paragraph=False로 안정성 확보)
    results = reader.readtext(image_path, detail=1, paragraph=False)

    # 결과 정리
    full_text = []
    details = []

    for result in results:
        # EasyOCR returns [[bbox_points], text, confidence]
        # 안전하게 처리
        if len(result) >= 3:
            bbox, text, confidence = result[0], result[1], result[2]
            full_text.append(text)
            # bbox를 JSON 직렬화 가능하도록 변환
            bbox_list = [[int(x), int(y)] for x, y in bbox]
            details.append({
                "text": text,
                "confidence": float(confidence),
                "bbox": bbox_list
            })
        elif len(result) == 2:
            # detail=0인 경우 (bbox, text)
            bbox, text = result[0], result[1]
            full_text.append(text)
            bbox_list = [[int(x), int(y)] for x, y in bbox]
            details.append({
                "text": text,
                "confidence": 1.0,
                "bbox": bbox_list
            })

    return {
        "full_text": "\n".join(full_text),
        "details": details
    }

def process_project(project_info, year):
    """
    프로젝트 하나를 처리 (이미지 추출 + OCR)

    Args:
        project_info: 프로젝트 정보 딕셔너리
        year: 연도
    """
    title = project_info['title']
    pages = project_info['pages']
    pdf_path = project_info['pdf']

    print(f"\n{'='*60}")
    print(f"[{year}] {title} 처리 시작")
    print(f"PDF: {pdf_path}")
    print(f"페이지: {pages[0]} - {pages[1]}")
    print(f"{'='*60}")

    # 프로젝트 ID 생성 (slugify)
    project_id = slugify(title)

    # 출력 디렉토리
    output_dir = f"public/assets/projects/{year}/{project_id}"
    os.makedirs(output_dir, exist_ok=True)

    # 1. PDF에서 페이지 이미지 추출
    print("\n[1/3] PDF 페이지 이미지 추출...")
    image_paths = extract_pages_as_images(
        pdf_path,
        pages[0],
        pages[1],
        output_dir,
        dpi=200
    )

    # 2. 이미지 최적화
    print("\n[2/3] 이미지 최적화...")
    for img_path in image_paths:
        optimize_image(img_path, max_width=1920, quality=85)

    # 3. OCR 텍스트 추출
    print("\n[3/3] OCR 텍스트 추출...")
    ocr_results = {}

    for img_path in image_paths:
        filename = os.path.basename(img_path)
        page_num = filename.replace('page_', '').replace('.png', '')

        text_data = extract_text_from_image(img_path)
        ocr_results[filename] = text_data

        print(f"  ✓ {filename}: {len(text_data['full_text'])}자 추출")

    # OCR 결과를 JSON으로 저장
    json_path = os.path.join(output_dir, "ocr_text.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            "project_id": project_id,
            "title": title,
            "year": year,
            "pages": pages,
            "ocr_results": ocr_results
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ {title} 처리 완료!")
    print(f"   - 이미지: {len(image_paths)}개")
    print(f"   - 저장 위치: {output_dir}")
    print(f"   - OCR 결과: {json_path}")

def main():
    """메인 실행 함수"""
    print("\n" + "="*60)
    print("PDF 콘텐츠 추출 및 OCR 스크립트")
    print("="*60)

    # artbook_mapping.md 파싱
    print("\n[단계 1] artbook_mapping.md 파싱 중...")
    mapping = parse_artbook_mapping("data/artbook_mapping.md")

    # 2023, 2024만 처리
    target_years = ['2023', '2024']

    for year in target_years:
        if year not in mapping:
            print(f"경고: {year}년 데이터가 없습니다.")
            continue

        projects = mapping[year]
        print(f"\n{'='*60}")
        print(f"{year}년: {len(projects)}개 프로젝트 발견")
        print(f"{'='*60}")

        for i, project in enumerate(projects, 1):
            print(f"\n\n진행: {i}/{len(projects)}")
            process_project(project, year)

    print("\n" + "="*60)
    print("✅ 모든 작업 완료!")
    print("="*60)

if __name__ == "__main__":
    main()
