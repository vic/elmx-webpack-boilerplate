module App where

import Counter exposing(..)
import View as View

import Html exposing (Html)


main : Signal Html
main =
  Signal.map (view action.address) model

action : Signal.Mailbox Action
action =
  Signal.mailbox Noop

model : Signal Model
model =
  Signal.foldp update initialModel action.signal

view : Signal.Address Action -> Model -> Html
view address model =
  View.html address model
