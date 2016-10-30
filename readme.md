# etcd-client

A simple etcd node client with tls support.

```
npm i --save etcd-client
```

Example Usage

```js
import EtcdClient from 'etcd-client'

async function main() {
	const etcdClient = new EtcdClient({
		scheme: 'https',
		host: '0.0.0.0',
		port: 2379,
		agentOpts: {
			ca: fs.readFileSync('./ca.pem'),
			key: fs.readFileSync('./etcd.key'),
			cert: fs.readFileSync('./etcd.crt'),
		},
	})
	
	console.log(await etcdClient.version())
}

main()
.catch(e => console.error(e))
```

## Constructor

fields|description
---|---
scheme| 'http' or 'https' if using https remember to set agentOpts
host| Address of etcd server
port| Port of etcd server
agentOpts| `{ ca, key, cert }` use fs.readFileSync for these fields

```js
const etcdClient = new EtcdClient({
	scheme: 'https',
	host: '0.0.0.0',
	port: 2379,
	agentOpts: {
		ca: fs.readFileSync('./ca.pem'),
		key: fs.readFileSync('./etcd.key'),
		cert: fs.readFileSync('./etcd.crt'),
	},
})
```

## API

### `get`

- key
- opts - `{ recursive: true }`

```js
await etcdClient.get('foo', { recursive: true })
```

### `set`

- key
- value

### `rm`

- key
- opts - `{ recursive: true }`

### `watch`

- key
- cb

### `mkdir`

- key

### `version`

### `statsLeader`

### `statsSelf`