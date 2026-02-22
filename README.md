# Simple Drag & Drop Search

A Chrome extension that lets you search selected text instantly using drag gestures, tile overlays, or a favicon popup — no need to copy-paste into a new tab.

## Modes

### Arrow Mode
Drag selected text in one of 8 directions to trigger a search with a different engine. A directional arrow and favicon indicator show which engine will be used as you drag.

### Tile Mode
Drag selected text to see a full-screen 3x3 tile overlay. Drop the text onto a tile to search with that engine.

### Favicon Mode
Select text (or double-click a word) and a compact popup of favicon buttons appears. Click a button to search with that engine. Right-click a button to open in a background tab.

## Features

- **18 configurable search slots** — 9 per page, switchable with Shift key (Arrow/Tile) or a shift button (Favicon)
- **40+ built-in search engines** — Google, YouTube, Wikipedia, Bing, DuckDuckGo, Reddit, Twitter, Flickr, and many more
- **Custom search engines** — enter any URL with a query parameter
- **Special actions** — Open URL, Copy to Clipboard, Save to Text File, Memo notepad, Text-to-Speech
- **Memo popup** — a small notepad window for collecting selected text snippets, with save/load/delete support
- **Per-engine tab control** — choose foreground or background for each search slot
- **Tab position** — open new tabs at the end or after the current tab
- **Detection sensitivity** — adjust drag distance threshold for Arrow mode
- **Exception list** — disable the extension on specific URLs
- **Import/Export** — back up and restore all settings as a JSON file
- **Chrome Sync** — sync settings across devices

## Installation

### From source
1. Clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the cloned folder

## Permissions

| Permission | Reason |
|---|---|
| `tabs` | Open search results in new tabs |
| `storage` | Save settings and preferences |
| `clipboardWrite` / `clipboardRead` | Copy selected text to clipboard |
| `downloads` | Save selected text to a .txt file |
| `tts` | Text-to-Speech for selected text |
| `offscreen` | Clipboard operations in Manifest V3 |

## License

This project is a Manifest V3 migration of the original Simple Drag & Drop Search extension, which is no longer available on the Chrome Web Store.
