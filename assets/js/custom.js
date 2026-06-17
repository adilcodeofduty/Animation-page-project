

// Dropdown Js
$(document).ready(function () {
  $(".dropdown").hover(
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(100).slideDown(800);
    },
    function () {
      $(this).find(".dropdown-menu").stop(true, true).delay(100).fadeOut(800);
    }
  );

});

//Menu Active class
var links = document.querySelectorAll(".collapse ul li");
links.forEach(function (element) {
  element.addEventListener("click", function (e) {
    links.forEach(function (element) {
      element.classList.remove("active");
    });
    this.classList.add("active");
  });
});

//sticky cta strpe
// var btn = $("#sticky-panel");
// var closeBtn = $("#close");

// $(window).scroll(function () {
//   if ($(window).scrollTop() > 100) {
//     btn.addClass("show");
//   } else {
//     btn.removeClass("show");
//   }
// });

// closeBtn.click(function () {
//   btn.hide();
// });

//Form validate & API call
document.addEventListener("DOMContentLoaded", function () {
  const forms = [
    {
      formId: "mainContactForm",
      fields: [
        {
          id: "fullName1",
          errorId: "fullNameError1",
        },
        {
          id: "email1",
          errorId: "emailError1",
          validate: validateEmail,
        },
        {
          id: "phone1",
          errorId: "phoneError1",
          validate: validatePhone,
        },
        {
          id: "CompanyName1",
          errorId: "CompanyError1",
        },
      ],
      apiPayload: (fields) => ({
        formType: "FormWithoutProjectDescription",
        fullName: fields["fullName1"].value,
        email: fields["email1"].value,
        phone: fields["phone1"].value,
        organizationName: fields["CompanyName1"].value,
        projectDescription: null,
      }),
      successMessageId: "message1",
      errorMessageId: "erroemessage1",
    },
  ];

  forms.forEach(setupForm);

  function setupForm(formConfig) {
    const form = document.getElementById(formConfig.formId);
    // Ensure form exists before proceeding
    if (!form) return;
    const fields = formConfig.fields.reduce((acc, field) => {
      acc[field.id] = document.getElementById(field.id);
      return acc;
    }, {});

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const isValid = validateForm(fields, formConfig.fields);
      const successMessage = document.getElementById(
        formConfig.successMessageId
      );
      const errorMessage = document.getElementById(formConfig.errorMessageId);

      if (isValid) {
        const payload = formConfig.apiPayload(fields);
        sendFormData(payload, successMessage, errorMessage, form);
      }
    });
  }

  function validateForm(fields, fieldConfigs) {
    let isValid = true;
    fieldConfigs.forEach(({ id, errorId, validate }) => {
      const field = fields[id];
      const errorElement = document.getElementById(errorId);
      errorElement.style.display = "none";

      // Skip validation if field is blank and id matches 'projectDescription'
      if ((id === 'projectDescription' || id === 'projectDescription2') && !field.value.trim()) {
        return; // Skip validation for this field
      }


      if (!field.value.trim() || (validate && !validate(field.value))) {
        errorElement.style.display = "block";
        isValid = false;
      }
    });
    return isValid;
  }

  function sendFormData(payload, successMessage, errorMessage, form) {
    fetch("https://crm-stageapi.pacificabs.com:3003/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.ResponseStatus === "success") {
          window.location.href = 'https://technomark.io/thankyou.html';
          successMessage.style.display = "block";
          form.reset();
        } else {
          errorMessage.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        errorMessage.style.display = "block";
      });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    return phone.length === 10 && /^[0-9]+$/.test(phone);
  }
});

// Bottom to top button
$(document).on("click", "#return-to-top-1", function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
});

// Sticky navbar 
$(window).scroll(function(){
  var sticky = $('.main-header'),
      scroll = $(window).scrollTop();

  if (scroll >= 600) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});


//////// ScrollTrigger Animation  JS ///////

// Methodology tab js
gsap.registerPlugin(ScrollTrigger);

const pinSections = gsap.utils.toArray(".pin-section");
const lists = gsap.utils.toArray(".list");

pinSections.forEach((section, i) => {
  const list = lists[i];
  const fill = section.querySelector(".fill");
  const listItems = gsap.utils.toArray("li", list);
  const slides = gsap.utils.toArray(".slide-tab", section);
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=" + listItems.length * 50 + "%",
      pin: true,
      scrub: true,
      id: i + 1,
    }
  });

  fill && gsap.set(fill, { scaleY: 0 });
  
  listItems.forEach((item, j) => {
    if (listItems[j - 1]) {
      // Remove backgroundColor change, add class toggling
      tl.set(item, { className: "active" }, 0.5 * j)
        .to(
          slides[j],
          {
            autoAlpha: 1,
            duration: 0.2
          },
          "<"
        )
        .set(listItems[j - 1], { className: "-=active" }, "<")
        .to(
          slides[j - 1],
          {
            autoAlpha: 0,
            duration: 0.2
          },
          "<"
        );
    } else {
      tl.set(item, { className: "active" }, 0.01).to(
        slides[j],
        {
          autoAlpha: 1,
          duration: 0.2
        },
        "<"
      );
    }
  });
  
  tl.to({}, {}).to(
    fill,
    {
      scaleY: 1,
      transformOrigin: "top left",
      ease: "none",
      duration: tl.duration() - 0.5
    },
    0
  );
});


