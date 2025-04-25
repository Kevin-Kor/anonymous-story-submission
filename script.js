function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // 수동으로 FormData 생성해서 payload 붙이기
    const payload = {
        title: document.getElementById('title').value.trim(),
        content: document.getElementById('content').value.trim(),
        tags: Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(tag => tag.value),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        region: document.getElementById('region').value
    };

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));  // ✅ 여기가 핵심!

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzzJNao3lOEqBdtAT5aGnnpcSMTudLY8Fpan2P96OiAfAjmxIdKgMzDHKm8uD4dPBuZUw/exec';

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';
    submitBtn.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        body: formData  // ✅ JSON이 아니라 FormData!
        // ❌ headers 설정 없음!
    })
    .then(response => response.json())
    .then(data => {
        console.log('성공:', data);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showModal();
        storyForm.reset();
        charCount.textContent = '0';
        charCount.style.color = 'var(--gray-600)';
        tagItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            updateTagStyle(checkbox, item);
        });
    })
    .catch(error => {
        console.error('오류:', error);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        showAlert('제보 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    });
}
