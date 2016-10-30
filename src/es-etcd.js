import axios, { CancelToken } from 'axios'
import invariant from 'invariant'
import {
  createHttpsAgent,
  createHttpAgent,
} from './helpers.js'
import qs from 'querystring'

function instantiateAxiosInstance({ agentOpts, opts }) {
  let config = {}
  const httpAgentDefaultConfig = {
    keepAlive: true
  }
  if (agentOpts) {
    config.httpsAgent = createHttpsAgent(Object.assign({}, httpAgentDefaultConfig, agentOpts))
  } else {
    config.httpAgent = createHttpAgent(Object.assign({}, httpAgentDefaultConfig))
  }

  config = Object.assign({}, config, opts)

  return axios.create(config)
}

/*
 * https://coreos.com/etcd/docs/latest/v2/api.html
 */
export default class EsEtcd {
  _scheme = null
  _host = null
  _port = null
  _version = '2'

  /*
   * Use this instead of axios directly, this instance will be configured with
   * htpsAgent if ca, cert, or key is specified in configure()
   */
  _axiosInstance = null

  /*
   * opts: {
   *   scheme,
   *   host,
   *   port,
   *   agentOpts: {
   *     ca,
   *     cert,
   *     key,
   *   },
   * }
   */
  constructor(args) {
    invariant(args.scheme, `'scheme' must be provided`)
    invariant(args.host, `'host' must be provided`)
    invariant(args.port, `'port' must be provided`)

    this.configure(args)
  }

  configure({ scheme, host, port, version = this._version, agentOpts }) {
    this._scheme = scheme
    this._host = host
    this._port = port
    this._version = version

    if (this._axiosInstance) {
      delete this._axiosInstance
    }

    this._axiosInstance = instantiateAxiosInstance({
      agentOpts,
    })
  }

  _getBaseUrl() {
    return `${this._scheme}://${this._host}:${this._port}`
  }

  _getKeyUrl() {
    return `${this._getBaseUrl()}/v${this._version}/keys`
  }

  /*
   * Response:
   *
   * node: {
   *   key: '/hi',
   *   value: 'hi',
   *   modifiedIndex: 4,
   *   createdIndex: 4,
   * }
   *
   * node: {
   *   key: '/hi',
   *   dir: true,
   *   nodes: [node],
   *   modifiedIndex: 4,
   *   createdIndex: 4,
   * }
   *
   * {
   *   action: 'get',
   *   node,
   * }
   */
  async get(key, opts) {
    const url = `${this._getKeyUrl()}/${key}?${qs.stringify(opts)}`
    const { data: { node } } = await this._axiosInstance.get(url)
    return node
  }

  async set(key, value) {
    // https://github.com/mzabriskie/axios/issues/97
    // need to pass in string or axios will send data as json
    const { data } = await this._axiosInstance.put(`${this._getKeyUrl()}/${key}`, qs.stringify({ value }))
    return data
  }

  async rm(key, opts) {
    const url = `${this._getKeyUrl()}/${key}?${qs.stringify(opts)}`
    const { data } = await this._axiosInstance.delete(url)
    return data
  }

  // with tail call optimization this can be recursive
  async _watch(key, cb, setCancel) {
    try {
      const opts = {
        recursive: true,
        wait: true,
      }
      const url = `${this._getKeyUrl()}/${key}?${qs.stringify(opts)}`
      const { data } = await this._axiosInstance.get(url, {
        cancelToken: new CancelToken(setCancel)
      })

      cb(data)
      return this._watch(key, cb, setCancel)
    } catch (e) {
      if (!axios.isCancel(e)) {
        throw new Error(e)
      }
      // canceled, return and exit recursive loop
      return
    }
  }

  async watch(key, cb) {
    let cancel = () => {}
    this._watch(key, cb, c => cancel = c)
    return () => cancel()
  }

  async mkdir(key) {
    const { data } = await this._axiosInstance.put(`${this._getKeyUrl()}/${key}`, qs.stringify({ dir: true }))
    return data
  }

  /**
   * Response:
   * {
   *  etcdserver: '3.0.0',
   *  etcdcluster: '3.0.0'
   * }
   */
  async version() {
    const { data } = await this._axiosInstance.get(`${this._getBaseUrl()}/version`)
    return data
  }

  async statsLeader() {
    const { data } = await this._axiosInstance.get(`${this._getBaseUrl()}/v${this._version}/stats/leader`)
    return data
  }

  async statsSelf() {
    const { data } = await this._axiosInstance.get(`${this._getBaseUrl()}/v${this._version}/stats/self`)
    return data
  }
}
