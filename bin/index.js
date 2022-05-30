#! /usr/bin/env node

const { spawn } = require('node:child_process')
const process = require('node:process')
const { performance } = require('node:perf_hooks')
const r = require('@rewl/rainbow')

const cwd = process.cwd()
const args = process.argv.slice(2)

const package = require(`${cwd}/package.json`)
const name = r.orange(`${package.name}@${package.version}`)

if (!args.length) {
  const scripts = Object.keys(package.scripts ?? {})
  if (!scripts.length) {
    console.log(`${name} 不能润啊！`)
  } else {
    const width = Math.max(...scripts.map(s => s.length))
    const pad = (str) => ' '.repeat(width - str.length)

    console.log(`${name} 有这些可以润：`)
    scripts.forEach(s => {
      console.log(`  ${r.sky(s)}${pad(s)} -  ${r.v60(package.scripts[s])}`)
    })
  }
} else {
  const run = spawn('npm run', args, { stdio: 'inherit', shell: true })

  const startRun = () => {
    console.log(`${r.sky(args.join(' '))} 开始润了！${r.rainbow('-----====≡≡≡', { offset: 'random' })}${r.yellow('｡ﾟ┌(ﾟ´Д`ﾟ)┘ﾟ｡`')}`)
    performance.mark('start run')
  }

  const endRun = (code) => {
    performance.mark('end run')
    const perf = performance.measure('run', 'start run', 'end run')

    let duration = perf.duration / 1000
    if (duration < 0.1) duration = duration.toFixed(6)
    else duration = duration.toFixed(2)

    if (code) {
      console.log(`润了 ${r.pink(duration)} 秒${r.orange('润出问题')}了！（退出码：${r.red(code.toString())}）检查一下再润吧 ${r.purple('...(o_ _)o⌒☆')}`)
    } else {
      console.log(`润了 ${r.pink(duration)} 秒润累了！休息一会儿再润${r.rainbow('.'.repeat(12), { offset: 'random' })} ${r.mint('_(-ω -`_)')}`)
    }
  }

  run.on('spawn', () => {
    startRun()
  })

  run.on('exit', (code) => {
    endRun(code)
  })

  const EndSignals = ['SIGINT', 'SIGTERM', 'SIGHUP']

  EndSignals.map(signal => {
    process.on(signal, () => {
      endRun()
      process.exit()
    })
  })
}