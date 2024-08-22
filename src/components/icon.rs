use implicit_clone::unsync::IString;
use yew::prelude::*;

#[derive(PartialEq, Properties)]
pub struct IconProps {
    pub name: IString,
}

#[function_component(Icon)]
pub fn icon(props: &IconProps) -> Html {
    let name = &props.name;
    let class = format!("fas fa-{name}");

    html! {
        <i class={class} />
    }
}
