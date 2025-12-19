"""
OCR 텍스트 수동 재작성 스크립트
"""
import sys
import io
import json
from pathlib import Path

# UTF-8 인코딩 강제 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# 재작성된 텍스트 (프로젝트별로 정의)
REWRITTEN_TEXTS = {
    "snowcchio": {
        "page_003.png": "2023 Art of Graduation Projects Division of VFX & Animation, Dongseo University\n애니메이션학과 방송영상학부 디지털영상전공\n스노키오 / 내 홍차에 독을 탔어 / 히치하이커(Hitchhiker) / Purple Lilac / Believe in You / Camouflage / Love Delivery / 소망 / Be Hatched / Best Friend / Turntable / Way Back Home",

        "page_004.png": "스노키오\n2023 3D Short Film Animation\nGenre | Fairy tale\nRunning Time | 10 min\n\n메리의 외로운 마음에서 살아난 눈사람 스노키오는 메리와 함께 즐거운 하루를 보낸다. 그러나 벽난로의 열기에 녹아내리는 자신을 보며 두려움을 느낀다. 사람이 되기 위해 산타의 선물을 훔치게 되는데, 그 선물의 원래 주인은 바로 메리였다. 스노키오는 자신의 욕망 때문에 메리와의 우정을 저버린 자신을 후회하며 메리에게 선물을 돌려준다. 그리고 기적이 일어난다.\n\n<스노키오>는 우정을 소중히 여기는 마음을 담은 따뜻한 이야기다.\n\nDirector & Concept Designer 김성은 하희권\nModeling Artist 이지예\nAnimator 이수민 김성은 진미수 하희권 이지예 이수민 승경진 진미수 하희권\nRigger 이지예\nEditor & Sound 이수민\nLighting Artist & Compositor 김성은 하희권",

        "page_005.png": "스노키오 Snowcchio\n\n크리스마스 이브날 메리가 만든 눈사람이 메리의 소망이 담겨 눈을 뜨고 살아 움직이게 되었다.\n\n스노키오의 컨셉 디자인\n녹아내리는 자신의 몸을 보고 두려움이 커져서 이기적인 모습을 보여주지만, 메리와의 소중한 추억을 떠올리며 반성하게 된다.\n\n스노키오는 기본적인 눈사람의 둥근 형태로 디자인하였다. 두 개의 둥근 눈덩이와 최대한 동글동글하고 귀여운 모습을 담고자 하였다. 몸통과 머리 사이는 목도리로 감싸 목이 없는 캐릭터의 문제점을 보완했다.\n\n모자, 목도리, 손은 어린이의 모습으로 표현하여 눈사람의 상징을 나타냈다.\n\n기본 캐릭터의 형태와 달리 동그랗고 커다란 몸통과 짧은 팔다리가 액팅 과정에서 원활한 움직임이 불가하여 팔다리가 늘어날 수 있도록 작업하였다.",

        "page_006.png": "스노키오 Snowcchio\n\n사람이 되고 싶은 소원을 이루게 된 스노키오\n\n사람이 된 스노키오의 컨셉 디자인\n서로를 걱정하고 위하는 애틋한 마음이 크리스마스의 기적을 일으켰다.\n\n스노키오가 눈사람이었을 때의 모습과 비슷한 분위기의 캐릭터로 디자인하고자 많은 고민과 고통이 있었다.\n\n스노키오는 벽난로 연기 앞에서도, 뜨거운 태양 아래서도 녹지 않는다. 더 이상 눈사람의 눈동자와 같은 색, 옷에는 눈사람의 아이콘을 담아서 눈사람의 상징을 표현하고자 했다.\n\n머리와 눈썹은 하얀색 계열로 통일하였고, 눈동자는 눈사람의 눈동자와 같은 색으로 디자인하였다.\n\n메리와 함께 즐겁게 지낼 수 있게 되었다.",

        "page_007.png": "메리 Merry\n\n동생을 원하던 메리는 마당에서 혼자 눈사람을 만들며 외로움을 달래고 있었다.\n\n메리의 컨셉 디자인\n생명을 얻게 된 스노키오를 보며 기뻐하던 것도 잠시, 녹아내리는 몸을 보고 두려움을 느껴 도망가버린 스노키오를 바라보며 안타까워한다.\n\n메리는 사랑스러운 어린 여자아이의 모습으로 디자인하고자 했다.\n\n의상 색상을 난색 계열 위주로 맞추어 노란 코트에 빨간색 장갑과 목도리, 앞두 머리끈으로 구상했다.\n\n헤어 디자인은 앞머리와 양갈래 머리로 귀여운 느낌을 연상케 하였으며, 모델링 제작 과정에서 묶은 머리의 움직임과 흩날림의 라인을 만들기 위해 많은 노력을 하였다.\n\n서로를 생각하는 따뜻한 마음 덕분에 메리는 크리스마스 선물로 원하던 소원을 이루게 된다.",

        "page_008.png": "선물상자 Gift Box\n산타의 선물 주머니에서 나온 메리의 선물상자이다. 선물상자를 도둑질한 스노키오로부터 도망을 가게 되지만, 후회하는 스노키오를 보며 다시 나타나게 된다.\n\n이웃집 아이들 The Children Next Door\n메리의 옆 집에 사는 이웃 아이들로, 주황색 머리에 귀여운 주근깨가 있는 남매이다. 항상 둘이서 서로를 아끼며 즐겁게 논다.",

        "page_009.png": "모델링 턴어라운드 Modeling Turnaround\n\n스노키오 / 사람이 된 스노키오 / 메리 / 잠옷을 입은 메리 / 이웃집 소녀 / 이웃집 소년\n\n하늘 배경 아트 Sky Background Art\n왼쪽 위부터 차례대로 아침, 낮, 저녁, 밤, 한밤중, 동이 트는 새벽",

        "page_010.png": "프랍 아트 Props Art\n\n스노키오 스티커 / 메리 스티커 / 선물상자 스티커 / 크리스마스 전단지\n\n포스터 Poster\n사람이 되고 싶은 눈사람의 이야기",

        "page_011.png": "마을 Town\n\n마을 3D Modelling & Texture\n<스노키오> 속 배경은 크리스마스 이브로 눈이 소복히 쌓인 겨울이다.\n\n마을은 산 속의 시골 마을로 언덕과 나무를 곳곳에 배치하였다. 마을의 구조는 미국의 주택가를 참고하였다.\n\n집의 모양은 미국 목조 주택을 레퍼런스로 잡아 집집마다 다른 디자인으로 연출했다. 울타리와 창문에 전구를 달고 현관문에 크리스마스 리스를 달아 크리스마스 느낌을 더했다.\n\n동화의 따뜻한 이미지와 겨울의 차분한 이미지를 동시에 표현하기 위해 다양한 색감과 채도를 조절하여 작업했다.\n\n나무 3D Modeling & Texture\n캐주얼하고 귀여운 느낌의 캐릭터와 배경에도 어울리는 나무 에셋을 찾아 이용하였다. 배경에 더욱 어울리도록 편집하고 눈을 쌓아 겨울 감성을 냈다.\n\n메리의 집 Merry's House\n\n메리의 집 컨셉 디자인과 3D Modeling & Texture\n미국 목조 주택을 레퍼런스로 잡아 초기 디자인을 구성하고 겨울 배경에 맞게 눈 덮인 환경을 조성했다.\n\n애니메이션에 핵심 장소 중 하나로 눈에 띄는 색을 적용했다. 외벽은 밝은 청록색으로, 푸른 색이지만 밝고 활기찬 느낌을 주도록 하였다.\n\n지붕 또한 눈에 덮여 잘 보이진 않지만 밝은 회색이다. 울타리는 나무 본연의 느낌을 살려 주변 환경과 어우러지게 연출하였다.\n\n마당에 작은 그네와 블록 등을 배치하여 하얀 바닥이 밋밋하지 않도록 하였다.",

        "page_012.png": "거실 Living Room\n\n거실 컨셉 디자인\n먼저 디자인된 메리의 집 외관에 맞춰 디자인되었다. 가장 메인이 되는 벽난로를 중심으로 구성하였다.\n\n유일하게 눈이 쌓이지 않은 장소이며 스노키오의 몸이 녹는 장소이므로 따뜻한 분위기의 컬러를 연출했다. 크리스마스에 어울리는 트리와 조명들을 배치하였다.\n\n거실 3D Modeling & Texture\n캐릭터의 동선에 맞게 가구와 소품들을 배치했다. 화면에 자세히 보이지 않아도 전체적인 분위기를 맞춰 디테일을 신경썼다.\n\n놀이터 Playground\n\n숲 속 놀이터 3D Modeling & Texture\n숲 속에 둘러싸인 놀이터로 연출하였다. 놀이기구의 대부분을 플라스틱과 철의 사용을 줄이고 숲 속 배경에 어울리는 나무로 제작했다.\n\n애니메이션에서는 메리와 스노키오가 함께 노는 장소, 스노키오와 선물상자의 액션 씬 배경으로 사용된다.",

        "page_013.png": "컬러 스크립트 Color Script\n\n애니메이션 <스노키오>의 프리 프로덕션 과정에서 전반적인 시간대의 색채와 분위기 및 캐릭터의 감정을 어떻게 연출할지 컬러 스크립트를 통해 시각적으로 표현했다.\n\n동화적인 분위기의 따뜻함과 겨울의 차가움을 동시에 표현하기 위해 많은 레퍼런스를 찾아보았다. 또한 Scene의 변화에 따라 관객들이 메리와 스노키오의 감정들에 몰입할 수 있도록 고민하여 작업하였다.\n\n애니메이션 & 라이팅 Lighting\n\n애니메이션 <스노키오>는 단편 애니메이션임에도 아침, 낮, 저녁, 밤, 새벽까지 다양한 시간대와 다양한 장소가 등장한다.\n\n눈의 반사광과 라이팅 작업자, 액팅과 라이팅 작업 과정의 통일감을 맞추는 데에 많은 시간을 쓰며 집중하였다."
    }
}

def rewrite_project(project_path, project_id):
    """프로젝트의 OCR 텍스트를 재작성된 텍스트로 교체"""
    json_path = project_path / "ocr_text.json"

    if not json_path.exists():
        print(f"파일 없음: {json_path}")
        return False

    if project_id not in REWRITTEN_TEXTS:
        print(f"재작성 텍스트 없음: {project_id}")
        return False

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    rewritten = REWRITTEN_TEXTS[project_id]
    modified = False

    for page_name, new_text in rewritten.items():
        if page_name in data['ocr_results']:
            data['ocr_results'][page_name]['full_text'] = new_text
            modified = True

    if modified:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True

    return False

if __name__ == "__main__":
    # Snowcchio 프로젝트 처리
    project_path = Path("public/assets/projects/2023/snowcchio")
    if rewrite_project(project_path, "snowcchio"):
        print("✅ Snowcchio 텍스트 재작성 완료!")
    else:
        print("❌ 처리 실패")
