use crate::{
    codemirror::{CodeMirror, CodeMirrorMode},
    state::StateContext,
};
use yew::prelude::*;

#[function_component]
pub fn Editor() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let mobile_open = state.mobile_editor_open;
    let mobile_open_class = mobile_open.then_some("editor--mobile-open");

    html! {
        <div class={classes!("editor", mobile_open_class)}>
            <div class="editor__content">
                <CodeMirror mode={CodeMirrorMode::Editor("".into())} />
            </div>
        </div>
    }
}
