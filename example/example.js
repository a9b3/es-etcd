import EtcdClient from '../src/index.js'

async function main() {
  const etcdClient = new EtcdClient({
    scheme: 'http',
    host: '127.0.0.1',
    port: 2379,
  })

  console.log(await etcdClient.version())
  console.log(await etcdClient.statsLeader())
  console.log(await etcdClient.statsSelf())
}

main()
.catch((e) => {
  console.log(e)
})
