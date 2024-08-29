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

        move |parent| {
            let onupdate = OnUpdateClosure::new(onupdate.clone());
            let onupdating = OnUpdatingClosure::new(onupdating.clone());
            let view = create_editor(&doc, parent, &onupdate.0, onupdating.0.as_ref());

            onupdate.forget();
            onupdating.forget();
            view
        }
    });

    html! {
        <CodeMirror {init} />
    }
}

#[repr(transparent)]
struct OnUpdateClosure(Closure<dyn Fn(EditorView)>);

impl OnUpdateClosure {
    fn new(cb: Callback<EditorView>) -> Self {
        Self(Closure::wrap(Box::new(move |v| cb.emit(v))))
    }

    fn forget(self) {
        self.0.forget();
    }
}

#[repr(transparent)]
struct OnUpdatingClosure(Option<Closure<dyn Fn()>>);

impl OnUpdatingClosure {
    fn new(cb: Option<Callback<()>>) -> Self {
        #[allow(clippy::manual_map)] // false positive
        Self(if let Some(cb) = cb {
            Some(Closure::wrap(Box::new(move || cb.emit(()))))
        } else {
            None
        })
    }

    fn forget(self) {
        if let Some(f) = self.0 {
            f.forget();
        }
    }
}
