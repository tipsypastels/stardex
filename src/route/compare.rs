use crate::layouts::Page;
use yew::prelude::*;

#[function_component(Compare)]
pub fn compare() -> Html {
    html! {
        <>
            <Page title="Compare">
                <h1>{"Compare"}</h1>
            </Page>
        </>
    }
}
