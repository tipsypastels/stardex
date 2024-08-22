use crate::models::Type;
use yew::prelude::*;

#[derive(PartialEq, Properties)]
pub struct TypeNameProps {
    pub typ: Type,
}

#[function_component]
pub fn TypeName(props: &TypeNameProps) -> Html {
    let typ = &props.typ;
    let style = format!("color: {};", typ.color);
    let icon_class = format!("fas fa-{}", typ.icon);

    html! {
        <span class="type-name" style={style}>
            <span class="type-name__icon">
                <i class={icon_class} />
            </span>

            <span class="type-name__name">
                {&typ.name}
            </span>
        </span>
    }
}
