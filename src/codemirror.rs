use crate::bindings;
use implicit_clone::{unsync::IString, ImplicitClone};
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorProps {
    // pub init: Callback<HtmlElement, bindings::EditorView>,
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
    Editor(IString),
    Tutorial(IString),
}

impl CodeMirrorMode {
    pub fn init(&self, parent: HtmlElement) -> bindings::EditorView {
        match self {
            Self::Editor(doc) => bindings::create_editor(doc, parent),
            Self::Tutorial(doc) => bindings::create_tutorial(doc, parent),
        }
    }
}
