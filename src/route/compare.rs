use crate::{components::InlineLink, layouts::Page, route::Route, state::StateContext};
use yew::prelude::*;

#[function_component]
pub fn Compare() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let html = if state.regions.is_empty() {
        html! {
            <p>
                {"No canonical regions are selected. Select some regions on the "}
                <InlineLink to={Route::Settings} />
                {" page to compare your Pokédex with them."}
            </p>
        }
    } else {
        html! {
            <p>

            </p>
        }
    };

    html! {
        <Page title="Compare">
            {html}
        </Page>
    }
}
