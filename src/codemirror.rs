use crate::bindings::{create_editor, create_tutorial, EditorView};
use implicit_clone::{unsync::IString, ImplicitClone};
use wasm_bindgen::prelude::*;
use web_sys::HtmlElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct CodeMirrorEditorProps {
    pub doc: IString,
    pub onupdate: Callback<EditorView>,
}

#[function_component]
pub fn CodeMirrorEditor(props: &CodeMirrorEditorProps) -> Html {
    let imp = Imp::Editor(props.doc.clone(), props.onupdate.clone());
    html! { <CodeMirrorImp {imp} /> }
}

#[derive(Properties, Clone, ImplicitClone, PartialEq)]
pub struct CodeMirrorTutorialProps {
    pub doc: &'static str,
}

#[function_component]
pub fn CodeMirrorTutorial(props: &CodeMirrorTutorialProps) -> Html {
    let imp = Imp::Tutorial(props.doc);
    html! { <CodeMirrorImp {imp} /> }
}

#[derive(Properties, PartialEq)]
struct CodeMirrorImpProps {
    imp: Imp,
}

#[derive(Clone, ImplicitClone, PartialEq)]
pub enum Imp {
    Editor(IString, Callback<EditorView>),
    Tutorial(&'static str),
}

#[function_component]
fn CodeMirrorImp(props: &CodeMirrorImpProps) -> Html {
    let node_ref = use_node_ref();
    let editor_ref = use_mut_ref(|| None::<EditorView>);

    use_effect_with(
        (node_ref.clone(), editor_ref, props.imp.clone()),
        |(node_ref, editor_ref, imp)| {
            let mut editor_ref = editor_ref.borrow_mut();

            if editor_ref.is_none() {
                let parent = node_ref.cast::<HtmlElement>().unwrap();
                let editor = imp.init(parent);

                editor_ref.replace(editor);
            }
        },
    );

    html! {
        <div class="codemirror" ref={node_ref} />
    }
}

impl Imp {
    fn init(&self, parent: HtmlElement) -> EditorView {
        match self {
            Self::Editor(doc, cb) => {
                let cb = cb.clone();
                let closure = Closure::<dyn Fn(EditorView)>::wrap(Box::new(move |v| cb.emit(v)));
                let view = create_editor(doc, parent, &closure);

                // This is a long-lived closure passed into JS, don't deallocate it.
                closure.forget();
                view
            }
            Self::Tutorial(doc) => create_tutorial(doc, parent),
        }
    }
}
