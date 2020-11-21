import libass from "libass-wasm"

function configure(player, subtitle, fonts) {
  function configurePlayer(instance, player) {
    function resizePlayer() {
      canvas.style.display = "block"
      canvas.style.position = "absolute"

      if (player && player.el_) {
        if (player.el_.offsetWidth) {
          canvas.style.width = player.el_.offsetWidth + "px"
        }

        if (player.el_.offsetHeight) {
          canvas.style.height = player.el_.offsetHeight + "px"
        }
      }

      canvas.style.height = player.el_.offsetHeight + "px"
      canvas.style.top = "0px" //player.el_.offsetTop + "px";
      canvas.style.left = "0px" // player.el_.offsetLeft + "px";
      canvas.style.pointerEvents = "none"

      if (
        player &&
        player.el_ &&
        player.el_.offsetWidth !== undefined &&
        player.el_.offsetHeight !== undefined &&
        player.el_.offsetTop !== undefined &&
        player.el_.offsetLeft !== undefined
      ) {
        instance.resize(
          player.el_.offsetWidth,
          player.el_.offsetHeight,
          player.el_.offsetTop,
          player.el_.offsetLeft
        )
      }
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

    document.addEventListener("fullscreenchange", resizePlayerWithTimeout);
    document.addEventListener("mozfullscreenchange", resizePlayerWithTimeout);
    document.addEventListener("webkitfullscreenchange", resizePlayerWithTimeout);
    document.addEventListener("msfullscreenchange", resizePlayerWithTimeout);
    window.addEventListener("resize", resizePlayerWithTimeout);

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
        resizePlayerWithTimeout()
      })
    }

    return {
      dispose: function dispose() {
        if (octopusInstance) {
          octopusInstance.dispose()
        }

        document.removeEventListener(
          "fullscreenchange",
          resizePlayerWithTimeout
        )
        document.removeEventListener(
          "mozfullscreenchange",
          resizePlayerWithTimeout
        )
        document.removeEventListener(
          "webkitfullscreenchange",
          resizePlayerWithTimeout
        )
        document.removeEventListener(
          "msfullscreenchange",
          resizePlayerWithTimeout
        )
        window.removeEventListener("resize", resizePlayerWithTimeout)
      },
    };
  }
  // const video = document.getElementById("vjs_video_3_youtube_api")
  const video = document.querySelector("iframe[id^='vjs_video']")
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
    subUrl: subtitle,
    fonts,
    debug: false,
    onError: function (err) {
      console.error(err)
    },
    workerUrl: "/octopus/subtitles-octopus-worker.js",
  }

  const octopusInstance = new libass(options)
  return configurePlayer(octopusInstance, player)
}

export default configure
