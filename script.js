document.addEventListener('DOMContentLoaded', function () {
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

    tagItems.forEach(item => {
        item.addEventListener('click', function () {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                console.log('태그 선택됨:', checkbox.value, checkbox.checked);
            }
        });
    });
});

function handleSubmit(e) {
    console.log('Form submit triggered');
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
        title: document.getElementById('title').value.trim(),
        content: document.getElementById('content').value.trim(),
        tags: Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        region: document.getElementById('region').value
    };

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzNB5K7R-FtGryfHpjFrjPdiA6KohbqwNvlhIcIRQlOJpiyfXiefi_TUUJBA2WUG4VYRQ/exec';

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    submitBtn.disabled = true;

    console.log('Sending data:', payload);

    fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
    })
    .then(() => {
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

function showAlert(message) {
    alert(message);
}

function showModal() {
    const modal = document.getElementById('submissionModal');
    if (!modal) return;

    modal.style.display = 'flex';

    // 닫기 버튼 (.close 또는 비슷한 클래스 포함 가능)
    const closeBtn = modal.querySelector('.close, [class*="close"], svg, .modal-close');
    if (closeBtn) {
        closeBtn.onclick = function () {
            console.log('X 버튼 클릭됨');
            modal.style.display = 'none';
        };
    }

    // 확인 버튼
    const confirmBtn = document.getElementById('closeModal') ||
                       modal.querySelector('button') ||
                       modal.querySelector('.confirm-btn, .btn-primary, .modal-confirm');
    if (confirmBtn) {
        confirmBtn.onclick = function () {
            console.log('확인 버튼 클릭됨');
            modal.style.display = 'none';
        };
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            console.log('ESC 눌러서 닫기');
            modal.style.display = 'none';
        }
    }, { once: true });

    // 모달 바깥 클릭 시 닫기
    window.onclick = function (event) {
        if (event.target === modal) {
            console.log('모달 외부 클릭됨');
            modal.style.display = 'none';
        }
    };
}