// Client speak slide js
// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
const slides = gsap.utils.toArray('.slide');
// Function to add/remove active class
const updateActiveClass = (index) => {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
};
// GSAP Timeline for smooth one-slide movement per scroll
gsap.fromTo(
  slides,
  { xPercent: 100 }, // Start the slides off to the right
  {
    xPercent: -100 * (slides.length - 1), 
    ease: "none",
    scrollTrigger: {
      trigger: ".client-section", 
      scroller: "body", 
      pin: true,                        
      scrub: 1,                         
      snap: 1 / (slides.length - 1),     
      start: "top top",                  
      end: "+=3000",                     
      onUpdate: (self) => {
        const index = Math.round(self.progress * (slides.length - 1)); 
        updateActiveClass(index); 
      },
    }
  }
);

// Set the initial active slide (starting from the first one)
updateActiveClass(0);

// FAQ Animation js
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const container = document.querySelector(".our-work");
const list = document.querySelector(".carousel__nav");
const listItems = gsap.utils.toArray(".carousel__nav__item", list);
const slides1 = gsap.utils.toArray(".carousel__item");
const tl = gsap.timeline();
const myST = ScrollTrigger.create({
	animation: tl,
  id: "st",
	trigger: container,
	start: "top top",
	end: "+=2500",
	pin: container,
	scrub: 3,
	snap: {
		snapTo: 1 / (slides1.length -1)
	},
	markers: false
})

gsap.set(slides1, {  xPercent: ()=>{ return (window.innerWidth<768?125:0)}, yPercent: ()=>{ return (window.innerWidth>768?125:0)},scale:0.5 ,opacity: 0 });
listItems.forEach((item, i) => {
  item.addEventListener("click", e => {
    e.preventDefault();
		const percent = tl.labels[e.target.getAttribute("data-target")] / tl.totalDuration();
    const scrollPos = myST.start + (myST.end - myST.start) * percent;
    gsap.to(window, {duration: 1, scrollTo: scrollPos});
	});
	
  const previousItem = listItems[i - 1];
  if (previousItem) {
    tl
			.to(item, { background: "#ed3c3c",boxShadow:'0 0 16px #ed3c3c' }, 0.5 * (i - 1))
      .to(
        slides1[i],
        {
          opacity: 1,
					yPercent: 0,
					xPercent: 0,
					scale:1,
        },
        '<'
      )
      .to(previousItem, { backgroundColor: '#424b58',	boxShadow:'0 0 16px transparent' }, '<')
      .to(
        slides1[i - 1],
        {
          opacity: 0,
					yPercent: ()=>{ return (window.innerWidth>768?-80:0)},
					xPercent: ()=>{ return (window.innerWidth<768?-80:0)},
					scale:0.5,
        },
        '<'
      ).add("our-work-"+(++i))
  } else {
		gsap.set(item, { background: "#ed3c3c",boxShadow:'0 0 16px #ed3c3c' });
    gsap.to(slides1[i], { yPercent:0, xPercent:0, opacity: 1,scale:1, duration:0},0);
		tl.add("our-work-"+(++i), "+=0")
  }
});



// Meet logo js
gsap.registerPlugin(ScrollTrigger);

gsap.from(".image1", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 80%", 
        end: "bottom 20%",
        scrub: true, 
        markers:false
    },
    x: 200,
    opacity: 0.5,
    duration: 1
});

gsap.from(".image2", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 60%",
        end: "bottom 40%",
        scrub: true,
       
    },
    y: 100,
    x: 200,
    opacity:1,
    duration: 1
});

gsap.from(".image3", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 40%",
        end: "bottom 60%",
        scrub: true,
    },
    x: 200,
    opacity: 1,
    duration: 1
});

gsap.from(".image4", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 20%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 200,
  opacity: 1,
  duration: 1
});

gsap.from(".image5", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 20%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 200,
  opacity: 1,
  duration: 1
});
gsap.from(".image6", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 300,
  opacity: 1,
  duration: 1
});

gsap.from(".image7", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 100,
  x:-80,
  opacity: 1,
  duration: 1
});

gsap.from(".image8", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 80%", 
      end: "bottom 20%",
      scrub: true, 
      markers:false
  },
  x: 200,
  y:80,
  opacity: 0.5,
  duration: 1
});

gsap.from(".image9", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 60%", 
      end: "bottom 40%",
      scrub: true, 
      markers:false
  },
  x: 200,
  opacity: 0.5,
  duration: 1
});
gsap.from(".image10", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 200,
  x:-80,
  opacity: 1,
  duration: 1
});
gsap.from(".image11", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 150,
  x:-80,
  opacity: 1,
  duration: 1
});

gsap.from(".image12", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  x: 100,
  y:20,
  opacity: 1,
  duration: 1
});

gsap.from(".image13", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  x: 150,
  y:80,
  opacity: 1,
  duration: 1
});

gsap.from(".image14", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  x: 100,
  y:40,
  opacity: 1,
  duration: 1
});
gsap.from(".image15", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 200,
  x:-20,
  opacity: 1,
  duration: 1
});

gsap.from(".image16", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 150,
  x:-60,
  opacity: 1,
  duration: 1
});
gsap.from(".image17", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  x: 200,
  y:80,
  opacity: 1,
  duration: 1
});

gsap.from(".image18", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  x: 180,
  y:80,
  opacity: 1,
  duration: 1
});

gsap.from(".image19", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 40%",
      end: "bottom 30%",
      scrub: true,
  },
  x: 180,
  y:80,
  opacity: 1,
  duration: 1
});


gsap.from(".image20", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 150,
  x:-30,
  opacity: 1,
  duration: 1
});

gsap.from(".image21", {
  scrollTrigger: {
      trigger: ".scroll-section",
      start: "top 30%",
      end: "bottom 40%",
      scrub: true,
  },
  y: 150,
  x:-80,
  opacity: 1,
  duration: 1
});
gsap.from(".text-content", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 50%",
        end: "bottom 50%",
        scrub: true,
    },
    opacity: 1,
    scale: 0.8,
    duration: 1
});





