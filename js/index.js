const Home = {
  elem: () => {
    return document.getElementById("home");
  },
  link: () => {
    return document.getElementById("homeLink");
  },
  setBg: function(canvas, container) {
    const canvasElements = document.getElementsByTagName("canvas");

    if (container.contains(canvasElements[0])) {
      for (element of canvasElements) {
        container.removeChild(element);
      }
      container.appendChild(canvas);
    } else {
      container.appendChild(canvas);
    }
  },

  resize: function() {
    Home.setBg(getTriangle(Home.elem()), Home.elem());
  }
};

const Modal = {
  CurrentSet: null,
  ProjectData: {
    TAU: [
      {
        Src: "imgs/TAU/ss-TAU-entry.png",
        Caption: "Entry Menu Options",
        Description:
          "TAU, named for the lab I was working in when I designed it, was initially created to make our gas cylinder inventory management easier. Eventually we began adapting it to manage maintenance and use of our vacuum pumps as well as handle some automatic notifications. The application entry menu displays the three main pages available, as well as the date of the last gas inventory for faster access."
      },
      {
        Src: "imgs/TAU/ss-TAU-loginForm.png",
        Caption: "Login Menu",
        Description:
          "The login menu here is fairly simplistic, with most of the logic handled by Google Firebase's cloud authentication. TAU had strict time demands as it was only one of several work projects I was juggling at the time, while also a full time student. As a result I focused on functionality over aesthetics."
      },
      {
        Src: "imgs/TAU/ss-TAU-gasMenu.png",
        Caption: "Room Selection Menu",
        Description:
          "My plan for a user interface was to use a use a generator that would spit out these card elements, given an array of objects. These cards could reflect several different parameters such as the total contained objects counter here. Each card is associated with a gas cylinder location. The array of objects is fetched from the Firebase Realtime Database on succesful authentication into the app. Each Card is a link to another Card list, containing the contents of the parent."
      },
      {
        Src: "imgs/TAU/ss-TAU-sideMenu.png",
        Caption: "Side Menu",
        Description:
          "This is a quick glance at the side menu which allowed quick navigation between inventories. Each inventory has it's own unique options such as the Verify Inventory option here, for the Gas Inventory. The options invoke NodeJS functions held in Firebase's cloud. In this case the verification changes the last inventory date and sends e-mails to the administrators letting them know the inventory is complete."
      },
      {
        Src: "imgs/TAU/ss-TAU-cylDetails.png",
        Caption: "Cylinder details menu",
        Description:
          "Once arriving at the end of the data tree, users can see the details associated with an inventory object, such as a gas cylinder. With high enough access level they can also edit or remove the object."
      }
    ]
  },
  SlideIndex: 0,
  BuildClips: function() {
    const container = $elem("modal-clip-container");
    const { ProjectData, CurrentSet, SlideIndex } = this;
    //img of ProjectData[CurrentSet]
    for (let i = 0; i < ProjectData[CurrentSet].length; i++) {
      const clipContainer = $makeElem("div");
      clipContainer.classList.add("modal-clip-column");
      clipContainer.onclick = function() {
        Modal.SetSlide(i);
      };

      const clip = $makeElem("img");
      clip.classList.add("modal-clip");
      clip.src = ProjectData[CurrentSet][i].Src;

      clipContainer.appendChild(clip);
      container.appendChild(clipContainer);
    }
  },
  BuildModal: function() {
    this.BuildSlides();
    this.BuildClips();
  },
  BuildSlides: function() {
    const caption = $elem("modal-caption");
    const description = $elem("modal-description");
    const slide = $elem("slide");
    const { ProjectData, CurrentSet, SlideIndex } = this;
    const index = Math.abs(SlideIndex % ProjectData[CurrentSet].length);

    caption.innerText = ProjectData[CurrentSet][index].Caption;
    description.innerText = ProjectData[CurrentSet][index].Description;
    slide.src = ProjectData[CurrentSet][index].Src;
  },
  ChangeSlide: function(n) {
    this.SlideIndex = this.SlideIndex + n;

    this.BuildSlides();
  },
  ClearClips: function() {
    const elem = $elem("modal-clip-container");
    while (elem.hasChildNodes()) {
      elem.removeChild(elem.lastChild);
    }
  },
  Close: function() {
    $elem("modal").style.display = "none";
    this.CurrentSet = null;
    this.ClearClips();
  },
  Open: function(dataset) {
    this.CurrentSet = dataset;
    this.SlideIndex = 0;
    this.BuildModal();
    $elem("modal").style.display = "block";
  },
  SetSlide: function(index) {
    Modal.SlideIndex = index;
    Modal.BuildSlides();
  }
};

const Nav = {
  chkScroll: function() {
    const yCoord = Math.floor(window.pageYOffset);

    Object.keys(Nav.sectionOffsets).map(id => {
      const offset = Nav.sectionOffsets[id];
      const delta = yCoord - offset;
      if (delta < 150 && delta > -150) {
        Nav.setActive($elem(`${id}Link`));
      }
    });
  },
  elem: () => {
    return document.getElementById("top-nav");
  },
  getActive: () => {
    return document.getElementsByClassName("active");
  },
  getOffsets: function() {
    const sectionIds = ["home", "about", "portfolio", "contact"];
    const sectionOffsets = {};

    sectionIds.forEach(index => {
      const offset = document.getElementById(index).offsetTop;
      sectionOffsets[index] = offset;
    });

    this.sectionOffsets = sectionOffsets;
  },
  init: function() {
    const links = this.elem().getElementsByTagName("a");

    for (link of links) {
      link.addEventListener("click", e => Nav.setActive(e.target));
    }
  },

  setActive: function(newActive) {
    for (link of this.getActive()) {
      if (link !== newActive) {
        link.classList.remove("active");
      }
    }
    newActive.classList = "active";
  }
};

function init() {
  const eventListeners = [["resize", resize], ["scroll", Nav.chkScroll]];

  resize();
  Nav.init();

  function setListeners(boolean) {
    for (listener of eventListeners) {
      const event = listener[0];
      const func = listener[1];

      boolean
        ? window.addEventListener(event, func)
        : window.removeEventListener(event, func);
    }
  }

  function resize() {
    Home.resize();
    Nav.getOffsets();
    setListeners(false);
    setListeners(true);
  }
}

function $elem(id) {
  return document.getElementById(id);
}

function $makeElem(tag) {
  return document.createElement(tag);
}

function getTriangle(container) {
  const { width, height } = container.getBoundingClientRect();

  const pattern = Trianglify({
    width: width > 0 ? width : window.innerWidth,
    height: height > 0 ? height : window.innerHeight,
    x_colors: "GnBu"
  });

  const canvas = pattern.canvas();

  Object.assign(canvas.style, { position: "fixed", top: 0, "z-index": -1 });

  return canvas;
}
