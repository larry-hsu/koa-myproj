const EventEmitter = (function () {
  var _handles = Object.create(null)

  var isNotDefined = function (obj) {
    return typeof obj === 'undefined'
  }

  var isType = function (obj) {
    const toString = Object.prototype.toString
    return toString.call(obj).slice(8, -1).toLowerCase()
  }

  var isArray = function (obj) {
    return Array.isArray(obj) || isType(obj) === 'array'
  }

  var _addListener = function (topic, cb, context, once) {
    if (typeof cb !== 'function') {
      throw new TypeError('cb must be a function')
    }

    cb.context = context
    cb.once = !!once  // 转换成布尔类型

    const event = _handles[topic]

    if (isNotDefined(event)) {
      _handles[topic] = cb;
    } else if (typeof event === 'function') {
      _handles[topic] = [event, cb]
    } else if (isArray(event)) {
      _handles[topic].push(cb)
    }
  }
  /**
   * 监听事件
   * @param {String} topic 
   * @param {Function} cb 
   */
  function on(topic, cb, context) {
    _addListener(topic, cb, context)
  }

  /**
   * 只触发事件一次
   * @param {String} topic 
   * @param {Function} cb 
   */
  function once(topic, cb, context) {
    _addListener(topic, cb, context, true)
  }

  /**
   * 触发事件
   * @param {String} topic 
   */
  function emit(topic, ...args) {
    if (isNotDefined(topic)) {
      throw new Error('emit must receive at lease one argument')
    }

    const event = _handles[topic]

    if (isNotDefined(event)) { return false }
    else if (typeof event === 'function') {
      event.apply(event.context || null, args)
      if (event.once) {
        off(topic, event)
      }
    } else if (isArray(event)) {
      // map不改变原始数组，且比forEach快
      event.map(e => {
        e.apply(e.context || null, args)
        if (e.once) {
          off(topic, e)
        }
      });
    }

    return true
  }

  /**
   * 移除事件
   * @param {String} topic 
   * @param {Function} cb 
   */
  function off(topic, cb) {
    if (isNotDefined(_handles)) { return; }
    if (isNotDefined(topic)) { return; }

    if (typeof cb !== 'function') {
      throw new Error('cb must be a function')
    }

    const event = _handles[topic]

    if (typeof event === 'function') {
      event === cb && delete _handles[topic] //delete 删除对象的一个属性
    } else {
      const index = event.findIndex(e => e === cb)

      if (index === -1) { return }

      // match the first one, shift faster than splice
      if (index === 0) {
        event.shift()
      } else {
        event.splice(index, 1)  // 是一个引用
      }

      // just left one listener, change Array to Function
      if (event.length === 1) {
        _handles[topic] = event[0]
      }
    }
  }

  function offAll(topic) {
    if (isNotDefined(_handles)) { return }

    // if not provide type, remove all
    if (isNotDefined(topic)) { _handles = Object.create(null) }

    const event = _handles[topic]
    if (!isNotDefined(event)) {
      // check if `type` is the last one
      if (Object.keys(_handles).length === 1) {
        _handles = Object.create(null)
      } else {
        delete _handles[topic]
      }
    }
  }

  function listeners(topic) {
    if (isNotDefined(_handles)) { return [] }

    const event = _handles[topic]

    return isNotDefined(event)
      ? []
      : (typeof event === 'function'
        ? [event]
        : event.map(o => o))
  }

  function listenerCount(topic) {
    if (isNotDefined(_handles)) { return 0 }

    const event = _handles[topic];

    return isNotDefined(event)
      ? 0
      : (typeof event === 'function'
        ? 1
        : event.length);
  }

  function topics() {
    if (isNotDefined(_handles)) { return [] }
    return Object.keys(_handles)
  }

  return {
    on,
    off,
    emit,
    once,
    offAll,
    topics,
    listeners,
    listenerCount
  }
}())

export { EventEmitter }