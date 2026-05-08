# Jetenic — 재테닉 도구 모음

[재테닉(YouTube)](https://www.youtube.com/) 채널 시청자를 위한 오픈소스 도구 모음입니다.

미국 주식·배당 ETF 중심 장기 투자 학습 채널의 부록으로, 시청자가 자신의 투자 데이터로 직접 활용할 수 있는 웹 도구들을 제공합니다.

## 구조

```
Jetenic/
└── apps/
    └── dividend-app/   # 주배당 ETF 관리 앱 (MVP)
```

## 앱 목록

### `apps/dividend-app/` — 주배당 ETF 관리

YieldMax / Roundhill / Defiance / Kurv 등 **weekly distribution ETF**의 보유 수량을 입력하면, 매주 발표되는 배당률을 기반으로 예상 배당금을 자동 계산합니다.

- **데이터 저장**: 브라우저 localStorage (회원가입·서버 없음)
- **데이터 갱신**: 운영자(채널 진행자)가 매주 검수한 distribution JSON
- **상세**: [`apps/dividend-app/README.md`](apps/dividend-app/README.md)

## 면책

본 도구들은 **투자 자문이 아닙니다**. 학습 및 참고 용도로만 사용하시고, 실제 투자 결정은 본인의 판단 하에 이루어져야 합니다.

## 라이선스

MIT
