use crate::bindings;
use html::IntoPropValue;
use web_sys::HtmlElement;
use yew::prelude::*;

#[hook]
pub fn use_codemirror() -> CodeMirror {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<bindings::EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref.clone()),
        |(node_ref, editor_ref)| {
            let parent = node_ref.cast::<HtmlElement>().unwrap();
            let editor = bindings::create_editor("", parent, false);
            editor_ref.borrow_mut().replace(editor);
        },
    );

    CodeMirror(node_ref)
}

pub struct CodeMirror(NodeRef);

impl IntoPropValue<NodeRef> for CodeMirror {
    fn into_prop_value(self) -> NodeRef {
        self.0
    }
}
