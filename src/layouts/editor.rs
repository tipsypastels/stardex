use crate::{
    bindings::walk_editor,
    codemirror::CodeMirrorEditor,
    models::{Entry, EntryError},
    state::{Action, StateContext},
};
use std::cell::RefCell;
use yew::prelude::*;

#[function_component]
pub fn Editor() -> Html {
    let state = use_context::<StateContext>().unwrap();
    let error = use_state(|| None::<EntryError>);

    let mobile_open = state.mobile_editor_open;
    let mobile_open_class = mobile_open.then_some("editor--mobile-open");

    let onupdate = Callback::from({
        let state = state.clone();
        let error = error.clone();

        move |view| {
            const CONTINUE: bool = true;
            const BREAK: bool = false;

            let entries = RefCell::new(Vec::<Entry>::new());

            let walk = walk_editor(
                &view,
                &|name, types, attrs| match Entry::new(name, types, attrs) {
                    Ok(entry) => {
                        entries.borrow_mut().push(entry);
                        CONTINUE
                    }
                    Err(e) => {
                        error.set(Some(e));
                        BREAK
                    }
                },
            );

            if let CONTINUE = walk {
                error.set(None);
            }

            let entries = entries.into_inner().into();
            state.dispatch(Action::SetEntries(entries));
        }
    });

    html! {
        <div class={classes!("editor", mobile_open_class)}>
            if let Some(error) = error.as_ref() {
                <div class="editor__error">
                    {error.to_string()}
                </div>
            }

            <div class="editor__content">
                <CodeMirrorEditor doc="" onupdate={onupdate} />
            </div>
        </div>
    }
}
