# 재테닉 배당 관리 앱

재테닉(YouTube) 채널 구독자를 위한 **주배당 ETF 관리 웹앱** MVP.

## 핵심 기능 (M1 검증 단계)

- 보유 종목·수량 입력 (브라우저 localStorage 저장, 회원가입 없음)
- 이번 주 예상 배당 자동 계산 (세전 USD)
- 보유 리스트 표시·삭제

## 다음 단계 (계획됨)

- 연간 추정 / 누적 수령 카드
- USD ⇄ KRW 토글 (ExchangeRate-API)
- 세전 ⇄ 세후 토글
- GitHub Actions 매주 자동 스크래핑 + PR 검수 (YieldMax / Roundhill / Defiance / Kurv)

## 로컬 실행

```bash
corepack pnpm install
corepack pnpm dev
```

기본 포트: http://localhost:5173

## 테스트

```bash
corepack pnpm test
```

## 면책

본 앱은 투자 자문이 아닙니다. 학습/참고용입니다.
모든 데이터는 브라우저에만 저장되며 서버로 전송되지 않습니다.
