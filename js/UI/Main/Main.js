import App from "../../App";
import { currentPage, showPage } from "../../Utils/DOMUtils";

export default class Main {
  constructor() {
    this.app = new App();
    this.config = this.app.config;
    this.init();
  }

  init() {
    document.title = this.config.get("name");
    document.querySelector("#favicon").href = this.config.get("icon");
    this.initBackgrounds();
    this.initScrollEvent();
  }

  initBackgrounds() {
    this.backgrounds = document.querySelector("#background");
    for (let i = 0; i < 2; i++) {
      let img = document.createElement("img");
      img.classList.add("notloaded");
      img.addEventListener("load", () => {
        img.classList.remove("notloaded");
      });
      this.backgrounds.appendChild(img);
    }

    this.backgrounds = this.backgrounds.children;
    this.backgrounds[0].src = this.config.get("wallpaper");
    this.backgrounds[1].src = this.config.get("wallpaper_dark");
  }

  initScrollEvent() {
    const servicesPage = document.querySelector(".page[p=services]");

    window.addEventListener("wheel", (e) => {
      if (currentPage === "home" && e.deltaY > 0) {
        showPage("services");
      }
      if (
        currentPage === "services" &&
        e.deltaY < 0 &&
        servicesPage.scrollTop === 0
      ) {
        showPage("home");
      }
    });
  }
}
