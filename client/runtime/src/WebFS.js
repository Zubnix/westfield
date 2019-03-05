import { WebFD } from 'westfield-runtime-common'

// TODO This is currently a literal copy of the server implementation. Do all use cases match 1o1 and can we use a single common code base between client & server for WebFS?
export default class WebFS {
  /**
   * @param {string}fdDomainUUID
   * @return {WebFS}
   */
  static create (fdDomainUUID) {
    return new WebFS(fdDomainUUID)
  }

  /**
   * @param {string}fdDomainUUID
   */
  constructor (fdDomainUUID) {
    /**
     * @type {string}
     * @private
     */
    this._fdDomainUUID = fdDomainUUID
    /**
     * @type {Object.<number,WebFD>}
     * @private
     */
    this._webFDs = {}
    /**
     * @type {number}
     * @private
     */
    this._nextFD = 0
  }

  /**
   * @param {ArrayBuffer} arrayBuffer
   * @return {WebFD}
   */
  fromArrayBuffer (arrayBuffer) {
    const fd = this._nextFD++
    // FIXME we want to use reference counting here instead of simply deleting.
    // Sending the WebFD to an endpoint will increase the ref, and we should wait until the endpoint has closed the fd as well.
    const webFD = new WebFD(fd, 'ArrayBuffer', this._fdDomainUUID, () => Promise.resolve(arrayBuffer), () => { delete this._webFDs[fd] })
    this._webFDs[fd] = webFD
    return webFD
  }

  /**
   * @param {ImageBitmap}imageBitmap
   * @return {WebFD}
   */
  fromImageBitmap (imageBitmap) {
    const fd = this._nextFD++
    const webFD = new WebFD(fd, 'ImageBitmap', this._fdDomainUUID, () => Promise.resolve(imageBitmap), () => { delete this._webFDs[fd] })
    this._webFDs[fd] = webFD
    return webFD
  }

  // TODO fromMessagePort

  /**
   * @param {number}fd
   * @return {WebFD}
   */
  getWebFD (fd) {
    return this._webFDs[fd]
  }
}
