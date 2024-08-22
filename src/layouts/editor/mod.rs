use self::codemirror::use_codemirror;
use crate::state::StateContext;
use yew::prelude::*;

mod codemirror;

#[function_component]
pub fn Editor() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let mobile_open = state.mobile_editor_open;
    let mobile_open_class = mobile_open.then_some("editor--mobile-open");

    let codemirror = use_codemirror();

    html! {
        <div class={classes!("editor", mobile_open_class)}>
            <div ref={codemirror} class="editor__textarea" />
        </div>
    }
}
