use super::Icon;
use crate::models::Type;
use yew::prelude::*;

#[derive(PartialEq, Properties)]
pub struct TypeNameProps {
    pub typ: Type,
}

#[function_component(TypeName)]
pub fn type_name(props: &TypeNameProps) -> Html {
    let typ = &props.typ;
    let style = format!("color: {};", typ.color);

    html! {
        <span class="type-name" style={style}>
            <span class="type-name__icon">
                <Icon name={typ.icon.clone()} />
            </span>

            <span class="type-name__name">
                {&typ.name}
            </span>
        </span>
    }
}
