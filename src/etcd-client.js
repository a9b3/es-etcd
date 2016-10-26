import axios from 'axios'
import {
  selectiveMerge,
} from './utilities.js'

export default class EtcdClient {
  host = null
  port = null

  constructor(config) {
    selectiveMerge(['host', 'port'], this, config)
  }
}
