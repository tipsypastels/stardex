use super::TypeName;
use crate::{
    collections::{MaybeRc, MyArray},
    components::InlineLink,
    models::{Breakdown, BreakdownAction, BreakdownType, Entry, Strictness, Type},
    routes::Route,
};
use implicit_clone::unsync::IString;
use std::rc::Rc;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct TypeBreakdownProps {
    pub id: IString,
    pub selected_type: UseStateHandle<Option<Type>>,
    pub breakdown: MaybeRc<Breakdown>,
    pub entries: MyArray<Entry>,
    pub regions_count: usize,
    pub strictness: Strictness,
}

#[function_component]
pub fn TypeBreakdown(props: &TypeBreakdownProps) -> Html {
    let strictness = props.strictness;
    let selected_type = &props.selected_type;

    let selected_entries = use_memo(
        (props.entries.clone(), selected_type.clone()),
        |(entries, typ)| {
            typ.as_ref()
                .map(|typ| entries.retain(|e| e.types.contains(typ)))
                .unwrap_or_default()
        },
    );

    let select = Callback::from({
        let selected_type = selected_type.clone();
        move |opt_type| selected_type.set(opt_type)
    });

    html! {
        <div class="type-breakdown">
            {for props.breakdown.iter().map(|bd_type| {
                let selected = selected_type.as_ref().map(|typ| typ == &bd_type.typ).unwrap_or(false);

                html! {
                   <Item
                       bd_type={bd_type}
                       selected={selected}
                       select={select.clone()}
                       selected_entries={selected_entries.clone()}
                       regions_count={props.regions_count}
                       strictness={strictness}
                    />
                }
            })}
        </div>
    }
}

#[derive(Properties, PartialEq)]
struct ItemProps {
    bd_type: BreakdownType,
    selected: bool,
    select: Callback<Option<Type>>,
    selected_entries: Rc<MyArray<Entry>>,
    regions_count: usize,
    strictness: Strictness,
}

#[function_component]
fn Item(props: &ItemProps) -> Html {
    let bd_type = props.bd_type.clone();
    let typ = bd_type.typ.clone();

    let onclick = {
        let bd_type = bd_type.clone();
        let selected = props.selected;
        let select = props.select.clone();
        move |_| select.emit((!selected).then(|| bd_type.typ.clone()))
    };

    let recs = {
        let compare_plural = if props.regions_count > 1 {
            "es on average"
        } else {
            ""
        };

        let percentage = |ratio: f64| {
            html! {
                <strong class="type-breakdown__rec-percent">
                    {format!("{:.1}%", ratio * 100.)}
                </strong>
            }
        };

        let summary = html! {
            <>
                {"They make up "}
                {percentage(bd_type.own_ratio)}
                {" of your Pokédex and "}
                {percentage(bd_type.against_ratio)}
                {" of the compared Pokédex"}
                {compare_plural}
                {"."}
            </>
        };

        if let Some(action) = bd_type.action {
            let (class, verb) = match action {
                BreakdownAction::Add => ("type-breakdown__rec-add", "Add"),
                BreakdownAction::Remove => ("type-breakdown__rec-rm", "Remove"),
            };

            html! {
                <>
                    <span class={class}>{verb}</span>
                    {" some. "}
                    {summary}
                </>
            }
        } else {
            let is_max_strictness = props.strictness >= Strictness::Bitchy;
            html! {
                <>
                    {"No changes needed! "}
                    {summary}

                    if !is_max_strictness {
                        {" You may increase the strictness in "}
                        <InlineLink to={Route::Settings} />
                        {" if that's not enough for you."}
                    }
                </>
            }
        }
    };

    html! {
        <>
            <h3 class="type-breakdown__header">
                <button class="type-breakdown__header__button" onclick={onclick}>
                    <TypeName typ={typ.clone()} />
                </button>
            </h3>

            <div class="type-breakdown__content" hidden={!props.selected}>
                <h2><TypeName typ={typ.clone()} /></h2>

                <h3>{"Recommendations"}</h3>
                <p>{recs}</p>
            </div>
        </>
    }
}
