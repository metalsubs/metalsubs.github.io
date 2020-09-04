import libass from 'libass-wasm'

function configure(player) {
  function configurePlayer(instance, player) {
      function resizePlayer() {
        // canvasParent.style.position = "relative"
        canvas.style.display = "block"
        canvas.style.position = "absolute"
        canvas.style.width = player.el_.offsetWidth + "px"
        canvas.style.height = player.el_.offsetHeight + "px"
        canvas.style.top = "0px" //player.el_.offsetTop + "px";
        canvas.style.left = "0px" // player.el_.offsetLeft + "px";
        canvas.style.pointerEvents = "none"

        console.log({
          offsetWidth: player.el_.offsetWidth,
          offsetHeight: player.el_.offsetHeight,
          offsetTop: player.el_.offsetTop,
          offsetLeft: player.el_.offsetLeft,
        })

        instance.resize(
          player.el_.offsetWidth,
          player.el_.offsetHeight,
          player.el_.offsetTop,
          player.el_.offsetLeft
        )
      }
    function resizePlayerWithTimeout() {
      resizePlayer()
      setTimeout(resizePlayer, 100)
    }
    const timeupdate = function () {
      instance.setCurrentTime(player.currentTime() + instance.timeOffset)
    }

    player.on("timeupdate", timeupdate)

    player.on("playing", function () {
      instance.setIsPaused(false, player.currentTime() + instance.timeOffset)
    })

    player.on("pause", function () {
      instance.setIsPaused(true, player.currentTime() + instance.timeOffset)
    })

    player.on("seeking", function () {
      player.off("timeupdate", timeupdate)
    })

    player.on("seeked", function () {
      player.on("timeupdate", timeupdate)
      instance.setCurrentTime(player.currentTime() + instance.timeOffset)
    })

    player.on("ratechange", function () {
      instance.setRate(player.playbackRate())
    })

    player.on("timeupdate", function () {
      instance.setCurrentTime(player.currentTime() + instance.timeOffset)
    })

    player.on("waiting", function () {
      instance.setIsPaused(true, player.currentTime() + instance.timeOffset)
    })

    document.addEventListener("fullscreenchange", () => {
      console.log(">>> fullscreenchange")
      resizePlayerWithTimeout()
    })
    document.addEventListener("mozfullscreenchange", () => {
      console.log(">>> mozfullscreenchange")
      resizePlayerWithTimeout()
    })
    document.addEventListener("webkitfullscreenchange", () => {
      console.log(">>> webkitfullscreenchange")
      resizePlayerWithTimeout()
    })
    document.addEventListener("msfullscreenchange", () => {
      console.log(">>> msfullscreenchange")
      resizePlayerWithTimeout()
    })
    window.addEventListener("resize", () => {
      console.log(">>> resize")
      resizePlayerWithTimeout()
    })

    // Support Element Resize Observer
    // if (typeof ResizeObserver !== "undefined") {
    //   self.ro = new ResizeObserver(instance.resizeWithTimeout);
    //   self.ro.observe(self.video);
    // }

    if (player.videoWidth() > 0) {
      // instance.resize(840, 460, 0, 0);
      resizePlayerWithTimeout()
    } else {
      player.on("loadedmetadata", function (e) {
        // e.target.removeEventListener(e.type, arguments.callee)
        // instance.resize(840, 460, 0, 0);
        console.log(">>> loadedmetadata", e)
        resizePlayerWithTimeout()
      })
    }
  }
  const video = document.getElementById("vjs_video_3_youtube_api")
  const canvas = document.createElement("canvas")
  const canvasParent = document.createElement("div")

  canvas.className = "libassjs-canvas"
  canvas.style.display = "none"

  canvasParent.className = "libassjs-canvas-parent"
  canvasParent.appendChild(canvas)

  if (video.nextSibling) {
    video.parentNode.insertBefore(canvasParent, video.nextSibling)
  } else {
    video.parentNode.appendChild(canvasParent)
  }

  var options = {
    canvas,
    subUrl: "marching-for-liberty.ass",
    fonts: [
      "UnifrakturMaguntia-Book.ttf",
      "BilboSwashCaps-Regular.ttf",
      "StardosStencil-Regular.ttf",
    ],
    debug: false,
    onError: function (err) {
      console.log(err)
    },
    workerUrl: "subtitles-octopus-worker.js",
  }

  const octopusInstance = new libass(options)
  configurePlayer(octopusInstance, player)
}

export default configure
