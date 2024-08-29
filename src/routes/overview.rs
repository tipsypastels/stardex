use super::tutorial;
use crate::{components::TypeChart, layouts::Page, models::Allotment, state::StateContext};
use yew::prelude::*;

#[function_component]
pub fn Overview() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let allotment = use_memo(state.entries.clone(), |e| Allotment::new(e.iter()));

    if state.entries.is_empty() {
        return html! {
            <tutorial::Tutorial />
        };
    }

    html! {
        <Page title="Overview">
            <h2>{"Allotment"}</h2>
            <TypeChart {allotment} />
        </Page>
    }
}
