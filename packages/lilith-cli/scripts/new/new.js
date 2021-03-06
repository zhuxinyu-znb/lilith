const path = require('path')
const fs = require('fs')
const { blue } = require('../../lib/color')
const { createNewModule } = require('quickly-template/lib/createTemplate')
const { getTemplate, findTemplate } = require('quickly-template/lib/template')
const { ask } = require('quickly-template/lib/rl')
const logger = require('../../lib/logger')

async function createTemplate(argv) {
  const { name, context, root, target = '', filter, isDebug } = argv
  const [template] = getTemplate(argv)

  if (!template) {
    const templates = findTemplate(argv)

    logger.info('当前可用的模板有', templates)

    return
  }
  const globPattern = path.join(context, root, template, 'src', '**', '*.*')
  // isDebug参数是因为debug的时候俺不知道怎么answer
  if (!isDebug && fs.existsSync(path.join(target, name))) {
    const answer = await ask(blue(`${name}已经存在是否覆盖？(Y/N)`))

    if (answer.toLowerCase() === 'n') return
  }
  const nameArray = name ? name.split('/') : ['']
  const nameArrayLength = nameArray.length
  let renderOptions = { name, dirname: nameArray[nameArrayLength - 1] }
  try {
    renderOptions = { ...renderOptions, ...filter[template] }
  } catch (error) {} // eslint-disable-line
  // debug('createNewModule',{ globPattern, target, renderOptions, name ,argv})
  createNewModule({ globPattern, target, renderOptions, name }, argv)
  logger.info('create new', template, path.join(context, target, name), 'done!')
}

module.exports = createTemplate
