use super::tutorial;
use crate::{
    collections::MyArray,
    graphs::{Pie, PieSlice},
    layouts::Page,
    models::Allotment,
    state::StateContext,
};
use yew::prelude::*;

#[function_component]
pub fn Overview() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let allotment = use_memo(state.entries.clone(), |e| Allotment::new(e.iter()));
    let slices = allotment
        .iter()
        .map(|s| PieSlice {
            ratio: s.ratio,
            color: s.typ.color,
            name: s.typ.name,
        })
        .collect::<MyArray<_>>();

    use_effect_with(allotment, |a| {
        gloo::console::log!(format!("{a:?}"));
    });

    if state.entries.is_empty() {
        return html! {
            <tutorial::Tutorial />
        };
    }

    html! {
        <Page title="Overview">
            <h2>{"Allotment"}</h2>
            <Pie {slices} />
        </Page>
    }
}
