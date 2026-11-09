# picom-motion

The site at <https://jornc.github.io/picom-motion/>: workspace and window animations for
[picom](https://github.com/yshui/picom) on X11 with i3, the two plugins that make them, and the
changes to picom they use. GitHub Pages serves this repository as it is, with no build step.

- The six pages are at the top: `index.html`, `workspaces.html`, `windows.html`, `install.html`,
  `under-the-hood.html` and `backlog.html`.
- `assets/` has the stylesheet and two scripts: `site.js` plays a video while it is on screen,
  `backlog.js` sorts and filters the backlog.
- `media/workspaces/` and `media/windows/` have one recording per style, as mp4 and webm, and its
  poster frame.

`backlog.html` is generated from the fork's history, with each change's size read from git; it is
not edited by hand.

The code is in [JornC/picom](https://github.com/JornC/picom/tree/winanim) (branch `winanim`),
[picom-ws-direction-plugin](https://github.com/JornC/picom-ws-direction-plugin) and
[picom-win-cause-plugin](https://github.com/JornC/picom-win-cause-plugin). On Arch, the AUR
package [picom-motion-git](https://aur.archlinux.org/packages/picom-motion-git) builds all three.
Problems with any of it go to this repository's issues, not to picom.

*This README, like all text on the site, was written by an LLM.*
