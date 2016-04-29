module Counter(Model, Action(..), initialModel, update) where

type alias Counter
  = Int

type alias Model
  = Counter

initialModel : Model
initialModel =
  0

type Action
  = Noop
  | Increment
  | Decrement

update : Action -> Model -> Model
update action model =
  case action of
    Noop ->
      model
    Increment ->
      model + 1
    Decrement ->
      model - 1
