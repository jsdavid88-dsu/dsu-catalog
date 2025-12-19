# Production Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Check
✅ One-Click Bypass는 production에서 자동으로 숨겨집니다 (NODE_ENV 체크)
✅ Firebase 환경 변수가 설정되어 있는지 확인

### 2. Build Test
```bash
npm run build
```
에러 없이 빌드되는지 확인

---

## 🚀 Deployment Steps

### Step 1: Firebase 프로젝트 준비
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 선택 또는 새로 생성
3. **Authentication** 활성화
   - Sign-in method → Email/Password 활성화

### Step 2: Firestore 보안 규칙 설정
Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{project} {
      allow read: if true;  // 누구나 프로젝트 조회 가능
      allow write: if request.auth != null;  // 로그인한 사용자만 수정 가능
    }
  }
}
```

### Step 3: 첫 관리자 계정 생성 (중요!)
**배포 전에 반드시 계정을 먼저 만드세요!**

Firebase Console → Authentication → Users → **Add User**
- Email: `admin@dsu.ac.kr` (또는 원하는 이메일)
- Password: 안전한 비밀번호 설정
- 이 계정 정보를 **안전하게 보관**하세요!

### Step 4: Firebase CLI로 배포
```bash
# Firebase 로그인
firebase login

# 프로젝트 빌드
npm run build

# Firebase Hosting 초기화 (처음만)
firebase init hosting
# - Public directory: .next
# - Single-page app: No
# - Overwrite: No

# 배포!
firebase deploy --only hosting
```

### Step 5: 배포 후 확인
1. 배포 완료 메시지에서 URL 확인 (예: `https://dsu-catalog.web.app`)
2. 사이트 접속 → 메인 페이지가 정상적으로 보이는지 확인
3. `/admin/login` 접속
4. **Step 3에서 만든 계정**으로 로그인
5. Admin 페이지에서 프로젝트 관리 가능한지 테스트

---

## 🔐 로그인 방법

### 프로덕션 환경에서는:
- ❌ One-Click Bypass 버튼이 보이지 않습니다
- ✅ Firebase Console에서 만든 계정으로만 로그인 가능
- ✅ 또는 사이트에서 "Register" 버튼으로 새 계정 생성 (비활성화 권장)

### 추가 관리자 추가하기:
1. Firebase Console → Authentication → Users → Add User
2. 또는 기존 관리자가 로그인 후 다른 사람에게 계정 생성 링크 공유

---

## ⚠️ 보안 주의사항

1. **Register 버튼 비활성화** (선택사항)
   - 무분별한 계정 생성 방지
   - `app/admin/login/page.tsx`에서 Register 버튼 제거 가능

2. **비밀번호 관리**
   - 강력한 비밀번호 사용 (최소 8자, 대소문자+숫자+특수문자)
   - 정기적으로 비밀번호 변경

3. **Firestore 규칙 재확인**
   - 인증 없이는 쓰기 불가능하도록 설정되어 있는지 확인

---

## 📝 빠른 배포 스크립트

`deploy.sh` 생성:
```bash
#!/bin/bash
echo "🔨 Building..."
npm run build

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your site is live!"
```

실행: `bash deploy.sh` (Windows: `sh deploy.sh`)

---

## 🆘 문제 해결

### "Authentication failed" 오류
→ Firebase Console에서 Email/Password 인증이 활성화되어 있는지 확인

### 프로젝트 목록이 비어있음
→ Firestore에 데이터를 수동으로 추가하거나, Admin 페이지에서 새 프로젝트 생성

### 배포 후 404 오류
→ `firebase.json`의 rewrites 설정 확인
