# 일회성 가져오기 스크립트 보관

2025년 사이트를 만들 때 네이버 블로그·노션·기존 자료에서 `app/data/*.json`을 처음 채우려고 한 번 돌린 스크립트들이다.
지금은 쓰지 않으며, 다시 돌리려면 gitignore된 `work/`(원자료 작업 폴더)와 `notion-raw/`(노션 내보내기)가
저장소 루트에 있어야 한다. 현재 쓰는 스크립트는 상위 `scripts/`의 `import_docx_blog.py`(블로그 글 가져오기)와
`make_favicon.py`(파비콘 생성)뿐이다.

| 스크립트 | 역할 |
| --- | --- |
| `build_naver_archive.py` / `prepare_naver_assets.py` / `add_writing_archive_entries.py` | 네이버 블로그 글을 `writing-archive.json`과 `public/images/writing/archive/`로 옮김 |
| `build_research_talks_archive.py` | `research-archive.json`·`talks-archive.json` 초기 생성 |
| `attach_paper_details.py` / `attach_report_details.py` / `attach_research_links.py` / `attach_book_covers.py` | 연구 항목에 초록·링크·표지 이미지 보강 |
