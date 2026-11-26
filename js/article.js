(function () {
  const progressBar = document.getElementById('readingProgress');
  const sideProgress = document.getElementById('sideProgress');

  function updateReadingProgress() {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - root.clientHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100;
    if (progressBar) progressBar.style.width = percent + '%';
    if (sideProgress) sideProgress.style.width = percent + '%';
    if (percent >= 85) {
      try {
        const key = 'reliserve-articles';
        const completed = JSON.parse(localStorage.getItem(key) || '[]');
        if (!completed.includes(window.location.pathname)) {
          completed.push(window.location.pathname);
          localStorage.setItem(key, JSON.stringify(completed));
        }
      } catch (error) {}
    }
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  updateReadingProgress();

  document.querySelectorAll('.knowledge-check').forEach(function (quiz, quizIndex) {
    const options = Array.from(quiz.querySelectorAll('.quiz-option'));
    const feedback = quiz.querySelector('.quiz-feedback');
    const reset = quiz.querySelector('.quiz-reset');
    const storageKey = 'reliserve-quiz-' + window.location.pathname + '-' + quizIndex;

    function answer(option) {
      const correct = option.dataset.correct === 'true';
      options.forEach(function (item) {
        item.disabled = true;
        item.classList.toggle('correct', item.dataset.correct === 'true');
        if (item === option && !correct) item.classList.add('incorrect');
      });
      feedback.textContent = correct
        ? 'Correct. ' + (option.textContent.trim()) + ' is the right answer.'
        : 'Not quite. The highlighted answer explains the correct choice.';
      feedback.classList.add('visible');
      if (reset) reset.hidden = false;
      try {
        localStorage.setItem(storageKey, correct ? 'correct' : 'incorrect');
      } catch (error) {
        // Progress remains available for the current visit if storage is unavailable.
      }
    }

    options.forEach(function (option) {
      option.addEventListener('click', function () {
        answer(option);
      });
    });

    if (reset) {
      reset.addEventListener('click', function () {
        options.forEach(function (item) {
          item.disabled = false;
          item.classList.remove('correct', 'incorrect');
        });
        feedback.textContent = '';
        feedback.classList.remove('visible');
        reset.hidden = true;
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          // No action needed when storage is unavailable.
        }
      });
    }
  });
})();
