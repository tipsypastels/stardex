use crate::bindings::{create_editor, EditorView};
use html::ImplicitClone;
use implicit_clone::unsync::IString;
use std::{cell::RefCell, rc::Rc};
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorProps {
    #[prop_or_default]
    pub doc: IString,
    #[prop_or_default]
    pub readonly: bool,
    #[prop_or_default]
    pub handle: Option<CodeMirrorHandle>,
}

#[function_component]
pub fn CodeMirror(props: &CodeMirrorProps) -> Html {
    let node = use_node_ref();
    let editor = use_mut_ref(|| None::<EditorView>);

    use_effect_with(
        (
            node.clone(),
            editor.clone(),
            props.doc.clone(),
            props.readonly,
            props.handle.clone(),
        ),
        |(node, editor, doc, readonly, handle)| {
            let parent = node.cast::<HtmlElement>().unwrap();
            let editor_view = create_editor(doc, parent, *readonly);

            editor.borrow_mut().replace(editor_view.clone());

            if let Some(handle) = handle.as_ref() {
                handle.editor.borrow_mut().replace(editor_view);
            }
        },
    );

    html! {
        <div class="codemirror" ref={node} />
    }
}

#[derive(Clone, ImplicitClone, PartialEq)]
pub struct CodeMirrorHandle {
    editor: Rc<RefCell<Option<EditorView>>>,
}

#[hook]
pub fn use_codemirror() -> CodeMirrorHandle {
    CodeMirrorHandle {
        editor: Rc::new(RefCell::new(None)),
    }
}
