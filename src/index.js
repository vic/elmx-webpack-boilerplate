require('./sass/index.sass')

var Elm = require('./elm/App.elm')
Elm.embed(Elm.App, document.querySelector('[elm-app]'))
