use crate::routes::Route;
use yew::prelude::*;
use yew_router::prelude::*;

#[function_component]
pub fn Nav() -> Html {
    html! {
        <nav class="nav">
            <div class="nav__links">
                <NavLink to={Route::Overview} />
                <NavLink to={Route::Compare} />
                <NavLink to={Route::Settings} />
                <NavLink to={Route::Tutorial} />
            </div>
        </nav>
    }
}

#[derive(Properties, PartialEq)]
struct NavLinkProps {
    to: Route,
}

#[function_component]
fn NavLink(props: &NavLinkProps) -> Html {
    let to = &props.to;
    let current_route = use_route::<Route>();
    let active = current_route.map(|cr| cr == *to).unwrap_or(false);
    let active_class = active.then_some("nav__link--active");

    html! {
        <Link<Route> to={props.to.clone()} classes={classes!("nav__link", active_class)}>
            <div class="nav__link__icon">
                <i class={to.icon()} />
            </div>

            <div class="nav__link__name">
                {to.name()}
            </div>
        </Link<Route>>
    }
}
