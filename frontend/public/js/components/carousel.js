export function initCarousel1() {
  $('.owl-carousel1').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    },
    autoplay: false,
  });
}

export function initCarousel2() {
  $('.owl-carousel2').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      700: { items: 2 },
      900: { items: 2 },
      1000: { items: 2 },
      1024: { items: 3 },
      1368: { items: 2 }
    },
    autoplay: false,
  });
}
