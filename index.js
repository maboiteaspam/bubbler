var flower = require('flower')
var debug = require('debug')('bubbler')
var pad = require('node-string-pad');
var k = 0;

module.exports = function bubbler (bubbleizedStream, events, name, fnT, fnF) {
  var stream;
  var cols = {};
  var autoPad = function (s, col, defPadLength) {
    if (!cols[col]) cols[col] = defPadLength;
    if (s.length>cols[col]) cols[col] = s.length+1;
    return pad(s, cols[col])
  }

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
      var args = [].slice.apply(arguments);
      args.unshift(event)
      debug('%s bubbles %s=> %s',
        autoPad(name+':', '1', 10),
        autoPad("'"+event+"'", '2', 10),
        ('message' in message ? autoPad(message.message, '3', 8) : '')
      )
      stream.emit.apply(stream, args)
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
