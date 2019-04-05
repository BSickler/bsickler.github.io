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
    const sectionIds = ["home", "about", "works", "contact"];
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
