use super::Route;
use crate::layouts::Page;
use yew::prelude::*;
use yew_router::hooks::use_route;

#[function_component]
pub fn Help() -> Html {
    let title = if let Some(Route::Home) = use_route() {
        "Welcome"
    } else {
        "Help"
    };

    html! {
        <Page {title}>
            <h1>{"Help"}</h1>
        </Page>
    }
}
