use super::CodeMirror;
use crate::bindings::{create_editor, EditorView};
use implicit_clone::unsync::IString;
use wasm_bindgen::prelude::*;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorEditorProps {
    pub doc: IString,
    pub onupdate: Callback<EditorView>,
    #[prop_or_default]
    pub onupdating: Option<Callback<()>>,
}

#[function_component]
pub fn CodeMirrorEditor(props: &CodeMirrorEditorProps) -> Html {
    let init = Callback::from({
        let doc = props.doc.clone();
        let onupdate = props.onupdate.clone();
        let onupdating = props.onupdating.clone();

        #[allow(clippy::option_map_unit_fn)]
        move |parent| {
            let onupdate = onupdate.clone();
            let onupdate = Closure::new(move |v| onupdate.emit(v));

            let onupdating = onupdating.clone();
            let onupdating = onupdating.map(|f| Closure::new(move || f.emit(())));

            let view = create_editor(&doc, parent, &onupdate, onupdating.as_ref());

            onupdate.forget();
            onupdating.map(|f| f.forget());

            view
        }
    });

    html! {
        <CodeMirror {init} />
    }
}
