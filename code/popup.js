/**
 * Tab controller
 * Removes active class from all other tabs on click
 * Add active class to clicked icon
 */
 const tabs = document.querySelectorAll('[data-tab-target]');
 const tabContents = document.querySelectorAll('[data-tab-content');
 tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach(tabContents => {
      tabContents.classList.remove('active');
    })
    target.classList.add('active');
  })
})
