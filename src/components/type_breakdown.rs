use super::TypeName;
use crate::{
    collections::MaybeRc,
    models::{Breakdown, BreakdownType, Type},
};
use implicit_clone::unsync::IString;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct TypeBreakdownProps {
    pub id: IString,
    pub selected_type: UseStateHandle<Option<Type>>,
    pub breakdown: MaybeRc<Breakdown>,
}

#[function_component]
pub fn TypeBreakdown(props: &TypeBreakdownProps) -> Html {
    let selected_type = &props.selected_type;
    let select = Callback::from({
        let selected_type = selected_type.clone();
        move |opt_type| selected_type.set(opt_type)
    });

    use_effect_with(selected_type.clone(), |st| {
        gloo::console::log!(format!("{st:#?}"));
    });

    html! {
        <div class="type-breakdown">
            {for props.breakdown.iter().map(|bd_type| {
                let selected = selected_type.as_ref().map(|typ| typ == &bd_type.typ).unwrap_or(false);

                html! {
                   <Item bd_type={bd_type} selected={selected} select={select.clone()} />
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
}

#[function_component]
fn Item(props: &ItemProps) -> Html {
    let onclick = {
        let bd_type = props.bd_type.clone();
        let selected = props.selected;
        let select = props.select.clone();
        move |_| select.emit((!selected).then(|| bd_type.typ.clone()))
    };

    html! {
        <h3 class="type-breakdown__header">
            <button class="type-breakdown__header__button" onclick={onclick}>
                <TypeName typ={props.bd_type.typ.clone()} />
            </button>
        </h3>
    }
}
