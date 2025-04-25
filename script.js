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
    
    // 제한에 가까워지면 색상 변
