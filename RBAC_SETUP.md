# Role-Based Access Control Setup Guide

## 🎯 What's Implemented

### Admin vs Student Permissions:
- ✅ **Admin**: 모든 프로젝트 수정/삭제 가능
- ✅ **Student**: 자기가 올린 프로젝트만 수정/삭제 가능
- ✅ Auto-tracking: 프로젝트 생성 시 자동으로 소유자 저장

---

## 📋 Deployment Steps

### 1. Firestore Security Rules 배포
Firebase Console → Firestore Database → Rules 탭:
```javascript
(firestore.rules 파일 내용을 복사해서 붙여넣기)
```
"게시" 버튼 클릭

### 2. Users Collection 생성
Firebase Console → Firestore Database → "컬렉션 시작":

**컬렉션 ID**: `users`

**첫 번째 문서** (관리자):
- 문서 ID: `{관리자 Firebase UID}`
- 필드:
  - `email` (string): `admin@dsu.ac.kr`
  - `role` (string): `admin`

**두 번째 문서** (학생 예시):
- 문서 ID: `{학생 Firebase UID}`
- 필드:
  - `email` (string): `student@dsu.ac.kr` 
  - `role` (string): `student`

### 3. 사용자 UID 찾기
Firebase Console → Authentication → Users → 해당 사용자의 UID 복사

---

## 🔍 How It Works

### 프로젝트 생성 시:
```typescript
{
  ...projectData,
  createdBy: "user-uid-here",  // 자동 추가
  createdByEmail: "user@email.com"  // 자동 추가
}
```

### Admin Dashboard:
- "Created by" 컬럼에 생성자 이메일 표시
- 권한 없으면 "No access" 표시
- Admin은 모든 프로젝트에 Edit/Delete 버튼 보임
- Student는 자기 프로젝트에만 버튼 보임

---

## 🧪 Testing Checklist

1. ✅ Admin 계정으로 모든 프로젝트 수정 가능
2. ✅ Student 계정으로 자기 프로젝트만 수정 가능
3. ✅ 권한 없는 프로젝트는 "No access" 표시
4. ✅ 새 프로젝트 생성 시 createdBy 자동 저장

---

## 💡 Future Enhancements

추가 가능한 기능들:
- 역할 관리 UI (관리자가 웹에서 역할 변경)
- 프로젝트 승인 워크플로우
- 팀 협업 기능 (여러 사람이 함께 수정)
