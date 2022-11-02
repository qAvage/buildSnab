import './sass/main.scss'
import 'slick-carousel'
import 'slick-carousel/slick/slick.scss'
import 'magnific-popup'
import 'magnific-popup/dist/magnific-popup.css'
import 'inputmask/dist/jquery.inputmask'
import { load } from 'recaptcha-v3/dist/ReCaptcha'


function requireAll(r) {
  r.keys().forEach(r);
}
requireAll(require.context('./assets/svg/', true, /\.svg$/));



window.addEventListener("load", () => {
  const preload = document.querySelectorAll(".u-preload");
  for (let el of preload) {
    el.classList.remove("u-preload")
  } 
 });

$('.gallery-slider').slick({
  infinite: true,
  variableWidth: true,
  centerMode: true,
  slidesToShow: 5,
  centerPadding: '0',
  autoplay: true,
  autoplaySpeed: 5000,
  dots: true,
  appendDots: $('.custom-dots'),
  prevArrow: $('.prev-arrow'),
  nextArrow: $('.next-arrow'),
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
});

$('.reviews-slider').slick({
  infinite: true,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 5000,
  prevArrow: $('.prev-arrow-review'),
  nextArrow: $('.next-arrow-review'),
  responsive: [
    {
      breakpoint: 300,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
});





const mainFrm = document.getElementById('main-form')
const subFrm = document.getElementById('sub-form')
const boxInputName = document.getElementById('choose-file')
const frms = [mainFrm, subFrm]



function getArrayFromInputFiles () {
  return Array.from((document.getElementById('profile')).files).map(f => { return f })
}

function removeElFromBoxInput() {
  boxInputName.innerHTML = ""
}

$("#profile").change(function(){
  const arrayInputFile = getArrayFromInputFiles()
  removeElFromBoxInput()
  for (let i = 0, l = arrayInputFile.length; i < l; i++) {
    const newElem = document.createElement('p')
    const text = document.createTextNode(arrayInputFile[i].name)
    newElem.appendChild( text );
    boxInputName.appendChild( newElem );
  }
});

function validateFieldByNameValue (name = 'global', value, filesArray) {
  let error = null
  const createReason = name => message => ({ name, message })
  if (name === 'global') return { name: 'global', message: 'Проверяемое поле не имеет атрибута name' }
  const setReason = createReason(name)
  if (name === 'name') {
    if (!value) return setReason('Поле обязательное к заполнению')
    if (value.length < 2 ) return setReason('Имя не должно содержать менее двух символов')
    if (value.length > 100 ) return setReason('Имя не должно содержать более ста символов')
  }
  if (name === 'phone') {
  }
  if (name === 'politic') {
    
  }
  if (name === 'comment') {
    
  }
  if (name === 'userfile[]') {
    if (filesArray.length >= 10) return setReason('Файлов не должно быть больше десяти')
    let total = 0
    for (let i = 0, l = filesArray.length; i < l; i++) {
      total += filesArray[i].size
    }
    if (total > 10485760) return setReason('Общий размер файлов не должен превышать 10 Мегабайт')
  }
  return error
}

function renderFieldsError (errors, ctx) {

  for (let i = 0, l = errors.length; i < l; i++) {
    const { name, message } = errors[i]
    if (name === 'global') {

    } else {
      const parentEl = ctx.elements[name].parentElement
      parentEl.classList.add('with-error')
      parentEl.children[parentEl.children.length - 1].innerHTML = message
    }
  }
}

function clearFieldsError (fields, ctx) {
  for (let i = 0, l = fields.length; i < l; i++) {
    const parentEl = ctx.elements[fields[i]].parentElement
    parentEl.classList.remove('with-error')
    parentEl.children[parentEl.children.length - 1].innerHTML = ''
  }

  ctx.children[ctx.children.length - 1].innerHTML = ''
}



frms.forEach(el => {
  el.addEventListener('submit', function (e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    load('6LdoOcUhAAAAAI4_6dYjxm_YEDHr7Qmz5UTD5zWr', {
    }).then((recaptcha) => {
      recaptcha.execute('submit').then((token) => {
        const ctx = this
        ctx.querySelector('.input-token').value = token
        const fields = ['name', 'phone', 'politic']
        let timePopup = 0
        if ($(ctx).attr('id') === 'sub-form') {
          fields.push('email', 'comment', 'userfile[]')
          timePopup = 300
        }
        clearFieldsError(fields, ctx)
        const data = new FormData(ctx);
        const errors = [];
        for (let i = 0, l = fields.length; i < l; i++) {
          const error = validateFieldByNameValue(fields[i], data.get(fields[i]), getArrayFromInputFiles())
          if (error) errors[errors.length] = error
        }
        if (errors.length > 0) return renderFieldsError(errors, ctx)
    
        fetch("sub-mail.php",{
          method: 'post',
          body: data,
        })
        .then(response => response.text()) 
        .then(data => {
          removeElFromBoxInput()
          ctx.reset()
          $.magnificPopup.close()
          setTimeout(() => {
            $.magnificPopup.open({
              items: {
                src: '#success-popup'
              },
              type: 'inline',
              removalDelay: 300,
              delegate: 'a',
              mainClass: 'mfp-fade',
              showCloseBtn: false,
              callbacks: {
                open: function() {
                  setTimeout(() => {
                    $.magnificPopup.close();
                  }, 1500);
                }
              },
            });
          }, timePopup);
        });
      })
    })
  })
})
// Mask


$(document).ready(function(){
  $('.phone').inputmask("+7 (999) 999 99 99");
});





// Popup



$(document).ready(function() {
  $('.inline-popups, .form-popup').magnificPopup({
    type:'inline',
    delegate: 'a',
    closeBtnInside:true,
    removalDelay: 300,
    mainClass: 'mfp-fade',
    callbacks: {
      beforeOpen: function() {
        $('body').addClass('mfp-active');
      },
      beforeClose: function() {
        $('body').removeClass('mfp-active');
      },
      close: function() {
        removeElFromBoxInput()
        const inputFields = document.querySelectorAll('.clear-fields')
        inputFields.forEach(el => {
          el.value = ''
        })
      }
    },
    midClick: true
  });

    
  setTimeout(() => {
    $.magnificPopup.open({
      items: {
        src: '#choice-popup'
      },
      type: 'inline',
      removalDelay: 300,
      delegate: 'a',
      mainClass: 'mfp-fade',
      enableEscapeKey: false,
      showCloseBtn: false,
      callbacks: {
        beforeOpen: function() {
          $('body').addClass('mfp-active');
        },
        beforeClose: function() {
          $('body').removeClass('mfp-active');
        },
        open: function() {
          $('#choice-popup-stay').click(() => {
            $.magnificPopup.close();
          })
        }
      },
    });
  }, 2500);
});






// Smooth scroll

$('a[href*="#"]')
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr('tabindex','-1');
            $target.focus();
          };
        });
      }
    }
  });


// Mobile-menu

const headTop = document.getElementById('header-top')
const mobMenu = document.getElementById('mobileMenu')
const togBut = document.getElementById('toggle-button')
const bgOverlayOpen = document.getElementById('bg-overlay')

const closeMenu = () => {
  headTop.classList.remove('open')
  bgOverlayOpen.classList.remove('bg-overlay-open')
}


$('#toggle-button').click(function() {
  $(headTop).toggleClass('open');
  $(bgOverlayOpen).toggleClass('bg-overlay-open');
});

$(document).click(e => {
  const isClickInside = togBut.contains(e.target);
  const isClickInsideSub = mobMenu.contains(e.target);
  if (!isClickInside && !isClickInsideSub) {
    closeMenu()
  }
})



$(document).scroll(() => {
  if (window.scrollY > 200) {
    closeMenu()
  }
})

