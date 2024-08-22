use crate::{
    components::{InlineLink, TypeName},
    layouts::Page,
    models::{Region, Strictness, Type},
    route::Route,
    state::{Action, SelectRegions, StateContext},
};
use implicit_clone::unsync::IString;
use yew::prelude::*;

#[function_component(Settings)]
pub fn settings() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let regions_phrase = if state.regions.len() == 1 {
        "region"
    } else {
        "regions"
    };

    let onchange_regions = {
        let state = state.clone();
        Callback::from(move |(r, c)| {
            state.dispatch(if c {
                Action::DisableRegion(r)
            } else {
                Action::EnableRegion(r)
            })
        })
    };

    let onemit_region_bulk_action = {
        let state = state.clone();
        Callback::from(move |s| state.dispatch(Action::SelectRegions(s)))
    };

    let onchange_strictness = {
        let state = state.clone();
        Callback::from(move |s| state.dispatch(Action::SetStrictness(s)))
    };

    html! {
        <Page title="Settings">
            <h2>{"Regions"}</h2>
            <p>
                {"Controls which canonical "}
                {regions_phrase}
                {" will be used as the basis of the "}
                <InlineLink to={Route::Compare} />
                {" page. The distribution of types (for example, what percentage of Pokémon are "}
                <TypeName typ={Type::dat().named("Fire").unwrap()} />
                {" type) will also be used to create recommendations."}
            </p>

            <div class="region-checkboxes">
                {for Region::dat().iter().map(|r| {
                    let key = r.name.clone();
                    html! {
                        <RegionCheckbox
                            key={key.as_str()}
                            checked={state.regions.contains(&r.name)}
                            region={r}
                            onchange={onchange_regions.clone()}
                        />
                    }
                })}
            </div>

            <div class="region-bulk-actions">
                {"Select "}
                <RegionBulkAction
                    label="Recommended"
                    select={SelectRegions::Recommended}
                    onemit={onemit_region_bulk_action.clone()}
                />
                {" / "}
                <RegionBulkAction
                    label="All"
                    select={SelectRegions::All}
                    onemit={onemit_region_bulk_action.clone()}
                />
                {" / "}
                <RegionBulkAction
                    label="None"
                    select={SelectRegions::None}
                    onemit={onemit_region_bulk_action.clone()}
                />
            </div>

            if state.regions.contains("Kanto") {
                <div class="region-kanto-warning">
                    {"Kanto has a skewed type balance by the standards of later regions - for example, too many "}
                    <TypeName typ={Type::dat().named("Poison").unwrap()} />
                    {" types. You may find that you get better results if you leave it out."}
                </div>
            }

            <h2>{"Strictness"}</h2>
            <p>
                {"Controls how much Stardex expects you to adhere to the type distribution in the "}
                {regions_phrase}
                {" you've chosen to compare against."}
            </p>

            {for Strictness::ALL.iter().map(|&s| html! {
                <StrictnessChoice
                    key={s.as_str()}
                    checked={state.strictness == s}
                    strictness={s}
                    onchange={onchange_strictness.clone()}
                />
            })}
        </Page>
    }
}

#[derive(Properties, PartialEq)]
struct RegionCheckboxProps {
    checked: bool,
    region: Region,
    onchange: Callback<(IString, bool)>,
}

#[function_component(RegionCheckbox)]
fn region_checkbox(props: &RegionCheckboxProps) -> Html {
    let region = props.region.clone();
    let checked = props.checked;
    let checked_class = checked.then_some("region-checkbox--checked");
    let icon_class = format!("fas fa-{}", region.icon);

    let onchange = {
        let onchange = props.onchange.clone();
        let name = region.name.clone();
        move |_| onchange.emit((name.clone(), checked))
    };

    html! {
        <label class={classes!("region-checkbox", checked_class)}>
            <input
                class="region-checkbox__input"
                type="checkbox"
                name="strictness"
                checked={checked}
                onchange={onchange}
            />

            <div class="region-checkbox__check">
                <i class="fas fa-badge-check" />
            </div>

            <div class="region-checkbox__icon">
                <i class={icon_class} />
            </div>

            <div class="region-checkbox__name">
                {&region.name}
            </div>
        </label>
    }
}

#[derive(Properties, PartialEq)]
struct RegionBulkActionProps {
    label: &'static str,
    select: SelectRegions,
    onemit: Callback<SelectRegions>,
}

#[function_component(RegionBulkAction)]
fn region_bulk_action(props: &RegionBulkActionProps) -> Html {
    let onclick = {
        let onemit = props.onemit.clone();
        let select = props.select;
        move |_| onemit.emit(select)
    };

    html! {
        <button class="region-bulk-actions__action" onclick={onclick}>
            {props.label}
        </button>
    }
}

#[derive(Properties, PartialEq)]
struct StrictnessChoiceProps {
    checked: bool,
    strictness: Strictness,
    onchange: Callback<Strictness>,
}

#[function_component(StrictnessChoice)]
fn strictness_choice(props: &StrictnessChoiceProps) -> Html {
    let strictness = props.strictness;
    let checked = props.checked;
    let checked_class = checked.then_some("strictness-choice--checked");
    let icon = if checked {
        "fas fa-circle-check"
    } else {
        "fas fa-circle"
    };

    let onchange = {
        let onchange = props.onchange.clone();
        move |_| onchange.emit(strictness)
    };

    html! {
        <label class={classes!("strictness-choice", checked_class)}>
            <input
                class="strictness-choice__input"
                type="radio"
                name="strictness"
                checked={checked}
                onchange={onchange}
            />

            <div class="strictness-choice__icon">
                <i class={icon} />
            </div>

            <div class="strictness-choice__text">
                <div class="strictness-choice__name">
                    {strictness.as_str()}
                </div>

                <div class="strictness-choice__description">
                    {strictness.description()}
                </div>
            </div>
        </label>
    }
}
