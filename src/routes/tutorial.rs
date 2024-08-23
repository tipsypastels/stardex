use super::Route;
use crate::layouts::Page;
use yew::prelude::*;
use yew_router::hooks::use_route;

#[function_component]
pub fn Tutorial() -> Html {
    let title = if let Some(Route::Overview) = use_route() {
        "Welcome"
    } else {
        "Tutorial"
    };

    html! {
        <Page {title}>
            <p>
                {"Welcome to Stardex! This tool "}
            </p>
        </Page>
    }
}
