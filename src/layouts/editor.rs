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
    let updating = use_state(|| false);

    let mobile_open = state.mobile_editor_open;
    let mobile_open_class = mobile_open.then_some("editor--mobile-open");

    let onupdate = Callback::from({
        let state = state.clone();
        let error = error.clone();
        let updating = updating.clone();

        move |view| {
            const CONTINUE: bool = true;
            const BREAK: bool = false;

            let entries = RefCell::new(Vec::<Entry>::new());

            let walk = walk_editor(&view, &|n, t, a| match Entry::new(n, t, a) {
                Ok(entry) => {
                    entries.borrow_mut().push(entry);
                    CONTINUE
                }
                Err(e) => {
                    error.set(Some(e));
                    BREAK
                }
            });

            if let CONTINUE = walk {
                error.set(None);
            }

            updating.set(false);

            let entries = entries.into_inner().into();
            state.dispatch(Action::SetEntries(entries));
        }
    });

    let onupdating = Callback::from({
        let updating = updating.clone();
        move |()| updating.set(true)
    });

    html! {
        <div class={classes!("editor", mobile_open_class)}>
            if let Some(error) = error.as_ref() {
                <div class="editor__error">
                    <div class="editor__error__icon">
                        <i class="fas fa-circle-exclamation" />
                    </div>

                    <div class="editor__error__text">
                        {error.to_string()}
                    </div>
                </div>
            }

            <div class="editor__content">
                <CodeMirrorEditor doc="" onupdate={onupdate} onupdating={onupdating} />
            </div>

            if *updating {
                <div class="editor__debounce">
                    <div class="editor_debounce__icon">
                        <i class="fas fa-spinner-scale fa-spin" />
                    </div>

                    <div class="editor__debounce__text">
                        {"Pause typing to rebuild graphs…"}
                    </div>
                </div>
            }
        </div>
    }
}
