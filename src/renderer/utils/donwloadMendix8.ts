import { dataPath } from '../utils'
const puppeteer = require('puppeteer')
// Downloads Make it Native
export const downloadMX8 = async () => {
  console.log('Dowloading8')
  puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' })
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.tracing.start({
    path: 'trace.json',
    categories: ['devtools.timeline']
  })
  await page.goto('https://apkpure.com/make-it-native/com.mendix.developerapp')

  // execute standard javascript in the context of the page.
  const stories = await page.$$eval('a.da', (anchors: any) => {
    return anchors.map((anchor: any) => anchor.textContent).slice(0, 10)
  })
  console.log(stories)
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: `${dataPath}/make-it-native-8`
  })
  await page.goto(
    'https://apkpure.com/make-it-native/com.mendix.developerapp/download?from=details'
  )
  page.on('dialog', async (dialog: any) => {
    await dialog.dismiss()
  })
  await page.waitFor(10000)
  await page.tracing.stop()
  console.log('Done 8')
  await browser.close()
}
