(() => {
  'use strict';

  // --- Existing Validation Logic ---
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    });
  });

  // --- New Theme Toggle Logic ---
  const toggleSwitch = document.querySelector('#checkbox');

  // Check for saved theme in localStorage
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.setAttribute('data-bs-theme', currentTheme);
    if (currentTheme === 'dark' && toggleSwitch) {
      toggleSwitch.checked = true;
    }
  }

  // Listener for the Sun/Moon switch
  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', function() {
      const theme = this.checked ? 'dark' : 'light';
      document.body.setAttribute('data-bs-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

})();