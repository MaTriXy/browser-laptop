/* global describe, it, before */

const Brave = require('../lib/brave')
const {urlInput, braveMenu, braveMenuDisabled, adsBlockedStat, braveryPanel, httpsEverywhereStat} = require('../lib/selectors')

describe('Bravery Panel', function () {
  function * setup (client) {
    yield client
      .waitUntilWindowLoaded()
      .waitForUrl(Brave.newTabUrl)
      .waitForBrowserWindow()
      .waitForVisible('#window')
      .waitForVisible(urlInput)
      .waitForUrl(Brave.newTabUrl)
      .windowByUrl(Brave.browserWindowUrl)
  }

  describe('General', function () {
    Brave.beforeAll(this)
    before(function * () {
      yield setup(this.app.client)
    })
    it('shows disabled brave button for about:newpage', function * () {
      yield this.app.client.waitForVisible(braveMenuDisabled)
    })
    it('shows brave button (not disabled) for normal pages', function * () {
      const page1Url = Brave.server.url('page1.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(page1Url)
        .url(page1Url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(braveMenu)
    })
  })
  describe('Stats', function () {
    Brave.beforeAll(this)
    before(function * () {
      yield setup(this.app.client)
    })
    it('detects blocked elements', function * () {
      const url = Brave.server.url('tracking.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .url(url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(braveMenu)
        .click(braveMenu)
        .waitForVisible(braveryPanel)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => blocked === '2')
        })
    })
    it('detects adblock elements', function * () {
      const url = Brave.server.url('adblock.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .url(url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(braveMenu)
        .waitForVisible(braveryPanel)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => blocked === '1')
        })
    })
    it('detects https upgrades', function * () {
      const url = Brave.server.url('httpsEverywhere.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .url(url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(braveMenu)
        .waitForVisible(braveryPanel)
        .waitUntil(function () {
          return this.getText(httpsEverywhereStat)
            .then((upgraded) => {
              console.log(upgraded)
              return upgraded === '1'
            })
        })
    })
  })
})
