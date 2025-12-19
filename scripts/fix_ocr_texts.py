"""
OCR 텍스트 오타 수정 및 문장 교정 스크립트
"""
import sys
import io
import os
import json
import re
from pathlib import Path

# UTF-8 인코딩 강제 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def fix_common_ocr_errors(text):
    """
    OCR에서 자주 발생하는 오타 패턴 수정
    """
    if not text:
        return text

    # 일반적인 OCR 오류 패턴 수정
    replacements = {
        # 특수문자 오류
        'ࢎ': '사',
        'ۈ': '용',
        '੉': '이',
        'ݫ': '눈',
        'ܻ': '무',
        '੄': '의',
        'ࣗ': '자',
        'ݎ': '기',
        '׮': '다',
        'ܳ': '을',
        'ࠁ': '보',
        'Ҋ': '고',
        '਷': '리',
        'झ': '주',
        '֢': '인',
        'ః': '공',
        'ய': '하',
        '੉': '이',
        'ࢲ': '서',
        '۽': '로',
        'ী': '에',
        'ੌ': '우',
        'ਸ': '를',
        'ೞ': '하',
        'ѱ': '고',
        'ػ': '는',
        'ח': '한',
        'ب': '며',
        '੗': '도',
        'פ': '나',
        '݅': '니',
        'о': '어',
        'ߡ': '요',
        'ܽ': '으',
        'দ': '던',
        'ই': '트',
        'স': '스',
        '੘': '테',
        'ಿ': '치',
        '౟': '와',
        '࠘': '드',

        # 영문자 오류
        'QPSU': 'POPU',
        'NVSO': 'TURN',

        # 한글 오류 (자주 발생하는 패턴)
        '떼서': '테서',
        '엄1': '엄',
        '곳곳에': '곳곳에',

        # 공백 오류
        '  ': ' ',

        # 특수기호 정리
        '\x01': '',
        '\x10': '',
        '\x11': '',
        '\u0a0d': '',
        '\u0a44': '',
        '\u0a49': '',
        '\u0a89': '',
        '\u0ad8': '',
        '\u0bfc': '',
        '\u0c5f': '',
        '\u0c74': '',
        '\u0cd0': '',
    }

    fixed = text
    for wrong, correct in replacements.items():
        fixed = fixed.replace(wrong, correct)

    # 연속된 공백 정리
    fixed = re.sub(r'\s+', ' ', fixed)

    # 앞뒤 공백 제거
    fixed = fixed.strip()

    return fixed

def clean_text(text):
    """
    텍스트 정리 및 자연스럽게 만들기
    """
    if not text:
        return text

    # 기본 OCR 오류 수정
    text = fix_common_ocr_errors(text)

    # 문장 부호 앞뒤 공백 정리
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'([.,!?;:])\s+', r'\1 ', text)

    # 괄호 앞뒤 공백 정리
    text = re.sub(r'\s+\)', ')', text)
    text = re.sub(r'\(\s+', '(', text)

    # 연속된 줄바꿈 정리 (2개 이상은 2개로)
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text

def process_ocr_file(json_path):
    """
    OCR JSON 파일을 읽어서 텍스트를 수정하고 다시 저장
    """
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if 'ocr_results' not in data:
            print(f"  ⚠️ ocr_results 없음: {json_path}")
            return False

        modified = False
        for page_name, page_data in data['ocr_results'].items():
            if 'full_text' in page_data:
                original = page_data['full_text']
                cleaned = clean_text(original)

                if original != cleaned:
                    page_data['full_text'] = cleaned
                    modified = True

            # details 내의 text도 수정
            if 'details' in page_data:
                for detail in page_data['details']:
                    if 'text' in detail:
                        original = detail['text']
                        cleaned = clean_text(original)
                        if original != cleaned:
                            detail['text'] = cleaned
                            modified = True

        if modified:
            # 백업 생성
            backup_path = str(json_path).replace('.json', '.backup.json')
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            # 원본 파일 업데이트
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            return True

        return False

    except Exception as e:
        print(f"  ❌ 오류: {json_path} - {e}")
        return False

def main():
    """메인 실행 함수"""
    print("\n" + "="*70)
    print("OCR 텍스트 오타 수정 스크립트")
    print("="*70)

    base_dir = Path("public/assets/projects")

    if not base_dir.exists():
        print(f"❌ 디렉토리를 찾을 수 없습니다: {base_dir}")
        return

    total_files = 0
    modified_files = 0

    # 2023, 2024 연도별로 처리
    for year in ['2023', '2024']:
        year_dir = base_dir / year
        if not year_dir.exists():
            continue

        print(f"\n{'='*70}")
        print(f"{year}년 프로젝트 처리 중...")
        print(f"{'='*70}")

        # 각 프로젝트 폴더 순회
        for project_dir in sorted(year_dir.iterdir()):
            if not project_dir.is_dir():
                continue

            json_path = project_dir / "ocr_text.json"
            if not json_path.exists():
                continue

            total_files += 1
            project_name = project_dir.name

            print(f"\n처리 중: {year}/{project_name}")

            if process_ocr_file(json_path):
                modified_files += 1
                print(f"  ✓ 수정 완료 및 저장")
            else:
                print(f"  - 수정 사항 없음")

    print(f"\n{'='*70}")
    print(f"✅ 작업 완료!")
    print(f"{'='*70}")
    print(f"총 파일: {total_files}개")
    print(f"수정된 파일: {modified_files}개")
    print(f"백업 파일: 각 프로젝트 폴더의 *.backup.json")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    main()
