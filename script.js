// DOM 요소
const storyForm = document.getElementById('storyForm');
const contentTextarea = document.getElementById('content');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const modal = document.getElementById('submissionModal');
const closeBtn = document.querySelector('.close');
const closeModalBtn = document.getElementById('closeModal');
const tagItems = document.querySelectorAll('.tag-item');

// 문자 수 카운트
contentTextarea.addEventListener('input', updateCharCount);

function updateCharCount() {
    const currentLength = contentTextarea.value.length;
    charCount.textContent = currentLength;
    
    // 제한에 가까워지면 색상 변경
    if (currentLength > 900) {
        charCount.style.color = 'var(--danger-color)';
    } else if (currentLength > 700) {
        charCount.style.color = 'var(--warning-color)';
    } else {
        charCount.style.color = 'var(--gray-600)';
    }
}

// 태그 선택 스타일링
tagItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    
    // 초기 상태 설정
    updateTagStyle(checkbox, item);
    
    // 클릭 이벤트
    item.addEventListener('click', function() {
        checkbox.checked = !checkbox.checked;
        updateTagStyle(checkbox, item);
    });
});

function updateTagStyle(checkbox, tagItem) {
    if (checkbox.checked) {
        tagItem.style.borderColor = 'var(--primary-color)';
    } else {
        tagItem.style.borderColor = 'transparent';
    }
}

// 폼 제출
storyForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
        return;
    }
    
    // 폼 데이터 수집
    const formData = new FormData(storyForm);
    const submissionData = {
        title: formData.get('title'),
        content: formData.get('content'),
        tags: formData.getAll('tags'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        region: formData.get('region')
    };
    
    // Google 스프레드시트 웹 앱 URL - 웹 앱 배포 후 이 URL을 업데이트하세요
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzzJNao3lOEqBdtAT5aGnnpcSMTudLY8Fpan2P96OiAfAjmxIdKgMzDHKm8uD4dPBuZUw/exec';
    
    // 로딩 상태 표시
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    submitBtn.disabled = true;
    
    // 구글 시트로 데이터 전송
    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(submissionData),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        console.log('성공:', data);
        
        // 버튼 상태 복원
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // 성공 모달 표시
        showModal();
        
        // 폼 초기화
        storyForm.reset();
        charCount.textContent = '0';
        charCount.style.color = 'var(--gray-600)';
        
        // 태그 스타일 초기화
        tagItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            updateTagStyle(checkbox, item);
        });
    })
    .catch(error => {
        console.error('오류:', error);
        
        // 버튼 상태 복원
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        // 오류 알림 표시
        showAlert('제보 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    });
}

function validateForm() {
    // 제목이 비어있지 않은지 확인
    const title = document.getElementById('title').value.trim();
    if (!title) {
        showAlert('제목을 입력해주세요.');
        return false;
    }
    
    // 내용이 비어있지 않은지 확인
    const content = contentTextarea.value.trim();
    if (!content) {
        showAlert('내용을 입력해주세요.');
        return false;
    }
    
    // 적어도 하나의 태그가 선택되었는지 확인
    const selectedTags = document.querySelectorAll('input[name="tags"]:checked');
    if (selectedTags.length === 0) {
        showAlert('하나 이상의 태그를 선택해주세요.');
        return false;
    }
    
    // 동의 체크박스가 체크되었는지 확인
    const consent = document.getElementById('consent').checked;
    if (!consent) {
        showAlert('익명 게시 동의가 필요합니다.');
        return false;
    }
    
    return true;
}

// 사용자 친화적인 알림 표시
function showAlert(message) {
    // 기존 알림 요소가 있으면 제거
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 새 알림 요소 생성
    const alertEl = document.createElement('div');
    alertEl.className = 'alert-message';
    alertEl.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 페이지에 추가
    document.body.appendChild(alertEl);
    
    // 스타일 적용을 위한 setTimeout
    setTimeout(() => {
        alertEl.classList.add('show');
    }, 10);
    
    // 3초 후 알림 제거
    setTimeout(() => {
        alertEl.classList.remove('show');
        setTimeout(() => {
            alertEl.remove();
        }, 300);
    }, 3000);
}

// 모달 기능
function showModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // 스크롤 복원
}

closeBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 알림 메시지에 대한 CSS 추가
const style = document.createElement('style');
style.innerHTML = `
    .alert-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background-color: var(--danger-color);
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-md);
        z-index: 1000;
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .alert-message.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// 모바일 터치 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
    // 입력 시 iOS에서 확대 방지
    const allInputs = document.querySelectorAll('input[type="text"], textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            document.body.classList.add('no-zoom');
        });
        
        input.addEventListener('blur', function() {
            document.body.classList.remove('no-zoom');
        });
    });
});

// 입력 필드에 포커스 효과 추가
const formInputs = document.querySelectorAll('input, textarea, select');
formInputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    
    input.addEventListener('focus', () => {
        if (formGroup) {
            formGroup.classList.add('focused');
        }
    });
    
    input.addEventListener('blur', () => {
        if (formGroup) {
            formGroup.classList.remove('focused');
        }
    });
});

// 입력 필드 포커스 스타일
const focusStyle = document.createElement('style');
focusStyle.innerHTML = `
    .form-group.focused label {
        color: var(--primary-color);
    }
`;
document.head.appendChild(focusStyle);
