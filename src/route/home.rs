use super::help;
use crate::{layouts::Page, state::StateContext};
use yew::prelude::*;

#[function_component(Home)]
pub fn home() -> Html {
    let state = use_context::<StateContext>().unwrap();

    if state.entries.is_empty() {
        return html! {
            <help::Help />
        };
    }

    html! {
        <Page title="Home">
            <h1>{"Home"}</h1>
        </Page>
    }
}
