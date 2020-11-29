import videojs from "video.js"
const Plugin = videojs.getPlugin("plugin")
const VideoJsMenuButton = videojs.getComponent("MenuButton")
const VideoJsMenu = videojs.getComponent("Menu")
const VideoJsComponent = videojs.getComponent("Component")
const VideoJsMenuItem = videojs.getComponent("MenuItem")
const VideoJsDom = videojs.dom

class ConcreteButton extends VideoJsMenuButton {
  createMenu() {
    const menu = new VideoJsMenu(this.player, { menuButton: this })

    if (this.options_.title) {
      const titleEl = VideoJsDom.createEl("li", {
        className: "vjs-menu-title",
        innerHTML: this.options_.title,
        tabIndex: -1,
      })

      const titleComponent = new VideoJsComponent(this.player, {
        el: titleEl,
      })

      menu.addItem(titleComponent)
    }

    this.items = this.createItems()

    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        menu.addItem(this.items[i])
      }
    }

    return menu
  }
}

class ConcreteMenuItem extends VideoJsMenuItem {
  /**
   *
   * @param {*} player
   * @param {*} item
   * @param {ConcreteButton} subtitleButton
   * @param {ASSSubtitlesSwitcher} plugin
   */
  constructor(player, item, subtitleButton, plugin) {
    super(player, {
      label: item.label,
      selectable: true,
      selected: item.selected || false,
    })

    this.item = item
    this.subtitleButton = subtitleButton
    this.plugin = plugin
  }

  handleClick() {
    for (let i = 0; i < this.subtitleButton.items.length; i++) {
      this.subtitleButton.items[i].selected(false)
    }

    this.plugin.setCurrentSubtitle(this.item)
    this.selected(true)
  }
}

class ASSSubtitlesSwitcher extends Plugin {
  constructor(player, options) {
    super(player, options)
    this.settings = {}
    this.subtitles = options.subtitles
    this.subtitleItems = []
    this.currentSubtitle = this.subtitles.find(subtitle => subtitle.selected)
    this.subtitleButton = this.createSubtitleButton(player)

    // Whenever the player emits a playing or paused event, we update the
    // state if necessary.
    this.on(player, ["playing", "paused"], this.updateState)
    this.on("statechanged", this.logState)
  }

  dispose() {
    super.dispose()
    videojs.log("the advanced plugin is being disposed")
  }

  updateState() {
    this.setState({ playing: !this.player.paused() })
  }

  logState(changed) {
    videojs.log(
      `the player is now ${this.state.playing ? "playing" : "paused"}`
    )
  }

  createSubtitleButton() {
    this.subtitleButton = new ConcreteButton(this.player)

    const placementIndex = this.player.controlBar.children().length - 2
    const concreteButtonInstance = this.player.controlBar.addChild(
      this.subtitleButton,
      { componentClass: "subtitleSelector" },
      this.settings.placementIndex || placementIndex
    )

    for (let i = 0; i < this.subtitles.length; ++i) {
      if (
        !this.subtitleItems.filter(
          _existingItem =>
            _existingItem.item &&
            _existingItem.item.value === this.subtitles[i].value // TODO: this.subtitles[i].value?
        ).length
      ) {
        const levelItem = this.getSubtitleMenuItem({
          label: this.subtitles[i].label,
          value: this.subtitles[i].value,
          src: this.subtitles[i].src,
          selected: this.subtitles[i].selected,
        })

        this.subtitleItems.push(levelItem)
      }
    }

    concreteButtonInstance.addClass("vjs-subtitle-selector")
    concreteButtonInstance.el_.style.display = "block"
    concreteButtonInstance.el_.style.width = "auto"

    if (!this.settings.displayCurrentSubtitle) {
      const icon = ` ${this.settings.vjsIconClass || "vjs-icon-subtitles"}`

      concreteButtonInstance.menuButton_.$(
        ".vjs-icon-placeholder"
      ).className += icon
    } else {
      this.setButtonInnerText(this.getCurrentSubtitle().label)
    }

    concreteButtonInstance.removeClass("vjs-hidden")

    if (this.subtitleButton) {
      // TODO: Check if this is necesary
      this.subtitleButton.createItems = () => this.subtitleItems
      this.subtitleButton.update()
    }
  }

  setButtonInnerText(text) {
    this.subtitleButton.menuButton_.$(".vjs-icon-placeholder").innerHTML = text
  }

  getSubtitleMenuItem(item) {
    return new ConcreteMenuItem(this.player, item, this.subtitleButton, this)
  }

  setCurrentSubtitle(subtitle) {
    this.currentSubtitle = subtitle
    this.player.Octopus().setTrackByUrl(subtitle.src)
  }

  getCurrentSubtitle() {
    return this.currentSubtitle
  }
}

export default ASSSubtitlesSwitcher
