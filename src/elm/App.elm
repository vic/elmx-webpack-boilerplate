module App exposing (main)

import Counter exposing (..)
import View exposing (view)

import Html exposing (Html)
import Html.App as Html

main : Program Never
main =
  Html.program
      { init = init
      , update = update
      , view = view
      , subscriptions = subscriptions
      }
