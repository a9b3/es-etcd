import EsEtcd from '../src/index.js'

async function main() {
  const esEtcd = new EsEtcd({
    scheme: 'http',
    host: '127.0.0.1',
    port: 2379,
  })

  console.log(await esEtcd.version())
  console.log(await esEtcd.statsLeader())
  console.log(await esEtcd.statsSelf())
}

main()
.catch((e) => {
  console.log(e)
})
