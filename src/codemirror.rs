use crate::bindings::{create_editor, EditorView};
use html::{ImplicitClone, IntoPropValue};
use implicit_clone::unsync::IString;
use std::{cell::RefCell, rc::Rc};
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Debug, Clone, ImplicitClone, PartialEq)]
pub struct CodeMirror {
    node: NodeRef,
    editor: Rc<RefCell<Option<EditorView>>>,
}

impl IntoPropValue<NodeRef> for CodeMirror {
    fn into_prop_value(self) -> NodeRef {
        self.node
    }
}

#[derive(Default, PartialEq)]
pub struct UseCodeMirror {
    pub doc: IString,
    pub readonly: bool,
}

#[hook]
pub fn use_codemirror(opts: UseCodeMirror) -> CodeMirror {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref.clone(), opts),
        |(node_ref, editor_ref, opts)| {
            let parent = node_ref.cast::<HtmlElement>().unwrap();
            let editor = create_editor(&opts.doc, parent, opts.readonly);
            editor_ref.borrow_mut().replace(editor);
        },
    );

    CodeMirror {
        node: node_ref,
        editor: editor_ref,
    }
}
