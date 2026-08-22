"""Add structured author/title/venue metadata to the 논문/편저/역서/학위논문
entries in app/data/research-archive.json, so the site can render them the
same way as 보고서 entries (kind chip, then authors + quoted title, then a
muted venue line) instead of the raw citation string - see conversation.

The 편저 (edited-volume chapter) title for slug 2023-004 was corrected from
the book's own title to the actual chapter title, confirmed against the
publisher's table of contents (press.skku.edu). Two other 편저 entries
(2025-004, 2022-002) could not be verified against a public table of
contents - their titles are left as the best guess already on the site
and may need a manual correction from the user.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "app" / "data" / "research-archive.json"

PAPER_DETAILS = {
    "2025-001": {
        "authors": ["송경호"],
        "title": "AI 이후의 민주주의: 기술적 가능성과 참여의 역설",
        "venue": "『입법과 정책』 통권 제41호(제17권 제2호), pp.39-72",
    },
    "2025-002": {
        "authors": ["김태진", "송경호"],
        "title": "계산하는 기계는 돌보는 기계가 될 수 있을까?— 일본의 개호로봇과 돌봄의 다층적 재구성",
        "venue": "『日本思想』 제51호, pp.1-28",
    },
    "2025-003": {
        "authors": ["송경호"],
        "title": "대형언어모델의 편향: 공통감각의 부재와 기술적 한계",
        "venue": "조화순 편, 『무엇이 한국사회를 분열시키나』 (서울: 박영사)",
    },
    "2025-004": {
        "authors": ["송경호", "양성빈"],
        "title": "기후적응 리빙랩을 위한 의사결정 지원시스템: 사례와 시사점",
        "venue": "이태동, 신상범 편, 『리빙랩: 지속가능한 발전을 위한 공동창조와 실험』 (서울: 사회평론아카데미)",
    },
    "2024-001": {
        "authors": ["김현", "송경호", "백우열"],
        "title": "한국 대학 학부 정치학 교육 생태계의 변화: 2008~2023년 교육통계자료에 대한 분석을 중심으로",
        "venue": "『시민과세계』 2024년 하반기호(통권 45호), pp.181-225",
    },
    "2024-002": {
        "authors": ["Kyungho Song"],
        "title": "North Korea’s Concept of Human Rights and Its Characteristics: An LDA-NLP Analysis on the CHRRA Report and Rodong Sinmun",
        "venue": "North Korean Review 20(2), pp.37-66",
    },
    "2023-001": {
        "authors": ["김현", "송경호"],
        "title": "‘북한동포’는 누구인가?: 대통령 연설문(1948-2017)을 통해 본 시민적·종족적 북한동포관의 경합",
        "venue": "『정치사상연구』 제29권 제1호, pp.82-114",
    },
    "2023-002": {
        "authors": ["Kim, Hyun", "Song, Kyungho"],
        "title": "How Democracy Became Minjujuui: A Conceptual History of Democracy in Modern Korea with Focus on the Generalization Process of Minjujuui",
        "venue": "Korea Journal 63(1), pp.36-65",
    },
    "2023-003": {
        "authors": ["송경호", "김현"],
        "title": "한국 대학원 인문·사회계열 박사과정생의 현실: 연구환경, 연구자 네트워크, 연구자 정체성과 연구력",
        "venue": "『역사비평』 2023년 가을호(통권 제144호), pp.216-250",
    },
    "2023-004": {
        "authors": ["김현", "송경호"],
        "title": "시큐리티 개념의 수용과 번역어 ‘안보’의 성립",
        "venue": "이병택 편, 『(동아시아 교양총서 4) 근현대 동아시아 지식장과 정치변동』 (서울: 성균관대학교출판부)",
    },
    "2022-001": {
        "authors": ["송경호"],
        "title": "마리아 루스호 사건을 통해 본 메이지 일본에서의 인권 개념 수용",
        "venue": "『한국동양정치사상사연구』 제21권 제1호, pp.39-75",
    },
    "2022-002": {
        "authors": ["송경호"],
        "title": "역사화해의 이정표 3: 역사적 콘텍스트와 근대성을 중심으로",
        "venue": "이병택 편, 『역사화해의 이정표 3: 역사적 콘텍스트와 근대성을 중심으로』 (서울: 동북아역사재단)",
    },
    "2021-001": {
        "authors": ["Song, Kyungho", "Kim, Hyun", "Cha, Jisoo", "Lee, Taedong"],
        "title": "Matching and Mismatching of Green Jobs: A Big Data Analysis of Job Recruiting and Searching",
        "venue": "Sustainability 13(7): 4074",
    },
    "2021-002": {
        "authors": ["송경호", "김현"],
        "title": "근대적 기본개념으로서 ‘민주주의(民主主義)’의 개념사: 19-20세기 일본에서의 번역어 성립과 사용의 일반화 과정을 중심으로",
        "venue": "『한국정치학회보』 제55집 2호, pp.5-32",
    },
    "2021-003": {
        "authors": ["장휘", "송경호"],
        "title": "코로나19와 한국 민족주의의 분화: ‘국뽕’ 유튜브의 사례를 중심으로",
        "venue": "『시민과세계』 통권 39호, pp.1-41",
    },
    "2021-004": {
        "authors": ["김현", "박은영", "소진형", "손민석", "송경호", "이헌미", "홍철기"],
        "title": "서양을 번역하다: 문명개화 시대의 자유, 권리, 주권, 사회",
        "venue": "더글라스 하울랜드 저 (서울: 성균관대학교 출판부)",
    },
    "2021-005": {
        "authors": ["송경호", "김현", "김숭배", "나카무라 슈토"],
        "title": "(완역) 서양사정",
        "venue": "후쿠자와 유키치 저 (파주: 여문책)",
    },
    "2020-001": {
        "authors": ["김현", "송경호"],
        "title": "시큐리티(security)는 어떻게 ‘안보’가 되었을까?: ‘안전’, ‘안전보장’, ‘안보’로의 전환 과정을 중심으로",
        "venue": "『국제정치논총』 제60집 4호, pp.1-37",
    },
    "2020-002": {
        "authors": ["송경호"],
        "title": "19세기 동아시아의 인권 수용과 가토 히로유키(加藤弘之) 천부인권론의 역설: 天賦人權에서 得有權利로의 主義의 변화를 중심으로",
        "venue": "연세대학교 대학원 정치학과 박사학위 논문",
    },
    "2016-001": {
        "authors": ["허재영", "송경호"],
        "title": "북한급변사태에 관한 이론적 논의: 선제공격론과 인도주의적 개입을 중심으로",
        "venue": "『현대북한연구』 제19집 2호, pp.37-82",
    },
    "2012-001": {
        "authors": ["송경호"],
        "title": "아시아, 인권침해 이미지의 재해석: 존 롤스의 『만민법』 기획을 중심으로",
        "venue": "『민주주의와 인권』 제12권 2호, pp.133-171",
    },
    "2010-001": {
        "authors": ["장동진 (책임번역)", "황민혁", "송경호", "변영환"],
        "title": "다문화주의 시민권",
        "venue": "윌 킴리카 저 (서울: 동명사)",
    },
    "2009-001": {
        "authors": ["Dong-Jin Jang", "Kyung-Ho Song", "Min-Hyuk Hwang"],
        "title": "China's Northeast Project and Contemporary Korean Nationalism",
        "venue": "Korea Journal 49(1), pp.120-153",
    },
    "2007-001": {
        "authors": ["최연식", "송경호"],
        "title": "경국대전과 유교국가 조선의 예치: 예의 형식화 과정을 중심으로",
        "venue": "『사회과학논집』 제38권 1호, pp.43-62",
    },
    "2007-002": {
        "authors": ["송경호"],
        "title": "인권의 보편성과 인도주의적 개입의 한계: 존 롤스의 『만민법』에 나타난 논의를 중심으로",
        "venue": "연세대학교 대학원 정치학과 석사학위 논문",
    },
    "2006-001": {
        "authors": ["장동진", "송경호"],
        "title": "심의민주주의의 주체에 대하여: 대표자, 위원회, 시민사회를 중심으로",
        "venue": "『사회과학논집』 제37권 2호, pp.49-64",
    },
}


def main():
    data = json.loads(RESEARCH.read_text(encoding="utf-8"))
    for item in data:
        item.setdefault("venue", None)
        details = PAPER_DETAILS.get(item["slug"])
        if details:
            item.update(details)
    RESEARCH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"attached paper details to {len(PAPER_DETAILS)} entries")


if __name__ == "__main__":
    main()
