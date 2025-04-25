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
    
    // 태그 항목 클릭 시 체크박스 토글 기능 추가
    tagItems.forEach(item => {
        item.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                console.log('태그 선택됨:', checkbox.value, checkbox.checked);
            }
        });
    });
    
    // 모달 닫기 기능 추가
    const modal = document.getElementById('submissionModal');
    const closeBtn = modal ? modal.querySelector('.close') : null;
    const confirmBtn = modal ? document.getElementById('closeModal') : null;
    
    // X 버튼으로 모달 닫기
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            modal.style.display = 'none';
        });
    }
    
    // 확인 버튼으로 모달 닫기
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            console.log('Confirm button clicked');
            modal.style.display = 'none';
        });
    }
    
    // 모달 바깥 영역 클릭 시 닫기 (선택 사항)
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            console.log('Outside modal clicked');
            modal.style.display = 'none';
        }
    });
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
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzNB5K7R-FtGryfHpjFrjPdiA6KohbqwNvlhIcIRQlOJpiyfXiefi_TUUJBA2WUG4VYRQ/exec';
    
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
        body: JSON.stringify(payload),
        mode: 'no-cors' // CORS 에러 우회
    })
    .then(() => { // no-cors 모드에서는 응답 내용 접근 불가
        console.log('요청 완료');
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

// Alert 표시 함수
function showAlert(message) {
    alert(message);
}

// Modal 표시 함수
function showModal() {
    const modal = document.getElementById('submissionModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // ESC 키로 모달 닫기 (선택 사항)
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }, {once: true});
    }
}
