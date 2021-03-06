# bubbler

`bubbler` gives streams ability to bubble up events.

## Install

    npm i @maboiteaspam/bubbler --save

## Usage

```js

var flower = require('@maboiteaspam/flower')

var bubbler = require('@maboiteaspam/bubbler')  // bubbler gives streams ability to bubble up events.
                                                //
var events = ['message'];                       // It needs to know which events to bubble.
                                                //
var streamA = bubbler(flower(), events);        // bubbler signature is
var streamB = bubbler(flower(), events);        //  - bubbler(events[, name[, fnT[, fnF]]]) => new stream
var streamC = bubbler(flower(), events);        //  - bubbler(stream, events[, name]) => stream
                                                //
streamA.pipe(streamB);                          // When bubbled streams
streamA.pipe(streamC);                          // are piped together.
                                                //
streamB.emit('message', 'hello, its streamB !') // A down stream can emit events
streamC.emit('message', 'hello, its streamC !') // upward in the stream.
                                                //
streamA.on('message', function (chunk) {        // Those streams enable you to listen
  console.log(chunk)                            // all down streams events in one handler.
})                                              //
                                                //
streamB.emit('message', 'hello, its streamB !') // Note : re-trigger the events to invoke the listener,
streamC.emit('message', 'hello, its streamC !') // so something shows up at runtime ;)

```

## Read more

You can see it in action in `npi`

- https://github.com/maboiteaspam/npi
- https://github.com/maboiteaspam/bubbled
- https://github.com/maboiteaspam/flower
- https://github.com/maboiteaspam/event-stream-writer
