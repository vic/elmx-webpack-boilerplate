require('./sass/index.sass')

var Elm = require('./elm/App.elm')
Elm.App.embed(document.querySelector('[elm-app]'))
