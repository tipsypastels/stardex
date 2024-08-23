use self::{
    layouts::Editor,
    routes::Router,
    state::{State, StateContextProvider},
};
use yew::prelude::*;

mod bindings;
mod collections;
mod components;
mod layouts;
mod models;
mod routes;
mod state;

#[function_component]
fn App() -> Html {
    let state = use_reducer(State::default);

    html! {
        <main class="container">
            <StateContextProvider context={state}>
                <Editor />
                <Router />
            </StateContextProvider>
        </main>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
