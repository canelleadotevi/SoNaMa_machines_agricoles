document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (selectHeader && (selectHeader.classList.contains('scroll-up-sticky') || selectHeader.classList.contains('sticky-top') || selectHeader.classList.contains('fixed-top'))) {
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    const body = document.querySelector('body');
    if (body && mobileNavToggleBtn) {
      body.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      if (document.querySelector('.mobile-nav-active')) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper !== 'undefined') {
      document.querySelectorAll('.swiper').forEach(function (swiper) {
        let config = JSON.parse(swiper.querySelector('.swiper-config').innerHTML.trim());
        new Swiper(swiper, config);
      });
    }
  }
  window.addEventListener('load', initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init isotope layout and filters
   */
  if (typeof Isotope !== 'undefined' && typeof imagesLoaded !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
        filters.addEventListener('click', function () {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          if (typeof aosInit === 'function') {
            aosInit();
          }
        }, false);
      });

    });
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  const navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

});

const http = axios.create({
  baseURL: 'http://localhost:5000/arduino',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('userToken')}`
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await http.post('/users/signin', {
        email: email,
        password: password
      });

      const data = response.data;

      if (data.error) {
        Toastify({
          text: data.error,
          duration: 3000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "red",
            color: "white"
          },
          onClick: function () { }
        }).showToast();
      } else if (data.mistake) {
        Toastify({
          text: data.mistake,
          duration: 3000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "orange",
            color: "white"
          },
          onClick: function () { }
        }).showToast();
      } else {
        // Enregistrement du token dans le localStorage
        localStorage.setItem('userToken', data.token);

        // Redirection vers la page home.html
        window.location.href = 'home.html';

        Toastify({
          text: "Bienvenue!",
          duration: 3000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "green",
            color: "white"
          },
          onClick: function () { }
        }).showToast();
      }
    } catch (error) {
      console.error('Erreur lors de la requête de connexion :', error);
      Toastify({
        text: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "red",
          color: "white"
        },
        onClick: function () { }
      }).showToast();
    }
  });
});

// Frontend avec JavaScript (utilisation d'Axios pour les requêtes HTTP)
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const userData = {
      password: 'john.doe',
      email: 'johndoe@gmail.com'
    };

    const response = await http.post('/users/create', userData);


  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);

    console.error('Une erreur s\'est produite lors de la création de l\'utilisateur.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchData();
    displayData(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});

async function fetchData() {
  const response = await http.get('/gps/currentLocation');
  return response.data;
}

function displayData(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  const formattedDate = dateFns.format(new Date(data.date), 'dd/MM/yyyy');
  const content = `Votre tracteur a été localisé le ${formattedDate} à ${data.hours} à exactement ${data.latitude}° de longitude, ${data.longitude}° de latitude et ${data.altitude}° d'altitude.`;
  const p = document.createElement('p');
  p.textContent = content;
  resultDiv.appendChild(p);
}

// stop or start programm
async function toggleState(state) {

  try {
    const response = await http.get(`/tractors/toggleTractorState/?state=${state}`);

    if (response.data && response.data.mistake) {
      Toastify({
        text: `${response.data.mistake}`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "orange",
          color: "white"
        },
        onClick: function () { }
      }).showToast();
    } else if (response.data && response.data.message) {
      Toastify({
        text: `${response.data.message}`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "green",
          color: "white"
        },
        onClick: function () { }
      }).showToast();
    } else {
      Toastify({
        text: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "red",
          color: "white"
        },
        onClick: function () { }
      }).showToast();
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la requête toggleState :', error);

    Toastify({
      text: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "red",
        color: "white"
      },
      onClick: function () { }
    }).showToast();

    throw error;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('logout-button').addEventListener('click', async function (event) {
    event.preventDefault();

    const token = localStorage.getItem('userToken');
   
    try {
      const response = await http.post('/users/logout');
      const data = await response.data;

      if (response.status == '200') {
        if(token){
          localStorage.removeItem('userToken');
          Toastify({
            text: data.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "green",
              color: "white"
            },
            onClick: function () { }
          }).showToast();
  
          window.location.href = 'signIn.html';
        }else{
          console.log('Aucun token')
    
        }
    
        
      } else {
        throw new Error(data.error || 'Une erreur s\'est produite lors de la déconnexion.');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      Toastify({
        text: "Une erreur s'est produite. Veuillez réessayer plus tard.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "red",
          color: "white"
        },
        onClick: function () { }
      }).showToast();
    }
  });
});


