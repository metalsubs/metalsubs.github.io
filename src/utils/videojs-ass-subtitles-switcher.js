/*! videojs-ass-subtitles-switcher - 2015-7-26
 * Copyright (c) 2016 Kasper Moskwiak
 * Modified by Pierre Kraft
 * Licensed under the Apache-2.0 license. */

(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    var videojs = require("video.js");
    var SubtitlesOctopus = require("libass-wasm");
    module.exports = factory(
      videojs.default || videojs,
      SubtitlesOctopus.default || SubtitlesOctopus
    );
  } else {
    root.Youtube = factory(root.videojs, root.SubtitlesOctopus);
  }
})(this, function (videojs, SubtitlesOctopus) {

  /**
   * Initialize the plugin.
   * @param {object} [options] configuration for the plugin
   */
  var videoJsASSSubtitlesSwitcher = function (
    options
  ) {
    var settings = options
    var player = this
    var canvas
    var video
    var octopus

    window.player = player

    var createCanvasElement = function (videoElement) {
      var canvas = document.createElement("canvas")
      var canvasParent = document.createElement("div")
      canvas.className = "libassjs-canvas"
      canvas.style.display = "none"
      canvas.style.border = "1px solid green"

      canvasParent.className = "libassjs-canvas-parent"
      canvasParent.appendChild(canvas)

      if (videoElement.nextSibling) {
        videoElement.parentNode.insertBefore(
          canvasParent,
          videoElement.nextSibling
        )
      } else {
        videoElement.parentNode.appendChild(canvasParent)
      }

      return canvas
    }

    var resizePlayer = function () {
      var size = {
        width: 1920,
        height: 1080,
      }
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
        octopus.resize(
          size.width, //player.el_.offsetWidth,
          size.height, //player.el_.offsetHeight,
          0, // player.el_.offsetTop,
          0 // player.el_.offsetLeft
        )
      }
    }

    var resizePlayerWithTimeout = function () {
      resizePlayer()
      setTimeout(resizePlayer, 100)
    }

    var timeupdate = function () {
      octopus.setCurrentTime(player.currentTime() + octopus.timeOffset)
    }

    var configurePlayer = function () {
      player.on("timeupdate", timeupdate)

      player.on("playing", function () {
        octopus.setIsPaused(false, player.currentTime() + octopus.timeOffset)
      })

      player.on("pause", function () {
        octopus.setIsPaused(true, player.currentTime() + octopus.timeOffset)
      })

      player.on("seeking", function () {
        player.off("timeupdate", timeupdate)
      })

      player.on("seeked", function () {
        player.on("timeupdate", timeupdate)
        octopus.setCurrentTime(player.currentTime() + octopus.timeOffset)
      })

      player.on("ratechange", function () {
        octopus.setRate(player.playbackRate())
      })

      player.on("timeupdate", function () {
        octopus.setCurrentTime(player.currentTime() + octopus.timeOffset)
      })

      player.on("waiting", function () {
        octopus.setIsPaused(true, player.currentTime() + octopus.timeOffset)
      })

      document.addEventListener("fullscreenchange", resizePlayerWithTimeout)
      document.addEventListener("mozfullscreenchange", resizePlayerWithTimeout)
      document.addEventListener(
        "webkitfullscreenchange",
        resizePlayerWithTimeout
      )
      document.addEventListener("msfullscreenchange", resizePlayerWithTimeout)
      window.addEventListener("resize", resizePlayerWithTimeout)

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
    }

    var dispose = function () {
      if (this.octopus) {
        this.octopus.instance.dispose()
      }

      document.removeEventListener("fullscreenchange", resizePlayerWithTimeout)
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
    }

    player.ready(function () {
      console.log("settings", settings)
      video = document.querySelector(settings.videoSelector)
      canvas = createCanvasElement(video);
      var octopusOptions = settings.octopus;
      var selectedSubtitle = settings.subtitles.find(
        subtitle => subtitle.selected
      );

      octopusOptions.subUrl = selectedSubtitle.src;
      octopusOptions.canvas = canvas;

      octopus = new SubtitlesOctopus(octopusOptions);
      window.octopus = octopus;

      configurePlayer();
    })

    return {
      dispose: dispose,
    }
  }

  // register the plugin
  videojs.plugin("videoJsASSSubtitlesSwitcher", videoJsASSSubtitlesSwitcher);
});
