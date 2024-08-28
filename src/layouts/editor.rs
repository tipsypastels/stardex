use crate::{bindings::walk_editor, codemirror::CodeMirrorEditor, state::StateContext};
use web_sys::console;
use yew::prelude::*;

#[function_component]
pub fn Editor() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let mobile_open = state.mobile_editor_open;
    let mobile_open_class = mobile_open.then_some("editor--mobile-open");

    let onupdate = {
        Callback::from(|view| {
            console::log_1(&"---".into());
            walk_editor(&view, &|name, types, attrs| {
                console::log_3(&name.into(), &types.into(), &attrs.into());
            });
            console::log_1(&"---".into());
        })
    };

    html! {
        <div class={classes!("editor", mobile_open_class)}>
            <div class="editor__content">
                <CodeMirrorEditor doc="" onupdate={onupdate} />
            </div>
        </div>
    }
}
