use super::tutorial;
use crate::{layouts::Page, state::StateContext};
use yew::prelude::*;

#[function_component]
pub fn Overview() -> Html {
    let state = use_context::<StateContext>().unwrap();

    if state.entries.is_empty() {
        return html! {
            <tutorial::Tutorial />
        };
    }

    html! {
        <Page title="Overview">
            <h1>{"Overview"}</h1>
        </Page>
    }
}
