import { useState, useEffect, useRef, SyntheticEvent } from "react";
import "./Slider.css";
import "../interfaces.ts";
import "../FrameHandler.ts";
import "../Easings.ts";

import img1front from "./assets/img/img_1_front.png";
import img2front from "./assets/img/img_2_front.png";
import img3front from "./assets/img/img_3_front.png";
import img4front from "./assets/img/img_4_front.png";
import img5front from "./assets/img/img_5_front.png";
import img1back from "./assets/img/img_1_back.jpg";
import img2back from "./assets/img/img_2_back.jpg";
import img3back from "./assets/img/img_3_back.jpg";
import img4back from "./assets/img/img_4_back.jpg";
import img5back from "./assets/img/img_5_back.png";

import { FrameHandler } from "../FrameHandler.ts";
import "../Easings.ts";

const imageURI = [
  { imgBack: img1back, imgFront: img1front },
  { imgBack: img2back, imgFront: img2front },
  { imgBack: img3back, imgFront: img3front },
  { imgBack: img4back, imgFront: img4front },
  { imgBack: img5back, imgFront: img5front },
];

const data: mockData[] = [
  {
    title: "header_1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imgBack: null,
    imgFront: null,
    imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z",
  },
  {
    title: "header_2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imgBack: null,
    imgFront: null,
    imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z",
  },
  {
    title: "header_3",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imgBack: null,
    imgFront: null,
    imgFrontClipPath: "M 0 50 h 920 v 621  L 807 621 h -967 Z",
  },
  {
    title: "header_4",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imgBack: null,
    imgFront: null,
    imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -967 Z",
  },
  {
    title: "header_5",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    imgBack: null,
    imgFront: null,
    imgFrontClipPath: "M 0 0 h 847 v 481  L 807 531 h -120 v 20 h -910 Z",
  },
];

let mouseMoveStartPosition = -1;
let offset = -1;

