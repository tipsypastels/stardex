use crate::bindings;
use implicit_clone::{unsync::IString, ImplicitClone};
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorProps {
    pub mode: CodeMirrorMode,
}

#[function_component]
pub fn CodeMirror(props: &CodeMirrorProps) -> Html {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<bindings::EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref.clone(), props.mode.clone()),
        |(node_ref, editor_ref, mode)| {
            let mut editor_ref = editor_ref.borrow_mut();
            if editor_ref.is_none() {
                let parent = node_ref.cast::<HtmlElement>().unwrap();
                let editor = mode.init(parent);

                editor_ref.replace(editor);
            }
        },
    );

    html! {
        <div class="codemirror" ref={node_ref} />
    }
}

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub enum CodeMirrorMode {
    Editor(IString, Callback<()>),
    Tutorial(&'static str),
}

impl CodeMirrorMode {
    pub fn init(&self, parent: HtmlElement) -> bindings::EditorView {
        match self {
            Self::Editor(doc, cb) => {
                let cb = cb.clone();
                let closure = Closure::<dyn Fn()>::wrap(Box::new(move || cb.emit(())));
                let view = bindings::create_editor(doc, parent, &closure);

                // This is a long-lived closure passed into JS, don't deallocate it.
                closure.forget();
                view
            }
            Self::Tutorial(doc) => bindings::create_tutorial(doc, parent),
        }
    }
}
