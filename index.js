var flower = require('flower')
var debug = require('debug')('bubbler')
var k = 0;

module.exports = function bubbler (bubbleizedStream, events, name, fnT, fnF) {
  var stream;

  if(!bubbleizedStream.pipe) {
    fnF = fnT
    fnT = name
    name = events || 'bubbler-' + k;
    events = bubbleizedStream
    stream = flower(fnT, fnF);
  } else {
    name = name || 'bubbler-' + k;
    stream = bubbleizedStream
    // fnT, fnF are ignored
  }

  var index = events.indexOf('data');
  index>-1 && events.splice(index, 1);

  var eventsFn = {};
  events.forEach(function (event) {
    eventsFn[event] = function(message) {
      debug('%s: bubble up message %s', name, event)
      stream.emit(event, message)
    };
  })


  var oldPipe = stream.pipe;
  var oldUnpipe = stream.unpipe;

  stream.pipe = function (s, o) {
    events.forEach(function (event) {
      s.on(event, eventsFn[event])
    });
    s.on('end', function (){
      events.forEach(function (event) {
        s.removeEventListener(event, eventsFn[event])
      })
    });
    return oldPipe.apply(stream, [].slice.apply(arguments));
  };

  stream.unpipe = function (s, o) {
    events.forEach(function (event) {
      s.removeEventListener(event, eventsFn[event])
    });
    return oldUnpipe.apply(stream, [].slice.apply(arguments));
  };

  k++;

  return stream;
};
