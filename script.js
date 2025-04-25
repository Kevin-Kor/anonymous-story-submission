document.addEventListener('DOMContentLoaded', function() {
    // DOM이 로드된 후 실행되도록 이벤트 리스너 추가
    const storyForm = document.getElementById('storyForm');
    const submitBtn = document.getElementById('submitBtn');
    const charCount = document.getElementById('charCount');
    const tagItems = document.querySelectorAll('.tag-item');
    
    if (storyForm) {
        storyForm.addEventListener('submit', handleSubmit);
        console.log('Form submit event listener added');
    } else {
        console.error('Form element not found');
    }
    
    // 기존 이벤트 리스너들이 있다면 여기에 추가...
});

function handleSubmit(e) {
    console.log('Form submit triggered'); // 디버깅용
    e.preventDefault(); // 기본 제출 동작 방지
    
    if (!validateForm()) {
        return;
    }
    
    const payload = {
        title: document.getElementById('title').value.trim(),
        content: document.getElementById('content').value.trim(),
        tags: Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        region: document.getElementById('region').value
    };
    
    // 직접 JSON으로 전송
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzzJNao3lOEqBdtAT5aGnnpcSMTudLY8Fpan2P96OiAfAjmxIdKgMzDHKm8uD4dPBuZUw/exec';
    
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    submitBtn.disabled = true;
    
    console.log('Sending data:', payload); // 디버깅용
    
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showModal();
        document.getElementById('storyForm').reset();
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = 'var(--gray-600)';
        }
        document.querySelectorAll('.tag-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox && typeof updateTagStyle === 'function') {
                updateTagStyle(checkbox, item);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showAlert('제보 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    });
}

// Form 유효성 검사 함수
function validateForm() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const tags = document.querySelectorAll('input[name="tags"]:checked');
    const consent = document.getElementById('consent').checked;
    
    if (!title) {
        showAlert('제목을 입력해주세요.');
        return false;
    }
    
    if (!content) {
        showAlert('내용을 입력해주세요.');
        return false;
    }
    
    if (tags.length === 0) {
        showAlert('태그를 하나 이상 선택해주세요.');
        return false;
    }
    
    if (!consent) {
        showAlert('익명 게시 동의에 체크해주세요.');
        return false;
    }
    
    return true;
}

// Alert 표시 함수 - 이 함수가 이미 존재하지 않는다면 추가
function showAlert(message) {
    alert(message); // 간단한 alert 사용, 필요시 커스텀 모달로 변경 가능
}

// Modal 표시 함수 - 이 함수가 이미 존재한다고 가정
function showModal() {
    const modal = document.getElementById('submissionModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}
