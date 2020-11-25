/*! videojs-ass-subtitles-switcher - 2015-7-26
 * Copyright (c) 2016 Kasper Moskwiak
 * Modified by Pierre Kraft
 * Licensed under the Apache-2.0 license. */

;(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    var videojs = require("video.js")
    var SubtitlesOctopus = require("libass-wasm")
    module.exports = factory(
      videojs.default || videojs,
      SubtitlesOctopus.default || SubtitlesOctopus
    )
  } else {
    root.Youtube = factory(root.videojs, root.SubtitlesOctopus)
  }
})(this, function (videojs, SubtitlesOctopus) {
  /**
   * Initialize the plugin.
   * @param {object} [options] configuration for the plugin
   */
  var videoJsASSSubtitlesSwitcher = function (options) {
    var settings = options
    var player = this
    var canvas
    var video
    var _octopus
    var _subtitles
    var _subtitleButton
    var _config = {
      displayCurrentSubtitle: false,
    }
    var _subtitleItems = []

    var label = document.createElement("span")

    videojs.dom.addClass(label, "vjs-resolution-button-label")

    window.player = player

    // ---------
    var VideoJsMenuButton = videojs.getComponent("MenuButton")
    var VideoJsMenu = videojs.getComponent("Menu")
    var VideoJsComponent = videojs.getComponent("Component")
    var VideoJsMenuItem = videojs.getComponent("MenuItem")
    const VideoJsDom = videojs.dom

    var ConcreteButton = videojs.extend(VideoJsMenuButton, {
      constructor(player) {
        VideoJsMenuButton.call(this, player, {
          title: player.localize("Subtitles"),
          name: "SubtitleButton",
        })
      },
      createItems() {},
      createMenu() {
        var menu = new VideoJsMenu(this.player, { menuButton: this })

        this.hideThreshold_ = 0

        // Add a title list item to the top
        if (this.options_.title) {
          const titleEl = VideoJsDom.createEl("li", {
            className: "vjs-menu-title",
            // innerHTML: toTitleCase(this.options_.title),
            innerHTML: this.options_.title,
            tabIndex: -1,
          })
          const titleComponent = new VideoJsComponent(this.player, {
            el: titleEl,
          })

          this.hideThreshold_ += 1

          menu.addItem(titleComponent)
        }

        this.items = this.createItems()

        if (this.items) {
          // Add menu items to the menu
          for (let i = 0; i < this.items.length; i++) {
            menu.addItem(this.items[i])
          }
        }

        return menu
      },
    })

    /**
     * Extend vjs menu item class.
     */
    var ConcreteMenuItem = videojs.extend(VideoJsMenuItem, {
      constructor(player, item, subtitleButton, plugin) {
        VideoJsMenuItem.call(this, player, {
          label: item.label,
          selectable: true,
          selected: item.selected || false,
        })

        this.item = item
        _subtitleButton = subtitleButton
        this.plugin = plugin
      },
      /**
       * Click event for menu item.
       */
      handleClick() {
        // Reset other menu items selected status.
        for (let i = 0; i < _subtitleButton.items.length; ++i) {
          _subtitleButton.items[i].selected(false)
        }

        // Set this menu item to selected, and set subtitle.
        setSubtitle(this.item)
        this.selected(true)
      },
    })

    // ---------
    var createSubtitleButton = function (subtitles) {
      var player = this.player
      _subtitles = subtitles

      _subtitleButton = new ConcreteButton(player)

      var placementIndex = player.controlBar.children().length - 2
      var concreteButtonInstance = player.controlBar.addChild(
        _subtitleButton,
        { componentClass: "subtitleSelector" },
        _config.placementIndex || placementIndex
      )

      for (let i = 0; i < _subtitles.length; ++i) {
        if (
          !_subtitleItems.filter(_existingItem => {
            return (
              _existingItem.item &&
              _existingItem.item.value === subtitles[i].height
            )
          }).length
        ) {
          const levelItem = getSubtitleMenuItem({
            label: _subtitles[i].label,
            value: _subtitles[i].value,
            selected: _subtitles[i].selected,
          })

          _subtitleItems.push(levelItem)
        }
      }

      _subtitleItems.sort((current, next) => {
        if (typeof current !== "object" || typeof next !== "object") {
          return -1
        }
        if (current.item.value < next.item.value) {
          return -1
        }
        if (current.item.value > next.item.value) {
          return 1
        }
        return 0
      })

      var selectedSubtitle = subtitles.find(
        subtitle => subtitle.selected
      )

      concreteButtonInstance.addClass("vjs-subtitle-selector")
      concreteButtonInstance.el_.style.display = "block";
      concreteButtonInstance.el_.style.width = "auto"

      if (!_config.displayCurrentSubtitle) {
        var icon = ` ${_config.vjsIconClass || "vjs-icon-subtitles"}`

        concreteButtonInstance.menuButton_.$(
          ".vjs-icon-placeholder"
        ).className += icon
      } else {
        setButtonInnerText(selectedSubtitle.label)
      }
      concreteButtonInstance.removeClass("vjs-hidden")

      // _subtitleItems.push(
      //   getSubtitleMenuItem({
      //     label: selectedSubtitle.label,
      //     value: selectedSubtitle.value,
      //     selected: true,
      //   })
      // )

      if (_subtitleButton) {
        _subtitleButton.createItems = function () {
          return _subtitleItems
        }
        _subtitleButton.update()
      }
    }

    var getSubtitleMenuItem = function (item) {
      const player = this.player

      return new ConcreteMenuItem(player, item, _subtitleButton, this)
    }

    var setButtonInnerText = function (text) {
      _subtitleButton.menuButton_.$(".vjs-icon-placeholder").innerHTML = text
    }

    /**
     * Sets subtitle (based on media height)
     *
     * @param {number} height - A number representing HLS playlist.
     */
    var setSubtitle = function (item) {
      if (_config.displayCurrentSubtitle) {
        setButtonInnerText(item.label)
      }

      for (let i = 0; i < _subtitles.length; ++i) {
        const subtitle = _subtitles[i]

        subtitle.enabled = subtitle.value === item.value
      }

      _octopus.setTrackByUrl(_subtitles.find(s => s.value === item.value).src);

      _subtitleButton.unpressButton()
    }

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
        _octopus.resize(
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
      _octopus.setCurrentTime(player.currentTime() + _octopus.timeOffset)
    }

    var configurePlayer = function () {
      player.on("timeupdate", timeupdate)

      player.on("playing", function () {
        _octopus.setIsPaused(false, player.currentTime() + _octopus.timeOffset)
      })

      player.on("pause", function () {
        _octopus.setIsPaused(true, player.currentTime() + _octopus.timeOffset)
      })

      player.on("seeking", function () {
        player.off("timeupdate", timeupdate)
      })

      player.on("seeked", function () {
        player.on("timeupdate", timeupdate)
        _octopus.setCurrentTime(player.currentTime() + _octopus.timeOffset)
      })

      player.on("ratechange", function () {
        _octopus.setRate(player.playbackRate())
      })

      player.on("timeupdate", function () {
        _octopus.setCurrentTime(player.currentTime() + _octopus.timeOffset)
      })

      player.on("waiting", function () {
        _octopus.setIsPaused(true, player.currentTime() + _octopus.timeOffset)
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
      if (_octopus) {
        _octopus.instance.dispose()
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
      canvas = createCanvasElement(video)
      var octopusOptions = settings.octopus
      var selectedSubtitle = settings.subtitles.find(
        subtitle => subtitle.selected
      )

      octopusOptions.subUrl = selectedSubtitle.src
      octopusOptions.canvas = canvas

      _octopus = new SubtitlesOctopus(octopusOptions)
      window._octopus = _octopus

      // -------
      configurePlayer()
      createSubtitleButton(settings.subtitles)
    })

    return {
      dispose: dispose,
    }
  }

  // register the plugin
  videojs.plugin("videoJsASSSubtitlesSwitcher", videoJsASSSubtitlesSwitcher)
})
