# 익명 사연 제보 페이지

이 프로젝트는 사용자가 익명으로 사연을 제보할 수 있는 간단한 웹 페이지입니다. 제보된 사연은 관리자의 선별 과정을 거쳐 게시됩니다.

## 기능

- 사연 제목, 내용, 태그 입력 (필수)
- 연령대, 성별, 지역 선택 (선택)
- 익명 게시 동의 체크박스
- 제보 기준 및 운영 방침 안내
- 모바일 반응형 디자인

## 사용 방법

### 로컬에서 실행하기

1. 저장소를 클론합니다.
   ```
   git clone https://github.com/Kevin-Kor/anonymous-story-submission.git
   cd anonymous-story-submission
   ```

2. 웹 브라우저에서 `index.html` 파일을 엽니다.

### 웹 서버에 배포하기

#### 정적 호스팅 서비스 사용

1. GitHub Pages

   - GitHub 저장소에 코드를 푸시합니다.
   - 저장소 설정에서 GitHub Pages를 활성화합니다.
   - `main` 브랜치를 선택하고 저장합니다.
   - 제공된 URL을 통해 페이지에 접속할 수 있습니다.

2. Netlify

   - Netlify 계정을 만듭니다.
   - "Sites" 섹션에서 "New site from Git"을 선택합니다.
   - GitHub 저장소를 연결하고 배포 설정을 완료합니다.
   - 자동으로 사이트가 생성되고 URL이 제공됩니다.

3. Vercel

   - Vercel 계정을 만듭니다.
   - "Import Project"를 클릭합니다.
   - GitHub 저장소를 연결하고 배포 설정을 완료합니다.
   - 자동으로 사이트가 생성되고 URL이 제공됩니다.

## 실제 서버에 연결하기

현재 프로젝트는 프론트엔드 코드만 포함하고 있습니다. 실제로 제보된 사연을 저장하고 관리하려면 백엔드 서버가 필요합니다.

### 백엔드 연결 방법

1. `script.js` 파일의 `handleSubmit` 함수에서 서버 엔드포인트로 데이터를 전송하도록 코드를 수정합니다:

```javascript
function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(storyForm);
    const submissionData = {
        title: formData.get('title'),
        content: formData.get('content'),
        tags: formData.getAll('tags'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        region: formData.get('region')
    };
    
    // 서버에 데이터 전송
    fetch('https://your-api-endpoint.com/submit-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('네트워크 응답이 올바르지 않습니다');
    })
    .then(data => {
        console.log('Success:', data);
        showModal();
        storyForm.reset();
        charCount.textContent = '0';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('제보 전송 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    });
}
```

## 커스터마이징

- `styles.css`: 디자인 및 레이아웃 수정
- `index.html`: 페이지 구조 및 콘텐츠 수정
- `script.js`: 기능 및 유효성 검사 로직 수정

## 라이센스

MIT 라이센스