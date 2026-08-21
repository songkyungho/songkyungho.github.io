"""Append the Notion "Column, Op-ed, and Essay" items that are NOT already
covered by the migrated Naver blog archive (app/data/naver-archive.json),
and rename the merged result to app/data/writing-archive.json.

Unlike the Naver import, these items only have a title/outlet/link/short
excerpt (no scraped full body or thumbnail) - see conversation for why:
mirroring 40+ external articles' full text wasn't worth the added scope.
Detail pages fall back to the excerpt + an outbound link when body is empty.

kind: "post" for the person's own writing, "press" for third-party coverage
about him (interviews/news reports) - the site renders a [보도] ribbon on
"press" rows so readers don't mistake them for his own writing.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "app" / "data" / "naver-archive.json"
DST = ROOT / "app" / "data" / "writing-archive.json"

NEW_ENTRIES = [
    # -- own writing: issue briefs / policy pieces --
    dict(slug="col-undp-2025", title="Building Safer AI for All Languages: A Collective Pathway to Inclusive Human Development",
         publication="UNDP Digital, AI and Innovation Hub", year="2025", section="칼럼", kind="post",
         sourceUrl="https://www.undp.org/digital/blog/building-safer-ai-all-languages-collective-pathway-inclusive-human-development",
         excerpt="Dr. Kyungho Song & Dr. Jiyeon Cho (Korea AI Safety Institute)와 UNDP Digital, AI and Innovation Hub의 공동 기고."),
    dict(slug="col-korea-univ-2026", title="[Issues & Insights 33호] 미토스 충격과 한국의 사이버 보안 전략",
         publication="고려대학교 경제기술안보연구원", year="2026", section="이슈브리프", kind="post",
         sourceUrl="https://iets.korea.ac.kr/iets/books/publication.do?mode=view&articleNo=808225",
         excerpt=None),
    dict(slug="col-koreaonpoint-2025", title="The Political Philosophy of REAIM: Rethinking Autonomous Weapon Systems in A Just War Theory Perspective",
         publication="한국국제정치학회 Korea on Point", year="2025", section="이슈브리프", kind="post",
         sourceUrl="https://koreaonpoint.org/view.php?idx=390",
         excerpt="As autonomous weapon systems (AWS) based on AI are increasingly integrated into military operations worldwide, international cooperation needs to establish ethical norms, and the legal framework..."),
    dict(slug="col-cdss-56", title="디지털사회 제56호: 게이머의 정치적 주체화와 디지털 공론장의 가능성",
         publication="연세대학교 디지털사회과학센터 [디지털사회]", year="2025", section="이슈브리프", kind="post",
         sourceUrl="http://cdss.yonsei.ac.kr/index.php/issue-brief/?uid=205&mod=document&pageid=1",
         excerpt="게이머들이 단순히 게임을 통해 여가를 즐기는 집단을 넘어 중요한 사회적, 정치적 행위자로 부상하고 있다."),
    # -- 프레시안 특집 --
    dict(slug="col-pressian-vote-2024", title="'한국인도 미국 대선 투표권을 허하라'가 헛소리라고요?",
         publication="프레시안 특집", year="2024", section="칼럼", kind="post",
         sourceUrl="https://www.pressian.com/pages/articles/2024091218534053511",
         excerpt="2024년 11월 5일, 60번째 미국 대통령 선거가 치러진다. 한국의 언론 보도나 기사 댓글, 인터넷 커뮤니티 게시물을 살펴보면, 우리 대선 못지 않게 미국 대선에 대한 관심이 뜨겁다."),
    # -- 프레시안 특집 [이세계 민주주의 교실] (series, 2024.02.08) --
    dict(slug="col-pressian-isekai-1", title="트럭에 치여 '이세계'에서 눈뜬 당신의 '정치적 선택'은?",
         publication="프레시안 특집 [이세계 민주주의 교실]", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024020810512758680",
         excerpt="당신은 트럭에 치여 이세계(異世界)에서 눈을 떴다. 주위를 둘러보니 혼자는 아니다. 수십 명의 지구인과 함께 있다."),
    dict(slug="col-pressian-isekai-2", title="미국이나 한국이나…이재명과 매카시, 문제는 포퓰리즘?",
         publication="프레시안 특집 [이세계 민주주의 교실]", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024020814370080497",
         excerpt="지구가 아닌 이세계에서 눈을 뜬 당신 앞에 주어진 과제는 '마법으로 드래곤 사냥하기'가 아닌, 평범한 사람들이 모여 공동의 문제를 해결할 '도구'로서의 정치체제를 만드는 것이었다."),
    dict(slug="col-pressian-isekai-3", title="'정체성 정치'의 역습…극우 이민혐오가 백인의 '정체성'?",
         publication="프레시안 특집 [이세계 민주주의 교실]", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024020814440909082",
         excerpt="지구가 아닌 이세계에서 눈을 뜬 당신 앞에 주어진 과제는 '마법으로 드래곤 사냥하기'가 아닌, 평범한 사람들이 모여 공동의 문제를 해결할 '도구'로서의 정치체제를 만드는 것이었다."),
    dict(slug="col-pressian-isekai-4", title="21세기 단군신화? 기업은 '시민'이 될 수 있을까",
         publication="프레시안 특집 [이세계 민주주의 교실]", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024020814521279229",
         excerpt="지구가 아닌 이세계에서 눈을 뜬 당신 앞에 주어진 과제는 '마법으로 드래곤 사냥하기'가 아닌, 평범한 사람들이 모여 공동의 문제를 해결할 '도구'로서의 정치체제를 만드는 것이었다."),
    dict(slug="col-pressian-isekai-5", title="인공지능을 정치에 어떻게 활용해 볼까?",
         publication="프레시안 특집 [이세계 민주주의 교실]", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024020814560006080",
         excerpt="지구가 아닌 이세계에서 눈을 뜬 당신 앞에 주어진 과제는 '마법으로 드래곤 사냥하기'가 아닌, 평범한 사람들이 모여 공동의 문제를 해결할 '도구'로서의 정치체제를 만드는 것이었다."),
    # -- 프레시안 특집 [신년특별기고 - 송경호의 'AI 정치'] (series, 2024.01.03) --
    dict(slug="col-pressian-aipolitics-1", title="AI로 정치인 대체하자? 'IT 강령술사'가 등장한다",
         publication="프레시안 특집 [신년특별기고 - 송경호의 'AI 정치']", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024010317011669947",
         excerpt="인공지능 기술의 발전은 우리의 삶을 근본적으로 변화시키고 있다. 정치 역시 예외는 아니다. 인간의 정치에 인공지능을 활용하는 것을 넘어, 인공지능에게 정치를 맡긴다면 어떻게 될까?"),
    dict(slug="col-pressian-aipolitics-2", title="'서울-양평고속도로'의 최적안을 결정할 AI가 나온다면?",
         publication="프레시안 특집 [신년특별기고 - 송경호의 'AI 정치']", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024010317042031233",
         excerpt="인공지능 기술의 발전은 우리의 삶을 근본적으로 변화시키고 있다. 정치 역시 예외는 아니다."),
    dict(slug="col-pressian-aipolitics-3", title="'철인군주AI'로 정치를 대체하자?",
         publication="프레시안 특집 [신년특별기고 - 송경호의 'AI 정치']", year="2024", section="칼럼", kind="post",
         sourceUrl="https://m.pressian.com/m/pages/articles/2024010317072429864",
         excerpt="인공지능 기술의 발전은 우리의 삶을 근본적으로 변화시키고 있다. 정치 역시 예외는 아니다."),
    # -- 통일연구원 이슈브리프 (신규 4건, 149호는 이미 마이그레이션됨) --
    dict(slug="col-yinks-157", title="최근 북한 「로동신문」의 인권관련 보도 경향",
         publication="연세대 통일연구원 이슈브리프", year="2023", section="이슈브리프", kind="post",
         sourceUrl="https://www.yinks.or.kr/post/제157호-송경호-전문연구원-최근-북한-「로동신문」의-인권관련-보도-경향",
         excerpt="최근 북한 언론에서 '인권'은 어떤 맥락에서 어떤 방식으로 다루어지고 있을까?"),
    dict(slug="col-yinks-161", title="대통령 연설문에 나타난 '북한동포' 인식의 변화",
         publication="연세대 통일연구원 이슈브리프", year="2023", section="이슈브리프", kind="post",
         sourceUrl="https://www.yinks.or.kr/post/제161호-송경호-전문연구원-대통령-연설문에-나타난-북한동포-인식의-변화",
         excerpt="과거 우리 사회에서 북한사람들은 '동포(同胞)'로 표현됐다."),
    dict(slug="col-yinks-169", title="북한을 탈출한 사람들은 어떻게 명명되었는가?: 1990-2024년 빅카인즈 데이터에 대한 기초 분석",
         publication="연세대 통일연구원 이슈브리프", year="2024", section="이슈브리프", kind="post",
         sourceUrl="https://www.yinks.or.kr/post/제169호-송경호-전문연구원-북한을-탈출한-사람들은-어떻게-명명되었는가-1990-2024년-빅카인즈-데이터에-대한-기초-분석",
         excerpt="2024년 2월 21일, 대통령직속 국민통합위원회는 「북배경주민과의 동행」 특별위원회 출범식을 열었다."),
    dict(slug="col-yinks-183", title="프론티어 없는 위협: 북한의 인공지능 역량 검증의 사각지대",
         publication="연세대 통일연구원 이슈브리프", year="2026", section="이슈브리프", kind="post",
         sourceUrl="https://www.yinks.or.kr/post/제183호-송경호-전문연구원-프론티어-없는-위협-북한의-인공지능-역량-검증의-사각지대",
         excerpt="북한의 인공지능(AI) 역량은 최근 몇 년 사이 북한·안보 연구의 핵심 주제로 부상했다."),
    # -- 경향신문 [공감] (2023, monthly) --
    dict(slug="col-khan-2023-01", title="[공감] 포퓰리즘이 뭐라고 생각하세요",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202301180300065",
         excerpt="온갖 포퓰리즘이 난무한다."),
    dict(slug="col-khan-2023-02", title="[공감] 세계시민주의는 실패한 걸까",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202302150300045",
         excerpt="베트남 냐짱에 왔다. 밤늦게 출발해 새벽에 도착하는 고된 비행 일정이었다."),
    dict(slug="col-khan-2023-03", title="[공감] 대표란 무엇인가",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202303150300035",
         excerpt="대표가 위기다. 거대 양당은 하루가 멀다 하고 상대 당대표를 공격한다."),
    dict(slug="col-khan-2023-04", title="[공감] 정치학이 쓸모가 있나요",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202304120300065",
         excerpt="\"정치학 전공하면 나중에 정치할 건가?\" 숱하게 받아온 질문이다."),
    dict(slug="col-khan-2023-05", title="[공감] 어버이날, 가족의 의미를 다시 생각하다",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202305100300065",
         excerpt="아침부터 첫째 아이를 혼냈다."),
    dict(slug="col-khan-2023-06", title="[공감] 그것은 우리가 원하는 우리 모습이 아니다",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202306070300065",
         excerpt="우리 집에는 많은 규칙이 있다."),
    dict(slug="col-khan-2023-07", title="[공감] 임금 노릇 하기도 어렵고 신하 노릇 하기도 쉽지 않다",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202307050300065",
         excerpt="잠자리에 누웠던 첫째가 대성통곡했다."),
    dict(slug="col-khan-2023-08", title="[공감] 인공지능시대, 문과가 필요할까",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202308012031005",
         excerpt="초등학교 4학년 첫째의 꿈은 요리사다."),
    dict(slug="col-khan-2023-09", title="[공감] 그건 정치가 아니다",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202308292030015",
         excerpt="우리 애들은 간판과 현수막으로 한글을 깨쳤다."),
    dict(slug="col-khan-2023-10", title="[공감] 어려울 때 도와주는 친구가 진정한 친구다",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202309262023015",
         excerpt="지난 주말, 한국에서 공부하는 미국·일본·중국 대학원생들과 부산에 다녀왔다."),
    dict(slug="col-khan-2023-11", title="[공감] 적대주의를 넘어 서로 함께 살아가기",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202310242027015",
         excerpt="우리 집에는 매일 전투가 벌어진다."),
    dict(slug="col-khan-2023-12", title="[공감] 기후위기에 함께 적응하기",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202311212040015",
         excerpt="둘째가 밤새 기침하는 통에 잠을 설쳤다."),
    dict(slug="col-khan-2023-13", title="[공감] 가장 외로운 시대의 인공지능",
         publication="경향신문 [공감]", year="2023", section="칼럼", kind="post",
         sourceUrl="https://www.khan.co.kr/opinion/column/article/202312192019015",
         excerpt="벌써 몇년 된 일이다. 일본에서 고장난 로봇 강아지 아이보(aibo)를 위한 합동 장례식이 열렸다."),
    # -- press coverage about him (report/interview - not written by him) --
    dict(slug="press-newstheai-2025", title="AI 안전 서울 포럼 참석한 앤트로픽 \"AI 안전, 사회 전체 노력 필요\"",
         publication="뉴스디에이아이", year="2025", section="보도", kind="press",
         sourceUrl="https://www.newstheai.com/news/articleView.html?idxno=9497", excerpt=None),
    dict(slug="press-henkaku-2025", title="The Henkaku Center's First AI Safety Workshop",
         publication="Henkaku Center", year="2025", section="보도", kind="press",
         sourceUrl="https://www.henkaku.center/en/news/reports/2025-08-11/workshop-2025-07-05-AI-Safety/", excerpt=None),
    dict(slug="press-nate-2025", title="\"AI 시대, 교육은 어디로?\"…디지털소사이어티, 세미나 개최",
         publication="네이트뉴스", year="2025", section="보도", kind="press",
         sourceUrl="https://news.nate.com/view/20250629n04222", excerpt=None),
    dict(slug="press-catholicnews-2025", title="\"청년 남성들은 정말 '극우'일까\"",
         publication="가톨릭뉴스", year="2025", section="보도", kind="press",
         sourceUrl="https://www.catholicnews.co.kr/news/articleView.html?idxno=34375", excerpt=None),
    dict(slug="press-catholictimes-2025", title="\"청년 남성은 우파?\"…편견 벗어나 이해의 폭 넓히는 자리 마련",
         publication="가톨릭타임즈", year="2025", section="보도", kind="press",
         sourceUrl="https://www.catholictimes.org/article/20250518500016", excerpt=None),
    dict(slug="press-etnews-2024", title="[AI 정치 선진화 포럼] \"AI 활용해 국민불신 없애고, 정치 개혁 이뤄내야\"",
         publication="전자신문", year="2024", section="보도", kind="press",
         sourceUrl="https://www.etnews.com/20240516000324", excerpt=None),
    dict(slug="press-kyosu-2024", title="돌봄의 기술을 탐구하다…AI와 로봇이 만드는 미래의 윤리적 재구성",
         publication="교수신문", year="2024", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=128899", excerpt=None),
    dict(slug="press-kyosu-2023-1", title="편향된 '신자유주의 비판'…\"디지털 대응은 소홀\"",
         publication="교수신문", year="2023", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=108807", excerpt=None),
    dict(slug="press-kyosu-2023-2", title="'AI 시대, 인문학은 정말 위기인가: 도래할 뉴리버럴아츠' 학술토론회 열린다",
         publication="교수신문", year="2023", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=108548", excerpt=None),
    dict(slug="press-kyosu-2022-1", title="\"지역정치 역할은 확대…정치학은 능동 대처 못해\"",
         publication="교수신문", year="2022", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=89320", excerpt=None),
    dict(slug="press-kyosu-2022-2", title="'휴먼 라이츠'는 어떻게 '천부인권'이 됐을까",
         publication="교수신문", year="2022", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=89798", excerpt=None),
    dict(slug="press-kyosu-2022-3", title="\"메이지 일본, 서양의 문법적 관점에서 자신의 언어를 사유하기 시작했다\"",
         publication="교수신문", year="2022", section="보도", kind="press",
         sourceUrl="https://www.kyosu.net/news/articleView.html?idxno=84364", excerpt=None),
    dict(slug="press-newsis-2020", title="\"5·18 인권침해 연구 시급…차별·혐오 역사 단절해야\"",
         publication="뉴시스", year="2020", section="보도", kind="press",
         sourceUrl="https://www.newsis.com/view/?id=NISX20200526_0001037801", excerpt=None),
]


def main():
    existing = json.loads(SRC.read_text(encoding="utf-8"))
    for item in existing:
        item.setdefault("kind", "post")

    for entry in NEW_ENTRIES:
        body = [entry["excerpt"]] if entry.get("excerpt") else []
        existing.append({
            "logNo": None,
            "slug": entry["slug"],
            "title": entry["title"],
            "rawTitle": entry["title"],
            "publication": entry["publication"],
            "issue": None,
            "year": entry["year"],
            "naverCategory": None,
            "section": entry["section"],
            "sourceUrl": entry["sourceUrl"],
            "naverImportedAt": None,
            "image": None,
            "imageSource": None,
            "body": body,
            "kind": entry["kind"],
            "migrationStatus": "외부 링크만 (전문 미이전)",
        })

    existing.sort(key=lambda d: (-int(d["year"]), d["title"]))
    DST.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"total writing-archive entries: {len(existing)} (added {len(NEW_ENTRIES)})")


if __name__ == "__main__":
    main()
