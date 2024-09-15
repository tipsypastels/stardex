use super::tutorial;
use crate::{
    collections::{MyArray, MySet},
    components::{TypeBreakdown, TypeChart},
    layouts::Page,
    models::{Allotment, Breakdown, Entry, Region, Strictness, Type},
    state::StateContext,
};
use implicit_clone::unsync::IString;
use std::rc::Rc;
use yew::prelude::*;

#[function_component]
pub fn Overview() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let allotment = use_allotment(&state.entries);
    let region_allotment = use_region_allotment(&state.regions);
    let breakdown = use_breakdown(&allotment, &region_allotment, state.strictness);
    let selected_type = use_state(|| None::<Type>);

    if state.entries.is_empty() {
        return html! {
            <tutorial::Tutorial />
        };
    }

    html! {
        <Page title="Overview">
            <h2>{"Type Allotment"}</h2>
            <TypeChart {allotment} />

            <h2>{"Breakdown"}</h2>
            <TypeBreakdown
                id="overview-breakdown"
                breakdown={breakdown}
                entries={state.entries.clone()}
                selected_type={selected_type}
                regions_count={state.regions.len()}
                strictness={state.strictness}
            />
        </Page>
    }
}

#[hook]
fn use_allotment(entries: &MyArray<Entry>) -> Rc<Allotment> {
    use_memo(entries.clone(), |entries| Allotment::new(entries.iter()))
}

#[hook]
fn use_region_allotment(region_names: &MySet<IString>) -> Rc<Allotment> {
    use_memo(region_names.clone(), |region_names| {
        let regions = Region::dat();
        let iter = regions
            .iter()
            .filter(|region| region_names.contains(&region.name))
            .flat_map(|region| region.pokemon.iter().map(Entry::from));

        Allotment::new(iter)
    })
}

#[hook]
fn use_breakdown(
    own: &Rc<Allotment>,
    against: &Rc<Allotment>,
    strictness: Strictness,
) -> Rc<Breakdown> {
    use_memo(
        (own.clone(), against.clone(), strictness),
        |(own, against, strictness)| Breakdown::new(own, against, *strictness),
    )
}
