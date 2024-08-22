use self::{
    layouts::Editor,
    route::Router,
    state::{State, StateContextProvider},
};
use gloo::{console, utils::document_element};
use yew::prelude::*;

mod collections;
mod components;
mod lang;
mod layouts;
mod models;
mod route;
mod state;

#[function_component(App)]
fn app() -> Html {
    let state = use_reducer(State::default);

    use_effect_with((), |_| {
        document_element().class_list().add_1("loaded").ok();
        console::log!("Loaded");
    });

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
