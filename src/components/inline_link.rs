use crate::routes::Route;
use yew::prelude::*;
use yew_router::prelude::*;

#[derive(Properties, PartialEq)]
pub struct InlineLinkProps {
    pub to: Route,
}

#[function_component]
pub fn InlineLink(props: &InlineLinkProps) -> Html {
    html! {
        <Link<Route> to={props.to.clone()} classes="inline-link">
            <span class="inline-link__icon">
                <i class={props.to.icon()} />
            </span>
            <span class="inline-link__name">
                {props.to.name()}
            </span>
        </Link<Route>>

    }
}
