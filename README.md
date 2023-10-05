# 오늘의 할일 todo-app
[https://youtu.be/b0yxzv0zliU](https://youtu.be/b0yxzv0zliU)

## 개요
- 중요도와 마감일 별로 관리할 수 있는 투두리스트 웹사이트를 개발하였습니다.
- 사용자는 할일을 추가/수정/삭제/검색/정렬하고, 완료한 할일들을 일괄 삭제할 수 있습니다.
- 완료한 할일의 진행도를 볼 수 있습니다.
- 랜덤으로 보여지는 명언과 실시간 시각을 보며 사용자는 동기부여를 받을 수 있습니다.
- 메인 화면에서 날씨를 확인할 수 있습니다.
- 다크모드를 적용하여 눈의 피로도를 줄일 수 있습니다.

## ﻿기술 스택
- Front-end: React
- Back-end: Spring Framework
- Database: H2 Database

## 시나리오
1. **할일 추가**
    - 사용자는 할일의 제목, 마감일, 중요도을 입력합니다.
    - 마감일과 중요도는 생략할 수 있습니다.
    - 추가 버튼을 클릭하거나 Enter 키를 눌러 정보를 서버에 전송합니다.
2. **할일 검색**
    - 사용자는 검색 창에 키워드를 입력하여 할일을 검색합니다.
    - 검색 결과는 리스트 형태로 표시됩니다.
3. **회원정보 수정**
    - 사용자는 마이페이지에서 수정할 회원 정보를 입력합니다.
    - 수정 버튼을 클릭하여 서버에 수정할 정보를 전송합니다.
4. **회원 탈퇴**
    - 사용자는 마이페이지에서 회원 탈퇴 링크를 클릭합니다.
    - 이메일과 비밀번호를 올바르게 입력합니다.
    - 서버에서 회원 정보를 삭제합니다.

## 페이지 별 기능
1. **회원가입 기능**
- 사용자 이름과 이메일 및 비밀번호를 입력하여 회원가입 가능
- 중복된 이메일로 회원가입 불가
![image](https://github.com/suhye0n/todo-app/assets/63187994/354c5e24-db6f-4bd5-945e-d9c533e52bc4)

2. **로그인 기능**
- 이메일 및 비밀번호를 입력하여 로그인 가능
![image](https://github.com/suhye0n/todo-app/assets/63187994/ab2a45ca-c07d-4b3e-a517-50224714f2aa)

3. **메인페이지**
- 랜덤 명언 API 활용
- 날씨 API 활용
- 시각 표시 기능
- 할일 추가/수정/삭제/검색/정렬 기능
![image](https://github.com/suhye0n/todo-app/assets/63187994/02612cbe-7d1f-4ea7-9fbe-49e721ecdd74)
![image](https://github.com/suhye0n/todo-app/assets/63187994/14462da4-358b-437b-b3b8-b17e2b00ceb0)

4. **마이페이지**
- 회원정보 수정 가능
- 회원 탈퇴 가능
![image](https://github.com/suhye0n/todo-app/assets/63187994/e8023de8-932c-4f8a-9cfb-407bd15e9766)

5. **상단바**
- 다크모드/라이트모드 전환 가능
- 로그아웃 가능
- 마이페이지 이동 가능
- 메인페이지 이동 가능
![image](https://github.com/suhye0n/todo-app/assets/63187994/a7e43e26-d59f-40c3-a617-be703ff325f8)
