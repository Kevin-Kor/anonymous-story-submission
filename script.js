// DOM Elements
const storyForm = document.getElementById('storyForm');
const contentTextarea = document.getElementById('content');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const modal = document.getElementById('submissionModal');
const closeBtn = document.querySelector('.close');
const closeModalBtn = document.getElementById('closeModal');
const tagItems = document.querySelectorAll('.tag-item');

// Character count for the content textarea
contentTextarea.addEventListener('input', updateCharCount);

function updateCharCount() {
    const currentLength = contentTextarea.value.length;
    charCount.textContent = currentLength;
    
    // Change color to red if approaching limit
    if (currentLength > 900) {
        charCount.style.color = '#e74c3c';
    } else {
        charCount.style.color = '#666';
    }
}

// Styling for tag selection
tagItems.forEach(item => {
    item.addEventListener('click', function() {
        const checkbox = this.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        
        // Visual feedback
        if (checkbox.checked) {
            this.style.backgroundColor = '#d4e6ff';
        } else {
            this.style.backgroundColor = '#f0f0f0';
        }
    });
});

// Form submission
storyForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // In a real application, this is where you would:
    // 1. Collect form data
    // 2. Send it to your server
    
    const formData = new FormData(storyForm);
    const submissionData = {
        title: formData.get('title'),
        content: formData.get('content'),
        tags: formData.getAll('tags'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        region: formData.get('region')
    };
    
    // For demo purposes, log to console
    console.log('Form submission:', submissionData);
    
    // Show success modal
    showModal();
    
    // Reset form
    storyForm.reset();
    charCount.textContent = '0';
    tagItems.forEach(item => {
        item.style.backgroundColor = '#f0f0f0';
    });
}

function validateForm() {
    // Check if title is not empty
    const title = document.getElementById('title').value.trim();
    if (!title) {
        alert('제목을 입력해주세요.');
        return false;
    }
    
    // Check if content is not empty
    const content = contentTextarea.value.trim();
    if (!content) {
        alert('내용을 입력해주세요.');
        return false;
    }
    
    // Check if at least one tag is selected
    const selectedTags = document.querySelectorAll('input[name="tags"]:checked');
    if (selectedTags.length === 0) {
        alert('하나 이상의 태그를 선택해주세요.');
        return false;
    }
    
    // Check if consent checkbox is checked
    const consent = document.getElementById('consent').checked;
    if (!consent) {
        alert('익명 게시 동의가 필요합니다.');
        return false;
    }
    
    return true;
}

// Modal functionality
function showModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Add mobile touch events for better mobile experience
document.addEventListener('DOMContentLoaded', function() {
    // Add this meta tag for better mobile experience
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
    
    // Prevent zoom on iOS when focusing inputs
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