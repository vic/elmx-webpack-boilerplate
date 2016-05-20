module Counter exposing (..)

type alias Model = Int

type Msg
  = NoOp
  | Increment
  | Decrement


init : (Model, Cmd Msg)
init = (0, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NoOp ->
      model ! []
    Increment ->
      (model + 1) ! []
    Decrement ->
      (model - 1) ! []

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