function Slider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //
  const timer1 = useRef(0);
  const timer2 = useRef(0);
  const timer3 = useRef(0);
  //
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null);
  const [counter, setCounter] = useState(0);
  const [currentPointerX, setCurrentPointerX] = useState(0);
  const [isFetchingComplete, setIsFetchingComplete] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  function changeSlide(e: SyntheticEvent): void {
    const target: HTMLElement = e.target as HTMLElement;
    if (target.textContent) {
      setCurrentSlide(parseInt(target.textContent) - 1);
      setCounter(parseInt(target.textContent) - 1);
    }
  }

  function nextSlide() {
    setCounter(counter + 1);
  }

  function previousSlide() {
    setCounter(counter - 1);
  }

  function getPointerPosition(e: MouseEvent) {
    e.preventDefault();
    setCurrentPointerX(e.clientX);
  }

  useEffect(() => {
    setCtx(canvasRef.current?.getContext("2d"));
  }, []);

  //fetch images
  useEffect(() => {
    let promises = [];

    for (let i = 0; i < imageURI.length; i++) {
      let fetchImgBack = fetch(imageURI[i].imgBack)
        .then((result) => {
          return result.blob();
        })
        .then((blob) => {
          return createImageBitmap(blob);
        })
        .then((imgBitmap) => {
          data[i].imgBack = imgBitmap;
        });

      let fetchImgFront = fetch(imageURI[i].imgFront)
        .then((result) => {
          return result.blob();
        })
        .then((blob) => {
          return createImageBitmap(blob);
        })
        .then((imgBitmap) => {
          data[i].imgFront = imgBitmap;
        });

      promises.push(fetchImgBack);
      promises.push(fetchImgFront);
    }

    Promise.all(promises).then(() => {
      setIsFetchingComplete(true);
    });
  }, []);

  // draw
  useEffect(() => {
    let imgOpacity = 0;

    const fhAnimationShow = new FrameHandler(animationShow);
    const fhAnimationHide = new FrameHandler(animationHide);
    const post = document.getElementById("newsBlock_post");
    const postHeader = document.getElementById("newsBlock_post_textHeader");
    const postText = document.getElementById("newsBlock_post_text");

    function animationShow(delta: number) {
      const imgBack = data[currentSlide].imgBack;
      const imgFront = data[currentSlide].imgFront;

      if (canvasRef.current && ctx && imgBack && imgFront) {
        canvasRef.current.width = imgBack.width;
        canvasRef.current.height = imgBack.height;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalAlpha = imgOpacity;
        ctx.save();

        let gradient = ctx.createRadialGradient(canvasRef.current.width, canvasRef.current.height / 2, 0, canvasRef.current.width, canvasRef.current.height / 2, canvasRef.current.width * 0.8);
        gradient.addColorStop(0, "#FFFFFFFF");
        gradient.addColorStop(1, "#00000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalCompositeOperation = "source-in";

        ctx.drawImage(imgBack, 0, 0);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(imgFront, 0, 0);
        imgOpacity += 0.01 * delta;
        if (imgOpacity >= 1) {
          fhAnimationShow.stop();
        }
      }
    }

    function animationHide(delta: number) {
      const imgBack = data[currentSlide].imgBack;
      const imgFront = data[currentSlide].imgFront;

      if (canvasRef.current && ctx && imgBack && imgFront) {
        canvasRef.current.width = imgBack.width;
        canvasRef.current.height = imgBack.height;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalAlpha = imgOpacity;
        ctx.save();

        let gradient = ctx.createRadialGradient(canvasRef.current.width, canvasRef.current.height / 2, 0, canvasRef.current.width, canvasRef.current.height / 2, canvasRef.current.width * 0.8);
        gradient.addColorStop(0, "#FFFFFFFF");
        gradient.addColorStop(1, "#00000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalCompositeOperation = "source-in";

        ctx.drawImage(imgBack, offset / 60, 0);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(imgFront, offset / 20, 0);
        imgOpacity -= 0.01 * delta;
        if (imgOpacity <= 0) {
          fhAnimationHide.stop();
        }
      }
    }

    if (isFetchingComplete) {
      timer1.current = setTimeout(() => {
        window.addEventListener("mousemove", getPointerPosition);
      }, 1500);

      timer2.current = setTimeout(() => {
        window.removeEventListener("mousemove", getPointerPosition);

        if (post) {
          post.className = "newsBlock_post-hidden";
        }

        fhAnimationHide.start();
      }, 4000);

      timer3.current = setTimeout(() => {
        mouseMoveStartPosition = -1;
        offset = -1;
        setCounter(counter + 1);
      }, 5500);

      if (post && postText && postHeader) {
        post.className = "newsBlock_post-shown";
        postHeader.textContent = data[currentSlide].title;
        postText.textContent = data[currentSlide].text;
      }
      fhAnimationShow.start();
    }

    return () => {
      clearTimeout(timer1.current);
      clearTimeout(timer2.current);
      clearTimeout(timer3.current);
    };
  }, [isFetchingComplete, currentSlide]);

  // parallax drawing
  useEffect(() => {
    const imgBack = data[currentSlide].imgBack;
    const imgFront = data[currentSlide].imgFront;

    function animationParallax() {
      if (mouseMoveStartPosition === -1) {
        mouseMoveStartPosition = currentPointerX;
      }

      offset = currentPointerX - mouseMoveStartPosition;

      if (canvasRef.current && ctx && imgBack && imgFront) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.save();

        let gradient = ctx.createRadialGradient(canvasRef.current.width, canvasRef.current.height / 2, 0, canvasRef.current.width, canvasRef.current.height / 2, canvasRef.current.width * 0.8);
        gradient.addColorStop(0, "#FFFFFFFF");
        gradient.addColorStop(1, "#00000000");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.globalCompositeOperation = "source-in";

        ctx.drawImage(imgBack, offset / 60, 0);
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(imgFront, offset / 20, 0);
      }
    }

    animationParallax();
  }, [currentPointerX]);

  //slide change
  useEffect(() => {
    setCurrentSlide(counter % 5);
  }, [counter]);

  return (
    <>
      <div className="slider_wrapper">
        <div className="slider_contentWrapper">
          <button className="slider_changeSlideButton" id="slider_changeSlideButtonPrev" onClick={previousSlide}>
            Prev
          </button>
          <button className="slider_changeSlideButton" id="slider_changeSlideButtonNext" onClick={nextSlide}>
            Next
          </button>
          <canvas id="slider_canvas" ref={canvasRef}></canvas>
          <div id="newsBlock_postholder">
            <div className="newsBlock_post-hidden" id="newsBlock_post">
              <h1 id="newsBlock_post_textHeader"></h1>
              <h2 id="newsBlock_post_text"></h2>
            </div>
          </div>
        </div>
        <div className="slider_navpanel">
          <button className="slider_navButton" onClick={changeSlide}>
            1
          </button>
          <button className="slider_navButton" onClick={changeSlide}>
            2
          </button>
          <button className="slider_navButton" onClick={changeSlide}>
            3
          </button>
          <button className="slider_navButton" onClick={changeSlide}>
            4
          </button>
          <button className="slider_navButton" onClick={changeSlide}>
            5
          </button>
        </div>
      </div>
    </>
  );
}

export default Slider;
