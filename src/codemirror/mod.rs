use crate::bindings::EditorView;
use web_sys::HtmlElement;
use yew::prelude::*;

mod editor;
mod tutorial;

pub use editor::CodeMirrorEditor;
pub use tutorial::CodeMirrorTutorial;

#[derive(Properties, PartialEq)]
struct CodeMirrorProps {
    init: Callback<HtmlElement, EditorView>,
}

#[function_component]
fn CodeMirror(props: &CodeMirrorProps) -> Html {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref, props.init.clone()),
        |(node_ref, editor_ref, init)| {
            let mut editor_ref = editor_ref.borrow_mut();

            if editor_ref.is_none() {
                let parent = node_ref.cast::<HtmlElement>().unwrap();
                let editor = init.emit(parent);
                editor_ref.replace(editor);
            }
        },
    );

    html! {
        <div class="codemirror" ref={node_ref} />
    }
}
