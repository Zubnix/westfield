/*
MIT License

Copyright (c) 2017 Erik De Rijcke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const {string} = require('./WireFormat')

class Resource {
  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  constructor (client, id, version) {
    /**
     * @type {Client}
     */
    this.client = client
    /**
     * @type {number}
     */
    this.id = id
    /**
     * @type {number}
     */
    this.version = version
    /**
     * Arbitrary data that can be attached to the resource.
     * @type {{}}
     */
    this.userData = {}
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolver = resolve
    })
    /**
     * @type {Array<function(Resource):void>}
     * @private
     */
    this._destroyListeners = []
    this._destroyPromise.then(() => {
      this._destroyListeners.forEach((destroyListener) => destroyListener(this))
    })

    this.client.registerResource(this)
  }

  /**
   *
   * @param {number} code
   * @param {string} msg
   */
  postError (code, msg) {
    this.client.displayResource.error(this, code, msg)
  }

  destroy () {
    this._destroyResolver(this)
    this.client.unregisterResource(this)
  }

  /**
   * @param {function(Resource):void}destroyListener
   */
  addDestroyListener (destroyListener) {
    this._destroyListeners.push(destroyListener)
  }

  /**
   * @param {function(Resource):void}destroyListener
   */
  removeDestroyListener (destroyListener) {
    this._destroyListeners = this._destroyListeners.filter((item) => { return item !== destroyListener })
  }

  /**
   * @return {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }
}

module.exports = Resource